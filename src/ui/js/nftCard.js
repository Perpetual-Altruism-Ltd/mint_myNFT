import {showModalPopup, hideModalPopup} from "./modalPopup.js"

/*
=====HTML ELEMENT=====
To put inside the page where you want to display an NFT card

To use it: 2 steps
1 - Add <nft-card></nft-card> inside HTML doc at desired position.
2 - Add
    import NFTCard from './components/nftCard.js';
    window.customElements.define('nft-card', NFTCard);
  In the app module of the website

*/
import {transferNFT} from './myWeb3.js';

const nftCardStruct = () => {
  let htmlContent = {};
  htmlContent.innerHTML = `
  <div class="NFTCardContainer">
    <div>
      <img class="NFTImage">
      <div class="NFTNameText"></div>
    </div>

    <div class="ControlContainer">
      <button class="Button ColoredButton TransfertButton">Transfert</button>
    </div>

  </div>`;
  return htmlContent.innerHTML;/* Using htmlContent variable is to have the synthax coloration for HTML*/
}

const nftCardStyle = () => {
  let cssStyle = document.createElement('style');
  cssStyle.textContent = `
  *{
    box-sizing: border-box;
  }
  .NFTCardContainer{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 1em;
    margin-bottom: 1em;

    width: 10vw;
    height: calc(100% - 1em);
    overflow-y: auto;
    overflow-x: hidden;
    margin: 0.5em;

    /* Border */
    border-color: #333;
    border-style: solid;
    border-width: 2px;
    border-radius: 0.3em;

    /* background */
    background-color: #fff;
  }
  .ControlContainer{
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5em; 0em;
    margin-bottom: 1em;
  }
  .NFTImage{
    width: 100%;
    height: auto;
  }
  .NFTNameText{
    text-align: center;
    word-break: break-word;
    margin-top: 1em;
    margin-bottom: 1em;
  }
  .Button{
    margin-left: 0.5em;
    margin-right: 0.5em;
  }

  /* Colored btn */
  .ColoredButton{
    padding: 0.25em 1em;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    border-radius: 30px;
    border-width: 0em;
    font-size: .88rem;
    line-height: 1.5rem;
    text-decoration: none;
    transition: 0.5s;
    background-image: linear-gradient(to right, #3e287a 0%, #af1540 100%);
    background-size: 200% auto;
    color: #fff;
    white-space: nowrap;
    cursor:pointer;
  }
  .ColoredButton:hover{
    background-position: right center;
  }
  .ColoredButton:active{
    background-image: linear-gradient(to right, #bf1560 0%, #bf1560 100%);
  }
  .ColoredButton:disabled, .ColoredButton[disabled]{
    background-image: linear-gradient(to right, #bbb 0%, #bbb 100%);
    /*Do not set bg-image : none; bg-color: #bbb. it causes a threshold during the switch from disabled to enabled and reverse */
    cursor: default;
  }
  .ColoredButton.Selected{
    background-image: linear-gradient(to right, #bf1560 0%, #bf1560 100%);
  }
`;
  return cssStyle;/* Using htmlContent variable is to have the synthax coloration for HTML*/
}


class NFTCard extends HTMLElement {
  constructor() {
    super();

    // Create a shadow root
    this.attachShadow({mode: 'open'}); // sets and returns 'this.shadowRoot'

    //Add style, but this way introduce a FOUC
    /*const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', '/site/style/css/nftCard.css');
    this.shadowRoot.appendChild(linkElem);*/

    //Add HTML elements making the breadcrumb trail
    const container = document.createElement('nftCardContainer');
    container.innerHTML = nftCardStruct();
    //this.shadowRoot.appendChild(container);
    this.shadowRoot.append(nftCardStyle(), container);

    //Default look of a card
    let imgElem = this.shadowRoot.querySelector(".NFTImage");
    imgElem.src = '/site/medias/noMediaBg.png';

    //SET transfert btn callback
    let transfertBtn = this.shadowRoot.querySelector(".TransfertButton");
    transfertBtn.addEventListener('click', (e) => {
      //First show modal popup for user to input the destination address
      showModalPopup();

      //Then show prompt switch network
      //Then call transfert
      transferNFT(this.world, this.tokenId, this.receiver);
    });

    window.onclick = (event) => {
      if (event.target.id == "ModalBackground") {
        hideModalPopup();
      }
    }

  }



  /* Register which attributes to watch for changes */
  static get observedAttributes() {
    return ['name', 'imgsrc', 'universe', 'world', 'tokenid'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    //NFT NAME
    if(attrName == 'name'){
      let nameElem = this.shadowRoot.querySelector(".NFTNameText");
      nameElem.textContent = newVal;
    }
    //NFT MEDIA
    else if(attrName == 'imgsrc'){
      let imgElem = this.shadowRoot.querySelector(".NFTImage");
      imgElem.src = newVal;
    }
    //SAVE NFT DATA
    else if(attrName == 'universe'){//Origin universe unique ID
      this.universe = newVal;
    }
    else if(attrName == 'world'){
      this.world = newVal;
    }
    else if(attrName == 'tokenid'){
      this.tokenId = newVal;
    }
  }
}

export default NFTCard;
