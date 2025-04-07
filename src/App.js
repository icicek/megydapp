import React from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

import '@solana/wallet-adapter-react-ui/styles.css';

import CoincarnateForm from './CoincarnateForm';
import TokenList from './TokenList';
import Dashboard from './Dashboard';
import ClaimPanel from './ClaimPanel';

const App = () => {
    const network = 'mainnet-beta';
    const endpoint = clusterApiUrl(network);

    const wallets = [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
    ];

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <div
                        style={{
                            minHeight: '100vh',
                            padding: '20px',
                            backgroundColor: '#0e0e0e',
                            color: '#fff',
                            fontFamily: 'Arial',
                        }}
                    >
                        <h1 style={{ marginBottom: '20px' }}>MEMERGY Wallet Portal</h1>

                        <div style={{ marginBottom: '20px' }}>
                            <WalletMultiButton />
                        </div>

                        <div style={{ marginTop: '40px' }}>
                            <CoincarnateForm />
                        </div>

                        <div style={{ marginTop: '40px' }}>
                            <TokenList />
                        </div>

                        <div style={{ marginTop: '40px' }}>
                            <Dashboard />
                        </div>

                        <div style={{ marginTop: '40px' }}>
                            <ClaimPanel />
                        </div>
                    </div>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default App;
