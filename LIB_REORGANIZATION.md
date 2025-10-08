# lib/ Folder Reorganization

## Overview

Successfully reorganized the `packages/connector/src/lib/` folder from a flat 17-file structure into a fine-grained 7-folder architecture for better code organization and maintainability.

## New Structure

```
lib/
├── core/                        # Core connector architecture (4 files)
│   ├── connector-client.ts     # Main coordinator class (296 lines)
│   ├── state-manager.ts        # State management with structural sharing (158 lines)
│   ├── event-emitter.ts        # Event system (67 lines)
│   └── debug-metrics.ts        # Performance metrics (77 lines)
│
├── connection/                  # Connection & wallet management (4 files)
│   ├── connection-manager.ts   # Connection lifecycle (348 lines)
│   ├── auto-connector.ts       # Auto-reconnection strategies (296 lines)
│   ├── wallet-detector.ts      # Wallet discovery & registry (171 lines)
│   └── connection-pool.ts      # RPC connection pooling (324 lines)
│
├── cluster/                     # Network management (1 file)
│   └── cluster-manager.ts      # Cluster selection & persistence (98 lines)
│
├── transaction/                 # Transaction handling (2 files)
│   ├── transaction-tracker.ts  # Transaction history tracking (104 lines)
│   └── transaction-signer.ts   # Transaction signing abstraction (397 lines)
│
├── health/                      # Diagnostics (1 file)
│   └── health-monitor.ts       # Health checks & diagnostics (114 lines)
│
├── adapters/                    # Adapters & shims (3 files)
│   ├── enhanced-storage.ts     # Enhanced storage with validation (346 lines)
│   ├── wallet-standard-shim.ts # Wallet Standard registry shim (110 lines)
│   └── solana-mobile-shim.d.ts # Mobile wallet adapter types (9 lines)
│
└── utils/                       # Utilities (2 files)
    ├── polyfills.ts            # Browser compatibility polyfills (134 lines)
    └── explorer-urls.ts        # Explorer URL utilities (116 lines)
```

## Organization Principles

### 1. **core/** - Heart of the connector
The foundational classes that everything else depends on:
- **connector-client.ts**: Lean coordinator that wires collaborators together
- **state-manager.ts**: Optimized state management with React-friendly updates
- **event-emitter.ts**: Event system for analytics and monitoring
- **debug-metrics.ts**: Performance tracking and optimization metrics

### 2. **connection/** - Wallet & connection management
Everything related to wallet connections:
- **connection-manager.ts**: Connect/disconnect lifecycle and account selection
- **auto-connector.ts**: Instant and fallback auto-reconnection strategies
- **wallet-detector.ts**: Wallet Standard registry integration and direct detection
- **connection-pool.ts**: RPC connection pooling for performance

### 3. **cluster/** - Network management
Solana network/cluster handling:
- **cluster-manager.ts**: Cluster selection, validation, and persistence

### 4. **transaction/** - Transaction operations
Transaction-related functionality:
- **transaction-tracker.ts**: History tracking and status updates
- **transaction-signer.ts**: Unified transaction signing abstraction

### 5. **health/** - Monitoring & diagnostics
System health and diagnostics:
- **health-monitor.ts**: Comprehensive health checks and state validation

### 6. **adapters/** - External integrations
Adapters and shims for external systems:
- **enhanced-storage.ts**: Storage with validation and SSR support
- **wallet-standard-shim.ts**: Wallet Standard registry integration
- **solana-mobile-shim.d.ts**: Mobile wallet adapter type definitions

### 7. **utils/** - Shared utilities
Common utilities used across the connector:
- **polyfills.ts**: Browser compatibility (crypto, etc.)
- **explorer-urls.ts**: Explorer URL generation

## Benefits

### Clear Separation of Concerns
- Each folder has a single, well-defined purpose
- Easy to locate relevant code
- Reduces cognitive load when navigating the codebase

### Improved Maintainability
- Changes to connection logic don't affect transaction tracking
- Cluster management isolated from core state management
- Utils and adapters clearly separated from business logic

### Better Discoverability
- New developers can quickly understand the architecture
- Folder names clearly indicate what's inside
- Related files are co-located

### Scalability
- Easy to add new files to appropriate folders
- Can split large files within their domain folder
- Clear boundaries for future refactoring

### Testing Organization
- Test files can mirror the folder structure
- Easy to test individual domains in isolation
- Clear separation for unit vs integration tests

## Migration Details

### Updated Files
All imports were updated to reflect the new structure:

**Source files:**
- `packages/connector/src/headless.ts` - Updated 7 imports
- `packages/connector/src/react.ts` - Updated 1 import
- `packages/connector/src/ui/connector-provider.tsx` - Updated 2 imports
- `packages/connector/src/hooks/use-transaction-signer.ts` - Updated 1 import
- `packages/connector/src/config/default-config.ts` - Updated 1 import

**Collaborator files:**
- All 10 collaborator files updated to use relative imports with `../` or `../../`

**Fixed issues:**
- Added missing type annotations in hooks (use-account.ts, use-wallet-info.ts)
- Fixed TypeScript errors in DTS build
- All imports now resolve correctly

### Build Status
✅ Connector package builds successfully
✅ TypeScript declarations generated
✅ Next.js example builds and works
✅ No linter errors
✅ Zero breaking changes to public API

## File Count

| Folder | Files | Lines of Code |
|--------|-------|---------------|
| core/ | 4 | ~598 |
| connection/ | 4 | ~1,139 |
| cluster/ | 1 | 98 |
| transaction/ | 2 | 501 |
| health/ | 1 | 114 |
| adapters/ | 3 | 465 |
| utils/ | 2 | 250 |
| **Total** | **17** | **~3,165** |

## Examples

### Importing from core
```typescript
import { ConnectorClient } from './lib/core/connector-client';
import { StateManager } from './lib/core/state-manager';
```

### Importing from connection
```typescript
import { ConnectionManager } from './lib/connection/connection-manager';
import { WalletDetector } from './lib/connection/wallet-detector';
```

### Importing from adapters
```typescript
import { getWalletsRegistry } from './lib/adapters/wallet-standard-shim';
import { EnhancedStorage } from './lib/adapters/enhanced-storage';
```

### Importing from utils
```typescript
import { installPolyfills } from './lib/utils/polyfills';
import { getSolanaExplorerUrl } from './lib/utils/explorer-urls';
```

## Future Improvements

Now that the organization is in place:

1. **Add index.ts files**: Create barrel exports for each folder
   ```typescript
   // lib/core/index.ts
   export * from './connector-client';
   export * from './state-manager';
   // etc.
   ```

2. **Co-locate tests**: Create tests next to each file
   ```
   core/
   ├── connector-client.ts
   ├── connector-client.test.ts
   ├── state-manager.ts
   └── state-manager.test.ts
   ```

3. **Add README files**: Document each folder's purpose
   ```
   core/
   ├── README.md  # Explains core architecture
   ├── connector-client.ts
   └── ...
   ```

4. **Split large files**: If files grow beyond ~500 lines, split within their domain
   ```
   connection/
   ├── connection-manager/
   │   ├── index.ts
   │   ├── lifecycle.ts
   │   └── events.ts
   ```

## Summary

This fine-grained reorganization transforms a flat 17-file structure into a well-organized 7-folder architecture that:

- ✅ **Improves clarity** - Each folder has a clear purpose
- ✅ **Enhances maintainability** - Easy to find and modify code
- ✅ **Facilitates growth** - Clear boundaries for new features
- ✅ **Enables testing** - Domain-focused test organization
- ✅ **Maintains compatibility** - Zero breaking changes

The refactoring is production-ready and all existing functionality continues to work perfectly! 🎉

