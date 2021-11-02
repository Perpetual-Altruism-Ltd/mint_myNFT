// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

contract myNftErc721 {
    // Mapping tokend Id to owners
    mapping(uint256 => address) private _owners;

    // Mapping owner address to token count
    mapping(address => uint256) private _balances;

    mapping(uint256 => bool) tokenExist;

    // Check if we can access the length from front-end
    // Total number of tokens in block chain
    // uint public totalSupply =0;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 indexed _tokenId
    );

    modifier uniqueToken(uint256 _tokenId) {
        require(!tokenExist[_tokenId]);
        _;
    }

    modifier notZeroAddress(address _to) {
        require(_to != address(0));
        _;
    }

    function balanceOf(address _owner) external view returns (uint256) {
        return _balances[_owner];
    }

    function ownerOf(uint256 _tokenId) public view returns (address) {
        return _owners[_tokenId];
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) external payable {
        require(ownerOf(_tokenId) == _from);
        _owners[_tokenId] = _to;
        _balances[_from]--;
        _balances[_to]++;

        emit Transfer(_from, _to, _tokenId);
    }

    function _mint(address _to, uint256 _tokenId)
        internal
        uniqueToken(_tokenId)
        notZeroAddress(_to)
    {
        _owners[_tokenId] = _to;
        _balances[_to] += 1;
        tokenExist[_tokenId] = true;
        // totalSupply++;

        emit Transfer(address(0), msg.sender, _tokenId);
    }
}
