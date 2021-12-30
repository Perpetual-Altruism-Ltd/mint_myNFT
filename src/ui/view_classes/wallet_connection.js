import AbstractView from './AbstractView.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("myNFT Mint - Connect to your wallet");
  }

  /*This function contain all the javascript code which will be executed when this view if selected */
  initCode(model){
    //Connect to metamask if available
    //NOPE! bad idea for people with multiple wallets
    //If you do want to auto-connect to metamask, just check if window.ethereum exists -> do the connector stuff. make sure to inject it at window.ethereum.

    /*var endLoadMetamaskConnection = async function () {
      //set callback function called when a wallet is connected
      connectionCallback = function(){
        console.log("Wallet connected");
        model.navigateTo('/mint_form');
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
    }*/
    //Probably a better idea to just hand this into the loadWestron function. I'll probably do that at some point.
    window.connectionCallback = function(){
      console.log("Wallet connected");
      model.navigateTo('/mint_form');
    };
    //Load westron library & connect to wallet provider
    let walletProviderConnect = function(){
      console.log("model.disconnectWallet");
      console.log(model.disconnectWallet);
      //If user want to disconnect his wallet, call disconnect from westron lib
      //+ set wallet connection buttons listeners. This is required as the view (HTML content) has been loaded again
      if(model.disconnectWallet){
        window.connector.disconnection();
        //set again buttons onClick functions
        setConnectWalletButtonsListeners();

        model.disconnectWallet = false;
      }else{
        //Load westron lib, to add the behaviour to connection buttons
        loadWestron();
      }

      //Once loadWestron started, wait for it to finish by polling. Timeout after 50ms*100 = 5sec
      //Then auto connect to metamask if wallet exists NOTE: doesn't actually happen anymore.
      /*let pollWestronLoaded = async function(){
        let cmptr = 0;
        try{
          await loadWestron();
          console.log("Westron lib loaded after " + cmptr + " attempts.");
        }catch(err){
          cmptr++;
          if(cmptr > 100){
            console.log("Westron loading timed out.");
            alert('It seems that you have no wallet provider installed. You can install metamask in few minutes by visiting https://metamask.io/')
          }else {
            setTimeout(pollWestronLoaded, 50);
          }
        }
      }
      //Start polling for westron to be loaded
      pollWestronLoaded();*/
    }

    document.getElementById("RequestWalletBtn").addEventListener('click', function(){
      window.open("mailto:bridge@mynft.com?subject=Network%20request");
    });

    walletProviderConnect();
    console.log("End of wallet_connnection");
  }

  async getHtml(callback){
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let htmlContent = xhr.response;
        callback(htmlContent);
      }
    };
    xhr.open('GET', '/static_views/wallet_connection.html');
    xhr.send();
  }
}
