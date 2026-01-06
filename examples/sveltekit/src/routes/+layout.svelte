<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { ConnectorProvider} from "@solana/connector/svelte";
	import { getDefaultConfig } from "@solana/connector/headless";

	const config = getDefaultConfig({
		appName: "Svelte Test App",
		network: "devnet",
		autoConnect: true,
	})

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ConnectorProvider {config}>
	{@render children()}
</ConnectorProvider>
