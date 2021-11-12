// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

contract myNftErc721 {
    // Mapping tokend Id to owners
    mapping(uint256 => address) private _owners;

    // Mapping owner address to token count
    mapping(address => uint256) private _balances;

    mapping(uint256 => bool) private tokenExist;

    mapping(uint256 => string) private tokenURI;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 indexed _tokenId
    );

    modifier uniqueToken(uint256 _tokenId) {
        require(!tokenExist[_tokenId], "Token already exist!");
        _;
    }

    modifier notZeroAddress(address _to) {
        require(_to != address(0), "Should be a real address!");
        _;
    }

    function balanceOf(address _owner) external view returns (uint256) {
        return _balances[_owner];
    }

    function ownerOf(uint256 _tokenId) public view returns (address) {
        return _owners[_tokenId];
    }

    function transfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) external payable notZeroAddress(_to) {
        require(tokenExist[_tokenId], "This token doesn't exist!");

        require(
            ownerOf(_tokenId) == msg.sender,
            "You are not the owner of this token!"
        );

        require(_to != msg.sender, "You are the owner of this token already!");

        _owners[_tokenId] = _to;
        _balances[_from]--;
        _balances[_to]++;

        emit Transfer(_from, _to, _tokenId);
    }

    function _mint(
        address _to,
        uint256 _tokenId,
        string calldata _tokenURI
    ) internal uniqueToken(_tokenId) notZeroAddress(_to) {
        _owners[_tokenId] = _to;
        _balances[_to] += 1;
        tokenExist[_tokenId] = true;

        _setTokenURI(_tokenId, _tokenURI);

        emit Transfer(address(0), msg.sender, _tokenId);
    }

    function _setTokenURI(uint256 _tokenId, string calldata _tokenURI)
        internal
    {
        tokenURI[_tokenId] = _tokenURI;
    }

    // Function return the URI of the metada of the token
    function getTokenURI(uint256 _tokenId) public view returns (string memory) {
        require(tokenExist[_tokenId], "This token doesn't exist!");
        return tokenURI[_tokenId];
    }
}
