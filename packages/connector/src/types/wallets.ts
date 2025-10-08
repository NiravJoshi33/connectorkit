/**
 * Wallet-related types
 * Re-exports from @wallet-standard/base and custom wallet types
 */

import type { Wallet, WalletAccount } from '@wallet-standard/base';

// Re-export standard types
export type { Wallet, WalletAccount };

/**
 * Extended wallet information with capability metadata
 */
export interface WalletInfo {
    /** The Wallet Standard wallet object */
    wallet: Wallet;
    /** Whether the wallet extension is installed */
    installed: boolean;
    /** Precomputed capability flag for UI convenience */
    connectable?: boolean;
}
