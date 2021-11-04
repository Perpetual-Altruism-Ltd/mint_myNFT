// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

import "./myNftErc721.sol";

contract MyNftToken is myNftErc721 {
    // Token name
    string private _name;

    // Token symbol
    string private _symbol;

    // Array with all tokens created
    uint[] public myTokens ;
    
    // Total number of tokens
    uint256 public totalSupply = 0;

    constructor() {
        _name = "myNFTToken";
        _symbol = "myNFTSymbol";
    }

    function mint(uint256 _tokenId) external {
        _mint(msg.sender, _tokenId);
         myTokens.push(_tokenId);
         totalSupply++;

    }
}
