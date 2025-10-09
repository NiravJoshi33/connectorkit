/**
 * Fetch transaction details from RPC
 */

import { createSolanaRpc, signature as createSignature } from '@solana/kit';

export interface FetchTransactionResult {
    transaction: any | null;
    error?: string;
}

/**
 * Fetch full transaction details from RPC
 * Returns parsed transaction with metadata including logs
 */
export async function fetchTransactionDetails(
    signature: string,
    rpcUrl: string
): Promise<FetchTransactionResult> {
    try {
        const rpc = createSolanaRpc(rpcUrl);
        
        // Convert signature string to Signature type
        const txSignature = createSignature(signature);
        
        // Try with 'confirmed' commitment first
        let transaction = await rpc
            .getTransaction(txSignature, {
                encoding: 'jsonParsed',
                maxSupportedTransactionVersion: 0,
                commitment: 'confirmed',
            })
            .send();
        
        // If not found with 'confirmed', try with 'finalized'
        if (!transaction) {
            console.log('Transaction not found with confirmed commitment, trying finalized...');
            transaction = await rpc
                .getTransaction(txSignature, {
                    encoding: 'jsonParsed',
                    maxSupportedTransactionVersion: 0,
                    commitment: 'finalized',
                })
                .send();
        }
        
        console.log('Transaction response for', signature.slice(0, 8) + '...:', transaction);

        if (!transaction) {
            console.warn('Transaction not found for signature:', signature);
            return {
                transaction: null,
                error: 'Transaction not found. It may not be confirmed yet or the RPC endpoint may be rate-limited.',
            };
        }

        return { transaction };
    } catch (error) {
        console.error('Error fetching transaction:', error);
        return {
            transaction: null,
            error: error instanceof Error ? error.message : 'Failed to fetch transaction',
        };
    }
}

/**
 * Extract basic instruction information from a transaction
 */
export function getInstructionSummaries(transaction: any): Array<{
    index: number;
    programId: string;
    programName?: string;
}> {
    const instructions = transaction.transaction?.message?.instructions || [];
    
    return instructions.map((ix: any, index: number) => {
        // Handle both parsed and unparsed instructions
        const programId = ix.programId || ix.program || 'unknown';
        return {
            index: index + 1,
            programId: typeof programId === 'string' ? programId : programId.toString(),
        };
    });
}

