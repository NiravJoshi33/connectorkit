import { getContext } from 'svelte';
import type { ConnectorClient } from '../lib/core/connector-client';
import { CONNECTOR_CLIENT_CONTEXT_KEY, CONNECTOR_STORE_CONTEXT_KEY } from './constants';
import { ConnectorState } from 'src/types';
import { derived, Readable } from 'svelte/store';

export const useConnectorClient = (): ConnectorClient => {
    const client = getContext<ConnectorClient>(CONNECTOR_CLIENT_CONTEXT_KEY);

    if (!client) {
        throw new Error('ConnectorProvider not found. Wrap your app in <ConnectionProvider />');
    }

    return client;
};

export const useConnector = () => {
    const client = useConnectorClient();
    const store = getContext<Readable<ConnectorState>>(CONNECTOR_STORE_CONTEXT_KEY);

    if (!store) {
        throw new Error('ConnectorStore not found. Wrap your app in <ConnectionProvider />');
    }

    return {
        // The raw store (usage: $store) if users want full access
        store,

        // Derived values (usage: $connected, $wallet)
        // These update automatically when the store changes
        connected: derived(store, $ => $.connected),
        wallet: derived(store, $ => $.selectedWallet),
        address: derived(store, $ => $.selectedAccount),
        wallets: derived(store, $ => $.wallets),
        cluster: derived(store, $ => $.cluster),

        // Actions bound to client so they don't need $ prefix
        select: client.select.bind(client),
        disconnect: client.disconnect.bind(client),
        selectAccount: client.selectAccount.bind(client),
    };
};
