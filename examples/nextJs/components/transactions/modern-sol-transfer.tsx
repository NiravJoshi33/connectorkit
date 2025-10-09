'use client';

import { useState } from 'react';
import { address, type Address } from '@solana/addresses';
import { createSolanaRpc } from '@solana/rpc';
import { signature as createSignature } from '@solana/keys';
import { useTransactionSigner, useCluster, useConnectorClient } from '@connector-kit/connector';
import { TransactionForm } from './transaction-form';
import { TransactionResult } from './transaction-result';


/**
 * Modern SOL Transfer Component
 * 
 * Demonstrates using @solana/kit (web3.js 2.0) with modular packages.
 * This shows the modern, type-safe approach to Solana development.
 */
export function ModernSolTransfer() {
    const { signer } = useTransactionSigner();
    const { cluster, rpcUrl } = useCluster();
    const client = useConnectorClient();
    const [signature, setSignature] = useState<string | null>(null);

    async function handleTransfer(recipientAddress: string, amount: number) {
        if (!signer || !rpcUrl) {
            throw new Error('Wallet not connected or cluster not selected');
        }

        if (!signer.address) {
            throw new Error('Wallet address not available');
        }

        // Create RPC client using web3.js 2.0
        const rpc = createSolanaRpc(rpcUrl);

        // Create addresses using the new address() API
        const senderAddress = address(signer.address);

        // Get recent blockhash using web3.js 2.0 RPC
        const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

        const { Transaction: LegacyTransaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL: LEGACY_LAMPORTS } = await import('@solana/web3.js');
        
        const recipientPubkey = new PublicKey(recipientAddress);
        const senderPubkey = new PublicKey(signer.address);
        
        const legacyInstruction = SystemProgram.transfer({
            fromPubkey: senderPubkey,
            toPubkey: recipientPubkey,
            lamports: amount * LEGACY_LAMPORTS,
        });
        
        const legacyTransaction = new LegacyTransaction({
            feePayer: senderPubkey,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: Number(latestBlockhash.lastValidBlockHeight),
        }).add(legacyInstruction);
        
        // Sign using the connector-kit signer
        const capabilities = signer.getCapabilities();
        if (!capabilities.canSign) {
            throw new Error('Wallet does not support transaction signing');
        }
        
        const signedTx = await signer.signTransaction(legacyTransaction);
        
        // For sending, we'll use the legacy Connection for now since we have a legacy transaction
        // In a fully modern implementation, you'd compile the transaction message and use web3.js 2.0's sendTransaction
        const { Connection } = await import('@solana/web3.js');
        const connection = new Connection(rpcUrl, 'confirmed');
        const sig = await connection.sendRawTransaction(signedTx.serialize());
        
        setSignature(sig);
        
        // Track transaction in debugger
        if (client) {
            (client as unknown as {
                trackTransaction: (tx: {
                    signature: string;
                    status: 'pending';
                    method: string;
                    feePayer: Address;
                }) => void;
                updateTransactionStatus: (sig: string, status: string, error?: string) => void;
            }).trackTransaction({
                signature: sig,
                status: 'pending',
                method: '@solana/kit RPC with legacy signer',
                feePayer: senderAddress,
            });
        }

        // Wait for confirmation using web3.js 2.0 RPC
        try {
            // Poll for confirmation using web3.js 2.0 APIs
            let confirmed = false;
            const maxAttempts = 30;
            let attempts = 0;
            const signatureObj = createSignature(sig);
            
            while (!confirmed && attempts < maxAttempts) {
                const { value: statuses } = await rpc.getSignatureStatuses([signatureObj]).send();
                
                if (statuses[0]?.confirmationStatus === 'confirmed' || statuses[0]?.confirmationStatus === 'finalized') {
                    confirmed = true;
                    break;
                }
                
                await new Promise(resolve => setTimeout(resolve, 1000));
                attempts++;
            }
            
            if (!confirmed) {
                throw new Error('Transaction confirmation timeout');
            }
            
            // Update status to confirmed
            if (client) {
                (client as unknown as {
                    updateTransactionStatus: (sig: string, status: string, error?: string) => void;
                }).updateTransactionStatus(sig, 'confirmed');
            }
        } catch (confirmError) {
            // Update status to failed if confirmation fails
            if (client) {
                (client as unknown as {
                    updateTransactionStatus: (sig: string, status: string, error?: string) => void;
                }).updateTransactionStatus(sig, 'failed',
                    confirmError instanceof Error ? confirmError.message : 'Confirmation failed'
                );
            }
            throw confirmError;
        }
    }

    return (
        <div className="space-y-4">
            <TransactionForm
                title="Modern SOL Transfer"
                description="Using modern @solana/kit"
                onSubmit={handleTransfer}
                disabled={!signer}
                defaultRecipient="DemoWa11et1111111111111111111111111111111111"
            />
            {signature && <TransactionResult signature={signature} cluster={cluster?.id || 'devnet'} />}
        </div>
    );
}

