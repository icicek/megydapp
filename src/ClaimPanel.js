import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const TOTAL_SUPPLY = 5_000_000_000;

const ClaimPanel = () => {
    const { publicKey } = useWallet();
    const [snapshotData, setSnapshotData] = useState([]);
    const [claimRecords, setClaimRecords] = useState([]);
    const [userData, setUserData] = useState(null);
    const [claimAddress, setClaimAddress] = useState('');
    const [claimed, setClaimed] = useState(false);
    const [alreadyClaimed, setAlreadyClaimed] = useState(false);

    const SNAPSHOT_URL = '/contributions.json'; // Yerel snapshot dosyası
    const CLAIM_API_URL = 'https://api.sheetbest.com/sheets/3a208f49-ef1c-4a16-a1e2-74c8ef1b8e54'; // <-- kendi Sheet.best URL'ini buraya koy

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Snapshot katkı verisini al
                const snapshotRes = await fetch(SNAPSHOT_URL);
                const snapshotJson = await snapshotRes.json();
                setSnapshotData(snapshotJson);

                // Claim kayıtlarını al
                const claimRes = await fetch(CLAIM_API_URL);
                const claimJson = await claimRes.json();
                setClaimRecords(claimJson);

                if (publicKey) {
                    const wallet = publicKey.toBase58();

                    // Snapshot verisiyle eşleşen kullanıcıyı bul
                    const user = snapshotJson.find(entry => entry.wallet === wallet);
                    setUserData(user || null);

                    // Eğer bu cüzdan daha önce claim ettiyse işaretle
                    const already = claimJson.some(entry => entry.snapshotWallet === wallet);
                    setAlreadyClaimed(already);
                }
            } catch (err) {
                console.error("Error loading data:", err);
            }
        };

        fetchData();
    }, [publicKey]);

    const userUsd = userData?.usdValue || 0;
    const totalPool = snapshotData.reduce((sum, entry) => sum + entry.usdValue, 0);
    const estimatedMEGY = totalPool > 0 ? Math.floor((userUsd / totalPool) * TOTAL_SUPPLY) : 0;

    const handleClaim = async () => {
        if (!claimAddress) {
            alert("Please enter a wallet address to receive your $MEGY.");
            return;
        }

        const payload = {
            snapshotWallet: publicKey?.toBase58(),
            receiveAddress: claimAddress,
            megys: estimatedMEGY,
            timestamp: new Date().toISOString()
        };

        try {
            const res = await fetch(CLAIM_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Your claim request has been submitted!");
                setClaimed(true);
            } else {
                alert("Error submitting claim. Please try again.");
            }
        } catch (err) {
            console.error("Claim error:", err);
            alert("Something went wrong. Please check console.");
        }
    };

    if (!publicKey) return null;

    return (
        <div style={{
            marginTop: '50px',
            backgroundColor: '#111',
            padding: '24px',
            borderRadius: '12px',
            color: '#fff',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            boxShadow: '0 0 10px rgba(255,255,255,0.1)'
        }}>
            <h2 style={{ marginBottom: '16px' }}>🎁 Claim Your $MEGY</h2>

            {userData ? (
                <>
                    <p><strong>Snapshot Address:</strong> {publicKey.toBase58()}</p>
                    <p><strong>Contribution (USD):</strong> ${userUsd.toLocaleString()}</p>
                    <p><strong>Estimated $MEGY:</strong> {estimatedMEGY.toLocaleString()} MEGY</p>

                    {alreadyClaimed ? (
                        <p style={{ marginTop: '20px', color: '#00ff99', fontWeight: 'bold' }}>
                            ✅ Already claimed. Thank you!
                        </p>
                    ) : (
                        <>
                            <div style={{ marginTop: '16px' }}>
                                <label style={{ fontWeight: 'bold' }}>
                                    Enter wallet address to receive $MEGY:
                                </label>
                                <input
                                    type="text"
                                    value={claimAddress}
                                    onChange={(e) => setClaimAddress(e.target.value)}
                                    placeholder="Your Solana address"
                                    style={{
                                        marginTop: '6px',
                                        padding: '10px',
                                        width: '100%',
                                        borderRadius: '8px'
                                    }}
                                />
                            </div>

                            <button
                                onClick={handleClaim}
                                disabled={claimed}
                                style={{
                                    marginTop: '16px',
                                    backgroundColor: claimed ? 'gray' : '#8e44ad',
                                    color: '#fff',
                                    padding: '12px',
                                    width: '100%',
                                    borderRadius: '8px',
                                    cursor: claimed ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {claimed ? 'Claimed ✅' : 'Claim $MEGY'}
                            </button>
                        </>
                    )}
                </>
            ) : (
                <p style={{ color: 'orange' }}>
                    No contribution found for this wallet.
                </p>
            )}
        </div>
    );
};

export default ClaimPanel;
