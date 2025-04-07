import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const TOTAL_SUPPLY = 5_000_000_000;

const Dashboard = () => {
    const { publicKey } = useWallet();

    const [contributions, setContributions] = useState([]);
    const [userData, setUserData] = useState(null);
    const [totalPool, setTotalPool] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/contributions.json');
                const data = await res.json();
                setContributions(data);

                const total = data.reduce((sum, entry) => sum + entry.usdValue, 0);
                setTotalPool(total);

                if (publicKey) {
                    const walletAddress = publicKey.toBase58();
                    const user = data.find(entry => entry.wallet === walletAddress);
                    setUserData(user);
                }
            } catch (err) {
                console.error("Failed to fetch contributions:", err);
            }
        };

        fetchData();
    }, [publicKey]);

    const userUsd = userData?.usdValue || 0;
    const userRatio = totalPool > 0 ? (userUsd / totalPool) * 100 : 0;
    const estimatedMEGY = totalPool > 0 ? Math.floor((userUsd / totalPool) * TOTAL_SUPPLY) : 0;

    return (
        <div style={{
            marginTop: '50px',
            backgroundColor: '#1e1e1e',
            padding: '20px',
            borderRadius: '12px',
            color: '#fff',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            boxShadow: '0 0 10px rgba(255,255,255,0.1)'
        }}>
            <h2 style={{ marginBottom: '10px' }}>📊 Contribution Dashboard</h2>
            {!publicKey ? (
                <p>Please connect your wallet.</p>
            ) : (
                <>
                    <p><strong>Wallet:</strong> {publicKey.toBase58()}</p>
                    <p><strong>Your Contribution:</strong> ${userUsd.toLocaleString()}</p>
                    <p><strong>Total Contributions:</strong> ${totalPool.toLocaleString()}</p>
                    <p><strong>Your Share of Pool:</strong> {userRatio.toFixed(2)}%</p>
                    <p><strong>Estimated $MEGY:</strong> {estimatedMEGY.toLocaleString()} MEGY</p>
                </>
            )}
        </div>
    );
};

export default Dashboard;
