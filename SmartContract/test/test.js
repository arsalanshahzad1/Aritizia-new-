const { expect } = require("chai");
const { ethers } = require("hardhat");

//describe for deploy the smart contract
describe("This Is Artizia", function () {
  let marketplace;
  let marketplaceContract;
  let nft;
  let NFTContract;
  let usdtToken;
  let signer;

  // let usdt ="0xdAC17F958D2ee523a2206206994597C13D831ec7";//This is USDT ON ETHEREUM Chain
  let usdt ="0x55d398326f99059fF775485246999027B3197955";//This is USDT ON BNB Chain 

  it(" Contract Deployment ", async function () {
    [user1, user2, user3, user4] = await ethers.getSigners();

    usdtToken = await ethers.getContractAt("TetherToken", usdt);

    marketplaceContract = await ethers.getContractFactory("ArtiziaMarketplace");
    marketplace = await marketplaceContract.deploy();
    await marketplace.deployed();
    console.log("Artizia Marketplace: ", marketplace.address);

    NFTContract = await ethers.getContractFactory("ArtiziaNFT");
    nft = await NFTContract.deploy(marketplace.address);
    await nft.deployed();
    console.log("Artizia NFT Contract:", nft.address);
  });

  // This method is for ETH USDT
  // it("impersonate", async function () {
  //   const imperUSDC = "0xA7A93fd0a276fc1C0197a5B5623eD117786eeD06";
  //   await network.provider.request({
  //     method: "hardhat_impersonateAccount",
  //     params: [imperUSDC],
  //   });

  // This method is for BNB USDT
  it("impersonate", async function () {
    const imperUSDC = "0x3A7d1A8C3A8dC9d48a68e628432198a2eAD4917c";
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [imperUSDC],
    });


    signer = await ethers.getSigner(imperUSDC);

    console.log("Impersonate Acount BNB Balance before transaction",
      ethers.utils.formatEther(await signer.getBalance())
    );

    let usdctoken = await usdtToken
      .connect(signer)
      .balanceOf(signer.getAddress());

    await usdtToken.connect(signer).transfer(user2.getAddress(), usdctoken);

    let usdttoken2 = await usdtToken
      .connect(signer)
      .balanceOf(user2.getAddress());
    console.log("USDT BALANCE AFTER TRANSACTION TO USER2 : ",ethers.utils.formatEther(usdttoken2?.toString()));
  });

  it("This Test Should mint 4 NFT's tokens", async function () {
    const tokenURIs = ["tokenURI1", "tokenURI2", "tokenURI3", "tokenURI4"];
    // Mint the NFTs
    await nft.mint(tokenURIs);
    // Verify the minted NFTs
    const totalSupply = await nft.balanceOf(user1.address);
    expect(totalSupply).to.be.equal("4");
  });

  it("Should list 1 nftToken in Fixed price", async function () {
    await marketplace.listNft(
      nft.address, // address _nftContract,
      [1], // uint256[] memory _tokenId,
      [ethers.utils.parseEther("1")], // uint256[] memory _price,
      [100], // uint256[] memory _royaltyPrice, "{amount*royalty/100}"
      0, // uint256 _listingType, {"0=fixPrice 1=Auctions"}
      [Date.now()], // uint256[] memory _startTime,
      [Date.now() + 24 * 60 * 60], // uint256[] memory _endTime,
      1, // uint256 _collectionId,
      1, // uint256 _paymentMethod {"0=ETHER,1=USDT,2=FIAT"}
      10
    );
  });

  it("Should list Remain 3 nft Tokens", async function () {
    let nowInMs = Date.now();
    let nowInSecond = Math.round(nowInMs / 1000);
    console.log("nowInSecond", nowInSecond); // 1698127419 1698127439

    await marketplace.listNft(
      nft.address, // address _nftContract,
      [2, 3], // uint256[] memory _tokenId,
      [ethers.utils.parseEther("1"), ethers.utils.parseEther("2")], // uint256[] memory _price,
      [1000, 1500], // uint256[] memory _royaltyPrice, "{amount*royalty/100}"
      1, // uint256 _listingType, {"0=fixPrice 1=Auctions"}
      [nowInSecond - 100, nowInSecond - 100], // uint256[] memory _startTime,
      [nowInSecond + 24 * (60 * 60), nowInSecond + 24 * (60 * 60)], // uint256[] memory _endTime,
      2, // uint256 _collectionId,
      0, // uint256 _paymentMethod {"0=ETHER,1=USDT,2=FIAT"}
      10 //sellerId for database
    );
  });

  it("get Listed Tokens from collectiin and nft's mapping ", async function () {

    let collectionData1 = await marketplace.getCollectionNfts(1);
    console.log("collectionData1 = ", collectionData1?.toString());

    let collectionData2 = await marketplace.getCollectionNfts(2);
    console.log("collectionData2 = ", collectionData2?.toString());

    let tokeId = await marketplace.getListedNfts();
    console.log("Listed nfts = ", tokeId);
  });

  ////++++++++++++Failed++++++++++++++++\\\\

  // it("Failed due to An owner cannot purchase its own NFT.",async function(){
  //   await marketplace.buyWithETH(
  //   nft.address,  // address _nftContract,
  //   0,  // uint256 _paymentMethod,
  //   0,  // uint256 _tokenId,
  //   3,  // uint8 _sellerPlan,
  //   3  // uint8 _buyerPlan
  //   )
  // });


  //This function is bying in Direact Method ETH == ETH
  it("Buy With ETH Fixed payment method USDT", async function () {
    
    let blcSaller = await user1.getBalance();
    console.log("Before sale nft Saller User1 Balance In BNB := ",ethers.utils.formatEther(blcSaller?.toString()));

    let blc = await user2.getBalance();
    console.log("Before sale User2 Balance In BNB := ",ethers.utils.formatEther(blc?.toString()));
    

    let blcNFT5 = await usdtToken.balanceOf(user1.address);
    let decimals = await usdtToken.decimals();
    console.log("Before sale nft Saller USDT Balance := ",ethers.utils.formatUnits(blcNFT5, decimals?.toString()));
  
    let blcNFT = await nft.balanceOf(user2.address);
    console.log("Before Purchase NFT owns by User2 := ", blcNFT?.toString());

    await marketplace.connect(user2).buyWithETH(
      nft.address, // address _nftContract,
      // 0,  // uint256 _paymentMethod,0=ETH 1=USDT
      1, // uint256 _tokenId,
      3, // uint8 _sellerPlan,
      3, // uint8 _buyerPlan
      10,//sellerId
      10,//BuyerId
      { value: ethers.utils.parseEther("1") }
    );

    let marketAddress = await usdtToken.balanceOf(marketplace.address);
    console.log("marketAddress =", marketAddress?.toString());

    let blc2 = await user2.getBalance();
    console.log("After Purchase ETH =", blc2.toString());

    let charge = +blc - +blc2;
    console.log(
      "Charges from Account = ",
      ethers.utils.formatEther(charge.toString())
    );

    let blcNFT2 = await nft.balanceOf(user2.address);
    console.log("After Purchase NFT owns =", blcNFT2?.toString());

    let blcNFT3 = await user1.getBalance();
    console.log("After sale nft Saller Balance =", blcNFT3?.toString());
    console.log(
      "Difference Saller Account =",
      blcNFT3?.toString() - blcSaller?.toString()
    );

    let blcNFT4 = await usdtToken.balanceOf(user1.address);
    console.log("After sale nft Saller USDT Balance =", blcNFT4?.toString());
  });

  it("this is Royalty cheek testcase with Respect to ETH resellNFT", async function () {
    await nft.connect(user2).approve(marketplace.address, 1);
    await marketplace.connect(user2).resellNft(
      nft.address, // address _nftContract,
      1, // uint256 _tokenId,
      ethers.utils.parseEther("1"), // uint256 _price,
      0, // uint256 _listingType, {"0=fixPrice 1=Auctions"}
      Date.now(), // uint256 _startTime,
      Date.now() + 24 * 60 * 60, // uint256 _endTime,
      10 //uint256 sellerId
    );
  });

  it("Buy With ETH Fixed payment method USDT second time check royalty", async function () {
    let blcSaller = await user1.getBalance();
    console.log("Before sale nft Creater Balance =", blcSaller?.toString());

    let blcNFT5 = await usdtToken.balanceOf(user2.address);
    console.log("Before sale nft Creater USDT Balance =", blcNFT5?.toString());

    let blc = await user2.getBalance();
    console.log("ETH Saller =", blc?.toString());

    await marketplace.connect(user3).buyWithETH(
      nft.address, // address _nftContract,
      // 0,  // uint256 _paymentMethod,0=ETH 1=USDT
      1, // uint256 _tokenId,
      3, // uint8 _sellerPlan,
      3, // uint8 _buyerPlan
     10, // uint256 sellerId,
     10, // uint256 buyerId
      { value: ethers.utils.parseEther("1") }
    );

    let blcNFT = await nft.balanceOf(user3.address);
    console.log("After Purchase NFT owns =", blcNFT?.toString());

    let blc2 = await user2.getBalance();
    console.log("After Purchase saller ETH =", blc2.toString());

    console.log(
      "amount increase to saller // not increase becuase payment method usdt",
      (blc2 - blc) / 10 ** 18
    );

    let blcNFT3 = await user1.getBalance();
    console.log(
      "After sale nft creater Balance (Royalty) =",
      blcNFT3?.toString()
    );
    console.log(
      "Difference Creater Royalti amount =",
      blcNFT3?.toString() - blcSaller?.toString()
    );

    let blcNFT4 = await usdtToken.balanceOf(user2.address);
    console.log("After sale nft saller USDT Balance =", blcNFT4?.toString());
  });

  it("List again affter Buy user3 Dont forget abut ryalty", async function () {
    await nft.connect(user3).approve(marketplace.address, 1);
    await marketplace.connect(user3).resellNft(
      nft.address, // address _nftContract,
      1, // uint256 _tokenId,
      ethers.utils.parseEther("1"), // uint256 _price,
      0, // uint256 _listingType, {"0=fixPrice 1=Auctions"}
      Date.now(), // uint256 _startTime,
      Date.now() + 24 * 60 * 60, // uint256 _endTime,
      10 //uint256 sellerId
    );
  });

  //lets check usdt to eth method
  it("Buy With USDT fixedPrice", async function () {
    let blc = await usdtToken.balanceOf(user2.address);
    console.log("Blance Of USDT =", +blc?.toString() / 10 ** 6);

    let convertedUSDT = await marketplace.getETHIntoUSDT(
      ethers.utils.parseEther("1")
    );
    console.log(
      `getAmountsOut ETHintoUSDT" (${ethers.utils.parseEther("1")} ETH = ${
        convertedUSDT / 10 ** 6
      } USDT)`
    );

    let blcNFT = await nft.balanceOf(user2.address);
    console.log("Before Purchase NFT owns =", blcNFT.toString());

    //yhn p mujhy 1 eth chaiye aske against ktne usdt dene hnga
    let ethAgastUSDT = await marketplace.getETHOutUSDTInOutPut(
      ethers.utils.parseEther("1")
    );
    console.log("Aganst Eth to USDT", ethAgastUSDT?.toString());

    await usdtToken.connect(user2).approve(marketplace.address, ethAgastUSDT);

    await marketplace.connect(user2).buyWithUSDT(
      nft.address, //address _nftContract,
      1, //uint256 _tokenId,
      ethAgastUSDT,
      3, //uint8 _sellerPlan,
      3, //uint8 _buyerPlan,
      10, //uint256 sellerId,
      10 //uint256 buyerId
    );

    let blc2 = await usdtToken.balanceOf(user2.address);
    console.log("Blance Of USDT =", +blc2?.toString() / 10 ** 6);

    let charge = +blc - +blc2;
    console.log("Charges from Account = ", charge.toString());

    let blc3 = await usdtToken.balanceOf(user3.address);
    console.log("Blance Of USDT =", +blc3?.toString() / 10 ** 6);
  });

  it("Check Auction Status ", async function () {
    let status = await marketplace.getStatusOfAuction(2);
    console.log(status);
  });

  ////////////Auction SECTIONS //////////////
  it("Bid on nft 2 from Ether side", async function () {
    let getBlc = await user2.getBalance();
    console.log("before bid balance", getBlc.toString());

    //payment method ether (ether to ether);
    let bid = ethers.utils.parseEther("1.1");
    await marketplace.connect(user2).bidInETH(2,0,{ value: bid });

    let getBlc2 = await user2.getBalance();
    console.log("After bid balance", getBlc2.toString());

    let bid2 = ethers.utils.parseEther("1.2");
    await marketplace.connect(user3).bidInETH(2,0, { value: bid2 });

    let getBlc3 = await user2.getBalance();
    console.log("After return bid balance", getBlc3.toString());

    console.log(
      `difference between bid `,
      (+getBlc.toString() - +getBlc2.toString()) / 10 ** 18
    );
    console.log(
      `difference after Bid bid `,
      (+getBlc3.toString() - +getBlc2.toString()) / 10 ** 18
    );
  });

  it("Increase Time", async function () {
    // suppose the current block has a timestamp of 01:00 PM
    const sevenDays = 2 * 24 * 60 * 60;
    await network.provider.send("evm_increaseTime", [sevenDays]);
    await network.provider.send("evm_mine"); // this one will have 02:00 PM as its timestamp
  });

  // it("Bid on nft 2 from Ether side", async function(){
  //   //payment method ether (ether to ether);
  //   let bid = ethers.utils.parseEther("1.3")
  //   await marketplace.connect(user2).bidInETH(2,{value:bid});
  //   })

  it("Conslude Auctions", async function () {
    let blcSaller = await user1.getBalance();
    console.log("Before sale nft saller Balance =", blcSaller?.toString());

    let blc = await user3.getBalance();
    console.log("Buyer ETH =", blc?.toString());

    let blcNFT = await nft.balanceOf(user3.address);
    console.log("before Purchase NFT owns =", blcNFT?.toString());

    await marketplace.connect(user3).closeAuction(
      nft.address, // address _nftContract,
      2, //uint256 _tokenId, // uint256 _sellerPercent, // uint256 _buyerPercent
      3, //uint8 _sellerPlan,
      3, //uint8 _buyerPlan
      10 //uint256 buyerId
    );

    let blc2 = await user3.getBalance();
    console.log("After Purchase saller ETH =", blc2.toString());

    console.log("amount increase to Buyer ETH ", (blc2 - blc) / 10 ** 18);

    let blcNFT3 = await user1.getBalance();
    console.log("After sale nft nft price - tex =", blcNFT3?.toString());
    console.log(
      "Difference amount that saller get =",
      blcNFT3?.toString() - blcSaller?.toString()
    );

    let blcNFT33 = await nft.balanceOf(user3.address);
    console.log("After Purchase NFT owns =", blcNFT33?.toString());
  });

  it("List again affter Buy user3 Dont forget abut ryalty", async function () {
    let nowInMs = Date.now();
    let nowInSecond = Math.round(nowInMs / 1000);
    console.log("nowInSecond", nowInSecond); // 1698127419 1698127439

    await nft.connect(user3).approve(marketplace.address, 2);
    await marketplace.connect(user3).resellNft(
      nft.address, // address _nftContract,
      2, // uint256 _tokenId,
      ethers.utils.parseEther("1"), // uint256 _price,
      1, // uint256 _listingType, {"0=fixPrice 1=Auctions"}
      0, // uint256[] memory _startTime,
      nowInSecond + 60 * 60,
      10
    );
  });

  it("Check Auction Status ", async function () {
    let status = await marketplace.getStatusOfAuction(2);
    console.log(status);
  });

  it("Bid on nft 2 from USDT side", async function () {
    let bid2 = ethers.utils.parseEther("1.2");

    let ethintousdts = await marketplace.getETHOutUSDTInOutPut(bid2.toString());
    await usdtToken.connect(user2).transfer(user1.address, ethintousdts);

    let getBlc = await usdtToken.balanceOf(user2.address);
    console.log("user2 before bid usdt balance", getBlc.toString());

    //payment method ether (ether to ether);
    let bid = ethers.utils.parseEther("1.1");
    let ethintousdt = await marketplace.getETHOutUSDTInOutPut(bid.toString());

    await usdtToken.connect(user2).approve(marketplace.address, ethintousdt);
    await marketplace.connect(user2).bidInUSDT(2, ethintousdt,10);

    let getBlc2 = await usdtToken.balanceOf(user2.address);
    console.log("user2 after bid usdt balance", getBlc2.toString());

    let getbl3 = await usdtToken.balanceOf(user1.address);
    console.log("user1 after bid usdt balance", getbl3.toString());

    await usdtToken.connect(user1).approve(marketplace.address, ethintousdts);
    await marketplace.connect(user1).bidInUSDT(2, ethintousdts,10);

    let getBlc3 = await usdtToken.balanceOf(user2.address);
    console.log("user2 after bid Return usdt balance", getBlc3.toString());

    console.log(
      `difference between bid `,
      (+getBlc.toString() - +getBlc2.toString()) / 10 ** 6
    );
    console.log(
      `difference after Bid bid `,
      (+getBlc3.toString() - +getBlc2.toString()) / 10 ** 6
    );
  });

  it("Increase Time", async function () {
    // suppose the current block has a timestamp of 01:00 PM
    const sevenDays = 1 * 24 * 60 * 60;
    await network.provider.send("evm_increaseTime", [sevenDays]);
    await network.provider.send("evm_mine"); // this one will have 02:00 PM as its timestamp
  });

  // it("Conslude Auctions", async function () {
  //   let blcSaller = await user3.getBalance();
  //   console.log("Before sale nft saller Balance =", blcSaller?.toString());

  //   let blcNFT = await nft.balanceOf(user1.address);
  //   console.log("before Purchase NFT owns =", blcNFT?.toString());

  //   await marketplace.connect(user1).closeAuction(
  //     nft.address, // address _nftContract,
  //     2, //uint256 _tokenId, // uint256 _sellerPercent, // uint256 _buyerPercent
  //     3, //uint8 _sellerPlan,
  //     3, //uint8 _buyerPlan,
  //     10 //buyerId
  //   );

  //   let blc2 = await user3.getBalance();
  //   console.log("After Purchase saller ETH =", blc2.toString());

  //   console.log("amount increase to Buyer ETH ", (blc2 - blcSaller) / 10 ** 18);

  //   let blcNFT33 = await nft.balanceOf(user1.address);
  //   console.log("After Purchase NFT owns =", blcNFT33?.toString());
  // });
});
