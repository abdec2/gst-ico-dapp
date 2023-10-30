import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react'

// 1. Get projectId
const projectId = '1242d9c1f7a1e32cc5fb0da6c6877f84'

// 2. Set chains
const mainnet = {
  chainId: 97,
  name: 'BSC Testnet',
  currency: 'BNB',
  explorerUrl: 'https://testnet.bscscan.com',
  rpcUrl: 'https://bsc-testnet.publicnode.com	'
}

// 3. Create modal
const metadata = {
  name: 'Global Standard Token',
  description: 'Global Standard Token Initial Coin Offering',
  url: 'https://globalstandardtoken.com/'
}

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [mainnet],
  projectId,
  defaultChain: [mainnet],
  themeVariables: {
    '--w3m-accent': '#E1C260',
    '--w3m-border-radius-master' : '1px'
  }

})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
