// import React from "react";
// import Header from "../landingpage/Header";
// import Footer from "../landingpage/Footer";
// import PageTopSection from "../../components/shared/PageTopSection";
// import { useState } from "react";
// import { FileUploader } from "react-drag-drop-files";
// import { AiFillTag } from "react-icons/ai";
// import { BsFillClockFill } from "react-icons/bs";
// import Dropdown from "react-dropdown";
// import "react-dropdown/style.css";
// import Slider from "rc-slider";

// const fileTypes = ["JPG", "PNG", "GIF"];

// const Multiple = () => {
//   const [file, setFile] = useState(null);
//   const handleChange = (file) => {
//     setFile(file);
//     console.log("FILE:", file);
//   };

//   const [crypto, setCrypto] = useState({ value: "eth", label: "ETH" });
//   const [collection, setCollection] = useState({
//     value: "",
//     label: "Select Collection",
//   });

//   const [activeMethod, setActiveMethod] = useState("fixedPrice");

//   const cryptoOptions = [
//     { value: "eth", label: "ETH" },
//     { value: "usdt", label: "USDT" },
//     { value: "usdc", label: "USDC" },
//   ];
//   const collectionOptions = [
//     { value: "", label: "Select Collection" },
//     { value: "usdt", label: "USDT" },
//     { value: "usdc", label: "USDC" },
//   ];

//   const [sliderValue, setSliderValue] = useState(0);

//   const handleSliderChange = (value) => {
//     setSliderValue(value);
//   };
//   return (
//     <>
//       <Header />
//       <div className="create-single">
//         <PageTopSection title={"Create Multiple Collectible"} />
//         <div className="create-single-section-wrap">
//           <div className="container">
//             <div className="row">
//               <div className="col-lg-8 mx-auto">
//                 <div className="row">
//                   <div className="col-lg-12">
//                     <div className="upload-file">
//                       <h2>Upload file</h2>
//                       <FileUploader
//                         handleChange={handleChange}
//                         multiple
//                         name="file"
//                         types={fileTypes}
//                         label="PNG, JPG, GIF, WEBP or MP4. Max 200mb."
//                       />
//                       <button
//                         handleChange={handleChange}
//                         className="button-styling single-button"
//                       >
//                         Browse
//                       </button>
//                     </div>
//                   </div>
//                   <div className="line-one">
//                     <div className="row">
//                       <div className="col-lg-12">
//                         <h2>Select method</h2>
//                       </div>
//                       <div className="col-lg-3 col-md-4 col-6">
//                         <div
//                           onClick={() => {
//                             setActiveMethod("fixedPrice");
//                           }}
//                           className={` create-single-card ${
//                             activeMethod === "fixedPrice" ? "active" : ""
//                           }`}
//                         >
//                           <AiFillTag />
//                           <h3>Fixed Price</h3>
//                         </div>
//                       </div>
//                       <div className="col-lg-3 col-md-4 col-6">
//                         <div
//                           onClick={() => {
//                             setActiveMethod("timedAuction");
//                           }}
//                           className={` create-single-card ${
//                             activeMethod === "timedAuction" ? "active" : ""
//                           }`}
//                         >
//                           <BsFillClockFill />
//                           <h3>Timed Auction</h3>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="line-two">
//                     <div className="row">
//                       <div className="col-lg-9 col-md-9 col-7">
//                         <h2>Price</h2>
//                         <input type="number" placeholder="0.00" />
//                       </div>
//                       <div className="col-lg-3 col-md-3 col-5">
//                         <h2>Crypto</h2>
//                         <Dropdown
//                           options={cryptoOptions}
//                           onChange={(e) => {
//                             setCrypto(e);
//                           }}
//                           value={crypto.label}
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="line-three">
//                     <div className="row">
//                       <div className="col-lg-12">
//                         <h2>Choose collection</h2>
//                         <p>
//                           This is the collection where your item will appear.
//                         </p>
//                         <Dropdown
//                           options={collectionOptions}
//                           onChange={(e) => {
//                             setCollection(e);
//                           }}
//                           value={collection.label}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="line-four">
//                     <div className="row">
//                       <div className="col-lg-9">
//                         <h2>Title</h2>
//                         <input type="text" placeholder="e.g. ‘Crypto Funk" />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="line-five">
//                     <div className="row">
//                       <div className="col-lg-9">
//                         <h2>Description</h2>
//                         <input
//                           type="text"
//                           placeholder="e.g. ‘This is very limited item’"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="line-six">
//                     <div className="row">
//                       <div className="col-lg-9">
//                         <h2>Royalties</h2>
//                         <Slider
//                           min={0}
//                           defaultValue={0}
//                           marks={{ 0: "0%", 45: "5%", 70: "10%", 100: "15%" }}
//                           step={null}
//                           value={sliderValue}
//                           onChange={handleSliderChange}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div className="line-seven">
//                     <div className="row">
//                       <div className="col-lg-8">
//                         <button className="button-styling">Create Item</button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     </>
//   );
// };

// export default Multiple;
