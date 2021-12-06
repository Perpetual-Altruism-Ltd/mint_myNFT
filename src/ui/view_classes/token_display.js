import { getUserNFTs } from "../api/metaDataApiCalls.js";
import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("myNFT Mint - Your tokens");
  }

  /*This function contain all the javascript code which will be executed when this view if selected */
  initCode(model) {
    //CODE

    //Get User NFT-s and display

    const displayTokens = async () => {
      let userAccountAddr = web3.currentProvider.selectedAddress;
      try {
        const { data } = await getUserNFTs(userAccountAddr);

        // data.forEach(nft => {

        // });
      } catch (error) {
        console.log(error);
      }
    };

    displayTokens();
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
