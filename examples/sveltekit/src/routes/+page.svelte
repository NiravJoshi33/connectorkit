<script lang="ts">
  import { 
    useConnector, 
    useConnectorClient, 
    useKitTransactionSigner, 
    useAccount 
  } from '@solana/connector/svelte';  
  import { 
    address, 
    createSolanaRpc, 
    createSolanaRpcSubscriptions,
    pipe, 
    createTransactionMessage, 
    setTransactionMessageFeePayerSigner, 
    setTransactionMessageLifetimeUsingBlockhash, 
    appendTransactionMessageInstructions, 
    signTransactionMessageWithSigners, 
    sendAndConfirmTransactionFactory, 
    getSignatureFromTransaction, 
    lamports 
  } from "@solana/kit";
    import { getTransferSolInstruction } from '@solana-program/system';

  const { connected, select, disconnect, wallets } = useConnector();
  const { formatted, address: userAddress } = useAccount();
  const client = useConnectorClient();
  
  const { signer } = useKitTransactionSigner();

  let recipient = '';
  let amount = 0.001;
  let status = '';
  let signature = '';
  let isProcessing = false;

  const LAMPORTS_PER_SOL = 1_000_000_000;

  async function handleSend() {
    if (!$signer || !$userAddress) {
      status = 'Wallet not connected';
      return;
    }

    try {
      isProcessing = true;
      status = 'Initializing RPC...';
      signature = '';

      const rpcUrl = client.getRpcUrl();
      if (!rpcUrl) throw new Error("No RPC URL found in connector config");
      
      const rpc = createSolanaRpc(rpcUrl);
      const rpcSubscriptions = createSolanaRpcSubscriptions(rpcUrl.replace('http', 'ws'));

      status = 'Fetching blockhash...';
      const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

      const amountInLamports = lamports(BigInt(Math.floor(amount * LAMPORTS_PER_SOL)));
      
      const transferInstruction = getTransferSolInstruction({
        source: $signer, 
        destination: address(recipient),
        amount: amountInLamports,
      });

      status = 'Building transaction...';
      const transactionMessage = pipe(
        createTransactionMessage({ version: 0 }),
        (tx: any) => setTransactionMessageFeePayerSigner($signer, tx),
        (tx: any) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
        (tx: any) => appendTransactionMessageInstructions([transferInstruction], tx)
      );

      status = 'Requesting signature...';
      const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);

      status = 'Sending transaction...';
      
      const sendAndConfirm = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });
      
      await sendAndConfirm(signedTransaction, { 
        commitment: 'confirmed',
        skipPreflight: false 
      });

      signature = getSignatureFromTransaction(signedTransaction);
      status = 'Transaction Confirmed!';

    } catch (e: any) {
      console.error(e);
      status = `Error: ${e.message}`;
    } finally {
      isProcessing = false;
    }
  }

  $: if ($userAddress && !recipient) {
    recipient = $userAddress;
  }
</script>

<div class="container">
  <h1>Testing Transactions</h1>
  <p class="subtitle">Using @solana/connector and @solana/kit</p>

  {#if $connected}
    <div class="card">
      <div class="wallet-info">
        <span class="badge">Connected</span>
        <strong>{$formatted}</strong>
      </div>

      <div class="form-group">
        <label for="recipient">Recipient Address</label>
        <input id="recipient" type="text" bind:value={recipient} placeholder="Solana Address" />
      </div>

      <div class="form-group">
        <label for="amount">Amount (SOL)</label>
        <input id="amount" type="number" bind:value={amount} step="0.0001" min="0" />
      </div>

      <div class="actions">
        <button 
          on:click={handleSend} 
          disabled={isProcessing || !recipient}
          class="primary-btn"
        >
          {#if isProcessing}
            Processing...
          {:else}
            Send Transaction
          {/if}
        </button>
        
        <button on:click={() => disconnect()} class="secondary-btn">
          Disconnect
        </button>
      </div>

      {#if status}
        <div class="status" class:error={status.startsWith('Error')}>
          {status}
        </div>
      {/if}

      {#if signature}
        <div class="result">
          <p>Signature:</p>
          <code>{signature}</code>
          <a 
            href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            View on Explorer
          </a>
        </div>
      {/if}
    </div>
  {:else}
    <div class="connect-view">
      <p>Connect your wallet to test modern transaction signing.</p>
      <div class="wallet-list">
        {#each $wallets as w}
          <button class="wallet-btn" on:click={() => select(w.wallet.name)}>
            {#if w.wallet.icon}
              <img src={w.wallet.icon} alt="" width="24" height="24" />
            {/if}
            <span>{w.wallet.name}</span>
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .container { 
    max-width: 480px; 
    margin: 0 auto; 
    padding: 2rem; 
    font-family: system-ui, sans-serif; 
  }
  .subtitle { 
    color: #666; 
    margin-top: -0.5rem; 
    margin-bottom: 2rem; 
  }
  
  .card { 
    border: 1px solid #e5e7eb; 
    padding: 1.5rem; 
    border-radius: 12px; 
    background: white; 
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); 
  }
  
  .wallet-info {
     display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .badge { 
    background: #dcfce7; 
    color: #166534; 
    padding: 0.25rem 0.75rem; 
    border-radius: 9999px; 
    font-size: 0.875rem; 
    font-weight: 500; 
  }
  
  .form-group { 
    margin-bottom: 1rem; 
  }
  
  label { 
    display: block; 
    font-size: 0.875rem; 
    font-weight: 500; 
    margin-bottom: 0.5rem; 
    color: #374151; 
  }
  
  input {
    width: 100%; 
    padding: 0.5rem; 
    border: 1px solid #d1d5db; 
    border-radius: 6px; 
    font-size: 1rem; 
    box-sizing: border-box; 
  }
  
  .actions { 
    display: flex; 
    gap: 0.5rem; 
    margin-top: 1.5rem; 
  }
  
  button { 
    flex: 1; 
    padding: 0.625rem; 
    border-radius: 6px; 
    font-weight: 500; 
    cursor: pointer; 
    border: none; 
    transition: opacity 0.2s; 
  }
  
  button:disabled {
    opacity: 0.5; 
    cursor: not-allowed; 
  }
  
  .primary-btn {
    background: #2563eb; 
    color: white; 
  }
  
  .secondary-btn { 
    background: #f3f4f6; 
    color: #374151; 
  }
  
  .wallet-btn { 
    display: flex; 
    align-items: center; 
    gap: 0.75rem; 
    background: #1f2937; 
    color: white; 
    margin-bottom: 0.5rem; 
    width: 100%; 
    text-align: left; 
  }
  
  .status { 
    margin-top: 1rem; 
    padding: 0.75rem; 
    background: #f3f4f6; 
    border-radius: 6px; 
    font-size: 0.875rem; 
  }
  .status.error { 
    background: #fee2e2; 
    color: #991b1b; 
  }
  
  .result { 
    margin-top: 1rem; 
    padding-top: 1rem; 
    border-top: 1px solid #e5e7eb; 
  }
  code {
    display: block; 
    word-break: break-all; 
    background: #f9fafb; 
    padding: 0.5rem; 
    border-radius: 4px; 
    font-size: 0.8rem; 
    margin: 0.5rem 0; 
  }
</style>