// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IUniswapV2Router01 {
    function factory() external pure returns (address);

    function WETH() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);

    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    )
        external
        payable
        returns (uint amountToken, uint amountETH, uint liquidity);

    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB);

    function removeLiquidityETH(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountToken, uint amountETH);

    function removeLiquidityWithPermit(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (uint amountA, uint amountB);

    function removeLiquidityETHWithPermit(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (uint amountToken, uint amountETH);

    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);

    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);

    function swapExactETHForTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable returns (uint[] memory amounts);

    function swapTokensForExactETH(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);

    function swapExactTokensForETH(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);

    function swapETHForExactTokens(
        uint amountOut,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable returns (uint[] memory amounts);

    function quote(
        uint amountA,
        uint reserveA,
        uint reserveB
    ) external pure returns (uint amountB);

    function getAmountOut(
        uint amountIn,
        uint reserveIn,
        uint reserveOut
    ) external pure returns (uint amountOut);

    function getAmountIn(
        uint amountOut,
        uint reserveIn,
        uint reserveOut
    ) external pure returns (uint amountIn);

    function getAmountsOut(
        uint amountIn,
        address[] calldata path
    ) external view returns (uint[] memory amounts);

    function getAmountsIn(
        uint amountOut,
        address[] calldata path
    ) external view returns (uint[] memory amounts);
}

interface IUniswapV2Router02 is IUniswapV2Router01 {
    function removeLiquidityETHSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountETH);

    function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (uint amountETH);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;

    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable;

    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
}

interface IERC20USDT {
    function allowance(address owner, address spender) external returns (uint);

    function transferFrom(address from, address to, uint value) external;

    function approve(address spender, uint value) external;

    function totalSupply() external returns (uint);

    function balanceOf(address who) external returns (uint);

    function transfer(address to, uint value) external;
}

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "hardhat/console.sol";

error invalidPrice();
error invalidListingFee();
error invalidListingType();

contract ArtiziaMarketplace is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter public _nftsSold;
    Counters.Counter public _nftCount;
    // uint256 public LISTING_FEE = 0.0001 ether;
    address payable private _marketOwner;

    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    ///////////////    MAPPINGS    ////////////////
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////

    mapping(uint256 => NFT) public _idToNFT;

    mapping(uint256 => NFT2) public _idToNFT2;

    // neechey wali dono mappings me key address artist ka h

    mapping(address => mapping(address => bool)) public isFan;

    mapping(address => address[]) public fanLists;

    mapping(address => uint256[]) public bannedNfts;

    mapping(uint256 => Auction) public _idToAuction;

    mapping(address => bool) public bannedUsers;

    mapping(uint256 => uint256[]) public collection;

    // mapping(address => SubscriptionLevel) public userSubscription;

    mapping(SubscriptionLevel => uint256) public subscriptionFees;

    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    ///////////////    ENUMS    ///////////////////
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////

    enum ListingType {
        FixedPrice,
        Auction
    }

    enum PaymentMethod {
        ETHER,
        USDT,
        FIAT
    }

    enum SubscriptionLevel {
        FreeTrial,
        FreeTrialEnded,
        Gold,
        Platinum,
        Diamond
    }

    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    ///////////////    STRUCTS    /////////////////
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////

    struct Auction {
        uint256 tokenId;
        address payable seller;
        uint256 basePrice;
        uint256 startTime;
        uint256 endTime;
        uint256 highestBid;
        address payable highestBidder;
        PaymentMethod highestBidCurrency;
        // bool isLive;
    }

    struct NFT {
        address nftContract;
        uint256 tokenId;
        address payable firstOwner;
        address payable seller;
        address payable owner;
        uint256 price;
        bool listed;
        uint256 royaltyPrice;
        ListingType listingType;
        PaymentMethod paymentMethod;
        bool approve;
        uint256 collectionId;
    }

    struct NFT2 {
        uint256 tokenId;
        bool onlyFans;
        uint256 fanDiscountPercent;
    }

    struct Bid {
        address bidder;
        uint256 amount;
        uint256 tokenId;
    }

    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    ///////////////    EVENTS    //////////////////
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////

    event auctionEndTimeIncreased(
        uint256 tokenId,
        address seller,
        uint256 newTime
    );

    event addedFans(address[] fans);

    event removeFan(address fan);

    event approvalUpdate(uint256 tokenId, bool decision);

    event receivedABid(
        uint256 tokenId,
        address seller,
        address highestBidder,
        uint256 highestBid
    );

    // event getsOutbid(
    //     uint256 tokenId,
    //     address seller,
    //     address highestBidder,
    //     uint256 highestBid
    // );

    event NFTListed(
        address nftContract,
        uint256 tokenId,
        address seller,
        address owner,
        uint256 price,
        uint256 collectionId,
        uint256 listingType
    );

    event NFTSold(
        // address nftContract,
        uint256 tokenId,
        address seller,
        address buyer,
        uint256 price
    );

    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    ////////////    INITIALIZERS    ///////////////
    ///////////////////////////////////////////////
    /////////////////////////////////////////////// 

    address public UNISWAP_ROUTER_ADDRESS =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address public USDT_ADDRESS = 0xdAC17F958D2ee523a2206206994597C13D831ec7;

    IUniswapV2Router02 uniswapRouter;
    IERC20USDT USDTtoken;

    constructor(address _token) {
        _marketOwner = payable(msg.sender);
        uniswapRouter = IUniswapV2Router02(UNISWAP_ROUTER_ADDRESS);
        USDTtoken = IERC20USDT(_token);

        setSubscriptionFee(SubscriptionLevel.FreeTrial, 150);
        setSubscriptionFee(SubscriptionLevel.FreeTrialEnded, 150);
        setSubscriptionFee(SubscriptionLevel.Gold, 150);
        setSubscriptionFee(SubscriptionLevel.Platinum, 100);
        setSubscriptionFee(SubscriptionLevel.Diamond, 0);
    }

    function setSubscriptionFee(
        SubscriptionLevel level,
        uint256 fee
    ) private onlyOwner {
        subscriptionFees[level] = fee;
    }

    // function setUserSubscription(SubscriptionLevel level) external {
    //     userSubscription[msg.sender] = level;
    // }

    // function getUserSubscriptionFee(
    //     address user
    // ) public view returns (uint256) {
    //     SubscriptionLevel level = userSubscription[user];
    //     return subscriptionFees[level];
    // }

    function getSubscriptionFee(uint8 level) public view returns (uint256) {
        if (level == 3) {
            return subscriptionFees[SubscriptionLevel.Diamond];
        } else if (level == 2) {
            return subscriptionFees[SubscriptionLevel.Platinum];
        } else if (level == 1) {
            return subscriptionFees[SubscriptionLevel.Gold];
        } else {
            return subscriptionFees[SubscriptionLevel.FreeTrial];
        }
    }

    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    ///////////////    MODIFIERS    ///////////////
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////

    // Function to swap USDT for ETH
    // Swap ko bol rhey hn itney USDT dey rhey hn
    function swapUSDTForETH(uint256 usdtAmountIn) public returns (uint256) {
        address[] memory path = new address[](2);
        path[0] = USDT_ADDRESS;
        path[1] = uniswapRouter.WETH();

        //chnage here
        // USDTtoken.transferFrom(msg.sender, address(this), usdtAmountIn);

        // Approve the Uniswap Router to spend the USDT
        USDTtoken.approve(UNISWAP_ROUTER_ADDRESS, usdtAmountIn);

        // Define the variable to store the return array
        uint256[] memory amountsOut = new uint256[](2);

        // Call the getAmountsOut function and assign the return value
        amountsOut = uniswapRouter.getAmountsOut(usdtAmountIn, path);

        // Perform the swap transaction
        uniswapRouter.swapTokensForExactETH(
            amountsOut[1],
            usdtAmountIn,
            path,
            address(this),
            block.timestamp
        );

        // Transfer the received ETH to the desired recipient (User A)
        // payable(msg.sender).transfer(amountsOut[1]);

        return amountsOut[1];
    }

    // Function to swap ETH for USDT

    // Swap ko bol rhey hn itney USDT chahye
    function swapETHForUSDT(
        uint256 usdtAmountOut,
        uint256 meth
    ) public payable {
        // Specify the desired USDT output amount
        // uint256 usdtAmountOut = 1000; // Example: Swap 1 ETH for 1000 USDT

        // Prepare the swap path (ETH to USDT)
        address[] memory path = new address[](2);
        path[0] = uniswapRouter.WETH();
        path[1] = USDT_ADDRESS;

        uint256[] memory amountsOut = new uint256[](2);
        // Call the getAmountsOut function and assign the return value
        amountsOut = uniswapRouter.getAmountsOut(usdtAmountOut, path);

        // Perform the swap transaction
        if (meth == 0) {
            uniswapRouter.swapExactETHForTokens{value: msg.value}(
                amountsOut[1],
                path,
                address(this),
                block.timestamp
            );
        } else {
            // console.log("Swap 1");

            uint256 ethWei = usdtAmountOut * getLatestUSDTPrice();

            ethWei = ethWei / 10 ** 6;

            uniswapRouter.swapExactETHForTokens{value: ethWei}(
                amountsOut[1],
                path,
                address(this),
                block.timestamp
            );
            // console.log("Swap 2");
        }

        // USDTtoken.transfer(msg.sender, amountsOut[1]);
    }

    // function getContractBalance() public view returns (uint) {
    //     return address(this).balance;
    // }

    modifier auctionIsLive(uint256 _tokenId) {
        require(
            block.timestamp > _idToAuction[_tokenId].startTime &&
                block.timestamp < _idToAuction[_tokenId].endTime,
            "This NFT is not on auction at the moment."
        );
        _;
    }

    modifier isApproved(uint256 _tokenId) {
        // Put this modifier in the following functions:
        // BuyWithETH
        // BuyWithUSDT
        // BidInUSDT
        // BidInETH
        require(
            _idToNFT[_tokenId].approve == true,
            "This NFT is not approved yet from the admin for purchase"
        );
        _;
    }

    modifier isUserBanned() {
        require(!bannedUsers[msg.sender], "You are banned on this platform.");
        _;
    }

    // List the NFT on the marketplace
    function listNft(
        address _nftContract,
        uint256[] memory _tokenId,
        uint256[] memory _price,
        uint256[] memory _royaltyPrice,
        uint256 _listingType,
        uint256[] memory _startTime,
        uint256[] memory _endTime,
        uint256 _collectionId,
        uint256 _paymentMethod
    ) public payable nonReentrant isUserBanned {
        // require(_price > 0, "Price must be at least 1 wei");
        // require(msg.value == LISTING_FEE, "Not enough ether for listing fee");

        for (uint256 i = 0; i < _tokenId.length; i++) {
            if (_price[i] < 0) {
                revert invalidPrice();
            } else if (_listingType > uint256(ListingType.Auction)) {
                revert invalidListingType();
            } else {
                IERC721(_nftContract).transferFrom(
                    msg.sender,
                    address(this),
                    _tokenId[i]
                );

                // _marketOwner.transfer(LISTING_FEE);
                // console.log("this is 3");

                _nftCount.increment();

                collection[_collectionId].push(_tokenId[i]);

                _idToNFT[_tokenId[i]] = NFT(
                    _nftContract,
                    _tokenId[i],
                    payable(msg.sender),
                    payable(msg.sender),
                    payable(address(this)),
                    _price[i],
                    true,
                    _royaltyPrice[i],
                    ListingType(_listingType),
                    PaymentMethod(_paymentMethod),
                    true,
                    _collectionId
                );

                _idToNFT2[_tokenId[i]] = NFT2(_tokenId[i], false, 0);

                if (_listingType == uint256(ListingType.Auction)) {
                    _idToAuction[_tokenId[i]] = Auction(
                        _tokenId[i], //tokenId
                        payable(msg.sender), // seller
                        _price[i], // basePrice
                        _startTime[i], // startTime
                        _endTime[i], // endTime
                        0, // highestBid
                        payable(address(0)), // highestBidder
                        PaymentMethod(_paymentMethod)
                        // false // isLive
                    );
                }

                emit NFTListed(
                    _nftContract,
                    _tokenId[i],
                    msg.sender,
                    address(this),
                    _price[i],
                    _collectionId,
                    _listingType
                );
            }
        }
    }

    function getLatestUSDTPrice() public view returns (uint256) {
        // Commenting for testing

        // 0xEe9F2375b4bdF6387aa8265dD4FB8F16512A1d46 USDt/ETH Ethereum mainnet
        AggregatorV3Interface USDTPriceFeed = AggregatorV3Interface(
            0xEe9F2375b4bdF6387aa8265dD4FB8F16512A1d46
        ); // Mainnet contract address for USDT price feed
        (, int256 price, , , ) = USDTPriceFeed.latestRoundData(); // Get the latest USDT price data from Chainlink
        require(price > 0, "Invalid USDT price"); // Ensure that the price is valid
        return uint256(price);

        // return 531391650000000;
    }

    function buyWithUSDT(
        address _nftContract,
        uint256 _paymentMethod,
        uint256 _tokenId,
        uint8 _sellerPlan,
        uint8 _buyerPlan,
        uint256 _amount,
        uint256 _amountInETHInWei
    ) public payable isApproved(_tokenId) isUserBanned nonReentrant {
        NFT storage nft = _idToNFT[_tokenId];
        // console.log("Test 0 _amount", _amount);
        require(
            nft.seller != msg.sender,
            "An owner cannot purchase its own NFT."
        );

        // uint256 ethPriceInUsdt = getLatestUSDTPrice();
        uint256 _sellerPercent = getSubscriptionFee(_sellerPlan);
        uint256 _buyerPercent = getSubscriptionFee(_buyerPlan);
        // uint256 _amountInETHInWei = _amount * 10 ** 12;

        // _amountInETHInWei = _amountInETHInWei * ethPriceInUsdt;
        // _amountInETHInWei = _amountInETHInWei / 10 ** 18;
        // uint256 _amountInETHInWei = _amountETHWei;
        // console.log("Test 0 _amountInETHInWei", _amountInETHInWei);
        require(
            !bannedUsers[nft.seller],
            "The owner of this nft is blacklisted on this platform."
        );

        require(
            nft.listingType == ListingType.FixedPrice,
            "This NFT is not at auction"
        );

        // require(nft.listed == true, "Nft is not listed to purchase");

        // if condition ajayegi jo check kregi k agr

        uint256 _amountToBePaid;

        // yhan payment method check kr k amountToBepaid
        // ko required unit me convert krdo

        // if (_paymentMethod == 1) {
        //     _amountToBePaid = _amount;
        // } else {
        //     _amountToBePaid = _amountInETHInWei;
        // }

        if (isFan[_idToNFT[_tokenId].seller][msg.sender]) {
            // uint256 _discountedAmountToBePaidUSDT = _amountToBePaid -
            //     discountCalculate(
            //         _amount,
            //         _idToNFT2[_tokenId].fanDiscountPercent
            //     );
            // uint256 _discountedAmountToBePaidETH = _amountToBePaid -
            //     discountCalculate(
            //         _amountInETHInWei,
            //         _idToNFT2[_tokenId].fanDiscountPercent
            //     );
            // if (_paymentMethod == 1) {
            //     _amountToBePaid = _discountedAmountToBePaidUSDT;
            // } else {
            //     _amountToBePaid = _discountedAmountToBePaidETH;
            // }
            // console.log("Is a fan", _amountToBePaid);
            // require(
            //     _amountInETHInWei >= _discountedAmountToBePaidETH,
            //     "Not enough amount to cover asking price"
            // );
        } else {
            require(
                _amountInETHInWei >= nft.price,
                "Not enough amount to cover asking price"
            );
        }

        bool check = false;

        address payable buyer = payable(msg.sender);

        uint256 _amountAfterRoyalty;

        USDTtoken.transferFrom(msg.sender, address(this), _amount);

        if (nft.seller == nft.firstOwner) {
            // console.log("Test 2 firstOwner _amount", _amount);

            // approve from frontend
            _amountToBePaid =
                _amount -
                platformFeeCalculate(_amount, _sellerPercent, _buyerPercent);
            // console.log(
            //     "Test 3 firstOwner _amountToBePaid after fee",
            //     _amountToBePaid
            // );

            if (_paymentMethod == 1) {
                USDTtoken.transfer(nft.seller, _amountToBePaid);
                check = true;
            } else {
                // _amountToBePaid swap in ETH
                uint256 amountToSend = swapUSDTForETH(_amountToBePaid);
                // get eth price of
                // uint256 _amountToBePaidInETHInWei = _amountToBePaid *

                // pay the seller
                payable(nft.seller).transfer(amountToSend);
                check = true;
            }
        } else {
            uint256 _royaltyFee = royaltyCalculate(_amount, nft.royaltyPrice);
            // console.log("Test 4 resell _royaltyFee ", _royaltyFee);

            _amountAfterRoyalty = _amount - _royaltyFee;
            // console.log(
            //     "Test 5 resell _amountAfterRoyalty ",
            //     _amountAfterRoyalty
            // );

            _amountToBePaid =
                _amountAfterRoyalty -
                // platformFeeCalculate(_amountAfterRoyalty);
                platformFeeCalculate(
                    _amountAfterRoyalty,
                    _sellerPercent,
                    _buyerPercent
                );
            // uint256 _royaltyInUSDTInDecimals = _royaltyFee * 10 ** 6;
            // console.log("Test 6 resell _amountToBePaid ", _amountToBePaid);

            USDTtoken.transfer(nft.firstOwner, _royaltyFee);
            // console.log("Test 7 resell _amountToBePaid ");

            if (_paymentMethod == 1) {
                // uint256 _amountInUSDTInDecimals = _amountToBePaid * 10 ** 6;
                // console.log("Test 7");
                USDTtoken.transfer(nft.seller, _amountToBePaid);
                check = true;
            } else {
                // _amountToBePaid swap in ETH
                swapUSDTForETH(_amountToBePaid);
                // console.log("Test 8");
                // get eth price of
                uint256 _amountToBePaidInETHInWei = _amountToBePaid *
                    getLatestUSDTPrice();
                // console.log("Test 9");

                // pay the seller
                payable(nft.seller).transfer(_amountToBePaidInETHInWei);
                check = true;
            }
            // console.log("Test 10");

            // payable(nft.seller).transfer(_amountAfterRoyalty);
            // payable(nft.firstOwner).transfer(_royaltyFee);
        }

        if (check) {
            IERC721(_nftContract).transferFrom(
                address(this),
                buyer,
                nft.tokenId
            );
            // console.log("Test 11");

            emit NFTSold(
                // _nftContract,
                nft.tokenId,
                nft.seller,
                buyer,
                _amountInETHInWei
            );

            nft.owner = buyer;
            nft.seller = payable(address(0));
            nft.listed = false;
            _nftsSold.increment();
            _idToNFT2[nft.tokenId].fanDiscountPercent = 0;
        }
    }

    // // Buy an NFT with ETH
    function buyWithETH(
        address _nftContract,
        uint256 _paymentMethod,
        uint256 _tokenId,
        uint8 _sellerPlan,
        uint8 _buyerPlan
    ) public payable isApproved(_tokenId) isUserBanned nonReentrant {
        NFT storage nft = _idToNFT[_tokenId];

        uint256 _sellerPercent = getSubscriptionFee(_sellerPlan);
        uint256 _buyerPercent = getSubscriptionFee(_buyerPlan);

        require(
            nft.seller != msg.sender,
            "An owner cannot purchase its own NFT."
        );

        require(
            !bannedUsers[nft.seller],
            "The owner of this nft is blacklisted on this platform."
        );

        require(
            nft.listingType == ListingType.FixedPrice,
            "This NFT is not at auction"
        );

        require(nft.listed == true, "Nft is not listed to purchase");

        bool check = false;
        address payable buyer = payable(msg.sender);

        // uint256 _amountAfterRoyalty;
        uint256 _amountToBePaid = msg.value;

        // if condition ajayegi jo check kregi k agr
        // if (_idToNFT2[_tokenId].onlyFans) {
        if (isFan[_idToNFT[_tokenId].seller][msg.sender]) {
            // require(
            //     isFan[_idToNFT[_tokenId].seller][msg.sender],
            //     "You are not in the fan list"
            // );
            // _amountToBePaid =
            //     msg.value -
            //     discountCalculate(
            //         msg.value,
            //         _idToNFT2[_tokenId].fanDiscountPercent
            //     );
            // require(
            //     msg.value >= _amountToBePaid,
            //     "Not enough ether to cover asking price"
            // );
        } else {
            require(
                msg.value >= nft.price,
                "Not enough ether to cover asking price"
            );
            // _amountToBePaid = msg.value;
        }

        if (nft.seller == nft.firstOwner) {
            _amountToBePaid =
                _amountToBePaid -
                // platformFeeCalculate(_amountToBePaid);
                platformFeeCalculate(
                    _amountToBePaid,
                    _sellerPercent,
                    _buyerPercent
                );

            if (_paymentMethod == 0) {
                payable(nft.seller).transfer(_amountToBePaid);
                check = true;
            } else {
                uint256 _amountOfUSDT = _amountToBePaid / getLatestUSDTPrice();
                _amountOfUSDT = _amountOfUSDT * 10 ** 6;
                //swap _amountToBePaid here to USDT and transfer
                swapETHForUSDT(_amountOfUSDT, 0);
                // get the equivalent of _amountToBePaid from getUSDTPrice
                // uint256 _amountToBePaidInUSDT = _amountToBePaid *
                //     getLatestUSDTPrice();
                // // send USDT to nft.seller

                // uint256 _amountToBePaidInUSDTInDecimals = _amountToBePaidInUSDT *
                //         10 ** 6;

                USDTtoken.transfer(nft.seller, _amountOfUSDT);
                check = true;
            }
        } else {
            uint256 _amount = _amountToBePaid;
            uint256 _royaltyFee = royaltyCalculate(_amount, nft.royaltyPrice);
            // _amountAfterRoyalty = _amount - _royaltyFee;

            _amountToBePaid =
                _amount -
                _royaltyFee -
                platformFeeCalculate(
                    _amountToBePaid,
                    _sellerPercent,
                    _buyerPercent
                );

            payable(nft.firstOwner).transfer(_royaltyFee);
            if (_paymentMethod == 0) {
                payable(nft.seller).transfer(_amountToBePaid);
                check = true;
            } else {
                //swap _amountToBePaid here to USDT and transfer
                uint256 _amountOfUSDT = _amountToBePaid / getLatestUSDTPrice();
                _amountOfUSDT = _amountOfUSDT * 10 ** 6;
                swapETHForUSDT(_amountOfUSDT, 0);
                // get the equivalent of _amountToBePaid from getUSDTPrice
                // uint256 _amountToBePaidInUSDT = _amountToBePaid /
                //     getLatestUSDTPrice();
                // // send USDT to nft.seller

                // uint256 _amountToBePaidInUSDTInDecimals = _amountToBePaidInUSDT *
                //         10 ** 6;

                USDTtoken.transfer(nft.seller, _amountOfUSDT);
                check = true;
            }
        }

        if (check) {
            IERC721(_nftContract).transferFrom(
                address(this),
                buyer,
                nft.tokenId
            );

            emit NFTSold(
                // _nftContract,
                nft.tokenId,
                nft.seller,
                buyer,
                msg.value
            );

            nft.owner = buyer;
            nft.seller = payable(address(0));
            nft.listed = false;
            _nftsSold.increment();
            _idToNFT2[nft.tokenId].fanDiscountPercent = 0;
        }
    }

    // Resell an NFT purchased from the marketplace
    function resellNft(
        address _nftContract,
        uint256 _tokenId,
        uint256 _price,
        uint256 _listingType,
        uint256 _startTime,
        uint256 _endTime
    )
        public
        // uint256 _paymentMethod
        isUserBanned
        nonReentrant
    {
        NFT storage nft = _idToNFT[_tokenId];

        require(_price > 0, "Price must be at least 1 wei");

        console.log("nft.owner", nft.owner);
        console.log("msg.sender", msg.sender);

        require(
            nft.owner == msg.sender,
            "Only the owner of an nft can list the nft."
        );

        IERC721(_nftContract).transferFrom(msg.sender, address(this), _tokenId);

        nft.seller = payable(msg.sender);
        nft.owner = payable(address(this));
        nft.price = _price;
        nft.listed = true;
        nft.listingType = ListingType(_listingType);
        // nft.paymentMethod = PaymentMethod(_paymentMethod);

        if (_listingType == uint256(ListingType.Auction)) {
            _idToAuction[_tokenId] = Auction(
                _tokenId, // tokenId
                payable(msg.sender), // seller
                _price, // basePrice
                _startTime, // startTime
                _endTime, // endTime
                0, // highestBid
                payable(address(0)), // highestBidder
                nft.paymentMethod
                // false // isLive
            );
        }

        _nftsSold.decrement();
        emit NFTListed(
            _nftContract,
            _tokenId,
            msg.sender,
            address(this),
            _price,
            nft.collectionId,
            _listingType
        );
    }

    function bidInETH(
        uint256 _tokenId,
        uint256 _bidCurrency
    ) public payable auctionIsLive(_tokenId) isApproved(_tokenId) isUserBanned {
        bool check = false;
        if (_idToNFT2[_tokenId].onlyFans) {
            require(
                isFan[_idToNFT[_tokenId].seller][msg.sender],
                "You are not in the fan list"
            );
        }

        if (_idToAuction[_tokenId].highestBidder == address(0)) {
            require(
                msg.value >= _idToAuction[_tokenId].basePrice,
                "Minimum bid has to be higher"
            );
        }
        require(
            msg.value > _idToAuction[_tokenId].highestBid,
            "You have to bid higher than the highest bid to make an offer"
        );
        require(
            _idToNFT[_tokenId].listingType == ListingType.Auction,
            "This NFT is at at auction"
        );
        require(
            _idToNFT[_tokenId].listed == true,
            "Nft is not listed to purchase"
        );

        Auction storage auction = _idToAuction[_tokenId];

        address payable prevBidder = auction.highestBidder;
        uint256 prevBid = auction.highestBid;

        // handle previous highest bidder
        if (auction.highestBidder != address(0)) {
            if (auction.highestBidCurrency == PaymentMethod.USDT) {
                // converting eth into usdt .... this will discard the decimal though
                uint256 usdtToReturn = prevBid / (getLatestUSDTPrice());

                // in wei
                usdtToReturn = usdtToReturn * 10 ** 6;

                USDTtoken.transfer(prevBidder, usdtToReturn);
            } else if (auction.highestBidCurrency == PaymentMethod.ETHER) {
                payable(prevBidder).transfer(prevBid);
            }
        }
        auction.highestBid = msg.value;
        auction.highestBidder = payable(msg.sender);
        auction.highestBidCurrency = PaymentMethod(_bidCurrency);

        if (auction.endTime < block.timestamp + 10 minutes) {
            auction.endTime += 5 minutes;
            emit auctionEndTimeIncreased(
                _tokenId,
                auction.seller,
                auction.endTime
            );
        }

        check = true;
        if (check) {
            emit receivedABid(
                _tokenId,
                auction.seller,
                auction.highestBidder,
                auction.highestBid
            );
        }
    }

    function bidInUSDT(
        uint256 _tokenId,
        uint256 _amount, // usdt in wei
        uint256 _bidCurrency,
        uint256 _amountInETHInWei
    ) public payable auctionIsLive(_tokenId) isApproved(_tokenId) isUserBanned {
        // uint256 ethPriceInUsdt = getLatestUSDTPrice();
        bool check = false;
        if (_idToNFT2[_tokenId].onlyFans) {
            require(
                isFan[_idToNFT[_tokenId].seller][msg.sender],
                "You are not in the fan list"
            );
        }
        // uint256 _amountInETHInWei = _amount * 10 ** 12;
        // _amountInETHInWei = _amountInETHInWei * ethPriceInUsdt;
        // _amountInETHInWei = _amountInETHInWei / 10 ** 18;
        // uint256 _amountInETH = _amountInETHInWei / 10 ** 18;
        if (_idToAuction[_tokenId].highestBidder == address(0)) {
            require(
                _amountInETHInWei >= _idToAuction[_tokenId].basePrice,
                "Minimum bid has to be higher"
            );
        }

        require(
            _amountInETHInWei >= _idToAuction[_tokenId].highestBid,
            "You have to bid higher than the highest bid to make an offer"
        );

        require(
            _idToNFT[_tokenId].listingType == ListingType.Auction,
            "This NFT is at at auction"
        );

        require(
            _idToNFT[_tokenId].listed == true,
            "Nft is not listed to purchase"
        );

        USDTtoken.transferFrom(msg.sender, address(this), _amount);

        Auction storage auction = _idToAuction[_tokenId];

        address payable prevBidder = auction.highestBidder;
        uint256 prevBid = auction.highestBid;

        // handle previous highest bidder

        if (auction.highestBidder != address(0)) {
            if (auction.highestBidCurrency == PaymentMethod.USDT) {
                uint256 usdtToReturn = prevBid / (getLatestUSDTPrice());

                // in wei
                usdtToReturn = usdtToReturn * 10 ** 6;

                USDTtoken.transfer(prevBidder, usdtToReturn);
            } else if (auction.highestBidCurrency == PaymentMethod.ETHER) {
                payable(prevBidder).transfer(prevBid);
            }
        }

        auction.highestBid = _amountInETHInWei;
        auction.highestBidder = payable(msg.sender);
        auction.highestBidCurrency = PaymentMethod(_bidCurrency);

        if (auction.endTime < block.timestamp + 10 minutes) {
            auction.endTime += 5 minutes;
            emit auctionEndTimeIncreased(
                _tokenId,
                auction.seller,
                auction.endTime
            );
        }

        check = true;

        if (check) {
            emit receivedABid(
                _tokenId,
                auction.seller,
                auction.highestBidder,
                auction.highestBid
            );
        }
    }

    function closeAuction(
        address _nftContract,
        uint256 _tokenId, // uint256 _sellerPercent, // uint256 _buyerPercent
        uint8 _sellerPlan,
        uint8 _buyerPlan
    ) public payable {
        // console.log("Test 1");

        uint256 _sellerPercent = getSubscriptionFee(_sellerPlan);
        uint256 _buyerPercent = getSubscriptionFee(_buyerPlan);

        // if (_idToAuction[_tokenId].highestBidder != address(0)) {
        //     console.log("Test 2");

        //     require(
        //         msg.sender == _idToAuction[_tokenId].highestBidder ||
        //             msg.sender == _idToAuction[_tokenId].seller,
        //         "Only the highest bidder and the seller can claim the NFT"
        //     );
        //     console.log("Test 3");
        // } else {
        //     console.log("Test 4");
        //     require(
        //         msg.sender == _idToAuction[_tokenId].seller,
        //         "Only the seller can close the unsold auction"
        //     );
        //     console.log("Test 5");
        // }

        NFT storage nft = _idToNFT[_tokenId];
        Auction storage auction = _idToAuction[_tokenId];
        // console.log("Test 6");

        bool transferred = false;

        // if there are no bids on an auction end the function there
        if (_idToAuction[_tokenId].highestBidder == address(0)) {
            require(
                msg.sender == _idToAuction[_tokenId].seller,
                "Only the seller can close the unsold auction"
            );
            // console.log("Test 7");
            nft.owner = nft.seller;
            // auction.isLive = false;
            nft.listed = false;
            // require(
            //     _idToAuction[_tokenId].highestBidder != address(0),
            //     "Nothing to claim. You have got 0 bids on your auction. Returning your NFT."
            // );
            IERC721(_nftContract).transferFrom(
                address(this),
                auction.seller,
                nft.tokenId
            );
            transferred = true;
        } else {
            require(
                msg.sender == _idToAuction[_tokenId].highestBidder ||
                    msg.sender == _idToAuction[_tokenId].seller,
                "Only the highest bidder and the seller can claim the NFT"
            );

            // UNCOMMENT THIS REQUIRE STATEMENT

            require(
                block.timestamp > _idToAuction[_tokenId].endTime,
                "Auction has not ended yet."
            );

            // auction.isLive = false;
            // console.log("Test 8");
            uint256 _royaltyFee;
            uint256 _amount = auction.highestBid; // alreay saving all bids in ether
            uint256 _amountToBePaid = _amount;
            uint256 usdtToReturn = _amount / (getLatestUSDTPrice());

            // in wei
            usdtToReturn = usdtToReturn * 10 ** 6;

            // console.log("auction.highestBid", _amount);

            // if the seller wants to be paid in ether
            if (nft.paymentMethod == PaymentMethod.ETHER) {
                ////////////////////////////
                /////////////SWAP///////////
                ////////////////////////////
                // console.log("Test 9");

                // if last bid is in USDT swap and update amount
                if (auction.highestBidCurrency == PaymentMethod.USDT) {
                    // swap USDT to ETH and update _amount
                    // _amount =
                    // console.log("Test 10");

                    // usdt ki 6 decimal me price chahye yha
                    uint256 _amountOfUSDT = _amount / getLatestUSDTPrice();
                    _amountOfUSDT = _amountOfUSDT * 10 ** 6;
                    swapUSDTForETH(_amountOfUSDT);
                    _amountToBePaid = _amount;
                }

                if (nft.seller == nft.firstOwner) {
                    // console.log("Test 11");
                    _amountToBePaid =
                        _amountToBePaid -
                        platformFeeCalculate(
                            _amountToBePaid,
                            _sellerPercent,
                            _buyerPercent
                        );
                    payable(nft.seller).transfer(_amountToBePaid);
                } else {
                    // console.log("Test 12");
                    _royaltyFee = royaltyCalculate(
                        _amountToBePaid,
                        nft.royaltyPrice
                    );
                    _amountToBePaid =
                        _amountToBePaid -
                        _royaltyFee -
                        platformFeeCalculate(
                            _amountToBePaid,
                            _sellerPercent,
                            _buyerPercent
                        );
                    // console.log("Test 13");
                    payable(nft.firstOwner).transfer(_royaltyFee);
                    payable(nft.seller).transfer(_amountToBePaid);
                }

                // if the seller wants to be paid in USDT
            } else if (nft.paymentMethod == PaymentMethod.USDT) {
                ////////////////////////////
                /////////////SWAP///////////
                ////////////////////////////

                // console.log("Test 14");
                _amountToBePaid = usdtToReturn;

                if (auction.highestBidCurrency == PaymentMethod.ETHER) {
                    // uint256 _amountOfUSDT = _amount / getLatestUSDTPrice();
                    // uint256 _amountInETHInWei = _amount * 10 ** 12;
                    // _amountInETHInWei = _amountInETHInWei * getLatestUSDTPrice();
                    // _amountInETHInWei = _amountInETHInWei / 10 ** 18;
                    // console.log("Test 15");
                    // console.log("auction.highestBid2", _amount);
                    // console.log("usdtToReturn", usdtToReturn);

                    swapETHForUSDT(usdtToReturn, 1);
                    // console.log("Test 15 2");

                    _amountToBePaid = usdtToReturn;

                    // _amount = _amountOfUSDT * 10 ** 6;
                }

                if (nft.seller == nft.firstOwner) {
                    // USDTtoken.transferFrom(msg.sender, address(this), _amount);

                    // convert eth amount to usdt here

                    _amountToBePaid =
                        _amountToBePaid -
                        platformFeeCalculate(
                            _amountToBePaid,
                            _sellerPercent,
                            _buyerPercent
                        );
                    // console.log("Test 16");
                    // console.log("_amountToBePaid", _amountToBePaid);
                    USDTtoken.transfer(nft.seller, _amountToBePaid);
                    // console.log("Test 17");
                    // payable(nft.seller).transfer(_amountToBePaid);
                } else {
                    _royaltyFee = royaltyCalculate(
                        _amountToBePaid, // highest bid's price should be in USDT
                        nft.royaltyPrice
                    );
                    // console.log("Test 18");
                    _amountToBePaid =
                        _amountToBePaid -
                        _royaltyFee -
                        platformFeeCalculate(
                            _amountToBePaid,
                            _sellerPercent,
                            _buyerPercent
                        );

                    // USDTtoken.transferFrom(msg.sender,address(this),_amount);
                    // console.log("Test 19");

                    USDTtoken.transfer(nft.seller, _amountToBePaid);
                    // console.log("Test 20");

                    USDTtoken.transfer(nft.firstOwner, _royaltyFee);
                    // console.log("Test 21");

                    // payable(nft.firstOwner).transfer(_royaltyFee);
                    // payable(nft.seller).transfer(_amountToBePaid);
                }
            }

            if (!transferred) {
                // console.log("Test 50");
                IERC721(_nftContract).transferFrom(
                    address(this),
                    auction.highestBidder,
                    nft.tokenId
                );
            }
            nft.owner = auction.highestBidder;
            nft.seller = payable(address(0));
            nft.listed = false;
            _nftsSold.increment();
            _idToNFT2[nft.tokenId].fanDiscountPercent = 0;
        }

        // console.log("Test 60");

        emit NFTSold(
            // _nftContract,
            nft.tokenId,
            nft.seller,
            auction.highestBidder,
            auction.highestBid
        );
        // console.log("Test 70");
    }

    function royaltyCalculate(
        uint256 _amount,
        uint256 _royaltyPercent
    ) internal pure returns (uint256) {
        return (_amount * _royaltyPercent) / 100;
    }

    function platformFeeCalculate(
        uint256 _amount,
        uint256 _sellerPercent,
        uint256 _buyerPercent
    ) internal pure returns (uint256) {
        uint256 _amountToDeduct;
        _amountToDeduct = (_amount * _sellerPercent) / 10000;
        _amountToDeduct = _amountToDeduct + (_amount * _buyerPercent) / 10000;
        return _amountToDeduct;
    }

    function changeFanDiscountPercent(
        uint256 _tokenId,
        uint256 _newDiscountPercent
    ) public {
        require(
            _idToNFT[_tokenId].seller == msg.sender,
            "Only the owner of an nft can set discounted prices."
        );

        _idToNFT2[_tokenId].fanDiscountPercent = _newDiscountPercent;
    }

    function addFans(address[] memory fans) public {
        address[] memory myFans = new address[](fans.length);

        for (uint256 i = 0; i < fans.length; i++) {
            address fan = fans[i];
            // require(fan != address(0), "Invalid fan address");
            // require(!isFan[msg.sender][fan], "Address is already a fan");
            if (fan == address(0)) {
                console.log("Invalid fan address");
            } else if (isFan[msg.sender][fan]) {
                console.log("Address is already a fan");
            } else {
                fanLists[msg.sender].push(fan);
                isFan[msg.sender][fan] = true;
                console.log("Fan added to list");
                myFans[i] = fan;
            }
        }

        emit addedFans(myFans);
    }

    function removeFans(address addressToRemove) public {
        address[] storage fanList = fanLists[msg.sender];
        for (uint256 i = 0; i < fanList.length; i++) {
            if (fanList[i] == addressToRemove) {
                fanList[i] = fanList[fanList.length - 1];
                fanList.pop();
                emit removeFan(addressToRemove);
                break;
            }
        }
    }

    function discountCalculate(
        uint256 _amount,
        uint256 _percent
    ) internal pure returns (uint256) {
        return (_amount * _percent) / 100;
    }

    function banUser(address _user) public onlyOwner {
        bannedUsers[_user] = true;

        uint nftCount = _nftCount.current();

        for (uint i = 0; i < nftCount; i++) {
            if (_idToNFT[i].seller == _user) {
                // cannot claim the ownership of the nfts
                // bcs IERC721 needs approval from the owner which
                // we cannot get

                //  IERC721(_nftContract).transferFrom(
                //         _user,
                //         address(this),
                //         _idToNFT[i].tokenId
                //     );

                _idToNFT[i].owner = payable(address(this));
                _idToNFT[i].seller = payable(address(0));
                _idToNFT[i].listed = false;
                _idToNFT[i].approve = false;
            }
        }
    }

    function unbanUser(address _user) public onlyOwner {
        bannedUsers[_user] = false;
    }

    function approveNfts(
        uint256[] memory _tokenId,
        bool _decision
    ) public onlyOwner returns (bool) {
        uint256 id;

        for (uint256 i = 0; i < _tokenId.length; i++) {
            id = _tokenId[i];
            _idToNFT[id].approve = _decision;

            if (
                _decision == false &&
                _idToNFT[id].listingType == ListingType.Auction
            ) {
                // if decsion == false and listingType == 1 && highest bidder != 0x0000
                // then return highestBid to highest Bidder
                Auction storage auction = _idToAuction[id];
                if (auction.highestBidder != address(0)) {
                    address payable prevBidder = auction.highestBidder;

                    uint256 prevBid = auction.highestBid;
                    if (auction.highestBidder != address(0)) {
                        if (auction.highestBidCurrency == PaymentMethod.USDT) {
                            // converting eth into usdt .... this will discard the decimal though
                            uint256 usdtToReturn = prevBid /
                                (getLatestUSDTPrice());

                            // in wei
                            usdtToReturn = usdtToReturn * 10 ** 6;

                            USDTtoken.transfer(prevBidder, usdtToReturn);
                        } else if (
                            auction.highestBidCurrency == PaymentMethod.ETHER
                        ) {
                            payable(prevBidder).transfer(prevBid);
                        }
                    }
                }
            }

            emit approvalUpdate(id, _decision);
        }
        return _decision;
    }

    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    ////////////    GETTER FUNCTIONS    ///////////
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////

    function getFans(
        address user
    ) public view isUserBanned returns (address[] memory) {
        return fanLists[user];
    }

    function checkFan(uint256 _tokenId) public view returns (bool) {
        return isFan[_idToNFT[_tokenId].seller][msg.sender];
    }

    function getCollectionNfts(
        uint256 _collectionId
    ) public view returns (NFT[] memory) {
        uint256 nftCount = _nftCount.current();
        uint256 unsoldNftsCount = nftCount - _nftsSold.current();

        NFT[] memory nfts = new NFT[](unsoldNftsCount);
        uint nftsIndex = 0;

        for (uint i = 0; i < nftCount; i++) {
            if (
                _idToNFT[i].listed &&
                _idToNFT[i].collectionId == _collectionId &&
                _idToNFT[i].approve
            ) {
                nfts[nftsIndex] = _idToNFT[i];
                nftsIndex++;
            }
        }
        return nfts;
    }

    function getListedNfts() public view returns (NFT[] memory) {
        uint256 nftCount = _nftCount.current();
        uint256 unsoldNftsCount = nftCount - _nftsSold.current();

        NFT[] memory nfts = new NFT[](unsoldNftsCount);
        uint nftsIndex = 0;

        for (uint i = 0; i < nftCount; i++) {
            if (_idToNFT[i].listed && _idToNFT[i].approve) {
                nfts[nftsIndex] = _idToNFT[i];
                nftsIndex++;
            }
        }
        return nfts;
    }

    function getMyNfts(
        address _user
    ) public view isUserBanned returns (NFT[] memory) {
        uint nftCount = _nftCount.current();
        uint myNftCount = 0;
        for (uint i = 0; i < nftCount; i++) {
            if (_idToNFT[i].owner == _user) {
                myNftCount++;
            }
        }

        NFT[] memory nfts = new NFT[](myNftCount);
        uint nftsIndex = 0;
        for (uint i = 0; i < nftCount; i++) {
            if (_idToNFT[i].owner == _user) {
                nfts[nftsIndex] = _idToNFT[i];
                nftsIndex++;
            }
        }
        return nfts;
    }

    function getUsersNfts(
        address _user
    ) public view isUserBanned returns (NFT[] memory) {
        uint nftCount = _nftCount.current();
        uint myListedNftCount = 0;
        for (uint i = 0; i < nftCount; i++) {
            if (
                _idToNFT[i].seller == _user
                // && _idToAuction[i].approve
                //   && _idToNFT[i].listed
            ) {
                myListedNftCount++;
            }
        }

        NFT[] memory nfts = new NFT[](myListedNftCount);
        uint nftsIndex = 0;
        for (uint i = 0; i < nftCount; i++) {
            if (
                _idToNFT[i].seller == _user
                //  && _idToNFT[i].listed
                //   && _idToAuction[id].approve
            ) {
                nfts[nftsIndex] = _idToNFT[i];
                nftsIndex++;
            }
        }
        return nfts;
    }

    function getMyListedNfts(
        address _user
    ) public view isUserBanned returns (NFT[] memory) {
        uint nftCount = _nftCount.current();
        uint myListedNftCount = 0;
        for (uint i = 0; i < nftCount; i++) {
            if (
                _idToNFT[i].seller == _user &&
                _idToNFT[i].listed &&
                _idToNFT[i].approve
            ) {
                myListedNftCount++;
            }
        }

        NFT[] memory nfts = new NFT[](myListedNftCount);
        uint nftsIndex = 0;
        for (uint i = 0; i < nftCount; i++) {
            if (
                _idToNFT[i].seller == _user &&
                _idToNFT[i].listed &&
                _idToNFT[i].approve
            ) {
                nfts[nftsIndex] = _idToNFT[i];
                nftsIndex++;
            }
        }
        return nfts;
    }

    function getStatusOfAuction(uint256 _tokenId) public view returns (bool) {
        if (
            block.timestamp > _idToAuction[_tokenId].startTime &&
            block.timestamp < _idToAuction[_tokenId].endTime
        ) {
            return true;
        } else {
            return false;
        }
    }

    receive() external payable {}

    fallback() external payable {}
}
