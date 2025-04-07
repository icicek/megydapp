import React, { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
} from "@solana/spl-token";

// Replace this with your actual admin/public wallet address
const TO_PUBLIC_KEY = new PublicKey("B3DMWpiWuaCMj7wELSrLeoeaqSdSR1idAvX3d9istKe4");

const CoincarnateForm = () => {
  const { publicKey, connected, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState("");
  const [amount, setAmount] = useState("");

  // Fetch user's token balances
  useEffect(() => {
    const fetchTokens = async () => {
      if (!publicKey) {
        setTokens([]);
        return;
      }

      try {
        const accounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
          programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        });

        const list = accounts.value.map((acc) => {
          const info = acc.account.data.parsed.info;
          return {
            mint: info.mint,
            amount: info.tokenAmount.uiAmount,
            decimals: info.tokenAmount.decimals,
          };
        });

        setTokens(list.filter((t) => t.amount > 0));
      } catch (err) {
        console.error("Failed to fetch tokens:", err);
      }
    };

    fetchTokens();
  }, [publicKey, connection]);

  // Handle Coincarnation transfer
  const handleTransfer = async (e) => {
    e.preventDefault();

    if (!publicKey || !selectedToken || !amount) {
      alert("Please fill out all fields.");
      return;
    }

    const lamports = Math.floor(parseFloat(amount) * 1e9); // For native SOL

    try {
      const transaction = new Transaction();

      // If sending SOL
      if (selectedToken === "So11111111111111111111111111111111111111112") {
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: TO_PUBLIC_KEY,
            lamports: lamports,
          })
        );
      } else {
        // If sending an SPL token
        const mintPubkey = new PublicKey(selectedToken);

        const fromTokenAccount = await getAssociatedTokenAddress(
          mintPubkey,
          publicKey
        );
        const toTokenAccount = await getAssociatedTokenAddress(
          mintPubkey,
          TO_PUBLIC_KEY
        );

        const tokenInfo = tokens.find(t => t.mint === selectedToken);
        const decimals = tokenInfo && tokenInfo.decimals ? tokenInfo.decimals : 6;

        const splAmount = parseFloat(amount) * Math.pow(10, decimals);

        transaction.add(
          createTransferInstruction(
            fromTokenAccount,
            toTokenAccount,
            publicKey,
            splAmount,
            []
          )
        );
      }

      const txSig = await sendTransaction(transaction, connection);
      console.log("✅ Transfer successful! TX:", txSig);
      alert("Coincarnation transaction submitted!");

      // Reset form
      setAmount("");
      setSelectedToken("");
    } catch (error) {
      console.error("❌ Transfer failed:", error);
      alert("Transaction failed. Please check the console.");
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-xl max-w-md mx-auto mt-6 text-black">
      <h2 className="text-xl font-bold mb-4">MEGY Coincarnation</h2>

      {!connected ? (
        <p className="text-red-500">Wallet not connected.</p>
      ) : (
        <form onSubmit={handleTransfer} className="space-y-4">
          <div>
            <label className="block font-semibold">Select Token</label>
            <select
              className="w-full p-2 rounded"
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
            >
              <option value="">-- Select Token --</option>
              <option value="So11111111111111111111111111111111111111112">SOL (native)</option>
              {tokens.map((token, index) => (
                <option key={index} value={token.mint}>
                  {token.mint.slice(0, 6)}...{token.mint.slice(-4)} - {token.amount}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold">Amount</label>
            <input
              type="number"
              step="any"
              className="w-full p-2 rounded"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
          >
            Coincarne 🚀
          </button>
        </form>
      )}
    </div>
  );
};

export default CoincarnateForm;
