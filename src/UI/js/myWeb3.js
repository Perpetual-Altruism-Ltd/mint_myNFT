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
const address = "0x6141a60804d9027517BeD1cDd756101bfe471aa9";

const contract = new web3.eth.Contract(abi, address);

// export const useContractMethods = async () => {
//   const totalSupply = await contract.methods.totalSupply().call();

//   return totalSupply;
// };

export const setDefaultAccount = async () => {
  await web3.eth.getAccounts((error, accounts) => {
    if (error) return console.error(error);
    web3.eth.defaultAccount = accounts[0];
  });
};

export const getAllTheTokens = async () => {
  let tokens = [];
  const totalSupply = await contract.methods.totalSupply().call();

  for (let i = 0; i < totalSupply; i++) {
    let token = await contract.methods.myTokens(i).call();

    tokens.push(token);
  }
  return tokens;
};

setDefaultAccount();

export const mintToken = async (tokenId) => {
  await contract.methods
    .mint(tokenId)
    .send({ from: web3.eth.defaultAccount })
    .once("receipt", (receipt) => console.log(receipt));
};
