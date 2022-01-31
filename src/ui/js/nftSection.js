// import { getAllMetaData } from "../../api/metaDataApiCalls.js";
import {
  getAllTheTokens,
  ownerOf,
  setDefaultAccount,
  transferToken,
} from "./myWeb3.js";

const nftContainer = document.createElement("div");

class nftSection extends HTMLElement {
  constructor() {
    super();

    this.tokens = [];
    this.allMetaData = [];

    this.attachShadow({ mode: "open" });

    nftContainer.classList.add("nftContainer");
    nftContainer.innerHTML = `<link rel="stylesheet" href="./css/nftSection.css"/>

      </h4>
    `;
  }

  showTransferBtn = async (i) => {
    let owner = await ownerOf(this.allMetaData[i].tokenID);

    if (owner !== window.connector.web3.eth.defaultAccount) { //may want to check if the user is approved?
      this.transferButtons[i].style.display = "none";
    }
  };

  enableTransfer = async (e, tokenId) => {
    e.preventDefault();
    const addToAddress = prompt("Enter recepient address", "");
    if (addToAddress !== null) {
      await transferToken(tokenId, addToAddress);
    }
  };

  getAllTokensAndMetadata = async () => {
    this.tokens = await getAllTheTokens();

    for (let token in this.tokens) {
      // let tokenMeta = await getAllMetaData(this.tokens[token]);

      if (tokenMeta._id) this.allMetaData = [...this.allMetaData, tokenMeta];
    }

    this.allMetaData.map((element) => {
      const nftTemplate = document.createElement("single-Nft");
      nftTemplate.classList.add("singleNtf");
      nftTemplate.innerHTML = navTemp(element);
      nftContainer.appendChild(nftTemplate);
    });

    this.transferButtons = this.shadowRoot.querySelectorAll(".transferBtn");

    for (let i = 0; i < this.transferButtons.length; i++) {
      this.transferButtons[i].onclick = (e) => {
        this.enableTransfer(e, this.allMetaData[i].tokenID);
      };

      this.showTransferBtn(i);
    }
  };

  async connectedCallback() {
    await setDefaultAccount();

    this.getAllTokensAndMetadata();

    this.shadowRoot.appendChild(nftContainer);
  }
}

const navTemp = (nft) => {
  return `

  <div>
    <h3>${nft.name}</h3>
    <div class ="nftWrapper">
      <p class="nftSign" style="color:${nft.attributes[0].value};font-size:${nft.attributes[1].value}px;">${nft.sign}</p>
    </div>
    <p>${nft.description}</p>
    <button class="transferBtn" >Transfer</button>
  </div?>
  `;
};

export default nftSection;
