import AbstractView from './AbstractView.js';
import {getUserNFTs} from '../api/metaDataApiCalls.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("myNFT Mint - Your tokens");
  }

  /*This function contain all the javascript code which will be executed when this view if selected */
  initCode(model){
    //=====Wallet Provider management=====
    //autoconnect to metamask if injected
    let connectToMetamask = async function () {
      //set callback function called when a wallet is connected
      //HERE connectionCallback undefined because provider not loaded yet
      connectionCallback = function () {
        console.log("Wallet connected");
        //Display connected addr + ogNet & prefill it
        model.displayConnectedWallet();

        //Fetch all users tokens
        fetchUserNFTCollection();
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

        //Fetch all users tokens
        fetchUserNFTCollection();
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

    //Call to Mathom API to get the list of all NFT of the user
    let addNFTToCollection = function(name, universe, world, tokenId, imgSrc){
      let cont = document.getElementById("NFTCollectionContainer");
      let newNftCard = document.createElement("nft-card");
      newNftCard.setAttribute('slot', "NFTElement");
      newNftCard.setAttribute('name', name);
      newNftCard.setAttribute('universe', universe);
      newNftCard.setAttribute('world', world);
      newNftCard.setAttribute('tokenid', tokenId);
      newNftCard.setAttribute('imgsrc', imgSrc);

      cont.appendChild(newNftCard);
    }
    let fetchUserNFTCollection = async function(){
      //Refresh user account addr
      let userAccount = model.getConnectedAddr();
      //let userAccount = '0x00';

      //Sent request to mathom, to get list of NFT of the user
      try{
        let response = await getUserNFTs(userAccount);
        if(response.status == 200){
          let nftList = response.data;
          //If user has no NFT at all
          if(nftList.httpStatusCode == 404){
            document.getElementById("EmptyCollecMsg").style.display = "block";
          }
          //If user has at least one NFT, display them
          else{
            console.log(nftList);
            for(let nft of nftList){
              let mdata = nft.metadata;
              console.log(mdata);

              //Add nft to nft collection
              if(mdata != undefined){
                addNFTToCollection(mdata.name, nft.universe, nft.world, nft.tokenId, mdata.image);
              }else{
                addNFTToCollection("No name", nft.universe, nft.world, nft.tokenId, '');
              }

            }
          }
        }else{
          console.log(response.status + ' : ' + response.statusText);
        }
      }catch(error){
        console.error(error);
      }
    }

    walletProviderConnect();


    document.getElementById("MintFormBtn").addEventListener('click', function(){
      model.navigateTo('mint_form');
    })
  }

  async getHtml(callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let htmlContent = xhr.response;
        callback(htmlContent);
      }
    };
    xhr.open("GET", "/static_views/token_display.html");
    xhr.send();
  }
}
