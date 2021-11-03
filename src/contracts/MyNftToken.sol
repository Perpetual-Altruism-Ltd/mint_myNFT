// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

import "./myNftErc721.sol";

contract MyNftToken is myNftErc721 {
    // Token name
    string private _name;

    // Token symbol
    string private _symbol;

    constructor() {
        _name = "myNFTToken";
        _symbol = "myNFTSymbol";
    }

    function mint(uint256 _tokenId) external {
        _mint(msg.sender, _tokenId);
    }
}
