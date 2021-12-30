import MintContract from "./ABI/ImplERC721_metadata.json" assert { type: "json" };

export let transferNFT = async function(contractAddr, tokenId, toAddr){
  console.log("Transfert to " + toAddr + " of token " + tokenId + " from " + contractAddr);
  //Create contract from contract addr
  let mintContract = new window.connector.web3.eth.Contract(
    MintContract.output.abi,
    contractAddr
  );
  //Call transfert
  return await transferToken(mintContract, tokenId, toAddr);
}

export const loadWeb3 = async () => {
  /*if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
  } else if (window.web3) {
    web3 = new Web3(web3.currentProvider);
  } else {
    return window.alert(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }*/
  console.error("OOP. use the wallet_connecton page instead.");
};

export const setDefaultAccount = async () => {
  const accounts = await window.connector.web3.eth.getAccounts();
  window.connector.web3.eth.defaultAccount = accounts[0];
  return window.connector.web3.eth.defaultAccount;
};

export const getAllTheTokens = async (contract) => {
  let tokens = [];
  try {
    const totalSupply = await contract.methods.mintedTokens().call();

    for (let i = 1; i <= totalSupply; i++) {
      let owner = await contract.methods.ownerOf(i).call();
      if (owner === window.connector.web3.eth.defaultAccount) {
        const token = await contract.methods.tokenURI(i).call();
        tokens = [
          ...tokens,
          {
            tokenId: i,
            tokenUri: token,
          },
        ];
      }
    }
  } catch (error) {
    console.error(error);
  }
  return tokens;
};

export const mintToken = async (tokenId, contract) => {
  const data = await contract.methods
    .mint(tokenId)
    .send({ from: window.connector.web3.eth.defaultAccount });
  return data;
};

export const getMetaDataUrI = async (tokenId, contract) => {
  const metaDataUrI = await contract.methods.tokenURI(tokenId).call();
  return metaDataUrI;
};

export const balance = async (contract) => {
  await setDefaultAccount();

  const bal = await contract.methods.balanceOf(window.connector.web3.eth.defaultAccount).call();

  return bal;
};

export const ownerOf = async (contract, tokenId) => {
  const owner = await contract.methods.ownerOf(tokenId).call();
  return owner;
};

//Returns 0 if transaction rejected by user; -1 if error occured, and 1 any other time.
export const transferToken = async (contract, tokenId, to) => {
  await setDefaultAccount();

  let returnVal = 'ok';
  await contract.methods
    .transferFrom(window.connector.web3.eth.defaultAccount, to, tokenId)
    .send({ from: window.connector.web3.eth.defaultAccount })
    .once("receipt", (receipt) => console.log(receipt))
    .catch((res) => {
      //Catch cancel error code
      if(res.code == 4001){returnVal = 'rejected';}
      else {returnVal = 'error';}
    });
    return returnVal;
};
