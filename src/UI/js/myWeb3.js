import MyNftToken from "../../contracts/artifacts/MyNftToken_metadata.json" assert { type: "json" };

export const loadWeb3 = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
  } else if (window.web3) {
    web3 = new Web3(web3.currentProvider);
  } else {
    window.alert(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }
};

loadWeb3();

const abi = MyNftToken.output.abi;

const address = "0xB6Fb6A3902c3a71Da521982B4384161501cf4e01";

const contract = new web3.eth.Contract(abi, address);

export const setDefaultAccount = async () => {
  const accounts = await web3.eth.getAccounts();
  web3.eth.defaultAccount = accounts[0];
};

export const getAllTheTokens = async () => {
  let tokens = [];

  const totalSupply = await contract.methods.totalSupply().call();

  for (let i = 0; i < totalSupply; i++) {
    let token = await contract.methods.myTokens(i).call();

    tokens = [...tokens, token];
  }
  return tokens;
};

export const mintToken = async (tokenId) => {
  const tokenURI = `http://localhost:3005/api/metadata/${tokenId}`;

  await contract.methods
    .mint(tokenId, tokenURI)
    .send({ from: web3.eth.defaultAccount });
};

export const getMetaDataURI = async (tokenId) => {
  const metaDataUrI = await contract.methods.getTokenURI(tokenId).call();
  return metaDataUrI;
};

export const balance = async () => {
  await setDefaultAccount();

  const bal = await contract.methods.balanceOf(web3.eth.defaultAccount).call();

  return bal;
};

export const ownerOf = async (tokenId) => {
  const owner = await contract.methods.ownerOf(tokenId).call();
  return owner;
};

export const transferToken = async (tokenId, to) => {
  await setDefaultAccount();
  await contract.methods
    .transfer(web3.eth.defaultAccount, to, tokenId)
    .send({ from: web3.eth.defaultAccount })
    .once("receipt", (receipt) => console.log(receipt));
};
