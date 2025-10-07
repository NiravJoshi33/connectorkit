import { ConnectorProvider } from '@connector-kit/connector/react'
import { getDefaultConfig } from '@connector-kit/connector/headless'
import { WalletDemo } from './components/WalletDemo'

const config = getDefaultConfig({
  appName: 'ConnectorKit Vite Example',
  network: 'devnet', // Will create default clusters: mainnet, devnet, testnet
})

function App() {
  return (
    <ConnectorProvider config={config}>
      <div className="min-h-screen bg-gray-50">
        <WalletDemo />
      </div>
    </ConnectorProvider>
  )
}

export default App
