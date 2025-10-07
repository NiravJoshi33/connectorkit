/**
 * Transaction and signer-related types
 */

import type { Wallet, WalletAccount } from './wallets'
import type { SolanaCluster } from '@wallet-ui/core'
import type { Address, Signature } from 'gill'

/**
 * Configuration for creating a transaction signer
 */
export interface TransactionSignerConfig {
	/** The Wallet Standard wallet instance */
	wallet: Wallet
	/** The specific account to sign with */
	account: WalletAccount
	/** Optional cluster/network context for chain-specific operations */
	cluster?: SolanaCluster
}

/**
 * Result of a signed transaction operation
 */
export interface SignedTransaction {
	/** The transaction signature/hash */
	signature: string
	/** The signed transaction data */
	transaction: any
}

/**
 * Capabilities that a transaction signer supports
 * Useful for conditionally enabling/disabling UI features
 */
export interface TransactionSignerCapabilities {
	/** Can sign transactions without sending */
	canSign: boolean
	/** Can sign and send transactions in one operation */
	canSend: boolean
	/** Can sign arbitrary messages */
	canSignMessage: boolean
	/** Can sign multiple transactions at once */
	supportsBatchSigning: boolean
}

/**
 * Transaction activity record for debugging and monitoring
 */
export interface TransactionActivity {
	/** Transaction signature */
	signature: Signature
	/** When the transaction was sent */
	timestamp: string
	/** Transaction status */
	status: 'pending' | 'confirmed' | 'failed'
	/** Error message if failed */
	error?: string
	/** Cluster where transaction was sent */
	cluster: string
	/** Fee payer address */
	feePayer?: Address
	/** Method used (signAndSendTransaction, sendTransaction, etc) */
	method: string
	/** Additional metadata */
	metadata?: Record<string, any>
}
