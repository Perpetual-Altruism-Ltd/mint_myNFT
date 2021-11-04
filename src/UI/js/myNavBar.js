import { setDefaultAccount } from "./myWeb3.js";

const navBarTemplate = document.createElement("myNavBar");

class myNavBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    navBarTemplate.innerHTML = navTemp();
    this.shadowRoot.appendChild(navBarTemplate);
  }

  connectedCallback() {
    let account = "";

    setDefaultAccount().then(() => {
      account = web3.eth.defaultAccount;

      this.shadowRoot.querySelector("#account").innerHTML =
        account !== null ? `${account}` : "   ";
    });
  }
}

const navTemp = () => {
  return `
  <link rel="stylesheet" href="./css/myNavBar.css"/>
  <div class="myNav">
  <div class="navContainer">
    <h3>myNFT</h3>
    <h3 id="account"></h3>
    </div>
  </div>`;
};

export default myNavBar;
