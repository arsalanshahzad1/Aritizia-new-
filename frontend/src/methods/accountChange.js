// // Import the necessary dependencies
// import { useEffect } from "react";

// const AccountChangeDetector = () => {
//   useEffect(() => {
//     const handleAccountChange = (accounts) => {
//       // The 'accounts' parameter contains the updated accounts array.
//       // If it's an empty array, it means the user disconnected from MetaMask.
//       if (accounts.length === 0) {
//         // Handle account disconnection or user logged out from MetaMask.
//         console.log("User disconnected from MetaMask.");
//       } else {
//         // Handle the case when the user switches to a different account in MetaMask.
//         console.log("User switched to a new account:", accounts[0]);
//       }
//     };

//     // Check if the 'ethereum' object is available (MetaMask installed and active)
//     if (window.ethereum) {
//       // Add the event listener for account changes.
//       window.ethereum.on("accountsChanged", handleAccountChange);

//       // Remove the event listener when the component unmounts to avoid memory leaks.
//       return () => {
//         window.ethereum.off("accountsChanged", handleAccountChange);
//       };
//     } else {
//       // MetaMask is not available, handle this scenario if needed.
//       console.log("MetaMask is not available.");
//     }
//   }, []);

//   // Placeholder component; you can ignore or use it to wrap your application.
//   return null;
// };

// export default AccountChangeDetector;
