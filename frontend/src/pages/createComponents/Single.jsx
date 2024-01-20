import React from "react";
import Header from "../landingpage/Header";
import Footer from "../landingpage/Footer";
import PageTopSection from "../../components/shared/PageTopSection";
import { useState, useEffect, useRef, useContext } from "react";
import { AiFillTag } from "react-icons/ai";
import { BsFillClockFill } from "react-icons/bs";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Slider from "rc-slider";
import { ethers } from "ethers";
import { uploadFileToIPFS, uploadJSONToIPFS } from "./pinanta";
import Search from "../../components/shared/Search";
import { useNavigate } from "react-router-dom";
import apis from "../../service/index";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/shared/Loader";
import { Store } from "../../Context/Store";

const Single = ({ search, setSearch }) => {

  const [loading, setLoading] = useState(false);
  
  const [showWarning, setShowWarning] = useState(false);
  const id = JSON.parse(localStorage.getItem("data"));
  const user_id = id?.id;

  const navigate = useNavigate();

  const { account, checkIsWalletConnected, getSignerMarketContrat, getSignerNFTContrat } = useContext(Store);

  const [listingType, setListingType] = useState(0);
  const [startingDate, setStartingDate] = useState(0);
  const [endingDate, setEndingDate] = useState(0);
  const [showCollection, setshowcollection] = useState(false);
  const [crypto, setCrypto] = useState({ value: 0, label: "ETH" });
  const [collection, setCollection] = useState("");
  const [royalty, setRoyalty] = useState(0);
  const [royaltyValue, setRoyaltyValue] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [displayImage, setDisplayImage] = useState("");
  const [price, setPrice]=useState("")
  const [showValue, setShowValue]=useState("");
  const [pinataImage ,setPinataImage]=useState("")
  const [description, setDescription]=useState("");
  const [title,setTitle]=useState("");
  const [startTime,setStartTime]=useState("");
  const [endTime, setEndTime]=useState(0);
    
  const [collectionOptions, setcollectionOptions] = useState([]);
  
  const [collectionName, setCreateCollection] = useState("");
  const [selectedImage2, setSelectedImage2] = useState(null); //collection Image
  const [showCreateCollection, setshowCreateCollection] = useState(false);
  
  const [collectionFinalized, setcollectionFinalized] = useState(false);
  const [isSingleSubmit, setIsSingleSubmit] = useState(false)
  
  
  let mintcounter = 0;
  let listcounter = 0;


  useEffect(() => {
    checkIsWalletConnected()
  }, [account])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const getCollection = async () => {
    const response = await apis.getNFTCollection(user_id);
    if (response?.status) {
  
      for (let i = 0; i < response?.data?.data?.length; i++) {
        let type = response?.data?.data[i]?.payment_type;

        if (type == "eth") {
          setcollectionOptions((previousOptions) => [
            ...previousOptions,
            {
              collection_id: response?.data?.data[i]?.id,
              label: response?.data?.data[i]?.name,
              image: response?.data?.data[i]?.media[0]?.original_url,
              crypto: 0,
            },
          ]);
        }
        if (type == "usdt") {
          setcollectionOptions((previousOptions) => [
            ...previousOptions,
            {
              collection_id: response?.data?.data[i]?.id,
              label: response?.data?.data[i]?.name,
              image: response?.data?.data[i]?.media[0]?.original_url,
              crypto: 1,
            },
          ]);
        }
      }
    }
  };

  const postSingleCollection = async () => {
    let cryptoType;

    if (collectionName.length < 1 || !selectedImage2) {
      toast.warning("All fields are required", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      if (crypto.value === 0) {
        cryptoType = "eth";
      } else if (crypto.value === 1) {
        cryptoType = "usdt";
      }
      const sendData = new FormData();
      sendData.append("user_id", user_id);
      sendData.append("name", collectionName);
      sendData.append("payment_type", cryptoType);
      sendData.append("image", selectedImage2);

      try {
        setLoading(true);
        const response = await apis.postNFTCollection(sendData);

        if (response.status) {
          toast.success(response?.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
          getCollection();
          setshowCreateCollection(false);
        }

        setLoading(false);
      }
      catch (e) {
        setLoading(false);
        console.log(e?.message, "EEEEEEEEEEEEEEEEEEEEE")
        toast.warning(e?.message)

      }

    }
  };

  // console.log(startingDate,"startDate")

  useEffect(() => {
    getCollection();
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setShowValue(value);
      let pricesss = ethers.utils.parseEther(value?.toString())
      setPrice(pricesss);
      setShowWarning(false);
    } else {
      setShowWarning(true);
    }
  };
  //pehly saai requitments pori kro fr upload oor mint or list kro

  const uploadToIPFS = async (e) => {
      e.preventDefault()
      setIsSingleSubmit(true);
      if (listingType == 0) {
        // console.log("startTimestamp in if", startingDate);
        // console.log("endTimestamp in if", endingDate);
        setStartTime(0)
        setEndTime(0)
        setStartingDate(0)
        setEndingDate(0)
      } 
      else if (listingType == 1) {
        const startDate = new Date(startingDate);
        const endDate = new Date(endingDate);
        const startTimestamp = Math.floor(startDate.getTime() / 1000)
        setStartTime(startTimestamp)
        const endTimestamp = Math.floor(endDate.getTime() / 1000); 
        setEndTime(endTimestamp)
        if (startTimestamp >= endTimestamp) return setEndingDate(0), setIsSingleSubmit(false), toast.error("Expire date must be grather than start date", {
          position: toast.POSITION.TOP_CENTER,
        });
      }

  if (!title || !description) return setIsSingleSubmit(false), toast.error("someThingWrong");
  
  if (typeof selectedImage !== "undefined") {
    try {
      setLoading(true);
      // console.log("this is image selectedImage ", selectedImage);
      const resut = await uploadFileToIPFS(selectedImage);
      console.log("Result.pinata", resut?.pinataURL);
      setPinataImage(resut?.pinataURL);
      setLoading(false);
      createNFT(resut?.pinataURL);
    } catch (error) {
      setLoading(false);
      console.log("ipfs image upload error: ", error);
    }
  }
};

  // Upload image and data to IPFS
  const createNFT = async (ImageUrl) => {
    if(!ImageUrl) return setIsSingleSubmit(false), toast.error("Image Url Undefined"); 
    
    const nftJSON = {
        "description": `${description}`,
        "image": `${ImageUrl}`,
        "title": `${title}`
        // "collection": `${1}`,
        // "listingType": `${listingType}`,
        // "price": `${price}`,
        // "crypto": `${collection?.crypto}`,
        // "royalty": `${royaltyValue}`
      }
      
      try {
        const result = await uploadJSONToIPFS(nftJSON);
        console.log("uploadJSONToIPFS", result.pinataURL);
        mintThenList(result?.pinataURL);
      } catch (error) {
        console.log("ipfs uri upload error: ", error);
        setIsSingleSubmit(false)
      }
  }

  let singleMinting = false;

  const mintThenList = async (result) => {
    mintcounter += 1;
    try {
      singleMinting= true;
     let minted =  await getSignerNFTContrat().mint([result], {
        gasLimit: ethers.BigNumber.from("5000000"),
      });
      minted.wait();
      console.log("NFT minting is complete!",minted);
      await getSignerNFTContrat().on("NFTMinted",handleNFTMintedEvent2);
    } catch (error) {
      setIsSingleSubmit(false)
      console.error("Error while minting NFT:", error);
      throw error;
    }
  };

  const handleNFTMintedEvent2 = async (mintedTokens) => {

    let tokenId = mintedTokens[0]?.toString();
    
    listcounter += 1;
    try {

      const startDate = new Date(startingDate);
      const endDate = new Date(endingDate);
      const startTimestamp = Math.floor(startDate.getTime() / 1000)
      const endTimestamp = Math.floor(endDate.getTime() / 1000); 

      console.log("data", tokenId);
      console.log("data", startTimestamp);
      console.log("data", endTimestamp);
      console.log("data", collection?.collection_id);
      console.log("data",listingType);
      console.log("data",royaltyValue);
      console.log("data",price?.toString());

       let listed =  await getSignerMarketContrat().listNft(
          getSignerNFTContrat().address,
          [tokenId],
          [price], // list
          [royaltyValue],
          listingType,
          [startTimestamp], // list
          [endTimestamp], // list
          collection?.collection_id, // collection number
          collection?.crypto,
          user_id,
          {
            gasLimit: ethers.BigNumber.from("5000000"),
          }
        );

      listed.wait();
      console.log("NFT listing is complete!");
      await getSignerMarketContrat().on("NFTListed", handleNFTListedEvent2);
    } catch (error) {
      setIsSingleSubmit(false)
      toast.error(`Error while listing NFT: ${error}`, {
        position: toast.POSITION.TOP_CENTER,
      });
      throw error; // Rethrow the error to be caught in the higher level function if necessary
    }
  };

  const handleNFTListedEvent2 = async (
    nftContract,
    tokenId,
    seller,
    owner,
    price,
    collectionId,
    listingType
  ) => {
    console.log("handleNFTListedEvent2");

      let listedData = {
        title: title,
        token_id: tokenId?.toString(),
        seller: seller?.toString(),
        owner: owner?.toString(),
        price: price?.toString(),
        collection_id: collectionId?.toString(),
        listing_type: listingType?.toString(),
        user_id: user_id
      };
      nftDataPost(listedData);
  };

  const nftDataPost = async (listedData) => {
    // const response = await apis.postListNft(listedData);
    if (true) {
      setIsSingleSubmit(false)
      toast.success("NFT listed", {
        position: toast.POSITION.TOP_CENTER,
      });
      setIsSingleSubmit(false)
      window.location.reload();
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
      
    } else {
      setIsSingleSubmit(false)
    }
  };

  const cryptoOptions = [
    { value: "", label: "Select Crypto" },
    { value: 0, label: "ETH" },
    { value: 1, label: "USDT" },
  ];
  
  const defaultCrypto = cryptoOptions[0];


  const handleSliderChange = (value) => {
    // Update the value or perform any other actions
    // console.log("Slider value:", value);
    setRoyalty(value);
    setRoyaltyValue(value * 100)
  };


  const hideCreateCollection = () => {
    setCreateCollection("");
    setshowCreateCollection(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setDisplayImage(URL.createObjectURL(file));
    setSelectedImage(file);
  };

  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleInputChange2 = (e) => {
    const file = e.target.files[0];
    setSelectedImage2(file);
  };

  console.log("Renderrrrr");

  return (
    <>
      {isSingleSubmit && <Loader />}
      <Header search={search} setSearch={setSearch} />
      <div className="create-single">
        <PageTopSection title={"Create Single Collectible"} />
        <div className="create-single-section-wrap">
          <form onSubmit={uploadToIPFS} type="button">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 mx-auto">
                  <div className="row">
                    {!collectionFinalized && (
                      <>
                        <div className="line-three">
                          <div className="row">
                            <div className="col-lg-12">
                              <h2>Choose collection</h2>
                              <p>
                                This is the collection where your item will
                                appear.
                              </p>
                              <div
                                className="custom-drop-down"
                                onClick={() =>
                                  setshowcollection(!showCollection)
                                }
                              >
                                <div className="drop-down-select">
                                  {collection == "" ? (
                                    <p>Select collection...</p>
                                  ) : (
                                    <p>{collection?.label}</p>
                                  )}
                                  {collectionOptions?.length > 0 && (
                                    <MdOutlineKeyboardArrowDown />
                                  )}
                                </div>
                                <div className="dropdown-list-wrap">
                                  {showCollection && (
                                    <ul>
                                      {collectionOptions.length > 0 ? (
                                        <>
                                          {collectionOptions.map(
                                            (value, index) => {
                                              return (
                                                <li
                                                  key={index}
                                                  className={`${collection?.label ===
                                                    value?.label
                                                    ? "is-selected"
                                                    : ""
                                                    }`}
                                                  onClick={() => {
                                                    setCollection(
                                                      collectionOptions[index]
                                                    )}}
                                                >
                                                  {value?.label}
                                                </li>
                                              );
                                            }
                                          )}
                                        </>
                                      ) : (
                                        <li>Collection is empty</li>
                                      )}
                                    </ul>
                                  )}
                                </div>
                              </div>
                              {/* <Dropdown
                                options={collectionOptions}
                                onChange={(e) => {
                                }}
                                defaultValue={ collection.collection_id}
                              /> */}
                              <div
                                className="create-collection-btn"
                                onClick={() => setshowCreateCollection(true)}
                              >
                                <svg
                                  enableBackground="new 0 0 50 50"
                                  height="25px"
                                  id="Layer_1"
                                  version="1.1"
                                  viewBox="0 0 50 50"
                                  width="25px"
                                  xmlSpace="preserve"
                                  xmlns="http://www.w3.org/2000/svg"
                                  xmlnsXlink="http://www.w3.org/1999/xlink"
                                >
                                  <rect fill="none" height="50" width="50" />
                                  <line
                                    fill="#2638CC"
                                    stroke="#2638CC"
                                    strokeMiterlimit="10"
                                    strokeWidth="4"
                                    x1="9"
                                    x2="41"
                                    y1="25"
                                    y2="25"
                                  />
                                  <line
                                    fill="#2638CC"
                                    stroke="#2638CC"
                                    strokeMiterlimit="10"
                                    strokeWidth="4"
                                    x1="25"
                                    x2="25"
                                    y1="9"
                                    y2="41"
                                  />
                                </svg>
                                Create Collection
                              </div>
                              {showCreateCollection && (
                                <div className="Create-collection-popup">
                                  <div className="Create-collection-popup-inner">
                                    <div className="Create-collection-wrap">
                                      <div className="left">
                                        <p>Collection Name</p>
                                        <input
                                        value={collectionName}
                                        onChange={(e) =>{
                                          const newValue = e.target.value.replace(/[^a-zA-Z]/g, '');
                                          setCreateCollection(newValue)
                                        }}
                                        type="text"
                                        placeholder="Enter collection name"
                                      />
                                      </div>
                                      <div className="right">
                                        <h2>Crypto</h2>
                                        <Dropdown
                                          options={cryptoOptions}
                                          onChange={(e) => {
                                            setCrypto(e);
                                          }}
                                          value={defaultCrypto.value}
                                        />
                                      </div>
                                    </div>
                                    <p className="txt-2">Upload Collection Image</p>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleInputChange2}
                                    />

                                    <div className="popUp-btn-group">
                                      <div
                                        onClick={hideCreateCollection}
                                        className="button-styling-outline btnCC"
                                      >
                                        <div className="btnCCin">Cancel</div>
                                      </div>
                                      <div
                                        className="button-styling btnCC"
                                        disabled={loading}
                                        onClick={() => {
                                          if (!loading) {
                                            // AddCollection();
                                            postSingleCollection();
                                          }
                                        }}
                                      >
                                        {loading ? "Loading" : "Create"}

                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {collection == "" ? (
                                <div
                                  className="browse-btn my-5 button-styling"
                                  style={{ background: "gray" }}
                                >
                                  Next
                                </div>
                              ) : (
                                <div
                                  onClick={() => {
                                    setcollectionFinalized(true);
                                    // notify();
                                  }}
                                  className="browse-btn my-5 button-styling"
                                >
                                  Next
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {collectionFinalized && (
                      <>
                        <div className="col-lg-8 mx-auto collectionDivPreview">
                          <div className="img-holder">
                            <img src={collection.image} alt="" />
                          </div>
                          {/* <div className="title">
                            Collection Name

                          </div> */}
                          <div className="title-txt">{collection?.label}</div>
                        </div>
                        <div className="col-lg-12">
                          <div className="upload-file">
                            <h2>Upload file</h2>
                            {displayImage == "" ? (
                              <div className="browseforSingle">
                                {!selectedImage ? (
                                  <p>PNG, JPG, GIF, WEBP or MP4. Max 200mb.</p>
                                ) : (
                                  <p>
                                    Uploaded successfully, want to upload
                                    another?
                                  </p>
                                )}
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept="image/*"
                                  style={{ display: "none" }}
                                  onChange={handleImageUpload}
                                />
                                <br />
                                <div
                                  onClick={handleButtonClick}
                                  className="button-styling" style={{ cursor: "pointer" }}
                                >
                                  Browse
                                </div>
                              </div>
                            ) : (
                              <div className="single-net-image">
                                <img src={displayImage} alt="" />
                                {/* <RxCross2/> */}
                                <span
                                  onClick={() => {
                                    setDisplayImage("");
                                    selectedImage(null);
                                  }}
                                >
                                  x
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="line-one">
                          <div className="row">
                            <div className="col-lg-12">
                              <h2>Select method</h2>
                            </div>
                            <div className="col-lg-3 col-md-4 col-6">
                              <div
                                onClick={() => {
                                  setListingType(0);
                                }}
                                className={` create-single-card ${listingType === 0 ? "active" : ""
                                  }`}
                              >
                                <AiFillTag />
                                <h3>Fixed Price</h3>
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-6">
                              <div
                                onClick={() => {
                                  setListingType(1);
                                }}
                                className={` create-single-card ${listingType === 1 ? "active" : ""
                                  }`}
                              >
                                <BsFillClockFill />
                                <h3>Timed Auction</h3>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="line-four">
                          <div className="row">
                            <div className="col-lg-9">
                              <h2>Title</h2>
                              <input
                                type="text"
                                placeholder="e.g. ‘Crypto Funk"
                                onChange={(e) => setTitle(e.target.value)}
                                defaultValue={title}
              
                              />
                            </div>
                          </div>
                        </div>
                        <div className="line-five">
                          <div className="row">
                            <div className="col-lg-9">
                              <h2>Description</h2>
                              <input
                                type="text"
                                onChange={(e)=>setDescription(e.target.value)}
                                placeholder="‘This is very limited item’"
                                defaultValue={description}
                                
                              />
                            </div>
                          </div>
                        </div>
                        {listingType === 0 ? (
                          <div className="line-two">
                            <div className="row">
                              <div className="col-lg-12 col-md-12 col-12">
                                <h2>Price</h2>
                                <input
                                  type="text"
                                  defaultValue={showValue}
                                  onChange={handleInputChange}
                                // type="number"
                                // placeholder="0.00"
                                // ref={price}
                                />
                                {showWarning && (
                                  <p style={{ color: "red" }}>
                                    Please enter a valid positive number.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="line-two">
                              <div className="row">
                                <div className="col-lg-8">
                                  <h2>Minimum bid</h2>
                                  
                                  <input
                                    type="number"
                                    defaultValue={showValue}
                                    onChange={handleInputChange}
                                  // type="number"
                                  // placeholder="0.00"
                                  // ref={price}
                                  />
                                  {showWarning && (
                                    <p style={{ color: "red" }}>
                                      Please enter a valid positive number.
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="line-two">
                              <div className="row">
                                <div className="col-lg-6 col-md-6 col-6">
                                  <h2>Starting date</h2>
                                  <input
                                    id="startingTime"
                                    type="date"
                                    placeholder="mm/dd/yyyy"
                                    style={{ padding: "6px 10px 6px 15px" }}
                                    value={startingDate}
                                    onChange={(e) =>
                                      setStartingDate(e.target.value)
                                    }
                                    min={new Date().toISOString().split("T")[0]}
                                  />
                                </div>
                                <div className="col-lg-6 col-md-6 col-6">
                                  <h2>Expiration date</h2>
                                  <input
                                    id="endTime"
                                    type="date"
                                    placeholder="mm/dd/yyyy"
                                    style={{ padding: "6px 10px 6px 15px" }}
                                    value={endingDate}
                                    onChange={(e) =>
                                      setEndingDate(e.target.value)
                                    }
                                  min={startingDate}
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        <div className="line-six">
                          <div className="row">
                            <div className="col-lg-9">
                              <h2>Royalties</h2>
                              <Slider
                                min={0}
                                max={15}
                                defaultValue={0}
                                // step={null}
                                onChange={handleSliderChange}
                                value={royalty}
                              />
                            </div>
                            <div className="col-lg-3 ">
                              <div className="royality-value">{royalty} %</div>
                            </div>
                          </div>
                        </div>
                        <div className="line-seven">
                          <div className="row">
                            <div className="col-lg-12">
                              <div style={{ textAlign: 'right' }}>
                                {
                                  !isSingleSubmit ?
                                    <button type="submit" className="button-styling">
                                      {/* Create Item */}
                                      Mint
                                    </button> :
                                    <button className="button-styling" style={{ background: "gray" }} disabled>
                                      {/* Create Item */}
                                      Mint
                                    </button>
                                }

                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>


        </div>
        <Search search={search} setSearch={setSearch} />
        <Footer />
      </div>
    </>
  );
};

export default Single;