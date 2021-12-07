import {
  balance,
  loadWeb3,
  setDefaultAccount,
  mintToken,
  transferToken,
  ownerOf,
  getAllTheTokens,
} from "./myWeb3.js";

import MintContract from "./ABI/ImplERC721_metadata.json" assert { type: "json" };
import Networks from "./networks.json" assert { type: "json" };
import { genRandomString } from "./utils.js";
import ERC721 from "./ABI/ERC721.json" assert { type: "json" };
import ERC165 from "./ABI/ERC165.json" assert { type: "json" };
import ERC721Metadata from "./ABI/ERC721Metadata.json" assert { type: "json" };

import Model from "./model.js";

//Views
import MintForm from "../view_classes/mint_form.js";
import TokenDisplay from "../view_classes/token_display.js";
import WalletConnection from "../view_classes/wallet_connection.js";

//components
import NFTCard from './nftCard.js';

const CONTRACTS = [
  {
    name: "Rinkeby",
    networkVersion: "4",
    address: "0x5aFC791CeCeAd8185d9d0C190784E64262Bac275",
  },
  {
    name: "Kovan",
    networkVersion: "42",
    address: "0x7cf01c77FCf173a69007A891beEc298D84235158",
  },
  {
    name: "Moonbase Alpha",
    networkVersion: "1287",
    address: "0x245b72b53ed93Cda919eD6e2C36bC888acFd6606",
  },
];

const ABIS = {
  ERC721: ERC721.abi,
  ERC165: ERC165.abi,
  ERC721Metadata: ERC721Metadata.abi,
  MintContract: MintContract.abi,
};
class App {
  __isLoading = true;
  __contract = null;
  __error = "";
  __defaultAccount = null;
  __allTokens = [];
  __allMetadata = [];
  __networks = Networks.networks;
  __contracts = {};

  constructor() {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", (event) => {
        // console.log( 'Changed', event )
        window.location.reload();
      });
    }
  }

  async loadInitialization() {
    this.__handleLoading(true);
    try {
      await loadWeb3();
      this.__initializeApp();
      this.loadMyNFTContract();
    } catch (error) {
      console.error(error);
      this.__handleError(
        "There was an issue loading contract information. Please try again"
      );
    } finally {
      this.__handleLoading(false);
    }
  }

  async loadMyNFTContract() {
    this.__handleLoading(true);
    try {
      // await loadWeb3();
      const networkVersion = await web3.eth.net.getId();
      const contractObject = CONTRACTS.find(
        (i) => i.networkVersion === `${networkVersion}`
      );
      const abi = MyNftToken.output.abi;
      const address = contractObject ? contractObject.address : "";

      this.__contract = await new web3.eth.Contract(abi, address);

      document.querySelector(
        "#contractAddress"
      ).innerHTML = `Contract Address: <strong>${address}</strong>`;

      this.__handleBalanceEnquiry();
      this.__handleNftSectionContent();
    } catch (error) {
      console.error(error);
      this.__handleError(
        "There was an issue loading contract information. Please try again"
      );
    } finally {
      this.__handleLoading(false);
    }
  }

  async __initializeApp() {
    try {
      this.__defaultAccount = await setDefaultAccount();

      this.__handleNetworkSection();
      this.__handleNavBarContent();
      this.__handleMintFormContent();
    } catch (error) {
      console.error(error);
      this.__handleError(
        "There was an issue initializing the application. Please try again"
      );
    } finally {
      this.__handleLoading(false);
    }
  }

  __handleNavBarContent() {
    try {
      document.querySelector("#account").textContent =
        this.__defaultAccount !== null
          ? `Address: ${this.__defaultAccount}`
          : "Address: N/A";
    } catch (error) {
      console.error(error);
      this.__handleError("Something went wrong. Please try again");
    }
  }

  __handleNetworkSection() {
    try {
      const networkSelector = document.querySelector(".network-selector");
      const contractInput = document.getElementById("contractInput");
      const loadContractBtn = document.getElementById("loadContractBtn");
      const loadTokenDataBtn = document.getElementById("loadTokenDataBtn");
      const tokenIdInput = document.getElementById("tokenIdInput");

      contractInput.addEventListener("change", async function () {
        const value = contractInput.value || "";
        if (!value) {
          loadContractBtn.setAttribute("disabled", "true");
        } else {
          loadContractBtn.removeAttribute("disabled");
        }
      });
      loadContractBtn.addEventListener("click", async () => {
        this.__loadTokenData(contractInput.value);
      });

      tokenIdInput.addEventListener("change", async function () {
        const value = tokenIdInput.value || "";
        if (!value.length) {
          loadTokenDataBtn.setAttribute("disabled", "true");
        } else {
          loadTokenDataBtn.removeAttribute("disabled");
        }
      });
      loadTokenDataBtn.addEventListener("click", async () => {
        this.__loadOtherTokenDetails();
      });

      networkSelector.innerHTML = "";
      for (let network of Networks.networks) {
        const newOption = document.createElement("option");
        newOption.value = network.chainID;
        newOption.textContent = network.name || "N/A";
        if (window.ethereum.networkVersion === `${network.chainID}`) {
          newOption.setAttribute("selected", "true");
        }

        networkSelector.appendChild(newOption);
      }

      networkSelector.addEventListener("change", (event) => {
        const value = event.target.value;
        const chainIDSelected = "0x" + Number(value).toString(16);
        this.__promptSwitchChainDataToFetch(chainIDSelected);
      });
    } catch (error) {
      console.error(error);
      this.__handleError("Something went wrong. Please try again");
    }
  }

  __handleMintFormContent() {
    try {
      const tokenURIinput = document.getElementById("tokenURIinput");
      const mintBtn = document.getElementById("mintBtn");
      const mintForm = document.getElementById("mintForm");

      mintForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const value = tokenURIinput.value || "";
        if (!value) return false;
        this.__handleSubmitMintForm(tokenURIinput.value || "");
      });

      tokenURIinput.addEventListener("change", async function () {
        const value = tokenURIinput.value || "";
        if (!value) {
          mintBtn.setAttribute("disabled", "true");
        } else {
          mintBtn.removeAttribute("disabled");
        }
      });
      mintBtn.addEventListener("click", async () => {
        this.__handleSubmitMintForm(tokenURIinput.value || "");
      });
    } catch (error) {
      console.error(error);
      this.__handleError("Something went wrong. Please try again");
    }
  }

  async __handleSubmitMintForm(tokenURI) {
    try {
      this.__handleLoading(true);
      await mintToken(tokenURI, this.__contract);

      const tokenURIinput = document.getElementById("tokenURIinput");
      const mintBtn = document.getElementById("mintBtn");

      tokenURIinput.value = "";
      mintBtn.setAttribute("disabled", "true");
    } catch (error) {
      console.error(error);
      alert("Failed to mint. Please retry." + ` ${error.message || ""}`);
    } finally {
      this.__handleLoading(false);
      this.__handleBalanceEnquiry();
      this.__handleNftSectionContent();
    }
  }

  async __handleNftSectionContent() {
    try {
      const nftSection = document.getElementsByClassName("nft-section")[0];
      await this.__handleTokenMetaData();
      nftSection.innerHTML = "";
      this.__allMetadata.forEach((metadata) => {
        // console.log( metadata )
        const cardElement = document.createElement("div");
        cardElement.classList.add("nft-card");
        cardElement.innerHTML = `
        <h3 class="nft-name">${metadata.name || "No name"}</h3>
        <p class="nft-description">${
          metadata.description || "No description"
        }</p>
        <p class="nft-token">Token ID: <strong>${
          metadata.token || "N/A"
        }</strong></p>
        <p class="nft-token">Token URI: <strong>${
          metadata.tokenUri || "N/A"
        }</strong></p>
        <button class="nft-transfer-btn btn" data-token-id="${
          metadata.token
        }" style="display: block;">Transfer</button>
        `;
        nftSection.appendChild(cardElement);
      });

      const transferButtons = document.querySelectorAll(".nft-transfer-btn");
      for (let transferElement of transferButtons) {
        const token = transferElement.getAttribute("data-token-id");
        transferElement.onclick = (e) => {
          this.__handleTransfer(e, token);
        };
      }
    } catch (error) {
      console.error(error);
      this.__handleError("Something went wrong. Please try again");
    }
  }

  async __handleBalanceEnquiry() {
    // return true
    try {
      const currentBalance = await balance(this.__contract);
      document.querySelector(
        "#balance"
      ).innerHTML = `Number of tokens this account has: <strong>${currentBalance}</strong>`;
    } catch (error) {
      console.error(error);
      alert("Failed to get balance enquiry");
    }
  }

  async __handleTransfer(event, tokenId) {
    try {
      this.__handleLoading(true);
      event.preventDefault();
      const addToAddress = prompt("Enter recipient address", "");
      if (addToAddress !== null) {
        await transferToken(this.__contract, tokenId, addToAddress);
        this.__handleNftSectionContent();
      }
      this.__handleBalanceEnquiry();
    } catch (error) {
      console.error(error);
      alert("Failed to transfer token." + ` ${error.message || ""}`);
    } finally {
      this.__handleLoading(false);
    }
  }

  async __getAllContractTokens() {
    let tokens = [];

    try {
      const myTokens = await getAllTheTokens(
        this.__contract,
        this.__defaultAccount
      );
      tokens = myTokens || [];

      return tokens;
    } catch (error) {
      console.error(error);
    } finally {
      this.__allTokens = tokens;
      return tokens;
    }
  }

  async __handleTokenMetaData() {
    let allTokens = [];

    try {
      allTokens = await this.__getAllContractTokens();
      this.__allMetadata = [];
      for (let tokenData of allTokens) {
        // let tokenMeta = await getAllMetaData(this.allTokens[token]);
        // TODO: Get the actual token metadata from IPFS
        let tokenMeta = {
          _id: genRandomString(),
          name: null,
          description: null,
          token: tokenData.tokenId,
          tokenUri: tokenData.tokenUri,
        };

        if (tokenMeta._id)
          this.__allMetadata = [...this.__allMetadata, tokenMeta];
      }
    } catch (error) {
      console.error(error);
    } finally {
      return allTokens;
    }
  }

  async __promptSwitchChainDataToFetch(ID) {
    try {
      window.ethereum
        .request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ID }], // chainId must be in hexadecimal numbers
        })
        .then((res) => {
          console.log("Network switched to " + ID + ". (DataToFetch)");
        })
        .catch((res) => {
          console.error(
            "Network switch canceled or error. (DataToFetch): " +
              JSON.stringify(res)
          );
        });
    } catch (error) {
      console.error(error);
      this.__handleError("Something broke while attempting to switch networks");
    }
  }

  async __loadTokenData(contractAddress) {
    const myNFTSection = document.querySelector(".myNFT-section");
    const genericSection = document.querySelector(".generic-section");

    //First we check that we have a connected wallet
    if (window.ethereum == undefined) {
      alert("Please connect to a Wallet first");
      return;
    }

    if (window.web3.currentProvider.selectedAddress == null) {
      alert("Please connect to a Wallet first");
      return;
    }

    genericSection.style.display = "block";
    myNFTSection.style.display = "block";
    // Instantiate an ERC721 contract at the address
    try {
      this.__contracts.originalChainERC721Contract =
        new window.web3.eth.Contract(ABIS.ERC721, contractAddress);
      this.__contracts.originalChainERC165Contract =
        new window.web3.eth.Contract(ABIS.ERC165, contractAddress);
      this.__contracts.originalChainERC721MetadataContract =
        new window.web3.eth.Contract(ABIS.ERC721Metadata, contractAddress);
    } catch (err) {
      genericSection.style.display = "none";
      console.log("Contract instantiation error: " + err);
      this.__handleError("Contract instantiation error");
      return;
    }

    //Check if ERC721 contract
    let isERC721 = await this.__isContractERC721(
      this.__contracts.originalChainERC165Contract,
      contractAddress
    );
    if (!isERC721) {
      console.log("This contract is NOT ERC721 compliant.");
      alert("This contract is NOT ERC721 compliant.");

      return;
    } else {
      console.log("This contract is ERC721 compliant.");
      //Hide the message (Useful if fetch data triggered by network change, and thus no onchange triggered for ogWorl input which would hide the msg)
    }

    //Get the Contract Name
    this.__getContractName();

    //Get the Contract Symbol
    this.__getContractSymbol();
  }

  async __loadOtherTokenDetails() {
    try {
      //Get the Token owner
      this.__getTokenOwner();

      //Get the Token URI
      this.__getTokenURI();
    } catch (error) {
      console.error(error);
      this.__handleError("Something went wrong. Please try again");
    }
  }

  async __getContractName() {
    let content = "";
    try {
      content =
        await this.__contracts.originalChainERC721MetadataContract.methods
          .name()
          .call();
    } catch (err) {
      //console.log(err);
      console.log(
        "Could not get name() for: contractAddress " +
          this.__contracts.originalChainERC721MetadataContract._address +
          "   tokenID: " +
          document.getElementById("tokenIdInput").value
      );
    }

    //Display or not the html element
    if (content != "") {
      document.getElementById("OGContractName").innerHTML = content;
    }
  }

  async __getContractSymbol() {
    let content = "";
    try {
      content =
        await this.__contracts.originalChainERC721MetadataContract.methods
          .symbol()
          .call();
    } catch (err) {
      //console.log(err);
      console.log(
        "Could not get symbol() for: contractAddress " +
          this.__contracts.originalChainERC721MetadataContract._address +
          "   tokenID:" +
          document.getElementById("tokenIdInput").value
      );
    }
    //Display or not the ctrc symbol
    if (content != "") {
      document.getElementById("OGContractSymbol").innerHTML = content;
    }
  }

  async __getTokenOwner() {
    let content = "";
    try {
      content = await this.__contracts.originalChainERC721Contract.methods
        .ownerOf(document.getElementById("tokenIdInput").value)
        .call();
    } catch (err) {
      //console.log(err);
      console.log(
        "Could not get ownerOf() for: contractAddress " +
          this.__contracts.originalChainERC721Contract._address +
          "   tokenID:" +
          document.getElementById("inputOGTokenID").value
      );
    }

    //Display or not the owner
    if (content) {
      document.getElementById("OGContractTokenOwner").innerHTML = `${content} ${
        content === web3.eth.defaultAccount ? "<i>(Its you)</i>" : ""
      }`;
    }
  }

  async __getTokenURI() {
    let content = "";
    try {
      content =
        await this.__contracts.originalChainERC721MetadataContract.methods
          .tokenURI(document.getElementById("tokenIdInput").value)
          .call();
    } catch (err) {
      //console.log(err);
      console.log(
        "Could not get tokenURI() for: contractAddress " +
          contracts.originalChainERC721MetadataContract._address +
          "   tokenID:" +
          document.getElementById("tokenIdInput").value
      );
    }

    if (content != "") {
      //Display tokenURI
      document.getElementById("OGTokenURI").innerHTML = content;
      document.getElementById("OGTokenURI").href = content;
      console.log("TokenURI: " + content);
    }
  }

  //Return weather the og world is an ERC721 contract
  async __isContractERC721(contract, contractAddress) {
    //First we check that we have a connected wallet
    if (window.ethereum == undefined) {
      alert("Please connect to a Wallet first");
      return false;
    }

    if (window.web3.currentProvider.selectedAddress == null) {
      alert("Please connect to a Wallet first");
      return false;
    }

    //Second, instanciate the contract through ERC165
    try {
      contract = new window.web3.eth.Contract(ABIS.ERC165, contractAddress);
    } catch (err) {
      console.log("Contract ERC165 instantiation error: " + err);
      return false;
    }

    //Then call supportsInterface()
    let isERC721;
    try {
      isERC721 = await contract.methods.supportsInterface("0x80ac58cd").call();
    } catch (err) {
      console.log(
        "Call to supportsInterface() from contract ERC165 error: " +
          JSON.stringify(err)
      );
      return false;
    }
    return isERC721;
  }

  __handleLoading(shouldLoad = true) {
    if (this.__error) return true;
    this.__isLoading = shouldLoad;

    const loadingContainer =
      document.getElementsByClassName("loading-container")[0];
    const contentContainer =
      document.getElementsByClassName("content-container")[0];

    loadingContainer.style.display = shouldLoad ? "block" : "none";
    contentContainer.style.display = shouldLoad ? "none" : "block";
  }

  __handleError(errorMessage = "") {
    this.__error = !!errorMessage;

    const loadingContainer =
      document.getElementsByClassName("loading-container")[0];
    const contentContainer =
      document.getElementsByClassName("content-container")[0];
    const errorContainer =
      document.getElementsByClassName("error-container")[0];
    const errorText = document.getElementsByClassName("error-text")[0];

    if (!errorMessage) {
      loadingContainer.style.display = "block";
      contentContainer.style.display = "block";
      errorContainer.style.display = "none";
      errorText.textContent = "";
    } else {
      loadingContainer.style.display = "none";
      contentContainer.style.display = "none";
      errorContainer.style.display = "block";
      errorText.textContent = errorMessage;
    }
  }

  get getContract() {
    return this.__contract;
  }

  get isLoading() {
    return this.__isLoading;
  }

  get isErrored() {
    return this.__error;
  }
}

/*========================================
====SINGLE PAGE APPLICATION MANAGEMENT====
==========================================*/

const pathToRegex = (path) =>
  new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const router = async () => {
  const routes = [
    { path: "/mint_form", view: MintForm },
    { path: "/watch_assets", view: TokenDisplay },
    { path: "/wallet_connection", view: WalletConnection },
  ];

  const potentialMatches = routes.map((route) => {
    return {
      route,
      result: location.pathname.match(pathToRegex(route.path)),
    };
  });

  let match = potentialMatches.find(
    (potentialMatch) => potentialMatch.result !== null
  );
  /* Route not found - return first route OR a specific "not-found" route */
  if (!match) {
    match = {
      route: routes[0],
      result: [location.pathname],
    };
    history.pushState(null, null, "/mint_form");
  }

  /*Controller: update view */
  //Get and display the view's html
  let view = new match.route.view([]);
  view.getHtml((htmlContent) => {
    //Display the HTML view inside WhiteSheet
    document.getElementById("WhiteSheet").innerHTML = htmlContent;
    //Run the code associated to this view
    view.initCode(Model);
  });
};

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};
Model.navigateTo = navigateTo;
//Return true if a provider is loaded.
Model.isProviderLoaded = function () {
  if (window.web3) {
    let userAccount = window.web3.currentProvider.selectedAddress;
    //If web3 already injected
    return userAccount != "" && window.web3.eth != undefined;
  } else {
    return false;
  }
};
Model.getConnectedAddr = function () {
  return window.web3.currentProvider.selectedAddress;
};
Model.displayConnectedWallet = function () {
  //Display user addr
  let userAccountAddr = Model.getConnectedAddr();
  document.getElementById("ConnectedAccountAddr").textContent = userAccountAddr;

  //Display wallet name
  let providerName = localStorage.getItem("provider");
  providerName = providerName.charAt(0).toUpperCase() + providerName.slice(1);
  document.getElementById("ConnectedWalletName").textContent = providerName;

  //Display selected network
};

Model.contractsData = CONTRACTS;
Model.ABIS = ABIS;

//Add event listener of disconnect button
document.getElementById("DisconnectWalletBtn").addEventListener('click', function(){
  //Indicate to wallet_connection that we want to disconnect wallet provider
  Model.disconnectWallet = true;
  Model.navigateTo('wallet_connection');
})

/* Document has loaded -  run the router! */
router();

/* call the router when the user goes a page backward*/
window.addEventListener("popstate", function (event) {
  let userInsists = confirm(
    "Do you really want to move from the page you are on?\nIf you have already registered the migration, you cannot modify it."
  );
  if (userInsists) {
    router();
  }
});

window.customElements.define('nft-card', NFTCard);
// window.customElements.define( "my-nav-bar", myNavBar );
// window.customElements.define( "mint-from", mintForm );
// window.customElements.define( "nft-section", nftSection );

//const nftApp = new App()
// Load the contract
//nftApp.loadInitialization()
