export const loadWeb3 = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
  } else if (window.web3) {
    web3 = new Web3(web3.currentProvider);
  } else {
    return window.alert(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }
};

export const setDefaultAccount = async () => {
  const accounts = await web3.eth.getAccounts();
  web3.eth.defaultAccount = accounts[0];
  return web3.eth.defaultAccount;
};

export const getAllTheTokens = async (contract) => {
  let tokens = [];
  try {
    const totalSupply = await contract.methods.mintedTokens().call();

    for (let i = 1; i <= totalSupply; i++) {
      let owner = await contract.methods.ownerOf(i).call();
      if (owner === web3.eth.defaultAccount) {
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
    .send({ from: web3.eth.defaultAccount });
  return data;
};

export const getMetaDataUrI = async (tokenId, contract) => {
  const metaDataUrI = await contract.methods.tokenURI(tokenId).call();
  return metaDataUrI;
};

export const balance = async (contract) => {
  await setDefaultAccount();

  const bal = await contract.methods.balanceOf(web3.eth.defaultAccount).call();

  return bal;
};

export const ownerOf = async (contract, tokenId) => {
  const owner = await contract.methods.ownerOf(tokenId).call();
  return owner;
};

export const transferToken = async (contract, tokenId, to) => {
  await setDefaultAccount();
  console.log(contract.methods);
  await contract.methods
    .transferFrom(web3.eth.defaultAccount, to, tokenId)
    .send({ from: web3.eth.defaultAccount })
    .once("receipt", (receipt) => console.log(receipt));
};
