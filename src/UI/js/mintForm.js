import { addMetaData } from "../../api/metaDataApiCalls.js";
import { balance, mintToken } from "./myWeb3.js";

const mintFormTemplate = document.createElement("div");

class mintForm extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    mintFormTemplate.innerHTML = formTemplate();
    this.shadowRoot.appendChild(mintFormTemplate);
  }

  mintAndAddMetaData = async (e) => {
    e.preventDefault();

    const sign = this.shadowRoot.querySelector("#sign");
    const name = this.shadowRoot.querySelector("#name");
    const tokenID = this.shadowRoot.querySelector("#tokenID");
    const colorValue = this.shadowRoot.querySelector("#color-value");
    const sizeValue = this.shadowRoot.querySelector("#size-value");
    const traitColor = colorValue.getAttribute("trait");
    const traitSize = sizeValue.getAttribute("trait");
    const description = this.shadowRoot.querySelector("#description");

    const body = {
      sign: sign.value,
      name: name.value,
      tokenID: tokenID.value,
      description: description.value,
      attributes: [
        { trait: traitColor, value: colorValue.value },
        { trait: traitSize, value: sizeValue.value },
      ],
    };

    await mintToken(tokenID.value);
    await addMetaData(body);
  };

  connectedCallback() {
    this.shadowRoot
      .querySelector("form")
      .addEventListener("submit", this.mintAndAddMetaData);

    balance().then((bal) => {
      this.shadowRoot.querySelector(
        "#balance"
      ).innerHTML = `Number of token this account has: <strong>${bal}</strong>`;
    });
  }
}

const formTemplate = () => {
  return `
  <link rel="stylesheet" href="./css/mintForm.css"/>
  
  <h2>Mint Token</h2>
  <p id="balance"></p>
  <form class="from-body">
  
  <div>
        <div class="form-Row">
            <label>Sign</label>
            <input type="text" id="sign" placeholder="You can write only one letter or symbol"/>
        </div>
        <div class="form-Row">
            <label>Name</label>
            <input type="text" id="name" placeholder="Name of your NFT"/>
        </div>
        
        <div class="form-Row">
            <label>Token ID</label>
            <input type="number" id="tokenID"  placeholder="Token Id should be number"/>
        </div>
        <div class="form-Row">
            <label>Color</label>
            <input type="text" trait="Color" id="color-value" placeholder="Color of your sing" />
        </div>
        <div class="form-Row">
            <label>Size</label>
            <input type="number" trait="Size" id="size-value" placeholder="Size of you sign in px"/>
        </div>
        <div class="form-Row">
            <label for="description">Description</label>
            <textarea id="description" rows="4"> </textarea>
        </div>
       <center>
        <button type="submit" class="btn" >Submit</button>
        </center>
    </div>
  </form>

    `;
};

export default mintForm;
