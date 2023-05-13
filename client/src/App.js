import './App.css';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { getAddress } from 'ethers';

function App() {
  const [currentAccount, setCurrentAccount] = useState(''); //fetched from metamask
  const [correctNetwork, setCorrectNetwork] = useState(false); //fetched from metamask

  //Ethereum Wallet Connector
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert('Metamask Not Found ! Get MetaMask and Try Again.');
        return;
      }

      let chainId = await ethereum.request({ method: 'eth_chainId' });

      const shardeumChainId = '0x1f91';
      if (chainId !== shardeumChainId) {
        alert('Please Connect to shardeum Testnet');
        return;
      }
      else {
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    connectWallet();
  }, [connectWallet]);

  return (
    <div className="App">
      {currentAccount === '' ? (
        <div className='ConnectWallet Page'> Connect Wallet</div>
      ): currentAccount === '' ? (
        <div className='flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3'
            style={{
              display:"flex",
              flexDirection:"column",
              justifyContent:"center",
              alignItems:"center",
              fontWeight:"bold",
              fontSize:"26px",
              width:"100%",
              height:"100vh"
            }}>
          <div>-----------------------------------------</div>
          <div>Please connect to the shardeum Testnet</div>
          <div>and reload the page</div>
          <div>-----------------------------------------</div>
        </div>
      ) : (
        <div className='Main'>Main Page</div>
      )
      }
    </div>
  );
}

export default App;
