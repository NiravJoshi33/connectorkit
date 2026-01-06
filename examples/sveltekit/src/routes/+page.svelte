<script lang="ts">
    import { useConnector, useAccount } from "@solana/connector/svelte"
    const { connected, select, disconnect, wallets } = useConnector()
    const { formatted, copy, copied } = useAccount()
</script>

<h1>ConnectorKit + Svelte</h1>

<div class="status-card">
  <h2>Status: {$connected ? 'Connected' : 'Disconnected'}</h2>

  {#if $connected}
    <div class="connected-view">
      <p>
        <strong>Address:</strong> {$formatted}
        <button on:click={copy} class="copy-btn">
          {$copied ? 'Copied' : 'Copy'}
        </button>
       
      </p>
      
      <button class="disconnect-btn" on:click={() => disconnect()}>
        Disconnect
      </button>
    </div>
  {:else}
    <div class="wallets-grid">
      {#if $wallets.length === 0}
        <p class="no-wallets">
          No wallets found. Install Phantom or Backpack.
        </p>
      {/if}
      
      {#each $wallets as w}
        <button class="wallet-btn" on:click={() => select(w.wallet.name)}>
          <img src={w.wallet.icon} alt={w.wallet.name} width="24" />
          <span>Connect {w.wallet.name}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .status-card { border: 1px solid #333; padding: 1.5rem; border-radius: 12px; width: 300px; }
  .wallets-grid { display: flex; flex-direction: column; gap: 0.5rem; }
  
  button { cursor: pointer; padding: 0.5rem 1rem; border-radius: 6px; border: none; font-weight: 600; }
  
  .wallet-btn { display: flex; align-items: center; gap: 10px; background: #333; color: white; text-align: left; transition: background 0.2s; }
  .wallet-btn:hover { background: #444; }
  
  .disconnect-btn { background: #ff4444; color: white; margin-top: 1rem; }
  .copy-btn { background: #444; color: #fff; font-size: 0.8rem; margin-left: 0.5rem; }
  .no-wallets { opacity: 0.6; font-style: italic; }
</style>