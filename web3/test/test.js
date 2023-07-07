const { expect } = require("chai");
const { ethers } = require("hardhat");

//describe for deploy the smart contract
describe("This Is Artizia", function () {
  let nft;
  let marketplace;
  let deployedMarketplaceContract;
  let marketplaceContract;
  let usdtToken;
  let provider;

  let usdt = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

  it(" Contract", async function () {
    [user1, user2, owner] = await ethers.getSigners();
    usdtToken = await ethers.getContractAt("TetherToken", usdt);

    // console.log("usdToken", usdtToken);

    // provider = new ethers.providers.JsonRpcProvider(
    //   "https://eth-mainnet.g.alchemy.com/v2/hmgNbqVFAngktTuwmAB2KceU06IJx-Fh"
    // );

    marketplaceContract = await ethers.getContractFactory("ArtiziaMarketplace");
    deployedMarketplaceContract = await marketplaceContract.deploy(usdt);

    console.log("Artizia Marketplace: ", deployedMarketplaceContract.address);

    marketplace = deployedMarketplaceContract;

    NFTContract = await ethers.getContractFactory("ArtiziaNFT");
    const deployedNFTContract = await NFTContract.deploy(
      deployedMarketplaceContract.address
    );
    await deployedNFTContract.deployed();
    console.log("Artizia NFT Contract:", deployedNFTContract.address);

    nft = deployedNFTContract;
  });

  it("impersonate", async function () {
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

    let usdctoken = await usdtToken
      .connect(signer)
      .balanceOf(signer.getAddress());

    await usdtToken.connect(signer).transfer(user1.getAddress(), usdctoken);

    let usdctoken2 = await usdtToken
      .connect(signer)
      .balanceOf(user1.getAddress());
    console.log("usdctoken2", usdctoken2);
  });

  it("Should mint 3 tokens", async function () {
    // Define the token URIs
    console.log("1");
    const tokenURIs = [
      "tokenURI1",
      "tokenURI2",
      "tokenURI3",
      "tokenURI3",
      "tokenURI3",
    ];
    console.log("2");

    // Mint the NFTs
    await nft.mint(tokenURIs, { from: user1.address });

    // Verify the minted NFTs
    const totalSupply = await nft.balanceOf(user1.address);
    expect(totalSupply).to.be.equal("5");
  });

  it("Should list 1 token in Fixed price", async function () {
    console.log("BALANCE ", await nft.balanceOf(user1.address));
    console.log("BALANCE ", await nft.ownerOf("1"));

    await marketplace.listNft(
      nft.address,
      [1],
      1000000000000000,
      1000000,
      0, // listing type
      0,
      0,
      0
    );
    // expect(nft.balanceOf(address(this)).to.be.equal("1"));

    const uri = await nft.tokenURI(1);

    console.log("URI ", uri);
  });

  it("Should list 1 token in Auction", async function () {
    console.log("BALANCE ", await nft.balanceOf(user1.address));
    console.log("BALANCE ", await nft.ownerOf("2"));

    await marketplace.listNft(
      nft.address,
      [2], // tokenId
      1000000000000000, // price
      1000000, // royaltyPrice
      1, // listing type
      1688463687, // startTime
      1688463687 + 300, //endTime
      0 //paymentMethod
    );
    // expect(nft.balanceOf(address(this)).to.be.equal("1"));

    const uri = await nft.tokenURI(2);

    console.log("URI ", uri);

    const auction = await marketplace._idToAuction(2);

    console.log("auction", auction);
    console.log("******************");
    console.log("******************");
    console.log("******************");
    console.log("******************");
    console.log("******************");

    const timepass = 5 * 60;
    await network.provider.send("evm_increaseTime", [timepass]);
    await network.provider.send("evm_mine");

    const bid = await marketplace.bidInETH(2, 0, {
      value: ethers.utils.parseEther("1000000000"),

      // value: 1000000000000000,
    });

    const auction2 = await marketplace._idToAuction(2);

    console.log("auction", auction2);
  });

  // it("this is swape check ", async function () {
  //   /// trying to take token from mainnet
  //   const imperUSDC = "0x16D541bB0f34d6877aF65fd562604B329C547Bd3";

  //   await network.provider.request({
  //     method: "hardhat_impersonateAccount",
  //     params: [imperUSDC],
  //   });

  //   const signer = await ethers.getSigner(imperUSDC);

  //   console.log(
  //     "Vitalik account before transaction",
  //     ethers.utils.formatEther(await signer.getBalance())
  //   );

  //   let usdttokens = await usdtToken.connect(signer).balanceOf(imperUSDC);
  //   console.log("ImpersonateAccount Balance", usdttokens);

  //   // //////////////// frontedn demo integration start here ///////////////

  //   // console.log("usdToken balance ",await usdToken.balanceOf(account2))
  //   // const signerlocal = await ethers.getSigner(account2);

  //   // let price = balance.toString();
  //   // await usdToken.connect(signerlocal).approve(BtcNftProxy.address,price);
  //   console.log("user", await user1.getBalance());

  //   // const transaction = {
  //   //   to: marketplace.address,
  //   //   value: ethers.utils.parseEther("1000"),
  //   // };

  //   // await user1.sendTransaction(transaction);
  //   console.log("user1", await user1.getBalance());

  //   /// swape tokens for eth
  //   let usdtAmountIn = 100000 * 10 ** 6;
  //   console.log("beofer", await marketplace.getContractBalance());

  //   await usdtToken.connect(signer).approve(marketplace.address, usdtAmountIn);
  //   console.log("transfered");

  //   let result = await marketplace.connect(signer).swapUSDTForETH(usdtAmountIn);
  //   // console.log("result",result);
  //   console.log("after", await marketplace.getContractBalance());
  //   let bal = await marketplace.getContractBalance();

  //   /// swape tokens for eth

  //   let usdttokensInContract = await usdtToken
  //     .connect(signer)
  //     .balanceOf(marketplace.address);
  //   console.log("usdttokensInContract before", usdttokensInContract);

  //   let ethersss = ethers.utils.parseEther("1");
  //   let result2 = await marketplace
  //     .connect(signer)
  //     .swapETHForUSDT(ethersss, { value: ethersss });

  //   let usdttokensInContract2 = await usdtToken
  //     .connect(signer)
  //     .balanceOf(marketplace.address);
  //   console.log("usdttokensInContract after", usdttokensInContract2);
  //   console.log("after again swap", await marketplace.getContractBalance());
  // });
});

// const { expect } = require("chai");
// const { ethers } = require("hardhat");
// const { Provider } = require("web3modal");

// // async function mineNBlocks(n) {
// //   for (let index = 0; index < n; index++) {
// //     await ethers.provider.send('evm_mine');
// //   }
// // }

// describe("This Is AIM", function () {

//   let TetherToken
//   let Tether
//   let AIMToken
//   let AIM
//   let usdtToken

//   let USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

//   before(async () => {
//     [per1, per2, per3] = await ethers.getSigners()

//     AIMToken = await ethers.getContractFactory("AIMToken")
//     AIM = await AIMToken.deploy();
//     console.log("AIM contract address", AIM.address);

//     usdtToken = await ethers.getContractAt("TetherToken", USDT);

//   });

//   it("this is get Round", async function () {
//     await AIM.startTheSale();
//     let round = await AIM.round();
//     console.log("this is Round", round);
//   })

//   it("this is impersonate account ", async function () {
//     /// trying to take token from mainnet
//     const imperUSDC = "0xA7A93fd0a276fc1C0197a5B5623eD117786eeD06";

//     await network.provider.request({
//       method: "hardhat_impersonateAccount",
//       params: [imperUSDC],
//     });

//     const signer = await ethers.getSigner(imperUSDC);

//     console.log(
//       "Vitalik account before transaction",
//       ethers.utils.formatEther(await signer.getBalance())
//     );

//     let USDTtoken = await usdtToken.connect(signer).balanceOf(signer.getAddress());
//     console.log("ImpersonateAccount Balance", USDTtoken)

//     await usdtToken.connect(signer).transfer(per1.getAddress(), USDTtoken);
//     let balance = await usdtToken.balanceOf(per1.getAddress());

//     console.log("usdToken balance ", balance)

//   })

//   it("lets swap by ETH ", async function () {

//     const balance = await ethers.provider.getBalance(AIM.address);

//     // Convert the balance to ether
//     const balanceInEther = ethers.utils.formatEther(balance);
//     console.log(balanceInEther);

//     let token = ethers.utils.parseEther("10000000");
//     let getPrice = await AIM.sellTokenInETHPrice(token, "5000");
//     await AIM.mintByEth(token, { value: getPrice })

//     const afterbalance = await ethers.provider.getBalance(AIM.address);
//     // Convert the balance to ether
//     const afterbalances = ethers.utils.formatEther(afterbalance);
//     console.log("afterbalance",Number(afterbalances).toFixed(2));

//       //   let balance = await usdtToken.balanceOf(account2);

//   //   console.log("usdToken balance ", balance)

//   });

// });
