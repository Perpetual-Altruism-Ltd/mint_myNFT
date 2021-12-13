import AbstractView from "./AbstractView.js";
import Networks from "../config/networks.json" assert { type: "json" };
import { addMetaData } from "../api/metaDataApiCalls.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("myNFT Mint - Minting form");
  }

  /*This function contain all the javascript code which will be executed when this view if selected */
  initCode(model) {
    //CODE
    console.log("Hello from view_classes/mint_form.js");

    //
    const name = document.querySelector(".mint-form-container #name");
    const description = document.querySelector(".mint-form-container textarea");
    const nftImage = document.getElementById("nftimage");
    const mintBtn = document.getElementById("mintButton");
    const selectedFileInput = document.getElementById("selectedFile");
    const browseButton = document.getElementById("browseButton");
    const DisconnectWalletBtn = document.getElementById("DisconnectWalletBtn");
    const tokensButton = document.getElementById("tokensButton");
    const loader = document.createElement("div");

    loader.classList.add("loader");

    mintBtn.appendChild(loader);

    //=====Wallet Provider management=====
    //autoconnect to metamask if injected
    let connectToMetamask = async function () {
      //set callback function called when a wallet is connected
      //HERE connectionCallback undefined because provider not loaded yet
      connectionCallback = function () {
        console.log("Wallet connected");
        //Display connected addr + ogNet & prefill it
        model.displayConnectedWallet();
      };

      //Connecting to metmask if injected
      if (
        window.web3.__isMetaMaskShim__ &&
        window.web3.currentProvider.selectedAddress != null
      ) {
        if (connector == null || !connector.isConnected) {
          connector = await ConnectorManager.instantiate(
            ConnectorManager.providers.METAMASK
          );
          connectedButton = connectMetaMaskButton;
          providerConnected = "MetaMask";
          connection();
        } else {
          connector.disconnection();
        }
      } else {
        console.log(
          "Metamask not injected. Redirecting to wallet_connection page."
        );
        model.navigateTo("wallet_connection");
        return; //To stop javascript execution in initCode() function
      }
    };

    let walletProviderConnect = function () {
      //HANDLE WALLET CONNECTION
      //If web3 already injected
      if (!window.web3) {
        model.navigateTo("/wallet_connection");
      } else if (model.isProviderLoaded()) {
        console.log("Westron already loaded, perfect.");
        //Display connected addr + ogNet & prefill it
        model.displayConnectedWallet();
      }
      //If metamask available: autoconnect without redirecting to connection page.
      else if (
        window.web3.__isMetaMaskShim__ &&
        window.web3.currentProvider.selectedAddress != null
      ) {
        console.log("Metamask detected. Auto connect.");
        loadWestron();

        //Once loadWestron started, wait for it to finish by polling.
        let cmptr = 0;
        let pollWestronLoaded = async function () {
          try {
            await connectToMetamask();
            console.log("Westron lib loaded after " + cmptr + " attempts.");
          } catch (err) {
            cmptr++;
            if (cmptr > 100) {
              console.log("Westron loading timed out.");
            } else {
              setTimeout(pollWestronLoaded, 50);
            }
          }
        };
        //Start polling for westron lib to be loaded
        pollWestronLoaded();
      }
      //Redirect to wallet_connection page
      else {
        console.log("Westron lib not loaded. Redirecting to wallet_connection");
        model.navigateTo("wallet_connection");
        return; //To stop javascript execution in initCode() function
      }
    };

    //=====Wallet provider interactions=====
    //This function mint a token given a tokenURI.
    //It retrieve the current network from the wallet provider
    let mintTokenOnBlockchain = async function (tokenURI) {
      //retrieve data from provider & contract data
      let selectedChain = web3.currentProvider.chainId;
      let userAccountAddr = web3.currentProvider.selectedAddress;
      let mintContractAddr = getMintContractAddrFromNetworkId(selectedChain);

      if (mintContractAddr) {
        try {
          let mintContract = new web3.eth.Contract(
            model.ABIS.MintContract,
            mintContractAddr
          );

          await mintContract.methods
            .mint(tokenURI)
            .send({ from: userAccountAddr, gas: 200000 });

          name.value = "";
          description.value = "";
          nftImage.src = "./medias/default.png";
          selectedFileInput.value = "";
        } catch (err) {
          console.error("mintToken error:" + err);
        }
      } else {
        console.error("The network " + selectedChain + " is not supported.");
      }
    };
    //Retrieve the corresponding contract address from the network in input.
    //Fetches this info from model.contractsData
    let getMintContractAddrFromNetworkId = function (netId) {
      let contractAddr = "";
      model.contractsData.forEach((ctr, i) => {
        if (parseInt(ctr.networkVersion) == parseInt(netId)) {
          contractAddr = ctr.address;
        }
      });
      return contractAddr;
    };

    //Add metadata to Mathom and mint token to blockchain
    const addMetadataAndMint = async () => {
      const formData = new FormData();

      formData.append("file", selectedFileInput.files[0]);
      formData.append("name", name.value);
      formData.append("description", description.value);

      try {
        mintBtn.setAttribute("disabled", true);
        showLoader();

        const response = await addMetaData(formData);

        if (response.status === 200) {
          const tokenURI = response.data.tokenURI;

          await mintTokenOnBlockchain(tokenURI);

          mintBtn.disabled = false;
          hideLoader();
        }
      } catch (error) {
        console.log(error);

        mintBtn.disabled = false;
        hideLoader();
      }
    };

    // Handle image upload
    const fileHandler = (e) => {
      nftImage.src = window.URL.createObjectURL(e.target.files[0]);
    };

    selectedFileInput.onchange = fileHandler;

    browseButton.addEventListener("click", function () {
      document.getElementById("selectedFile").click();
    });

    mintBtn.onclick = () => {
      if (formValidator()) {
        addMetadataAndMint();
      }
    };

    tokensButton.onclick = () => {
      model.navigateTo("watch_assets");
    };

    networkSelector();

    walletProviderConnect();

    //=====NetworkSelector=====
    function networkSelector() {
      try {
        const networkSelector = document.querySelector(".network-selector");
        networkSelector.innerHTML = "";
        for (let network of Networks.networks) {
          const newOption = document.createElement("option");
          newOption.value = network.chainID;
          newOption.textContent = network.name || "N/A";
          if (window.ethereum.networkVersion === `${network.chainID}`) {
            newOption.setAttribute("selected", "true");
            const defaultChainID = "0x" + network.chainID.toString(16);
            displayContractAddress(defaultChainID);
          }

          networkSelector.appendChild(newOption);
        }

        networkSelector.addEventListener("change", (event) => {
          const value = event.target.value;
          const chainIDSelected = "0x" + Number(value).toString(16);
          console.log(chainIDSelected);
          __promptSwitchChainDataToFetch(chainIDSelected);
          displayContractAddress(chainIDSelected);
        });
      } catch (error) {
        console.error(error);
      }
    }

    function __promptSwitchChainDataToFetch(ID) {
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
          let chainID = window.ethereum.networkVersion;
          document.querySelector(".network-selector").value = chainID;
          displayContractAddress(chainID);
        });
    }

    function displayContractAddress(chainIDSelected) {
      let contractAddress = getMintContractAddrFromNetworkId(chainIDSelected);
      document.querySelector("#contractAddress").value = contractAddress;
    }

    function formValidator() {
      var fields = ["name", "description", "file"];
      var correctFields = 0;
      var ready = false;
      var i,
        l = fields.length;
      var fieldname;
      for (i = 0; i < l; i++) {
        fieldname = fields[i];
        var errorType = fieldname + "Error";
        if (document.forms["mintForm"][fieldname].value === "") {
          document.getElementById(errorType).innerHTML =
            "Please enter a valid " + fieldname + ".";
        } else {
          correctFields++;
          if (document.getElementById(errorType).innerHTML != "") {
            document.getElementById(errorType).innerHTML = " ";
          }
        }
      }
      if (correctFields == fields.length) {
        ready = true;
      }
      return ready;
    }

    function showLoader() {
      console.log("show");
      loader.style.display = "inline-block";
    }

    function hideLoader() {
      console.log("hide");
      loader.style.display = "none";
    }
  }

  async getHtml(callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let htmlContent = xhr.response;
        callback(htmlContent);
      }
    };
    xhr.open("GET", "/static_views/mint_form.html");
    xhr.send();
  }
}
