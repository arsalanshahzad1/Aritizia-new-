// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ArtiziaNFT is ERC721URIStorage {
    uint256 public _tokenIds;
    address artiziaMarketplaceContract;
    event NFTMinted(uint256[]);

    constructor(address _artiziaMarketplaceContract) ERC721("Artizia", "ARTZ") {
        artiziaMarketplaceContract = _artiziaMarketplaceContract;
    }

    mapping(address => uint256[]) public mintedTokens;

    uint256[] public mintedTokensList;

    function getMintedTokensList() public view returns (uint256[] memory) {
        return mintedTokensList;
    }

    function getNFTsOnAcount(
        address _contractAddress
    ) public view returns (uint[] memory) {
        return mintedTokens[_contractAddress];
    }

    function mint(string[] memory _tokenURIs) public {
        uint256[] memory mintedTokenIds = new uint256[](_tokenURIs.length);

        for (uint256 i = 0; i < _tokenURIs.length; i++) {
            _tokenIds++;
            uint256 newTokenId = _tokenIds;
            _safeMint(msg.sender, newTokenId);
            _setTokenURI(newTokenId, _tokenURIs[i]);
            setApprovalForAll(artiziaMarketplaceContract, true);

            mintedTokenIds[i] = newTokenId;
            mintedTokensList.push(newTokenId);
            mintedTokens[msg.sender].push(newTokenId);
        }
        emit NFTMinted(mintedTokenIds);
    }
}
