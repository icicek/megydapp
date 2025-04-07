import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import connection from './connection';

const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

function TokenList() {
    const { publicKey, connected } = useWallet();
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTokens = async () => {
        if (!publicKey) return;

        setLoading(true);
        try {
            // ✅ SOL bakiyesi
            const solBalance = await connection.getBalance(publicKey);
            const solInSOL = solBalance / 1e9;

            // ✅ SPL tokenlar
            const accounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
                programId: TOKEN_PROGRAM_ID,
            });

            const tokenData = accounts.value.map(({ account }) => {
                const info = account.data.parsed.info;
                return {
                    mint: info.mint,
                    amount: info.tokenAmount.uiAmount,
                    decimals: info.tokenAmount.decimals,
                };
            });

            // ✅ SOL + SPL tokenları birlikte ayarla
            setTokens([
                {
                    mint: "SOL",
                    amount: solInSOL.toFixed(4),
                    decimals: 9,
                },
                ...tokenData,
            ]);
        } catch (err) {
            console.error("Token çekme hatası:", err);
        }
        setLoading(false);
    };

    // ✅ Cüzdan bağlandığında tokenları otomatik çek
    useEffect(() => {
        if (connected) {
            fetchTokens();
        }
    }, [connected]);

    if (!publicKey) return <p>Connect your wallet to see your tokens.</p>;

    return (
        <div>
            <h3>Wallet Token List:</h3>
            <button onClick={fetchTokens} style={{ marginBottom: '10px' }}>Refresh Tokens</button>
            {loading ? (
                <p>Loading tokens...</p>
            ) : (
                <ul>
                    {tokens.map((token, index) => (
                        <li key={index}>
                            <strong>{token.mint === "SOL" ? "SOL (Native)" : `Mint: ${token.mint}`}</strong> — Amount: {token.amount}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TokenList;
