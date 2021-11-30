import AbstractView from './AbstractView.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("myNFT Mint - Your tokens");
  }

  /*This function contain all the javascript code which will be executed when this view if selected */
  initCode(model){
    //CODE
    console.log("Hello from token_display.js");
  }

  async getHtml(callback){
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let htmlContent = xhr.response;
        callback(htmlContent);
      }
    };
    xhr.open('GET', '/static_views/token_display.html');
    xhr.send();
  }
}
