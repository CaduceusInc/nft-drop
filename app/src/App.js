import React, { useEffect, useState } from "react";
import "./App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import CandyMachine from "./CandyMachine/index";
// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom Wallet exists");

          const response = await solana.connect({ onlyIfTrusted: true });
          console
            .log("Connected with Public Key:", response.publicKey.toString());

          setWalletAddress(response.publicKey);
          
        } else {
          alert("Wallet not found. Install Phantom wallet ASAP.");
        }
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const connectWallet = async () => {
    // retrieve solana object
    const { solana } = window;
    // connect to the wallet via public key
    const response = await solana.connect();
    // log the public key
    console.log("Connected with Public Key:", response.publicKey);
    // set the wallet address
    setWalletAddress(response.publicKey.toString());

  };

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      {" "}
      Connect Wallet{" "}
    </button>
  );

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🍭 Candy Drop</p>
          <p className="sub-text">NFT drop machine with fair mint</p>
          {!walletAddress && renderNotConnectedContainer()}
        </div>
        {walletAddress && (<CandyMachine walletAddress={window.solana} />)}
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`Adapted from @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
