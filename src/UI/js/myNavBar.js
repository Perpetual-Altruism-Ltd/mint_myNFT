import { loadWeb3 } from "./myWeb3.js";

const navBarTemplate = document.createElement("myNavBar");

loadWeb3();

class myNavBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    navBarTemplate.innerHTML = navTemp();
    this.shadowRoot.appendChild(navBarTemplate);
  }

  connectedCallback() {
    this.shadowRoot.querySelector("#account").innerHTML =
      web3.eth.defaultAccount !== null ? `${web3.eth.defaultAccount}` : "";
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
