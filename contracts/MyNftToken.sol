// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

import "./myNftErc721.sol";

contract MyNftToken is myNftErc721 {
    // Token name
    string private _name;

    // Token symbol
    string private _symbol;

    // All our nft tokens
    string[] public nftTokens;

    mapping(string => bool) _nameOfNftExists;

    // Check if we can access the length from front-end
    // Total number of tokens in block chain
    // uint public totalSupply =0;

    constructor() {
        _name = "myNFTToken";
        _symbol = "myNFTSymbol";
    }

    // Names for our nft to be unique
    modifier uniqueName(string memory _nameOfNft) {
        require(!_nameOfNftExists[_nameOfNft]);
        _;
    }

    function mint(string memory _nameOfNft) external uniqueName(_nameOfNft) {
        nftTokens.push(_nameOfNft);
        uint256 id = nftTokens.length - 1;
        _mint(msg.sender, id);
        _nameOfNftExists[_nameOfNft] = true;
        // totalSupply++;
    }
}
