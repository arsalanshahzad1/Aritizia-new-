const express = require("express");
const { ethers } = require("ethers");
const rp = require("request-promise");
require("dotenv").config({ path: ".env" });
const abis = require("../frontend/src/contractsData/ArtiziaMarketplace.json");
const contractAddress = require("../frontend/src/contractsData/ArtiziaMarketplace-address.json");
const nftabis = require("../frontend/src/contractsData/ArtiziaNFT.json");


const app = express();
const port = 5000; // Replace with your desired port

// Initialize an Ethereum provider (e.g., Infura or your own Ethereum node)
const MATIC_RPC_ADDRESS = process.env.MATIC_RPC_ADDRESS;
const provider = new ethers.providers.JsonRpcProvider(MATIC_RPC_ADDRESS);
// const PRIVATE_KEYS = process.env.PRIVATE_KEYS;

// ABI and address of the smart contract
// const wallet = new ethers.Wallet(PRIVATE_KEYS, provider); // Replace with your private key

const contract = new ethers.Contract(
  contractAddress.address,
  abis.abi,
  provider
);

console.log(contractAddress)

// Function to process NFT Sold event
const processNFTSoldEvent = (nftContract,tokenId,price,seller,buyer,sellerId,buyerId) => {
  // Define the data you want to send in the API request
  const apiData = {
    contractAddress: nftContract?.toString(),
    token_id: tokenId?.toString(),
    price: price?.toString(),
    seller: seller?.toString(),
    buyer: buyer?.toString(),
    sellerId: sellerId?.toString(),
    buyerId: buyerId?.toString(),
  };
  // ("");
  // console.log("checckData",apiData);
  // Send a POST request to another server's API
  try {
    var options = {
      method: "POST",
      uri: `${process.env.API_URL}/sold-nft`,
      // uri: "http://165.232.142.3/api/sold-nft",
      body: apiData,
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
};

const processNFTListedEvent = async (nftContract,tokenId,seller,buyer,firstOwner,price,last_bid,collectionId,listingType,
start_time,
end_time,
sellerId,royaltyPrice) => {

  const nftcontract = new ethers.Contract(
    nftContract?.toString(),
    nftabis.abi,
    provider
  );
  
  let tokenUris = await nftcontract.tokenURI(tokenId?.toString())
  const responses = await fetch(tokenUris);
  const metadata = await responses.json();

  console.log(nftContract,tokenId,seller,buyer,firstOwner,
    price,last_bid,collectionId,listingType,
    start_time,
    end_time,
    sellerId,"Details");

  // address nftContract,
  // uint256 tokenId,
  // address seller,
  // address owner,
  // address firstOwner,
  // uint256 price,
  // uint256 last_bid,
  // uint256 collectionId,
  // uint256 listingType,
  // uint256 start_time,
  // uint256 end_time,
  // uint256 sellerId
  
  const apiData = {
    contractAddress: nftContract?.toString(),
    token_id: tokenId?.toString(),
    title: metadata?.title,
    description:metadata.description,
    image_url:metadata.image,
    seller: seller?.toString(),
    owner: buyer?.toString(),
    creator_address:firstOwner?.toString(),
    price: price?.toString(),
    collection_id: collectionId?.toString(),
    listing_type : listingType?.toString(),
    start_time : start_time?.toString(),
    end_time : end_time?.toString(),
    sellerId: sellerId?.toString(),
    last_bid: last_bid?.toString(),
    royality: royaltyPrice?.toString()
  };


  // Send a POST request to another server's API
  console.log("checckData2",apiData);
  try {
    var options = {
      method: "POST",
      uri: `${process.env.API_URL}/list-nft`,
      // uri: "http://165.232.142.3/api/sold-nft",
      body: apiData,
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
};

const processReceivedABidEvent = (tokenId, seller, highestBidder, highestBidIntoETH, highestBidIntoUSDT) => {
  // console.log("NFTListed Event:", event.args);
  // Define the data you want to send in the API request

  const apiData = {
    token_id: tokenId?.toString(),
    seller: seller?.toString(),
    bidder: highestBidder?.toString(),
    bidding_price_eth: highestBidIntoETH?.toString(),
    bidding_price_usdt: highestBidIntoUSDT?.toString(),
  };
  // Send a POST request to another server's API
  console.log("checckData2",apiData);
  try {
    var options = {
      method: "POST",
      uri: `${process.env.API_URL}/bidding-nft`,
      // uri: "http://165.232.142.3/api/sold-nft",
      body: apiData,
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
};

const processCancelListEvent = (nftContract,tokenId,owner,sellerId) => {
  // console.log("NFTListed Event:", event.args);
  // Define the data you want to send in the API request
  const apiData = {
    nft_id: tokenId?.toString(),
    seller_id: sellerId?.toString(),
    seller_address: owner,
  };
  // Send a POST request to another server's API
  console.log("checckData4",apiData);
  try {
    var options = {
      method: "POST",
      uri: `${process.env.API_URL}/cancel-nft-listing`,
      // uri: "http://165.232.142.3/api/sold-nft",
      body: apiData,
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
};


contract.on("receivedABid",processReceivedABidEvent);
contract.on("NFTSold",processNFTSoldEvent);
contract.on("NFTListed",processNFTListedEvent);
contract.on("cancelList",processCancelListEvent);



// async function getLatestBlockNumber() {
//   try {
//     const blockNumber = await provider.getBlockNumber();
//     console.log(blockNumber,"blockNumber")
//     return blockNumber;
//   } catch (error) {
//     console.error('Error getting latest block number:', error);
//     throw error;
//   }
// }


// async function GetPastEvents()
// {
//   console.log("try")
//   console.log(await getLatestBlockNumber(),"await getLatestBlockNumber()")
//   var event = await contract.getPastEvents(
//     'AllEvents', // Feel free to change this to 'Transfer' to see only the transfer events 
//     {
//       fromBlock: await getLatestBlockNumber() - 5,
//       toBlock: 'latest'
//     }
//   )
//   console.log("get");
//   console.log('Total events: ', event.length)
//   console.log(event[event.length - 1])
// }

// GetPastEvents();


//PAY WITH FIAT 

// Function to process approvalUpdate event
// const processApprovalUpdateEvent = (event) => {
//   console.log("NFT Sold Event:", event.args);
//   // Define the data you want to send in the API request
//   const apiData = {
//     nftContract: event.args.nftContract,
//     tokenId: event.args.tokenId,
//     price: event.args.price,
//     seller: event.args.seller,
//     buyer: event.args.buyer,
//   };

//   // Send a POST request to another server's API
//   try {
//     var options = {
//       method: "POST",
//       uri: "http://143.198.70.237/api/sold-nft",
//       body: {
//         some: apiData,
//       },
//       json: true, // Automatically stringifies the body to JSON
//     };

//     rp(options)
//       .then(function (parsedBody) {
//         // POST succeeded...
//         console.log("DONEE", parsedBody);
//       })
//       .catch(function (err) {
//         // POST failed...
//         console.log("FAIL", err);
//       });
//   } catch (error) {
//     console.error("API Request Error:", error);
//   }
// };

// Function to process auctionEndTimeIncreased event
// const processAuctionEndTimeIncreasedEvent = (event) => {
//   console.log("NFT Sold Event:", event.args);
//   // Define the data you want to send in the API request
//   const apiData = {
//     nftContract: event.args.nftContract,
//     tokenId: event.args.tokenId,
//     price: event.args.price,
//     seller: event.args.seller,
//     buyer: event.args.buyer,
//   };

//   // Send a POST request to another server's API
//   try {
//     var options = {
//       method: "POST",
//       uri: "http://143.198.70.237/api/sold-nft",
//       body: {
//         some: apiData,
//       },
//       json: true, // Automatically stringifies the body to JSON
//     };

//     rp(options)
//       .then(function (parsedBody) {
//         // POST succeeded...
//         console.log("DONEE", parsedBody);
//       })
//       .catch(function (err) {
//         // POST failed...
//         console.log("FAIL", err);
//       });
//   } catch (error) {
//     console.error("API Request Error:", error);
//   }
// };

// // Function to listen for events indefinitely
// const listenForNFTSoldEvents = async () => {
//   try {
//     console.log("Listening for NFT Sold events...");

//     // Here you can Listning your event
//     // contract.on(
//     //   await contract.queryFilter(approvalUpdateEvent),(eventData) => {
//     //     // function in which you send the data
//     //     processApprovalUpdateEvent(eventData);
//     //   }
//     // );

//     // Here you can Listning your event
//     // contract.on(
//     //   await contract.queryFilter(auctionEndTimeIncreasedEvent),(eventData) => {
//     //     // function in which you send the data
//     //     processAuctionEndTimeIncreasedEvent(eventData);
//     //   }
//     // );

//     // Here you can Listning your event
//     // contract.on(await contract.queryFilter(receivedABidEvent),(eventData) => {
//     //   // function in which you send the data
//     //   processReceivedABidEvent(eventData);
//     // });

//     // Here you can Listning your event
//     contract.on(await contract.queryFilter(NFTListedEvent),(eventData) => {
//       // function in which you send the data
//       processNFTListedEvent(eventData);
//     });

//   } catch (error) {
//     console.error("Event Listener Error:", error);
//   }
// };

// Function to listen for events indefinitely

// Start event listener
// listenForNFTSoldEvents();
// listenForNFTSoldEvents2();


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
