const { ethers } = require("hardhat");
const rp = require('request-promise');

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

  const marketplaceContract = await ethers.getContractFactory("ArtiziaMarketplace");

  const deployedMarketplaceContract = await marketplaceContract.deploy();

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

  // saveFrontendFiles(usd, "TetherToken");

  //Send a POST request to another server's API
  //console.log("checckData2",apiData);
  try {
    var options = {
      method: "POST",
      // uri: "http://143.198.70.237/api/list-nft",
      uri: `http://165.232.142.3/api/admin/truncate-tables?wallet_address=${deployedMarketplaceContract.address}`,
      //body: apiData,
      json: true, // Automatically stringifies the body to JSON
    };
    rp(options)
      .then(function (parsedBody) {
        // POST succeeded...
        console.log("DONEE", parsedBody);
      })
      .catch(function (err) {
        // POST failed...
        console.log("FAIL", err);
      });
  } catch (error) {
    console.error("API Request Error:", error);
  }
  
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
