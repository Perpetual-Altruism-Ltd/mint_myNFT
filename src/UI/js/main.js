import myNavBar from "./myNavBar.js";
import { getAllTheTokens } from "./myWeb3.js";
import nftSection from "./nftSection.js";

window.customElements.define("my-nav-bar", myNavBar);
window.customElements.define("nft-section", nftSection);

console.log(await getAllTheTokens());
