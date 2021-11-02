import { getAllMetaData } from "../../api/metaDataApiCalls.js";

const allMetaData = await getAllMetaData();

class nftSection extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    const nftContainer = document.createElement("div");
    nftContainer.classList.add("nftContainer");
    nftContainer.innerHTML = `<link rel="stylesheet" href="./css/nftSection.css"/>`;

    allMetaData.map((element) => {
      const nftTemplate = document.createElement("single-Nft");
      nftTemplate.classList.add("singleNtf");
      nftTemplate.innerHTML = navTemp(element);
      nftContainer.appendChild(nftTemplate);
    });

    this.shadowRoot.appendChild(nftContainer);
  }
}

const navTemp = (nft) => {
  return `
   
  <div>
    <h3>${nft.name}</h3>
    <div>
      <p class="nftSign" style="color:${nft.attributes[0].value};font-size:${nft.attributes[1].value}px;">${nft.sign}</p>
    </div>
    <p>${nft.description}</p>
  </div?>
  `;
};

export default nftSection;
