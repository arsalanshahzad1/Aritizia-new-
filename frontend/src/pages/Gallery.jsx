import React from 'react'
import { useState } from 'react'
import bird from '../../public/assets/images/bird.png'
import ArtItem from './ArtItem'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GalleryItem from './GalleryItem'
import apis from '../service'
import HeaderConnectPopup from './Headers/HeaderConnectPopup'
import Loader from '../components/shared/Loader'
import Modal from "react-bootstrap/Modal";
import { AiOutlineClose } from "react-icons/ai";
import { IoIosArrowDown } from 'react-icons/io'

const Gallery = ({ user, loader, setLoader }) => {
    const [connectPopup, setConnectPopup] = useState(false);
    console.log(user == "admin" ? "yes admin" : "not admin")
    const navigate = useNavigate()
    const id = JSON.parse(localStorage.getItem("data"));
    const user_id = id?.id;
    const [allGalleryItems, setAllGalleryItems] = useState([])
    const [folderGalleryItems, setFolderGalleryItems] = useState([])
    const [selectCount, setSelectCount] = useState(0)
    const [showCollectionDropdown, setShowCollectionDropdown] = useState(false)
    const [addToCollection, setAddToCollection] = useState(false)
    const [selectedGalleryCollection, setSelectedGalleryCollection] =
        useState({ value: { name: '', value: '' }, options: [{ name: 'One', value: 'one' }, { name: 'Two', value: 'two' }, { name: 'three', value: 'Three' }] })
    const [createAndOld, setCreateAndOld] = useState('')
    const accountAddress = localStorage.getItem("userAddress")
    const [transferType , setTransferType] = useState('')
    const [showTransferType , setShowTransferType] = useState(false)
    const [showDeleteConfirmation , setShowDeleteConfirmation] = useState(false)

    useEffect(() => {
        const count = allGalleryItems.filter(item => item.selected).length;
        setSelectCount(count)
    }, [allGalleryItems])

    const handleSelectArt = (index) => {
        console.log("I'm being selected", index);
        const updatedArts = [...allGalleryItems];
        updatedArts[index].selected = true;
        setAllGalleryItems(updatedArts);
    };
    const handleUnselectArt = (index) => {
        console.log("I'm being unselected", index);
        const updatedArts = [...allGalleryItems];
        updatedArts[index].selected = false;
        setAllGalleryItems(updatedArts);
    };
    const ListGallery = async () => {
        setLoader(true)
        const readyTobeListed = allGalleryItems.filter(item => item.selected).map(item => item.image)
        console.log(readyTobeListed, 'one');
        const imageDataObject = [];
        for (let i = 0; i < readyTobeListed.length; i++) {
            console.log(readyTobeListed[i], 'two');
            try {
                const imageUrl = readyTobeListed[i];
                console.log(imageUrl, 'three');
                const imageFile = await convertImageUrlToImageFile(imageUrl, i);
                console.log(imageFile, 'nnnnn');
                imageDataObject.push(imageFile);


            } catch (error) {
                console.error(`Error fetching image for URL ${readyTobeListed[i]}:`, error);
            }
            console.log(imageDataObject, 'imageDataObject');

        }


        setLoader(false)
        navigate(
            '/create/multiple',
            {
                state: {
                    artGallery: imageDataObject
                },
            }
        )

    }

    const convertImageUrlToImageFile = async (url, i) => {
        console.log(url, 'four');
        try {
            if (url.includes("http")) {
                console.log(url, 'five');
                // Download the image from the URL
                const imageUrl = url;
                const resp = await apis.generateBase({ image_url: url })
                try {
                    console.log(resp?.data?.data, 'asasasa');
                    //    // const response = await fetch(url);
                    const response = await fetch(`data:image/png;base64,${resp?.data?.data}`);
                    console.log(response, 'six');

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
                } catch (error) {
                    console.log(error, 'generate_image');
                }

            } else {
                const imageUrl = url;
                const response = await fetch(`data:image/png;base64,${url}`);
                console.log(response);

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
    const scrollToPrompt = () => {
        document.getElementById('prompt').scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        })
    }

    const saveToGallery = async () => {
        setLoader(true)
        try {
            const response = await apis.viewArtGallery(user_id);
            console.log(response, 'sdasdsad');
            let tempImages = []
            for (let index = 0; index < response?.data?.data?.images?.length; index++) {
                tempImages.push({ 
                    image: response?.data?.data?.images?.[index]?.image_url, 
                    id: response?.data?.data?.images?.[index]?.id, 
                    selected: false })
            }
            setAllGalleryItems(tempImages)
            let tempFolderImages = []
        } catch (error) {
        }
        setLoader(false)
    }

    useEffect(() => {
        saveToGallery()
    }, [])




    return (
        <>
            {loader && <Loader />}
            < div >
                <div className='Arts-holder'>
                    {allGalleryItems.length >= 0 ?
                        allGalleryItems.map((item, Index) => {
                            return <GalleryItem handleUnselectArt={handleUnselectArt} handleSelectArt={handleSelectArt} Image={item.image} selected={item.selected} Index={Index} user={user} />
                        }) :
                        <div className="data-not-avaliable">
                            <h2>No data avaliable</h2>
                        </div>
                    }
                </div>
                {user === "admin" ?
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        {accountAddress !== "false" ?
                            <button onClick={ListGallery} disabled={selectCount < 1} className='save-art-btn'>Listing ({selectCount})</button>
                            :
                            <button onClick={() => setConnectPopup(true)} disabled={selectCount < 1} className='save-art-btn'>Listing ({selectCount})</button>
                        }

                        <button onClick={() => setConnectPopup(true)} className='save-art-btn'>Load More</button>


                        <button onClick={() => setShowDeleteConfirmation(true)} disabled={selectCount < 1} className='save-art-btn'>Delete</button>


                        <button onClick={() => setAddToCollection(true)} disabled={selectCount < 1} className='save-art-btn'>Add into Collection ({selectCount})</button>

                    </div>
                    : ""
                }
                <HeaderConnectPopup connectPopup={connectPopup} setConnectPopup={setConnectPopup} />
            </ div>
            <Modal
                show={addToCollection}
                onHide={() => setAddToCollection(false)}
                centered
                size="lg"
                className="add-to-collection-modal-wrap"
                backdrop="static"
                keyboard={false}
            >
                <div className="modal-body">
                    <div className="main-data">
                        <div className="header-connect-close">
                            <AiOutlineClose onClick={() => setAddToCollection(false)} />
                        </div>
                        <div className="body">
                            <p className={`${createAndOld === 'create_new_collection' ? 'active' : ''}`} onClick={() => { setCreateAndOld('create_new_collection') }}>Create New Collection <span></span></p>
                            {createAndOld === 'create_new_collection' &&
                                <input type="text" name="" placeholder='Type Collection Name' id="" />
                            }
                            <p className={`${createAndOld === 'existing_collection' ? 'active' : ''}`} onClick={() => { setCreateAndOld('existing_collection') }}>Existing Collection <span></span></p>
                            {createAndOld === 'existing_collection' &&
                                <div className='dd' onClick={() => { setShowCollectionDropdown(!showCollectionDropdown) }}>
                                    <p>{selectedGalleryCollection?.value?.name === '' ? 'Select Collection' : selectedGalleryCollection?.value?.name} <IoIosArrowDown /></p>
                                    {
                                        showCollectionDropdown &&
                                        <ul className='option'>
                                            {selectedGalleryCollection?.options.map((item, index) => {
                                                return (
                                                    <li key={index} onClick={() => { setSelectedGalleryCollection((prev) => ({ ...prev, value: item })) }}>{item?.name}</li>
                                                )
                                            })}
                                        </ul>
                                    }
                                </div>
                            }
                            <div className="button">
                                <button>Next</button>
                                <button>Cancle</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal
                show={showTransferType}
                onHide={() => setShowTransferType(false)}
                centered
                size="lg"
                className="add-to-collection-modal-wrap"
                backdrop="static"
                keyboard={false}
            >
                <div className="modal-body">
                    <div className="main-data">
                        <div className="header-connect-close">
                            <AiOutlineClose onClick={() => setShowTransferType(false)} />
                        </div>
                        <div className="body">
                            <p className={`${transferType === 'move' ? 'active' : ''}`} onClick={() => { setTransferType('move') }}>move<span></span></p>
                            <p className={`${transferType === 'copy' ? 'active' : ''}`} onClick={() => { setTransferType('copy') }}>copy<span></span></p>
                            <div className="button">
                                <button>Done</button>
                                <button>Cancle</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal
                show={showDeleteConfirmation}
                onHide={() => setShowDeleteConfirmation(false)}
                centered
                size="lg"
                className="delete-modal-wrap"
                backdrop="static"
                keyboard={false}
            >
                <div className="modal-body">
                    <div className="main-data">
                        <div className="header-connect-close">
                            <AiOutlineClose onClick={() => setShowDeleteConfirmation(false)} />
                        </div>
                        <div className="body">
                            <p>Are you sure?</p>
                            
                            <div className="button">
                                <button>Delete</button>
                                <button>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default Gallery