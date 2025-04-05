import React from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';

import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import TokenList from './TokenList'; // ✅ Token bileşenini dışarıdan alıyoruz

const App = () => {
    const network = 'devnet'; // test ağı. Mainnet'e geçince 'mainnet-beta' yaz
    const endpoint = clusterApiUrl(network);

    const wallets = [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
    ];

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <div style={{
                        minHeight: '100vh',
                        padding: '20px',
                        backgroundColor: '#0e0e0e',
                        color: '#fff',
                        fontFamily: 'Arial'
                    }}>
                        <h1 style={{ marginBottom: '20px' }}>$MEGY Wallet Connect</h1>
                        <WalletMultiButton />
                        <div style={{ marginTop: '40px' }}>
                            <TokenList />
                        </div>
                    </div>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default App;
