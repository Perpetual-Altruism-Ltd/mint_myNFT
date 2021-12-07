import AbstractView from './AbstractView.js';
import {getUserMetadata} from '../api/metaDataApiCalls.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("myNFT Mint - Your tokens");
  }

  /*This function contain all the javascript code which will be executed when this view if selected */
  initCode(model){
    //Call to Mathom API to get the list of all NFT of the user
    let addNFTToCollection = function(name, universe, world, tokenId, imgSrc){
      let cont = document.getElementById("NFTCollectionContainer");
      let newNftCard = document.createElement("nft-card");
      newNftCard.setAttribute('slot', "NFTElement");
      newNftCard.setAttribute('name', name);
      newNftCard.setAttribute('universe', universe);
      newNftCard.setAttribute('world', world);
      newNftCard.setAttribute('tokenid', tokenId);
      newNftCard.setAttribute('imgsrc', imgSrc);

      cont.appendChild(newNftCard);
    }
    let fetchUserNFTCollection = async function(){
      //Refresh user account addr
      //let userAccount = model.getConnectedAddr();
      let userAccount = '0x00';




      //Sent request to mathom, to get list of NFT of the user
      try{
        let response = await getUserMetadata(userAccount);
        if(response.status == 200){
          let nftList = response.data;
          for(let nft of nftList){
            let mdata = nft.metadata;

            //Add nft to nft collection
            addNFTToCollection(mdata.name, nft.universe, nft.world, nft.tokenId, mdata.image);
          }
        }else{
          console.log(response.status + ' : ' + response.statusText);
        }
      }catch(error){
        console.error(error);
      }
    }

    fetchUserNFTCollection();


    document.getElementById("MintFormBtn").addEventListener('click', function(){
      model.navigateTo('mint_form');
    })
  }

  async getHtml(callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let htmlContent = xhr.response;
        callback(htmlContent);
      }
    };
    xhr.open("GET", "/static_views/token_display.html");
    xhr.send();
  }
}
