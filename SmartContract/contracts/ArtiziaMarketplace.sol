//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

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
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error invalidPrice();
error invalidListingFee();
error invalidListingType();

contract ArtiziaMarketplace is ReentrancyGuard, Ownable {
    uint256 public _nftsSold = 1;
    uint256 public _nftCount = 1;

    address payable private _marketOwner;

    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    ///////////////    MAPPINGS    ////////////////
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////

    mapping(uint256 => NFT) public _idToNFT;

    mapping(uint256 => Auction) public _idToAuction;

    mapping(address => bool) public bannedUsers;

    mapping(uint256 => uint256[]) public collection;

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
        ETHER, //0
        USDT, //1
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
        uint256 highestBidIntoETH;
        uint256 highestBidIntoUSDT;
        address payable highestBidder;
        PaymentMethod highestBidCurrency;
        uint8 buyerPlane;
        bool royalty;
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
        bool royalty;
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

    event approvalUpdate(uint256 tokenId, bool decision);

    event auctionEndTimeIncreased(
        uint256 tokenId,
        address seller,
        uint256 newTime
    );

    event receivedABid(
        uint256 tokenId,
        address seller,
        address highestBidder,
        uint256 highestBidIntoETH,
        uint256 highestBidIntoUSDT
    );

    event NFTSold(
        address nftContract,
        uint256 tokenId,
        uint256 price,
        address seller,
        address buyer,
        uint256 sellerId,
        uint256 buyerId
    );

    event NFTListed(
        address nftContract,
        uint256 tokenId,
        address seller,
        address owner,
        address firstOwner,
        uint256 price,
        uint256 min_bid,
        uint256 last_bid,
        uint256 collectionId,
        uint256 listingType,
        uint256 start_time,
        uint256 end_time,
        uint256 sellerId
    );

    event cancelList(
        address nftContract,
        uint256 tokenId,
        address owner,
        uint256 sellerId
    );

    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    ////////////    INITIALIZERS    ///////////////
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////

    address public UNISWAP_ROUTER_ADDRESS = 0x10ED43C718714eb63d5aA57B78B54704E256024E; //BNB Router 0x10ED43C718714eb63d5aA57B78B54704E256024E //ETH Router 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
    address public USDT_ADDRESS = 0x55d398326f99059fF775485246999027B3197955; //USDT In BNB 0x55d398326f99059fF775485246999027B3197955 18 Decimals // Eth USDT 0xdAC17F958D2ee523a2206206994597C13D831ec7

    IUniswapV2Router02 uniswapRouter;
    IERC20USDT USDTtoken;

    constructor() {
        _marketOwner = payable(msg.sender);
        uniswapRouter = IUniswapV2Router02(UNISWAP_ROUTER_ADDRESS);
        USDTtoken = IERC20USDT(USDT_ADDRESS);

        setSubscriptionFee(SubscriptionLevel.Diamond, 0);
        setSubscriptionFee(SubscriptionLevel.Platinum, 100);
        setSubscriptionFee(SubscriptionLevel.Gold, 150);
        setSubscriptionFee(SubscriptionLevel.FreeTrial, 150);
    }

    function setSubscriptionFee(
        SubscriptionLevel _level,
        uint256 _fee
    ) private onlyOwner {
        subscriptionFees[_level] = _fee;
    }

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

    // function getLatestUSDTPrice() public view returns (uint256) {
    //     // Commenting for testing
    //     AggregatorV3Interface USDTPriceFeed = AggregatorV3Interface(
    //         0xEe9F2375b4bdF6387aa8265dD4FB8F16512A1d46
    //     );
    //     // Mainnet contract address for USDT price feed
    //     (, int256 price, , , ) = USDTPriceFeed.latestRoundData(); // Get the latest USDT price data from Chainlink
    //     require(price > 0, "Invalid USDT price"); // Ensure that the price is valid
    //     return uint256(price);
    //     // Uncomment for testnet
    //     // return 627758691588469;
    // }

    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    ///////////////    MODIFIERS    ///////////////
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////

    modifier auctionIsLive(uint256 _tokenId) {
        require(
            block.timestamp > _idToAuction[_tokenId].startTime &&
                block.timestamp < _idToAuction[_tokenId].endTime,
            "This NFT is not on auction at the moment."
        );
        _;
    }

    modifier isApproved(uint256 _tokenId) {
        require(_idToNFT[_tokenId].approve == true, "admin Block This NFT");
        _;
    }

    modifier isUserBanned() {
        require(!bannedUsers[msg.sender], "You are banned on this platform.");
        _;
    }

    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    ///////////////    functions    ///////////////
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////

    // Function to swap USDT for ETH
    // swap ko bol rhy hain itna amount de rhy hain aske against eth return/wap kro
    function swapUSDTForETH(uint256 usdtAmountIn) public returns (uint256) {
        address[] memory path = new address[](2);
        path[0] = USDT_ADDRESS;
        path[1] = uniswapRouter.WETH();

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
    ) public payable returns (uint256) {
        // Specify the desired USDT output amount
        // uint256 usdtAmountOut = 1000; // Example: Swap 1 ETH for 1000 USDT

        // Prepare the swap path (ETH to USDT)
        address[] memory path = new address[](2);
        path[0] = uniswapRouter.WETH();
        path[1] = USDT_ADDRESS;

        uint256[] memory amountsOut = new uint256[](2);

        //amountIn(amountsOut[0]) kr k batao aspe amountsOut[1] kitna milega
        amountsOut = uniswapRouter.getAmountsOut(usdtAmountOut, path);

        // Perform the swap transaction
        if (meth == 0) {
            uniswapRouter.swapExactETHForTokens{value: msg.value}(
                amountsOut[1],
                path,
                address(this),
                block.timestamp
            );
            return amountsOut[1];
        } else {
            uniswapRouter.swapExactETHForTokens{value: amountsOut[0]}(
                amountsOut[1],
                path,
                address(this),
                block.timestamp
            );
            return amountsOut[1];
        }
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
        uint256 _paymentMethod,
        uint256 _sellerId
    ) public payable nonReentrant isUserBanned {
        // require(_price > 0, "Price must be at least 1 wei");
        // require(msg.value == LISTING_FEE, "Not enough ether for listing fee");
        for (uint256 i = 0; i < _tokenId.length; i++) {
            if (_price[i] <= 0) {
                revert invalidPrice();
            } else if (_listingType > uint256(ListingType.Auction)) {
                revert invalidListingType();
            } else {
                IERC721(_nftContract).transferFrom(
                    msg.sender,
                    address(this),
                    _tokenId[i]
                );

            _nftCount++;

            collection[_collectionId].push(_tokenId[i]);

             
            

                if (_listingType == uint256(ListingType.Auction)) {

                    _idToAuction[_tokenId[i]] = Auction(
                        _tokenId[i], //tokenId
                        payable(msg.sender), // seller
                        _price[i], // basePrice
                        _startTime[i], // startTime
                        _endTime[i], // endTime
                        0,
                        0, // highestBid
                        payable(address(0)), // highestBidder
                        PaymentMethod(_paymentMethod),
                        150,
                        false
                    );

                         emit NFTListed(
                    _nftContract,
                    _tokenId[i],
                    msg.sender,
                    address(this),
                    payable(msg.sender),
                    _price[i],
                    0,
                    0,
                    _collectionId,
                    _listingType,
                    0,
                    0,
                    _sellerId
                );
                
                }
                else{
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
                    _collectionId,
                    false
                );

                emit NFTListed(
                    _nftContract,
                    _tokenId[i],
                    msg.sender,
                    address(this),
                    payable(msg.sender),
                    _price[i],
                    0,
                    0,
                    _collectionId,
                    _listingType,
                    0,
                    0,
                    _sellerId
                );

                }

        // address nftContract,
        // uint256 tokenId,
        // address seller,
        // address owner,
        // address firstOwner,
        // uint256 price,
        // uint256 min_bid,
        // uint256 last_bid,
        // uint256 collectionId,
        // uint256 listingType,
        // uint256 start_time,
        // uint256 end_time,
        // uint256 sellerId

     
            }
        }
    }

    function cancelListing(
        address _nftContract,
        uint256 _tokenId,
        uint256 _sellerId
    ) public payable nonReentrant isUserBanned {
        NFT storage nft = _idToNFT[_tokenId];
        require(msg.sender == nft.seller, "Only Seller can cancelListing");
        nft.owner = payable(msg.sender);
        nft.seller = payable(address(0));
        nft.listed = false;
        // IERC721(_nftContract).approve(msg.sender,_tokenId);
        IERC721(_nftContract).transferFrom(address(this), msg.sender, _tokenId);
        emit cancelList(_nftContract, _tokenId, msg.sender, _sellerId);
    }

    function buyWithUSDT(
        address _nftContract,
        uint256 _tokenId,
        uint256 _amount,
        uint8 _sellerPlan,
        uint8 _buyerPlan,
        uint256 sellerId,
        uint256 buyerId
    ) public payable isApproved(_tokenId) isUserBanned nonReentrant {
        NFT storage nft = _idToNFT[_tokenId];

        uint256 _sellerPercent = getSubscriptionFee(_sellerPlan);
        uint256 _buyerPercent = getSubscriptionFee(_buyerPlan);

        require(
            nft.seller != msg.sender,
            "An owner cannot purchase its own NFT."
        );
        require(nft.listed == true, "Nft is not listed to purchase");
        require(
            !bannedUsers[nft.seller],
            "The owner of this nft is blacklisted on this platform."
        );
        require(
            nft.listingType == ListingType.FixedPrice,
            "This NFT is not at auction"
        );
        uint256 texForBuyer = _buyerFeeCalculate(nft.price, _buyerPercent);

        uint256 usdtToEth = getUSDTIntoETH(_amount);

        require(
            usdtToEth >= (nft.price + texForBuyer),
            "Not enough amount to cover asking price"
        );

        bool check = true;
        uint256 _amountToBePaid;
        uint256 _amountAfterRoyalty;
        address payable buyer = payable(msg.sender);
        address seller = nft.seller;

        USDTtoken.transferFrom(msg.sender, address(this), _amount);

        if (!nft.royalty) {
            _amountToBePaid =
                _amount -
                platformFeeCalculate(_amount, _sellerPercent, _buyerPercent);

            if (nft.paymentMethod == PaymentMethod.USDT) {
                USDTtoken.transfer(nft.seller, _amountToBePaid);
                check = true;
            } else {
                // _amountToBePaid swap in ETH
                uint256 amountToSend = swapUSDTForETH(_amountToBePaid);
                payable(nft.seller).transfer(amountToSend);
                check = true;
            }
        } else {
            uint256 _royaltyFee = royaltyCalculate(_amount, nft.royaltyPrice);

            _amountAfterRoyalty = _amount - _royaltyFee;

            _amountToBePaid =
                _amountAfterRoyalty -
                platformFeeCalculate(_amount, _sellerPercent, _buyerPercent);

            USDTtoken.transfer(nft.firstOwner, _royaltyFee);

            if (nft.paymentMethod == PaymentMethod.USDT) {
                USDTtoken.transfer(nft.seller, _amountToBePaid);
                check = true;
            } else {
                // _amountToBePaid swap in ETH
                uint256 returnEth = swapUSDTForETH(_amountToBePaid);
                payable(nft.seller).transfer(returnEth);
                check = true;
            }
        }

        if (check) {
            IERC721(_nftContract).transferFrom(
                address(this),
                buyer,
                nft.tokenId
            );

            nft.owner = buyer;
            nft.seller = payable(address(0));
            nft.listed = false;
            _nftsSold++;

            emit NFTSold(
                _nftContract,
                nft.tokenId,
                _amount,
                seller,
                buyer,
                sellerId,
                buyerId
            );
        }
    }

    //Buy an NFT with ETH
    function buyWithETH(
        address _nftContract,
        uint256 _tokenId,
        uint8 _sellerPlan, //0x00
        uint8 _buyerPlan,
        uint256 sellerId,
        uint256 buyerId
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

        uint256 texForBuyer = _buyerFeeCalculate(nft.price, _buyerPercent);

        require(
            msg.value >= (nft.price + texForBuyer),
            "Not enough ether to cover asking price"
        );

        bool check = false;
        uint256 _amountToBePaid = msg.value;
        address payable buyer = payable(msg.sender);
        address seller = nft.seller;

        if (!nft.royalty) {
            _amountToBePaid =
                _amountToBePaid -
                platformFeeCalculate(nft.price, _sellerPercent, _buyerPercent);

            if (nft.paymentMethod == PaymentMethod.ETHER) {
                payable(nft.seller).transfer(_amountToBePaid);
                check = true;
            } else {
                uint256 usdtAmount = swapETHForUSDT(_amountToBePaid, 0); // 0 means msg.value
                USDTtoken.transfer(nft.seller, usdtAmount);
                check = true;
            }
        } else {
            uint256 _amount = _amountToBePaid;
            uint256 _royaltyFee = royaltyCalculate(nft.price, nft.royaltyPrice);

            _amountToBePaid =
                (_amount - _royaltyFee) -
                platformFeeCalculate(nft.price, _sellerPercent, _buyerPercent);

            payable(nft.firstOwner).transfer(_royaltyFee);

            if (nft.paymentMethod == PaymentMethod.ETHER) {
                payable(nft.seller).transfer(_amountToBePaid);
                check = true;
            } else {
                uint256 usdtAmount = swapETHForUSDT(_amountToBePaid, 1); // 0 means msg.value
                USDTtoken.transfer(nft.seller, usdtAmount);
                check = true;
            }
        }

        if (check) {
            IERC721(_nftContract).transferFrom(
                address(this),
                buyer,
                nft.tokenId
            );

            nft.owner = buyer;
            nft.seller = payable(address(0));
            nft.listed = false;
            _nftsSold++;

            emit NFTSold(
                _nftContract,
                nft.tokenId,
                msg.value,
                seller,
                buyer,
                sellerId,
                buyerId
            );
        }
    }

    //Buy an NFT with Fiat
    function buyWithFIAT(
        address _nftContract,
        uint256 _tokenId,
        uint8 _sellerPlan, //0x00
        address _buyerAddress,
        uint8 _buyerPlan,
        uint256 sellerId,
        uint256 buyerId
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

        uint256 texForBuyer = _buyerFeeCalculate(nft.price, _buyerPercent);

        require(msg.value >= (nft.price + texForBuyer),
            "Not enough ether to cover asking price"
        );

        bool check = false;
        uint256 _amountToBePaid = msg.value;
        address payable buyer = payable(_buyerAddress);
        address seller = nft.seller;

        if (!nft.royalty) {
            _amountToBePaid =
                _amountToBePaid -
                platformFeeCalculate(nft.price, _sellerPercent, _buyerPercent);

            if (nft.paymentMethod == PaymentMethod.ETHER) {
                payable(nft.seller).transfer(_amountToBePaid);
                check = true;
            } else {
                uint256 usdtAmount = swapETHForUSDT(_amountToBePaid, 0); // 0 means msg.value
                USDTtoken.transfer(nft.seller, usdtAmount);
                check = true;
            }
        } else {
            uint256 _amount = _amountToBePaid;
            uint256 _royaltyFee = royaltyCalculate(nft.price, nft.royaltyPrice);

            _amountToBePaid =
                (_amount - _royaltyFee) -
                platformFeeCalculate(nft.price, _sellerPercent, _buyerPercent);

            payable(nft.firstOwner).transfer(_royaltyFee);

            if (nft.paymentMethod == PaymentMethod.ETHER) {
                payable(nft.seller).transfer(_amountToBePaid);
                check = true;
            } else {
                uint256 usdtAmount = swapETHForUSDT(_amountToBePaid, 1); // 0 means msg.value
                USDTtoken.transfer(nft.seller, usdtAmount);
                check = true;
            }
        }

        if (check) {
            IERC721(_nftContract).transferFrom(
                address(this),
                buyer,
                nft.tokenId
            );

            nft.owner = buyer;
            nft.seller = payable(address(0));
            nft.listed = false;
            _nftsSold++;

            emit NFTSold(
                _nftContract,
                nft.tokenId,
                msg.value,
                seller,
                buyer,
                sellerId,
                buyerId
            );
        }
    }

    //Resell an NFT purchased from the marketplace
    function resellNft(
        address _nftContract,
        uint256 _tokenId,
        uint256 _price,
        uint256 _listingType,
        uint256 _startTime,
        uint256 _endTime,
        uint256 sellerId
    ) public isUserBanned nonReentrant {
        NFT storage nft = _idToNFT[_tokenId];

        require(_price > 0, "Price must be at least 1 wei");
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
        nft.royalty = true;

        if (_listingType == uint256(ListingType.Auction)) {
            _idToAuction[_tokenId] = Auction(
                _tokenId, // tokenId
                payable(msg.sender), // seller
                _price, // basePrice
                _startTime, // startTime
                _endTime, // endTime
                0,
                0, // highestBid
                payable(address(0)), // highestBidder
                nft.paymentMethod,
                150,
                true
            );
        }

        _nftsSold--;

        emit NFTListed(
            _nftContract,
            _tokenId,
            msg.sender,
            address(this),
            nft.firstOwner,
            _price,
            nft.collectionId,
            _listingType,
            sellerId
        );
    }

    function bidInETH(
        uint256 _tokenId,
        uint8 _buyerPlan
    ) public payable auctionIsLive(_tokenId) isApproved(_tokenId) isUserBanned {
        Auction storage auction = _idToAuction[_tokenId];
        NFT storage nft = _idToNFT[_tokenId];

        uint256 _buyerPlans = getSubscriptionFee(_buyerPlan);

        uint256 tax_amount = _buyerFeeCalculate(auction.basePrice, _buyerPlans);
        uint256 tax_amountOnBid = _buyerFeeCalculate(
            auction.highestBidIntoETH,
            _buyerPlans
        );

        bool check = false;
        require(msg.sender != nft.seller, "seller can't bid in auction");
        require(
            nft.listingType == ListingType.Auction,
            "This NFT is at at auction"
        );
        require(nft.listed == true, "Nft is not listed to purchase");
        require(
            msg.value >= (auction.basePrice + tax_amount),
            "Minimum bid has to be higher"
        );
        require(
            msg.value > (auction.highestBidIntoETH + tax_amountOnBid),
            "You have to bid higher than the highest bid to make an offer"
        );

        address payable prevBidder = auction.highestBidder;

        uint256 prevBidETH = auction.highestBidIntoETH;
        uint256 prevBidUSDT = auction.highestBidIntoUSDT;

        // handle previous highest bidder
        if (auction.highestBidder != address(0)) {
            if (auction.highestBidCurrency == PaymentMethod.USDT) {
                // uint256 prevAmount = getETHIntoUSDT(prevBid);
                USDTtoken.transfer(prevBidder, prevBidUSDT);
            } else if (auction.highestBidCurrency == PaymentMethod.ETHER) {
                payable(prevBidder).transfer(prevBidETH);
            }
        }

        auction.highestBidIntoETH = msg.value;
        auction.highestBidIntoUSDT = getETHIntoUSDT(msg.value);
        auction.highestBidder = payable(msg.sender);
        auction.highestBidCurrency = PaymentMethod(0);
        auction.buyerPlane = _buyerPlan;

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
                auction.highestBidIntoETH,
                auction.highestBidIntoUSDT
            );
        }
    }

    function bidInUSDT(
        uint256 _tokenId,
        uint256 _amount, // usdt in wei
        uint8 _buyerPlan
    ) public payable auctionIsLive(_tokenId) isApproved(_tokenId) isUserBanned {
        Auction storage auction = _idToAuction[_tokenId];
        NFT storage nft = _idToNFT[_tokenId];

        uint256 _buyerPlans = getSubscriptionFee(_buyerPlan);

        uint256 tax_amount = _sellerFeeCalculate(
            auction.basePrice,
            _buyerPlans
        );

        uint256 tax_amountOnBid = _sellerFeeCalculate(
            auction.highestBidIntoETH,
            _buyerPlans
        );

        bool check = false;

        uint256 usdtintoEth = getUSDTIntoETH(_amount);

        require(msg.sender != nft.seller, "seller can't bid in auction");
        require(
            usdtintoEth >= (auction.basePrice + tax_amount),
            "Minimum bid has to be higher"
        );
        require(
            usdtintoEth > (auction.highestBidIntoETH + tax_amountOnBid),
            "You have to bid higher than the highest bid to make an offer"
        );
        require(
            nft.listingType == ListingType.Auction,
            "This NFT is at at auction"
        );
        require(nft.listed == true, "Nft is not listed to purchase");

        USDTtoken.transferFrom(msg.sender, address(this), _amount);

        address payable prevBidder = auction.highestBidder;
        uint256 prevBidInETH = auction.highestBidIntoETH;
        uint256 prevBidInUSDT = auction.highestBidIntoUSDT;

        // handle previous highest bidder

        if (auction.highestBidder != address(0)) {
            if (auction.highestBidCurrency == PaymentMethod.USDT) {
                USDTtoken.transfer(prevBidder, prevBidInUSDT);
            } else if (auction.highestBidCurrency == PaymentMethod.ETHER) {
                payable(prevBidder).transfer(prevBidInETH);
            }
        }

        auction.highestBidIntoETH = usdtintoEth;
        auction.highestBidIntoUSDT = _amount;
        auction.highestBidder = payable(msg.sender);
        auction.highestBidCurrency = PaymentMethod(1);
        auction.buyerPlane = _buyerPlan;

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
                auction.highestBidIntoETH,
                auction.highestBidIntoUSDT
            );
        }
    }

    function closeAuction(
        address _nftContract,
        uint256 _tokenId,
        uint8 _sellerPlan,
        uint256 sellerId,
        uint256 buyerId
    ) public payable {
        NFT storage nft = _idToNFT[_tokenId];
        Auction storage auction = _idToAuction[_tokenId];

        bool transferred = false;
        uint256 _sellerPercent = getSubscriptionFee(_sellerPlan);
        uint256 _buyerPercent = getSubscriptionFee(auction.buyerPlane);
        address seller = nft.seller;

        // if there are no bids on an auction end the function there
        if (auction.highestBidder == address(0)) {
            require(
                msg.sender == auction.seller,
                "Only the seller can close the unsold auction"
            );

            IERC721(_nftContract).transferFrom(
                address(this),
                auction.seller,
                nft.tokenId
            );
            nft.listed = false;
            nft.owner = nft.seller;
            transferred = true;
        } else {
            require(
                msg.sender == auction.highestBidder ||
                    msg.sender == auction.seller,
                "Only the highest bidder and the seller can claim the NFT"
            );

            // UNCOMMENT THIS REQUIRE STATEMENT

            require(
                block.timestamp > auction.endTime,
                "Auction has not ended yet."
            );

            uint256 _royaltyFee;
            uint256 _amountInETH = auction.highestBidIntoETH; // alreay saving all bids in ether
            uint256 _amountInUSDT = auction.highestBidIntoUSDT;
            uint256 _amountToBePaid;

            // if the seller wants to be paid in ether
            if (nft.paymentMethod == PaymentMethod.ETHER) {
                ////////////////////////////
                /////////////SWAP///////////
                ////////////////////////////

                // if last bid is in USDT swap and update amount
                if (auction.highestBidCurrency == PaymentMethod.USDT) {
                    _amountToBePaid = swapUSDTForETH(_amountInUSDT);

                    if (!nft.royalty) {
                        _amountToBePaid =
                            _amountToBePaid -
                            platformFeeCalculate(
                                _amountToBePaid,
                                _sellerPercent,
                                _buyerPercent
                            );
                        payable(nft.seller).transfer(_amountToBePaid);
                    } else {
                        _royaltyFee = royaltyCalculate(
                            _amountToBePaid,
                            nft.royaltyPrice
                        );

                        _amountToBePaid =
                            (_amountToBePaid - _royaltyFee) -
                            platformFeeCalculate(
                                _amountToBePaid,
                                _sellerPercent,
                                _buyerPercent
                            );
                        payable(nft.firstOwner).transfer(_royaltyFee);
                        payable(nft.seller).transfer(_amountToBePaid);
                    }
                } else {
                    _amountToBePaid = _amountInETH;

                    if (!nft.royalty) {
                        _amountToBePaid =
                            _amountToBePaid -
                            platformFeeCalculate(
                                _amountToBePaid,
                                _sellerPercent,
                                _buyerPercent
                            );

                        payable(nft.seller).transfer(_amountToBePaid);
                    } else {
                        _royaltyFee = royaltyCalculate(
                            _amountToBePaid,
                            nft.royaltyPrice
                        );

                        _amountToBePaid =
                            (_amountToBePaid - _royaltyFee) -
                            platformFeeCalculate(
                                _amountToBePaid,
                                _sellerPercent,
                                _buyerPercent
                            );
                        payable(nft.firstOwner).transfer(_royaltyFee);
                        payable(nft.seller).transfer(_amountToBePaid);
                    }
                }

                // if the seller wants to be paid in USDT
            } else if (nft.paymentMethod == PaymentMethod.USDT) {
                ////////////////////////////
                /////////////SWAP///////////
                ////////////////////////////

                if (auction.highestBidCurrency == PaymentMethod.ETHER) {
                    _amountToBePaid = swapETHForUSDT(_amountInETH, 1);

                    if (!nft.royalty) {
                        _amountToBePaid =
                            _amountToBePaid -
                            platformFeeCalculate(
                                _amountToBePaid,
                                _sellerPercent,
                                _buyerPercent
                            );
                        USDTtoken.transfer(nft.seller, _amountToBePaid);
                    } else {
                        _royaltyFee = royaltyCalculate(
                            _amountToBePaid, // highest bid's price should be in USDT
                            nft.royaltyPrice
                        );

                        _amountToBePaid =
                            (_amountToBePaid - _royaltyFee) -
                            platformFeeCalculate(
                                _amountToBePaid,
                                _sellerPercent,
                                _buyerPercent
                            );

                        USDTtoken.transfer(nft.firstOwner, _royaltyFee);
                        USDTtoken.transfer(nft.seller, _amountToBePaid);
                    }
                } else {
                    _amountToBePaid = _amountInUSDT;

                    if (!nft.royalty) {
                        _amountToBePaid =
                            _amountToBePaid -
                            platformFeeCalculate(
                                _amountToBePaid,
                                _sellerPercent,
                                _buyerPercent
                            );
                        USDTtoken.transfer(nft.seller, _amountToBePaid);
                    } else {
                        _royaltyFee = royaltyCalculate(
                            _amountToBePaid, // highest bid's price should be in USDT
                            nft.royaltyPrice
                        );

                        _amountToBePaid =
                            (_amountToBePaid - _royaltyFee) -
                            platformFeeCalculate(
                                _amountToBePaid,
                                _sellerPercent,
                                _buyerPercent
                            );

                        USDTtoken.transfer(nft.firstOwner, _royaltyFee);
                        USDTtoken.transfer(nft.seller, _amountToBePaid);
                    }
                }
            }

            if (!transferred) {
                IERC721(_nftContract).transferFrom(
                    address(this),
                    auction.highestBidder,
                    nft.tokenId
                );
            }
            nft.owner = auction.highestBidder;
            nft.seller = payable(address(0));
            nft.listed = false;
            _nftsSold++;
        }

        emit NFTSold(
            _nftContract,
            nft.tokenId,
            auction.highestBidIntoETH,
            seller,
            auction.highestBidder,
            sellerId,
            buyerId
        );
    }

    function royaltyCalculate(
        uint256 _price,
        uint256 noOfBips
    ) private pure returns (uint256) {
        return (_price / 10000) * noOfBips; //100 means 1 %
    }

    function platformFeeCalculate(
        uint256 _amount,
        uint256 _sellerPercent,
        uint256 _buyerPercent
    ) internal pure returns (uint256) {
        uint256 _amountToDeduct;
        _amountToDeduct = (_amount / 10000) * _sellerPercent;
        _amountToDeduct = _amountToDeduct + ((_amount / 10000) * _buyerPercent);
        return _amountToDeduct;
    }

    function _buyerFeeCalculate(
        uint256 _amount,
        uint256 _buyerPercent
    ) internal pure returns (uint256) {
        return (_amount / 10000) * _buyerPercent;
    }

    function _sellerFeeCalculate(
        uint256 _amount,
        uint256 _sellerPercent
    ) internal pure returns (uint256) {
        return (_amount / 10000) * _sellerPercent;
    }

    function banUser(address _user, bool _status) public onlyOwner {
        bannedUsers[_user] = _status;
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
                    uint256 prevBidETH = auction.highestBidIntoETH;
                    uint256 prevBidUSDT = auction.highestBidIntoUSDT;

                    if (auction.highestBidCurrency == PaymentMethod.USDT) {
                        USDTtoken.transfer(prevBidder, prevBidUSDT);
                    } else if (
                        auction.highestBidCurrency == PaymentMethod.ETHER
                    ) {
                        payable(prevBidder).transfer(prevBidETH);
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

    //yeh function apko usdt ke against kitne ETH miln ga yeh bataiga
    function getUSDTIntoETH(
        uint256 usdtAmountIn
    ) public view returns (uint256) {
        address[] memory path = new address[](2);
        path[0] = USDT_ADDRESS;
        path[1] = uniswapRouter.WETH();

        uint256[] memory amountsOut = new uint256[](2);
        amountsOut = uniswapRouter.getAmountsOut(usdtAmountIn, path);

        return amountsOut[1];
    }

    //yeh function apko eth ke against kitne USDT miln ga yeh bataiga
    function getETHIntoUSDT(uint256 EthAmountIn) public view returns (uint256) {
        address[] memory path = new address[](2);
        path[0] = uniswapRouter.WETH();
        path[1] = USDT_ADDRESS;

        uint256[] memory amountsOut = new uint256[](2);
        amountsOut = uniswapRouter.getAmountsOut(EthAmountIn, path);

        return amountsOut[1];
    }

    //yeh function apko jine eth chaiyn aske against kitne usdt dene hnga bataiga
    function getETHOutUSDTInOutPut(
        uint256 EthAmountOut
    ) public view returns (uint256) {
        address[] memory path = new address[](2);
        path[0] = USDT_ADDRESS;
        path[1] = uniswapRouter.WETH();

        uint256[] memory amountsOut = new uint256[](2);
        amountsOut = uniswapRouter.getAmountsIn(EthAmountOut, path);
        //apko itne USDT dene hnga
        return amountsOut[0];
    }

    //yeh function apko jine eth chaiyn aske against kitne usdt dene hnga bataiga
    function getUSDTOutETHInOutPut(
        uint256 USDTAmountOut
    ) public view returns (uint256) {
        address[] memory path = new address[](2);
        path[0] = uniswapRouter.WETH();
        path[1] = USDT_ADDRESS;

        uint256[] memory amountsOut = new uint256[](2);
        amountsOut = uniswapRouter.getAmountsIn(USDTAmountOut, path);
        //apko itne USDT dene hnga
        return amountsOut[0];
    }

    function getCollectionNfts(
        uint256 _collectionId
    ) public view returns (NFT[] memory) {
        uint256 nftCount = _nftCount;
        uint256 unsoldNftsCount = nftCount - _nftsSold;

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
        uint256 nftCount = _nftCount;
        uint256 unsoldNftsCount = nftCount - _nftsSold;

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
        uint nftCount = _nftCount;
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
        uint nftCount = _nftCount;
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
        uint nftCount = _nftCount;
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
