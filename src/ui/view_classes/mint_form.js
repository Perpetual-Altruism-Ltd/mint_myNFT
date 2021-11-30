import AbstractView from './AbstractView.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("myNFT Mint - Minting form");
  }

  /*This function contain all the javascript code which will be executed when this view if selected */
  initCode(model){
    //CODE
    console.log("Hello from view_classes/mint_form.js");

    //=====Wallet Provider management=====
    let displayConnectedWallet = function(){

    }
    //autoconnect to metamask if injected
    let connectToMetamask = async function () {
      //set callback function called when a wallet is connected
      //HERE connectionCallback undefined because provider not loaded yet
      connectionCallback = function(){
        console.log("Wallet connected");
        //Display connected addr + ogNet & prefill it
        displayConnectedWallet();
      };

      //Connecting to metmask if injected
      if (window.web3.__isMetaMaskShim__ && window.web3.currentProvider.selectedAddress != null) {
          if (connector == null || !connector.isConnected) {
              connector = await ConnectorManager.instantiate(ConnectorManager.providers.METAMASK);
              connectedButton = connectMetaMaskButton;
              providerConnected = "MetaMask";
              connection();
          } else {
              connector.disconnection();
          }
      }
      else{
        console.log("Metamask not injected. Redirecting to wallet_connection page.");
        model.navigateTo('wallet_connection');
        return;//To stop javascript execution in initCode() function
      }
    }
    let walletProviderConnect = function(){
      //HANDLE WALLET CONNECTION
      //If web3 already injected
      if(!window.web3){
          model.navigateTo("/migration_finished");
      }
      else if(model.isProviderLoaded()){
        console.log("Westron already loaded, perfect.");
        //Display connected addr + ogNet & prefill it
        displayConnectedWallet();
      }
      //If metamask available: autoconnect without redirecting to connection page.
      else if (window.web3.__isMetaMaskShim__ && window.web3.currentProvider.selectedAddress != null) {
        console.log("Metamask detected. Auto connect.");
        loadWestron();

        //Once loadWestron started, wait for it to finish by polling.
        let cmptr = 0;
        let pollWestronLoaded = async function(){
          try{
            await connectToMetamask();
            console.log("Westron lib loaded after " + cmptr + " attempts.");
          }catch(err){
            cmptr++;
            if(cmptr > 100){
              console.log("Westron loading timed out.");
            }else {
              setTimeout(pollWestronLoaded, 50);
            }
          }
        }
        //Start polling for westron lib to be loaded
        pollWestronLoaded();
      }
      //Redirect to wallet_connection page
      else{
        document.getElementById("ConnectedAccountAddr").textContent = "Wallet not connected. Redirect to connection page.";
        console.log("Westron lib not loaded. Redirecting to wallet_connection");
        model.navigateTo('wallet_connection');
        return;//To stop javascript execution in initCode() function
      }
    }

    document.getElementById("Example").addEventListener('click', function(){
      //Indicate to wallet_connection that we want to disconnect wallet provider
      model.disconnectWallet = true;
      model.navigateTo('wallet_connection');
    })

    walletProviderConnect();
  }

  async getHtml(callback){
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let htmlContent = xhr.response;
        callback(htmlContent);
      }
    };
    xhr.open('GET', '/static_views/mint_form.html');
    xhr.send();
  }
}
