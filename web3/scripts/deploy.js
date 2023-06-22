const { ethers } = require("hardhat");

async function main() {
  // TETHER TOKEN

  const TetherTokenContract = await ethers.getContractFactory("TetherToken");

  // here we deploy the contract
  const deployedTetherTokenContract = await TetherTokenContract.deploy();
  // 10 is the Maximum number of whitelisted addresses allowed

  // Wait for it to finish deploying
  await deployedTetherTokenContract.deployed();

  // print the address of the deployed contract
  console.log(
    "TetherToken Contract Address:",
    deployedTetherTokenContract.address
  );

  //  MARKETPLACE TOKEN

  const marketplaceContract = await ethers.getContractFactory(
    "ArtiziaMarketplace"
  );

  const deployedMarketplaceContract = await marketplaceContract.deploy(
    deployedTetherTokenContract.address
  );

  await deployedMarketplaceContract.deployed();

  console.log("Artizia Marketplace: ", deployedMarketplaceContract.address);

  // NFT CONTRACT

  const NFTContract = await ethers.getContractFactory("ArtiziaNFT");

  const deployedNFTContract = await NFTContract.deploy(
    deployedMarketplaceContract.address
  );

  await deployedNFTContract.deployed();

  console.log("Artizia NFT Contract:", deployedNFTContract.address);

  saveFrontendFiles(deployedTetherTokenContract, "TetherToken");
  saveFrontendFiles(deployedMarketplaceContract, "ArtiziaMarketplace");
  saveFrontendFiles(deployedNFTContract, "ArtiziaNFT");
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../frontend/src/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);
  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
