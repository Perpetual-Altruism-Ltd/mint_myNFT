// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

contract myNftErc721 {
    // Mapping tokend Id to owners
    mapping(uint256 => address) private _owners;

    // Mapping owner address to token count
    mapping(address => uint256) private _balances;

    mapping(uint256 => bool) tokenExist;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 indexed _tokenId
    );

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

    function _mint(address _to, uint256 _tokenId) internal {
        require(_to != address(0));
        require(!tokenExist[_tokenId]);
        _owners[_tokenId] = _to;
        _balances[_to] += 1;
        tokenExist[_tokenId] = true;

        emit Transfer(address(0), msg.sender, _tokenId);
    }
}
