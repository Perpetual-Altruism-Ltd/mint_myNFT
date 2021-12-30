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
      //just return to wallet_connection, model.displayConnectedWallet may misbehave on the wallet_connection page...
      //if you wanna fix -> window.connectionCallback= [...]
      //and then go fix up the walletConnection page so it checks before overwriting.
      /*connectionCallback = function () {
        console.log("Wallet connected");
        //Display connected addr + ogNet & prefill it
        model.displayConnectedWallet();
      };*/


      //checking connector
      if(model.isProviderLoaded()){
        model.displayConnectedWallet();
      }
      else{
        console.log(
          "Westron not loaded yet.. Redirecting to wallet_connection page."
        );
        model.navigateTo("wallet_connection");
        return; //To stop javascript execution in initCode() function
      }
    };

    let walletProviderConnect = function () {
      //HANDLE WALLET CONNECTION
      //If connector already injected
      if (!model.isProviderLoaded()) {
        console.log("walletProviderConnect failed");
        model.navigateTo("/wallet_connection");
      } else{
        console.log("Connector already loaded, perfect.");
        //Display connected addr + ogNet & prefill it
        model.displayConnectedWallet();
      }

      //If metamask available: autoconnect without redirecting to connection page.
      //was starting to try and fix this.... this is better left commented, and just handled by the connection page.
      /*else if (
        window.connector && window.connector!= null && !window.connector.connected
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
      }*/
    };

    //=====Wallet provider interactions=====
    //This function mint a token given a tokenURI.
    //It retrieve the current network from the wallet provider
    let mintTokenOnBlockchain = async function (tokenURI) {
      //retrieve data from provider & contract data
      let selectedChain = await window.connector.web3.eth.getChainId();
      let userAccountAddr = window.connector.web3.currentProvider.selectedAddress;
      let mintContractAddr = getMintContractAddrFromNetworkId(selectedChain);

      if (mintContractAddr) {
        try {
          let mintContract = new window.connector.web3.eth.Contract(
            model.ABIS.MintContract,
            mintContractAddr
          );

          await mintContract.methods
            .mint(tokenURI)
            .send({ from: userAccountAddr, gas: 200000 })
            .then((res) => {
              showMintMessage("Minting processed successfully!", "#050");
            })
            .catch((err) => {
              showMintMessage(
                "Minting processed aborted. Please contact our team if the issue persist.",
                "#500"
              );
            });

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

        if (response.status === 201) {
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

    tokensButton.onclick = (e) => {
      e.preventDefault();
      model.navigateTo("watch_assets");
    };

    walletProviderConnect();

    networkSelector();


    //=====NetworkSelector=====
    async function networkSelector() {
      console.log("NetworkSelecting");
      try {
        const networkSelector = document.querySelector(".network-selector");
        networkSelector.innerHTML = "";
        for (let network of Networks.networks) {
          const newOption = document.createElement("option");
          newOption.value = network.chainID;
          newOption.textContent = network.name || "N/A";
          let chainID=await window.connector.web3.eth.getChainId();
          if (chainID == `${network.chainID}`) {// === -> == bc === wasn't working....? i'm guessing it just returns a different type.
            newOption.setAttribute("selected", "true");
            const defaultChainID = "0x" + network.chainID.toString(16);
            console.log("Displaying");
            displayContractAddress(defaultChainID); // should probably add a break in here. For now it's fine though.
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

    async function __promptSwitchChainDataToFetch(ID) {
      window.connector.web3.currentProvider
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
          window.connector.web3.getChainId().then((chainID)=>
            {
              document.querySelector(".network-selector").value = chainID;
              displayContractAddress(chainID);
            },
          (badResponse)=>{});
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

    function showMintMessage(txt, clr) {
      let textElem = document.getElementById("MintMsgElement");
      textElem.innerHTML = txt;
      textElem.style.color = clr;
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
