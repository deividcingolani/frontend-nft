import React, { useState, useEffect, useRef } from "react";
import NFT from "./contracts/NFT.json";
import axios from "axios";
import { getWeb3 } from "./getWeb3";
function App() {
  const [tokensInfo, setTokensInfo] = useState([]);
  const [accounts, setAccounts] = useState();
  const contract = useRef();
  console.log(contract?.current?.methods?.tokenURI(0).arguments[0]);

  // const handlerMint = async () => {
  //   const tokenURI = await nft.tokenURI(0);
  //   const { data } = await axios.get(tokenURI);
  //   setTokenInfo(data.result);
  // }
  // await nft.mint("0xD853A6a2b472456D0829d34125782C563Bf59755");
  // };

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts);
      const networkId = await web3.eth.net.getId();
      const contractAddress = NFT.networks[networkId].address;
      // instantiate contract instance and assign to component ref variable
      contract.current = new web3.eth.Contract(NFT.abi, contractAddress, {
        from: accounts[0],
      });
      const tokenUri = await contract?.current?.methods?.tokenURI(0);
      console.log(tokenUri);
    };

    init();
  }, []);
  const handlerMint = async () => {
    console.log(accounts);
    // console.log(contract?.current?.methods?.mint())
    await contract?.current?.methods?.mint(accounts[0]);
    const tokenURI = await contract?.current?.methods?.tokenURI(0).call();
    const { data } = await axios.get(tokenURI);
    setTokensInfo((prevState) => [...prevState, data.result]);
  };

  return (
    <div className="container">
      <button onClick={() => handlerMint()}>
        Click here if you want to mint a new card
      </button>
      {tokensInfo &&
        tokensInfo.map((tokenInfo) => {
          return (
            <div key={tokenInfo.tokenId}>
              <div className="jumbotron">
                <p className="lead text-center">{tokenInfo.description}</p>
                <img src={tokenInfo.image} className="img-fluid" />
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default App;
