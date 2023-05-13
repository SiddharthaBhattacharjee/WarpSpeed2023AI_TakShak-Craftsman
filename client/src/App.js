import "./App.css";
import React, { useState, useEffect, useReducer } from "react";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { getAddress } from "ethers";
import PhoneNum from "./res/PhoneNum.png";
import Ilustration from "./res/Ilustration.png"



function App() {
  const [currentAccount, setCurrentAccount] = useState(""); //fetched from metamask
  const [correctNetwork, setCorrectNetwork] = useState(false); //fetched from metamas

  //Ethereum Wallet Connector
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Metamask Not Found ! Get MetaMask and Try Again.");
        return;
      }

      let chainId = await ethereum.request({ method: "eth_chainId" });

      const shardeumChainId = "0x1f91";
      if (chainId !== shardeumChainId) {
        alert("Please Connect to shardeum Testnet");
        return;
      } else {
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  function copyPhoneNumberToClipboard() {
    const phoneNumber = "+12707704034";
    navigator.clipboard.writeText(phoneNumber)
      .then(() => {
        window.alert("Copied phone number to clipboard!");
      })
      .catch((error) => {
        window.alert("Could not copy phone number to clipboard.");
        console.error(error);
      });
  }

  useEffect(() => {
    connectWallet();
  }, [connectWallet]);

  return (
    <div className="App">
      {currentAccount === "" ? (
        <div className="ConnectWallet">
          <div className="cwTop">
            <img
              src={PhoneNum}
              alt="+12707704034"
              className="NumBtn"
              onClick={copyPhoneNumberToClipboard} 
            ></img>
          </div>
          <div className="cwBottom">
            <div className="cwBottomLeft">
              <div className="cwBottomLeftInner">
                <div className="cwBottomLeftHead">Operator AI</div>
              </div>
            </div>
            <div className="cwBottomRight">
              <img src={Ilustration} alt="illustration"></img>
            </div>
          </div>
        </div>
      ) : currentAccount === "" ? (
        <div
          className="flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "bold",
            fontSize: "26px",
            width: "100%",
            height: "100vh",
          }}
        >
          <div>-----------------------------------------</div>
          <div>Please connect to the shardeum Testnet</div>
          <div>and reload the page</div>
          <div>-----------------------------------------</div>
        </div>
      ) : (
        <div className="Main">Main Page</div>
      )}
    </div>
  );
}

export default App;
