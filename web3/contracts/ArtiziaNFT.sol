// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";


contract ArtiziaNFT is ERC721URIStorage {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  address artiziaMarketplaceContract;
  event NFTMinted(uint256);

  constructor(address _artiziaMarketplaceContract) ERC721("Artizia", "ARTZ") {
    artiziaMarketplaceContract = _artiziaMarketplaceContract;
  }
  
  
  mapping(address => uint256[]) public mintedTokensList;

     function getMintedTokensList() public view returns (uint256[] memory) {
        return mintedTokensList[msg.sender];
    }

  function mint(string[] memory _tokenURIs) public  {
    
    uint256[] memory mintedTokenIds = new uint256[](_tokenURIs.length);



    for(uint256 i = 0; i < _tokenURIs.length; i++){
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURIs[i]);
        setApprovalForAll(artiziaMarketplaceContract, true);

        mintedTokenIds[i] = newTokenId;
        _tokenIds.increment();

      console.log("mintedTokenIds",mintedTokenIds[i]);
        
    emit NFTMinted(newTokenId);
    }
    mintedTokensList[msg.sender] = mintedTokenIds;

  }
}