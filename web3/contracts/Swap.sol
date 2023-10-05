// pragma solidity ^0.8.0;

// interface IUniswapRouter {
//     function swapTokensForExactETH(uint256, uint256, address[] calldata, address, uint256) external returns (uint256[] memory);
//     function swapExactETHForTokens(uint256, address[] calldata, address, uint256) external payable returns (uint256[] memory);
// }

// contract NFTMarketplace {
//     address private constant UNISWAP_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
//     address private constant USDT_ADDRESS = "0x217C98b8F569D8c00fbe665A58Ee3cC4207106fB";

//     IUniswapRouter private uniswapRouter;

//     constructor() {
//         uniswapRouter = IUniswapRouter(UNISWAP_ROUTER_ADDRESS);
//     }

//     // Function to swap USDT for ETH
//     function swapUSDTForETH(uint256 usdtAmountIn) external {
//         address[] memory path = new address[](2);
//         path[0] = USDT_ADDRESS;
//         path[1] = uniswapRouter.WETH();

//         // Approve the Uniswap Router to spend the USDT
//         IERC20 usdtToken = IERC20(USDT_ADDRESS);
//         usdtToken.approve(UNISWAP_ROUTER_ADDRESS, usdtAmountIn);

//         // Perform the swap transaction
//         uniswapRouter.swapTokensForExactETH(usdtAmountIn, 0, path, address(this), block.timestamp);

//         // Transfer the received ETH to the desired recipient (User A)
//         payable(msg.sender).transfer(address(this).balance);
//     }

//     // Function to swap ETH for USDT
//     function swapETHForUSDT(uint256 usdtAmountOut) external payable {
//         // Specify the desired USDT output amount
//         // uint256 usdtAmountOut = 1000; // Example: Swap 1 ETH for 1000 USDT

//         // Prepare the swap path (ETH to USDT)
//         address[] memory path = new address[](2);
//         path[0] = uniswapRouter.WETH();
//         path[1] = USDT_ADDRESS;

//         // Perform the swap transaction
//         uniswapRouter.swapExactETHForTokens{value: msg.value}(usdtAmountOut, path, address(this), block.timestamp);
        
//         // Transfer the received USDT to the desired recipient (User A)
//         IERC20 usdtToken = IERC20(USDT_ADDRESS);
//         uint256 receivedUSDTAmount = usdtToken.balanceOf(address(this));
//         require(receivedUSDTAmount >= usdtAmountOut, "Insufficient USDT balance in the contract");
//         usdtToken.transfer(msg.sender, usdtAmountOut);
//     }
// }
