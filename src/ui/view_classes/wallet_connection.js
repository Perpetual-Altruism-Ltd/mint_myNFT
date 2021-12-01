import AbstractView from './AbstractView.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("myNFT Mint - Connect to your wallet");
  }

  /*This function contain all the javascript code which will be executed when this view if selected */
  initCode(model){
    //CODE
    console.log("Hello from wallet_connection.js");
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
