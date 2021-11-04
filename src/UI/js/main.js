import { balance, loadWeb3, setDefaultAccount } from "./myWeb3.js";
import myNavBar from "./myNavBar.js";
import nftSection from "./nftSection.js";
import mintForm from "./mintForm.js";

loadWeb3();

window.customElements.define("my-nav-bar", myNavBar);
window.customElements.define("mint-from", mintForm);
window.customElements.define("nft-section", nftSection);
