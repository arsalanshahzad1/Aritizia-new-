import React from 'react'
import { useContext, useRef, useState } from 'react'
import Header from './landingpage/Header'
import bird from '../../public/assets/images/bird.png'
import { GlobalContext } from '../Context/GlobalContext'
import ArtItem from './ArtItem'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TNL } from 'tnl-midjourney-api';
import apis from '../service'
import Loader from '../components/shared/Loader'
import { ToastContainer, toast } from "react-toastify";
import Footer from './landingpage/Footer'
import GalleryLoader from '../components/shared/GalleryLoader'
const Art = ({ search, setSearch, loader, setLoader }) => {
    const navigate = useNavigate()
    // const [loader, setLoader] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const { prompt, setprompt } = useContext(GlobalContext)
    const [generatedArts, setgeneratedArts] = useState([])
    const [base64Images, setBase64Images] = useState()
    const [selectCount, setSelectCount] = useState(0)
    const [promptCalculator, setPromptCalculator] = useState('')
    const buttonRef = useRef(null);
    const id = JSON.parse(localStorage.getItem("data"));
    const user_id = id?.id;
    const [prevSearchList, setPrevSearchList] = useState([]);
    const [inputOptions, setInputOptions] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("data")));
    const inputRef = useRef(null);

    const viewRemainingArtGallery = async (user_id) => {
        try {
            const response = await apis.viewRemainingArtGallery(user_id)
            setPromptCalculator(response?.data?.data)
            if (response?.data?.data?.remaining == 0) {
                setLoader(false)
                toast.error("No prompt avaliable", {
                    position: toast.POSITION.TOP_CENTER,
                });
            }
        } catch (error) {
            console.log(error, 'viewRemainingArtGallery');
        }
    }
    const generateArtGalleryImages = async (user_id, total_generates) => {
        try {
            const response = await apis.generateArtGalleryImages({ user_id: user_id, total_generates: total_generates });
            setPromptCalculator(response?.data?.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        viewRemainingArtGallery(user_id)
    }, [])

    useEffect(() => {
        const count = generatedArts.filter(item => item.selected).length;
        setSelectCount(count)
    }, [generatedArts])

    const handleSelectArt = (index) => {
        const updatedArts = [...generatedArts];
        updatedArts[index].selected = true;
        setgeneratedArts(updatedArts);
    };

    const handleUnselectArt = (index) => {
        const updatedArts = [...generatedArts];
        updatedArts[index].selected = false;
        setgeneratedArts(updatedArts);
    };



    const [midjourneyId, setMidjourneyId] = useState('')

    const convertImageUrlToImageFile = async (url, i) => {
        try {
            if (url.includes("http")) {
                // Download the image from the URL
                const imageUrl = url;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch image. Status: ${response.status}`);
                }

                // Convert the response data to a Blob
                const imageBlob = await response.blob();

                // Extract the file name from the URL or specify a custom name
                const urlParts = imageUrl.split('/');
                const fileName = urlParts[urlParts.length - 1] || 'image.jpg';

                // Create a File object from the Blob
                const file = new File([imageBlob], fileName, { type: response.headers.get('content-type') });
                return (
                    file
                )
            } else {
                const imageUrl = url;
                const response = await fetch(`data:image/png;base64,${url}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch image. Status: ${response.status}`);
                }

                // Convert the response data to a Blob
                const imageBlob = await response.blob();

                // Extract the file name from the URL or specify a custom name
                const urlParts = imageUrl.split('/');
                const fileName = `image${i}.png`;

                // Create a File object from the Blob
                const file = new File([imageBlob], fileName, { type: response.headers.get('content-type') });
                return (
                    file
                )

            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getMidjourneyId = async (event) => {
        if (promptCalculator?.remaining != 0) {
            event.preventDefault();
            setLoader(true)
            try {
                const response = await apis.getMidjourneyId({
                    "msg": prompt
                });

                if (response?.data?.success) {
                    console.log(response, "RESPONSE");

                    if (response?.data?.messageId) {
                        setMidjourneyId(response?.data?.messageId);
                    }
                }
            }

            catch (error) {
                getStabilityImages()
                // setLoader(false)
            }
        } else {
            toast.error("No prompt avaliable", {
                position: toast.POSITION.TOP_CENTER,
            });
            setLoader(false)
        }

    };

    const getMidjourneyImagesFromId = async () => {
        if (promptCalculator?.remaining > 0) {
            try {
                // const response = await apis.getMidjourneyImagesFromId()
                const response = await apis.getMidjourneyImagesFromId(midjourneyId)
                if (response?.data?.progress < 100 || response?.data?.progress == 'incomplete') {
                    getMidjourneyImagesFromId()
                } else {
                    const imageDataObject = [];
                    for (let i = 0; i < response?.data?.response?.imageUrls?.length; i++) {
                        try {
                            const imageUrl = response?.data?.response?.imageUrls?.[i];
                            const imageFile = await convertImageUrlToImageFile(imageUrl, i);
                            imageDataObject.push(imageFile);
                        } catch (error) {
                            console.error(`Error fetching image for URL ${response?.data?.response?.imageUrls?.[i]}:`, error);
                        }
                    }

                    const sendData = new FormData();
                    sendData.append('user_id', user_id);

                    for (let i = 0; i < imageDataObject.length; i++) {
                        sendData.append('media_file[]', imageDataObject[i]);
                    }

                    const resp = await apis.storeTempArtGallery(sendData);
                    try {
                     
                        let tempImages = []
                        for (let index = 0; index < resp?.data?.data?.media?.length; index++) {
                            tempImages.push({ image: resp?.data?.data?.media?.[index], selected: false })
                        }
                        setgeneratedArts(tempImages)
                        setprompt('')
                        generateArtGalleryImages(user_id, 4)
                        setLoader(false)
                        setMidjourneyId('')
                       
                    } catch (error) {
                       
                        getStabilityImages()
                        setMidjourneyId('')
                    }



                }
            } catch (error) {
                console.log('error');
                getStabilityImages()
                setMidjourneyId('')
                // setLoader(false) // need to remove
            }
        } else {
            toast.error("No prompt avaliable", {
                position: toast.POSITION.TOP_CENTER,
            });
            setLoader(false)
        }
    }


    useEffect(() => {
        if (midjourneyId !== '' && promptCalculator?.remaining != 0) {
            getMidjourneyImagesFromId()
        }

    }, [midjourneyId])

    useEffect(() => {
       
        if (prompt !== '') {
            viewRemainingArtGallery(user_id)
            buttonRef.current.click();
        }

    }, [])


    const getStabilityImages = async () => {
        if (promptCalculator?.remaining != 0) {
            // const body = {
            //     steps: 40,
            //     width: 512,
            //     height: 768,
            //     seed: 0,
            //     cfg_scale: 5,
            //     samples: 1,
            //     text_prompts: [
            //       {
            //         "text": prompt,
            //         "weight": 1
            //       },
            //       {
            //         "text": prompt,
            //         "weight": -1
            //       }
            //     ],
            //   };
            const body = {
                width: 512,
                height: 512,
                steps: 40, //50
                seed: 0, //10
                cfg_scale: 5,//10
                samples: 4,
                // steps: 50,
                // seed: 10,
                // cfg_scale: 10,
                // samples: 4,
                style_preset: "digital-art",
                text_prompts: [
                    {
                        text: prompt,
                        weight: 1,
                    }
                ],
            };

            try {
                const response = await apis.getStabilityImages(body);
                const urls = response.data.artifacts.map((image) => {
                    const byteCharacters = atob(image.base64);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: "image/png" });

                    const urlCreator = window.URL || window.webkitURL;
                    return urlCreator.createObjectURL(blob);
                });

                const imageDataObject = [];
                    for (let i = 0; i <urls?.length; i++) {
                        try {
                            const imageUrl = response?.data?.artifacts?.[i]?.base64;
                            const imageFile = await convertImageUrlToImageFile(imageUrl, i);
                            imageDataObject.push(imageFile);
                        } catch (error) {
                            console.error(`Error fetching image for URL ${response?.data?.artifacts?.[i]}:`, error);
                        }
                    }
               
                    const sendData = new FormData();
                    sendData.append('user_id', user_id);

                    for (let i = 0; i < imageDataObject.length; i++) {
                        sendData.append('media_file[]', imageDataObject[i]);
                    }

                    const resp = await apis.storeTempArtGallery(sendData);
                    try {
                       
                        let tempImages = []
                        for (let index = 0; index < resp?.data?.data?.media?.length; index++) {
                            tempImages.push({ image: resp?.data?.data?.media?.[index], selected: false })
                        }
                        setgeneratedArts(tempImages)
                        setprompt('')
                        generateArtGalleryImages(user_id, 4)
                        setLoader(false)
                    } catch (error) {
                        console.log(error)   
                  setLoader(false)
                    }


                // let tempImages = []
                // for (let index = 0; index < urls.length; index++) {
                //     tempImages.push({ image: urls?.[index], selected: false, base64Images: response?.data?.artifacts?.[index]?.base64 })
                // }
                // console.log(response, "data");

                // setgeneratedArts(tempImages);
                // setprompt('')
                setLoader(false)
                // generateArtGalleryImages(user_id, 4)
            } catch (error) {
                console.error("Error fetching data:", error);
                setgeneratedArts([])
                setErrorMessage('Oops something went wrong, please try again')
                setLoader(false)
                setprompt('')
            }
        } else {
            toast.error("No prompt avaliable", {
                position: toast.POSITION.TOP_CENTER,
            });
            setLoader(false)
        }

    };

    const saveToGallery = async () => {
        setLoader(true)
        let readyTobeSaved;
        if (generatedArts?.[0].base64Images) {
            readyTobeSaved = generatedArts.filter(item => item.selected).map(item => item.base64Images)
        } else {
            readyTobeSaved = generatedArts.filter(item => item.selected).map(item => item.image)
        }

        const sendData = new FormData();
        sendData.append('user_id', user_id);

        for (let i = 0; i < readyTobeSaved.length; i++) {
            sendData.append('gallery_images[]', readyTobeSaved[i]);
        }

        try {
            const response = await apis.createArtGalleryImages(sendData);
            if (response.status) {
                // const res = await apis.deleteTempArtGallery({'user_id': user_id})
                setprompt('')
                setTimeout(() => {
                    setLoader(false)
                    navigate('/profile')
                }, 3000)
            }
        } catch (error) {
            setLoader(false)
            alert(error.message)
        }

    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setInputOptions(false)
            storeSearchHistory()
            getMidjourneyId(e)
        }
    };

    const getUserSearchHistory = async (prompt, page) => {
        const response = await apis.getUserSearchHistory(user?.id, prompt, page)
        try {
            if (response?.data?.data?.result?.length > 0) {
                setInputOptions(true)
            }
            setPrevSearchList(response?.data?.data)
        } catch (error) {

        }
    }

    const storeSearchHistory = async () => {
        const data = {
            user_id: user?.id,
            search_key: prompt
        }
        const response = await apis.storeSearchHistory(data)
    }

    const getSearchList = () => {
        getUserSearchHistory(inputRef.current.value, 1)
    }
    const DeleteSearchHistoryByName = async (searchText) => {
        const data = {
            user_id: user?.id,
            search_term: searchText,
        };

        try {
            // Make the API call to delete the search history item
            const response = await apis.DeleteSearchHistoryByName(data);

            // If the deletion is successful, update the state to remove the deleted item
            if (response?.status) {
                setPrevSearchList((prevList) => {
                    // Filter out the deleted item based on the search term
                    const updatedList = prevList.result.filter(
                        (item) => item.search_term !== searchText
                    );

                    // Return the updated list
                    return { result: updatedList };
                });
            }
        } catch (error) {
            // Handle errors if needed
            console.error('Error deleting search history item:', error);
        }
    };

    const DeleteAllSearchHistory = async () => {
        const data = {
            user_id: user?.id
        }
        try {
            // Make the API call to delete the search history item
            const response = await apis.DeleteAllSearchHistory(data)
            if (response?.status === 200) {
                setInputOptions(false)
                setPrevSearchList([]);
            }
        } catch (error) {
            console.error('Error deleting search history item:', error);
        }
    }

    const getPromptValue = (e) => {
        console.log(e.target.value, 'e.target.value');
        setprompt(e.target.value)
        getUserSearchHistory(inputRef.current.value, 1)
    }


    const goToPromptSearchPage = () => {
        navigate(`/prompt-search`)
    }
    const handleDocumentClick = (e) => {
        // Check if the click is outside the input field
        // and not on the delete button or the "See All" and "Delete All" elements
        if (
            inputRef.current &&
            !inputRef.current.contains(e.target) &&
            !e.target.closest('.AQZ9Vd') &&
            !e.target.closest('.search-all-delete')
        ) {
            // console.log('Clicked outside the input field and not on delete button or "See All"/"Delete All"');
            // Perform your action for clicks outside the input field
            setInputOptions(false); // Hide input options when clicked outside
        }
    };

    useEffect(() => {
        // Add click event listener to the document
        document.addEventListener('click', handleDocumentClick);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);


    return (
        <>
            < div className='art-page' style={{ width: "100%", minHeight: "300px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                {loader && <GalleryLoader />}

                <Header search={search} setSearch={setSearch} />
                <h1 style={{ textAlign: 'center' }}>Your Generated Art</h1>
                {/* <h3 className='remaining-prompt' >Your remaining prompt is {promptCalculator?.remaining/4}</h3> */}
                <h3 className='remaining-prompt' >Your remaining images {promptCalculator?.remaining}</h3>
                <section className="home-first-section">
                    <div className="home-first-wraperr">
                        <div className="search" id="prompt">
                            <button ref={buttonRef} onClick={getMidjourneyId}>Prompt</button>
                            <div className="search-input-wrap">
                                <input
                                    type="text"
                                    placeholder="A cinematic wide shot of a hamster in a space suite, HD, NFT art, 2:3"
                                    defaultValue={prompt}
                                    onChange={(e) => getPromptValue(e)}
                                    onKeyDown={handleKeyDown}
                                    onClick={getSearchList}
                                    ref={inputRef}
                                />
                                {inputOptions &&
                                    <>
                                        {prevSearchList?.result?.length === 0 ?
                                            null
                                            :
                                            <div className="search-options">
                                                <ul className="not-hide">
                                                    {prevSearchList?.result?.slice(0, 5)?.map((item, index) => {
                                                        return (
                                                            <li key={index}>
                                                                <div className="eIPGRd">
                                                                    <div className="sbic sb27"></div>
                                                                    <div className="pcTkSc" onClick={() => setprompt(item?.search_term)}>
                                                                        {item?.search_term}
                                                                    </div>
                                                                    <div
                                                                        className="AQZ9Vd"
                                                                        aria-atomic="true"
                                                                        role="button"
                                                                        aria-label="Delete from history"
                                                                        id="YjTQcc"
                                                                    >
                                                                        <div className="sbai JCHpcb" role="presentation" onClick={() => DeleteSearchHistoryByName(item?.search_term)}>
                                                                            Delete
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </li>
                                                        )
                                                    })}
                                                    <li className="search-all-delete">
                                                        <span onClick={() => { goToPromptSearchPage() }}>See All</span>
                                                        <span onClick={() => { DeleteAllSearchHistory() }}>Delete All</span>
                                                    </li>
                                                </ul>
                                            </div>

                                        }
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="connect-wallet-mobile">
                        <button className={`connect-wallet`}>
                            Connect Wallet
                        </button>
                    </div>
                </section>
                <div className='Arts-holder'>
                    {generatedArts.length > 0 &&

                        generatedArts.map((item, Index) => {
                            return < ArtItem handleUnselectArt={handleUnselectArt} handleSelectArt={handleSelectArt} Image={item.image} selected={item.selected} Index={Index} />
                        })

                    }
                </div>
                {generatedArts.length > 0 &&
                    <div style={{ display: "flex", justifyContent: "center" }}>

                        <button onClick={saveToGallery} disabled={selectCount < 1} className='save-art-btn'>Save to Gallery ({selectCount})</button>
                    </div>
                }
                {errorMessage != '' &&
                    <p className='art-error'>{errorMessage}</p>
                }
            </ div>
            <Footer />
        </>
    )
}

export default Art