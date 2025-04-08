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

console.log("🎯 TEST BANNER VERSION LOADED"); // ✅ Konsola düşmesi gerekiyor

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
                        {/* 🚧 TEST MODE BANNER */}
                        <div
                            style={{
                                backgroundColor: '#ffcc00',
                                color: '#000',
                                padding: '12px',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                borderRadius: '10px',
                                marginBottom: '20px',
                                fontSize: '16px',
                            }}
                        >
                            🚧 This is a <u>test version</u> of the Coincarnation platform. Distribution has not started yet.
                        </div>

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
