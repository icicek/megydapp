// src/TokenList.js

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import connection from './connection';

const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

function TokenList() {
  const { publicKey } = useWallet();
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    const fetchTokens = async () => {
      if (!publicKey) return;

      try {
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

        setTokens(tokenData);
      } catch (err) {
        console.error("Token çekme hatası:", err);
      }
    };

    fetchTokens();
  }, [publicKey]);

  if (!publicKey) return <p>Connect your wallet to see tokens.</p>;

  return (
    <div>
      <h3>Wallet Token List:</h3>
      <ul>
        {tokens.map((token, index) => (
          <li key={index}>
            Mint: {token.mint} — Amount: {token.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TokenList;
