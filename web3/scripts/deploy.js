const { ethers } = require("hardhat");

async function main() {
  // TETHER TOKEN

  // const TetherTokenContract = await ethers.getContractFactory("TetherToken");

  // // here we deploy the contract
  // const deployedTetherTokenContract = await TetherTokenContract.deploy();
  // // 10 is the Maximum number of whitelisted addresses allowed

  // // Wait for it to finish deploying
  // await deployedTetherTokenContract.deployed();

  // // print the address of the deployed contract
  // console.log(
  //   "TetherToken Contract Address:",
  //   deployedTetherTokenContract.address
  // );

  //  MARKETPLACE TOKEN

  const usd = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

  const usdToken = await ethers.getContractAt("TetherToken", usd);

  const marketplaceContract = await ethers.getContractFactory(
    "ArtiziaMarketplace"
  );

  const deployedMarketplaceContract = await marketplaceContract.deploy(usd);

  await deployedMarketplaceContract.deployed();

  console.log("Artizia Marketplace: ", deployedMarketplaceContract.address);

  // NFT CONTRACT

  const NFTContract = await ethers.getContractFactory("ArtiziaNFT");

  const deployedNFTContract = await NFTContract.deploy(
    deployedMarketplaceContract.address
  );

  await deployedNFTContract.deployed();

  console.log("Artizia NFT Contract:", deployedNFTContract.address);

  const imperUSDC = "0xA7A93fd0a276fc1C0197a5B5623eD117786eeD06";

  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [imperUSDC],
  });

  const signer = await ethers.getSigner(imperUSDC);

  console.log(
    "Vitalik account before transaction",
    ethers.utils.formatEther(await signer.getBalance())
  );

  let usdctoken = await usdToken.connect(signer).balanceOf(signer.getAddress());

  let account2 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  await usdToken.connect(signer).transfer(account2, usdctoken);

  saveFrontendFiles(usd, "TetherToken");
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
