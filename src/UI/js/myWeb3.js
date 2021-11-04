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
const address = "0x121d0f940a17ED33b0b90D961950aFbbE3e77fd7";

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
  await contract.methods.mint(tokenId).send({ from: web3.eth.defaultAccount });
};

export const getMetaDataUrI = async (tokenId) => {
  const metaDataUrI = await contract.methods.tokenURI(tokenId).call();
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
    ._transfer(web3.eth.defaultAccount, to, tokenId)
    .send({ from: web3.eth.defaultAccount })
    .once("receipt", (receipt) => console.log(receipt));
};
