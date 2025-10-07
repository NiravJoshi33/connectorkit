/**
 * Storage-related types
 */

import type { SolanaClusterId } from '@wallet-ui/core'

/**
 * Storage adapter interface for connector persistence
 */
export interface StorageAdapter<T> {
	get(): T
	set(value: T): void
	subscribe?(callback: (value: T) => void): () => void
}

/**
 * Options for creating enhanced storage instances
 */
export interface StorageOptions<T> {
	/** Custom error handler for storage failures */
	onError?: (error: Error) => void
	/** Validate before setting values */
	validator?: (value: T) => boolean
	/** Use memory storage if localStorage unavailable (SSR) */
	useMemoryFallback?: boolean
}

/**
 * Options for account storage
 */
export interface EnhancedStorageAccountOptions {
	key?: string
	initial?: string | undefined
	validator?: (value: string | undefined) => boolean
	onError?: (error: Error) => void
}

/**
 * Options for cluster storage
 */
export interface EnhancedStorageClusterOptions {
	key?: string
	initial?: SolanaClusterId
	validClusters?: SolanaClusterId[]
	onError?: (error: Error) => void
}

/**
 * Options for wallet storage
 */
export interface EnhancedStorageWalletOptions {
	key?: string
	initial?: string | undefined
	onError?: (error: Error) => void
}
