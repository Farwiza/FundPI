import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThirdwebProvider, metamaskWallet, coinbaseWallet, walletConnect } from '@thirdweb-dev/react';
import { Sepolia } from "@thirdweb-dev/chains";

import App from './App.jsx';
import './index.css';
import { StateContextProvider } from './context';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <ThirdwebProvider 
        activeChain={ Sepolia } 
        clientId='d30a6a69212a9d477b75cbc1e41212c9'
        supportedWallets={[metamaskWallet()]}
        >
        <Router>
            <StateContextProvider>
                <App />

            </StateContextProvider>
        </Router>
    </ThirdwebProvider>
);