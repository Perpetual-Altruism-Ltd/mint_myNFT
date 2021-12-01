import { balance, mintToken } from "./myWeb3.js";
import { genRandomString } from './utils.js'

const mintFormTemplate = document.createElement( "div" );

class mintForm extends HTMLElement {
  constructor() {
    super();

    this.attachShadow( { mode: "open" } );
    mintFormTemplate.innerHTML = formTemplate();
    this.shadowRoot.appendChild( mintFormTemplate );
  }

  mintAndAddMetaData = async ( e ) => {
    e.preventDefault();

    const tokenID = genRandomString( 10 );

    await mintToken( tokenID );
  };

  connectedCallback() {
    this.shadowRoot
      .getElementById( "mintBtn" )
      .addEventListener( "click", this.mintAndAddMetaData );

    balance().then( ( bal ) => {
      this.shadowRoot.querySelector(
        "#balance"
      ).innerHTML = `Number of token this account has: <strong>${bal}</strong>`;
    } );
  }
}

const formTemplate = () => {
  return `
  <link rel="stylesheet" href="./css/mintForm.css"/>

  <h2>Mint Token</h2>
  <p id="balance"></p>
  <form class="from-body">

    <div>
      <center>
        <button id="mintBtn" type="button" class="btn">Mint</button>
      </center>
    </div>
  </form>

    `;
};

export default mintForm;
