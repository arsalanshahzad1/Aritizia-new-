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

  before(async () => {
    [user1, user2, owner] = await ethers.getSigners();

    usdt = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    usdtToken = await ethers.getContractAt("IERC20", usdt);

    provider = new ethers.providers.JsonRpcProvider(
      "https://eth-mainnet.g.alchemy.com/v2/hmgNbqVFAngktTuwmAB2KceU06IJx-Fh"
    );

    marketplaceContract = await ethers.getContractFactory("ArtiziaMarketplace");

    deployedMarketplaceContract = await marketplaceContract.deploy();

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

  it("Should mint 3 tokens", async function () {
    // Define the token URIs
    const tokenURIs = [
      "tokenURI1",
      "tokenURI2",
      "tokenURI3",
      "tokenURI3",
      "tokenURI3",
    ];

    // Mint the NFTs
    await nft.mint(tokenURIs, { from: user1.address });

    // Verify the minted NFTs
    const totalSupply = await nft.balanceOf(user1.address);
    expect(totalSupply).to.be.equal("5");
  });

  // it("Should list 3 tokens", async function () {
  //   console.log("BALANCE ", await nft.balanceOf(user1.address));
  //   console.log("BALANCE ", await nft.ownerOf("1"));

  //   await marketplace.listNft(
  //     nft.address,
  //     [1],
  //     1000000000000000,
  //     1000000,
  //     0,
  //     0,
  //     0
  //   );
  //   // expect(nft.balanceOf(address(this)).to.be.equal("1"));
  // });

  it("this is swape check ", async function () {
    /// trying to take token from mainnet
    const imperUSDC = "0x16D541bB0f34d6877aF65fd562604B329C547Bd3";

    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [imperUSDC],
    });

    const signer = await ethers.getSigner(imperUSDC);

    console.log(
      "Vitalik account before transaction",
      ethers.utils.formatEther(await signer.getBalance())
    );

    let usdttokens = await usdtToken.connect(signer).balanceOf(imperUSDC);
    console.log("ImpersonateAccount Balance", usdttokens);

    // //////////////// frontedn demo integration start here ///////////////

    // console.log("usdToken balance ",await usdToken.balanceOf(account2))
    // const signerlocal = await ethers.getSigner(account2);

    // let price = balance.toString();
    // await usdToken.connect(signerlocal).approve(BtcNftProxy.address,price);
    console.log("user", await user1.getBalance());

    // const transaction = {
    //   to: marketplace.address,
    //   value: ethers.utils.parseEther("1000"),
    // };

    // await user1.sendTransaction(transaction);
    console.log("user1", await user1.getBalance());

    /// swape tokens for eth
    let usdtAmountIn = 100000 * 10 ** 6;
    console.log("beofer", await marketplace.getContractBalance());

    await usdtToken.connect(signer).approve(marketplace.address, usdtAmountIn);
    console.log("transfered");

    let result = await marketplace.connect(signer).swapUSDTForETH(usdtAmountIn);
    // console.log("result",result);
    console.log("after", await marketplace.getContractBalance());
    let bal = await marketplace.getContractBalance();

    /// swape tokens for eth

    let usdttokensInContract = await usdtToken
      .connect(signer)
      .balanceOf(marketplace.address);
    console.log("usdttokensInContract before", usdttokensInContract);

    let ethersss = ethers.utils.parseEther("1");
    let result2 = await marketplace
      .connect(signer)
      .swapETHForUSDT(ethersss, { value: ethersss });

    let usdttokensInContract2 = await usdtToken
      .connect(signer)
      .balanceOf(marketplace.address);
    console.log("usdttokensInContract after", usdttokensInContract2);
    console.log("after again swap", await marketplace.getContractBalance());
  });
});
