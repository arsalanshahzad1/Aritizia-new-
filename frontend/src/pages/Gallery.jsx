import React, { useRef } from "react";
import { useState } from "react";
import bird from "../../public/assets/images/bird.png";
import ArtItem from "./ArtItem";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GalleryItem from "./GalleryItem";
import apis from "../service";
import HeaderConnectPopup from "./Headers/HeaderConnectPopup";
import Loader from "../components/shared/Loader";
import Modal from "react-bootstrap/Modal";
import { AiOutlineClose } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";

const Gallery = ({ user, loader, setLoader }) => {
    const [connectPopup, setConnectPopup] = useState(false);
    const navigate = useNavigate();
    const id = JSON.parse(localStorage.getItem("data"));
    const user_id = id?.id;
    const [allGalleryItems, setAllGalleryItems] = useState([]);
    const [folderGalleryItems, setFolderGalleryItems] = useState([]);
    const [selectCount, setSelectCount] = useState(0);
    const [selectFolderCount, setSelectFolderCount] = useState(0);
    const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);
    const [addToCollection, setAddToCollection] = useState(false);
    const [addToFolderCollection, setAddToFolderCollection] = useState(false);
    const [selectedGalleryCollection, setSelectedGalleryCollection] = useState({
        value: { id: "", name: "" },
        options: [],
    });
    const [createAndOld, setCreateAndOld] = useState("");
    const accountAddress = localStorage.getItem("userAddress");
    const [transferType, setTransferType] = useState("");
    const [showTransferType, setShowTransferType] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showDeleteFolderConfirmation, setShowDeleteFolderConfirmation] =
        useState(false);
    const [selectedPart, setSelectedPart] = useState("");
    const [selectedFolderId, setSelectedFolderId] = useState("");
    const [fullGalleryResponse, setFullGalleryResponse] = useState([]);

    useEffect(() => {
        const count = allGalleryItems.filter((item) => item.selected).length;
        setSelectCount(count);
        if (count === 0) {
            setSelectedPart("");
        }
        console.log(allGalleryItems , 'allGalleryItems');
    }, [allGalleryItems]);
    useEffect(() => {
        var totalCount = folderGalleryItems.reduce(function (accumulator, folder) {
            var selectedImagesCount = folder.images.reduce(function (
                innerAccumulator,
                image
            ) {
                return innerAccumulator + (image.selected ? 1 : 0);
            },
                0);
            return accumulator + selectedImagesCount;
        }, 0);
        if (totalCount === 0) {
            setSelectedPart("");
        }
        setSelectFolderCount(totalCount);
    }, [folderGalleryItems]);

    const handleSelectArt = (index, title) => {
        if (title === "All") {
            const updatedArts = [...allGalleryItems];
            updatedArts[index].selected = true;
            setAllGalleryItems(updatedArts);
        } else {
            var indexOfClickedCard = folderGalleryItems.findIndex(function (obj) {
                return obj.title === title;
            });
            const updatedFolderArts = [...folderGalleryItems];
            updatedFolderArts[indexOfClickedCard].images[index].selected = true;
            setFolderGalleryItems(updatedFolderArts);
        }
    };
    const handleUnselectArt = (index, title) => {
        if (title === "All") {
            const updatedArts = [...allGalleryItems];
            updatedArts[index].selected = false;
            setAllGalleryItems(updatedArts);
        } else {
            var indexOfClickedCard = folderGalleryItems.findIndex(function (obj) {
                return obj.title === title;
            });
            const updatedFolderArts = [...folderGalleryItems];
            updatedFolderArts[indexOfClickedCard].images[index].selected = false;
            setFolderGalleryItems(updatedFolderArts);
        }
    };
    const ListGallery = async () => {
        setLoader(true);
        const readyTobeListed = allGalleryItems
            .filter((item) => item.selected)
            .map((item) => item.image);
        const imageDataObject = [];
        for (let i = 0; i < readyTobeListed.length; i++) {
            try {
                const imageUrl = readyTobeListed[i];
                const imageFile = await convertImageUrlToImageFile(imageUrl, i);
                imageDataObject.push(imageFile);
            } catch (error) {
                console.error(
                    `Error fetching image for URL ${readyTobeListed[i]}:`,
                    error
                );
            }
        }

        setLoader(false);
        navigate("/create/multiple", {
            state: {
                artGallery: imageDataObject,
            },
        });
    };
    const ListFolderGallery = async () => {
        setLoader(true);
        // const readyTobeListed = allGalleryItems.filter(item => item.selected).map(item => item.image)

        // Use reduce to flatten the nested structure and get all images
        var allImages = folderGalleryItems.reduce(function (accumulator, folder) {
            // Concatenate the images array of each folder to the accumulator
            return accumulator.concat(folder.images);
        }, []);

        // Use filter to get only the images where selected === true
        var selectedImages = allImages.filter(function (image) {
            return image.selected === true;
        });

        // Use map to extract the id values from the selected images
        var readyTobeListed = selectedImages.map(function (image) {
            return image.image;
        });
        const imageDataObject = [];
        for (let i = 0; i < readyTobeListed.length; i++) {
            try {
                const imageUrl = readyTobeListed[i];
                const imageFile = await convertImageUrlToImageFile(imageUrl, i);
                imageDataObject.push(imageFile);
            } catch (error) {
                console.error(
                    `Error fetching image for URL ${readyTobeListed[i]}:`,
                    error
                );
            }
        }

        setLoader(false);
        navigate("/create/multiple", {
            state: {
                artGallery: imageDataObject,
            },
        });
    };

    const convertImageUrlToImageFile = async (url, i) => {
        try {
            if (url.includes("http")) {
                // Download the image from the URL
                const imageUrl = url;
                const resp = await apis.generateBase({ image_url: url });
                try {
                    //    // const response = await fetch(url);
                    const response = await fetch(
                        `data:image/png;base64,${resp?.data?.data}`
                    );

                    if (!response.ok) {
                        throw new Error(
                            `Failed to fetch image. Status: ${response.status}`
                        );
                    }

                    // Convert the response data to a Blob
                    const imageBlob = await response.blob();

                    // Extract the file name from the URL or specify a custom name
                    const urlParts = imageUrl.split("/");
                    const fileName = urlParts[urlParts.length - 1] || "image.jpg";

                    // Create a File object from the Blob
                    const file = new File([imageBlob], fileName, {
                        type: response.headers.get("content-type"),
                    });
                    return file;
                } catch (error) { }
            } else {
                const imageUrl = url;
                const response = await fetch(`data:image/png;base64,${url}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch image. Status: ${response.status}`);
                }

                // Convert the response data to a Blob
                const imageBlob = await response.blob();

                // Extract the file name from the URL or specify a custom name
                const urlParts = imageUrl.split("/");
                const fileName = `image${i}.png`;

                // Create a File object from the Blob
                const file = new File([imageBlob], fileName, {
                    type: response.headers.get("content-type"),
                });
                return file;
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    const scrollToPrompt = () => {
        document.getElementById("prompt").scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const saveToGallery = async () => {
        setLoader(true);
        try {
            const response = await apis.viewArtGallery(user_id, 0, 1);
            setFullGalleryResponse(response?.data?.data);
            let tempImages = [];
            for (
                let index = 0;
                index < response?.data?.data?.images?.length;
                index++
            ) {
                tempImages.push({
                    image: response?.data?.data?.images?.[index]?.image_url,
                    id: response?.data?.data?.images?.[index]?.id,
                    title: "All",
                    selected: false,
                });
            }
            setAllGalleryItems(tempImages);

            let tempFolder = [];
            let tempFolderImages = [];
            for (
                let index = 0;
                index < response?.data?.data?.folders.length;
                index++
            ) {
                tempFolderImages = [];

                for (
                    let j = 0;
                    j < response?.data?.data?.folders?.[index]?.images?.length;
                    j++
                ) {
                    tempFolderImages.push({
                        image:
                            response?.data?.data?.folders?.[index]?.images?.[j]?.image_url,
                        id: response?.data?.data?.folders?.[index]?.images?.[j]?.id,
                        title: response?.data?.data?.folders?.[index]?.title,
                        selected: false,
                    });
                }
                tempFolder.push({
                    title: response?.data?.data?.folders?.[index]?.title,
                    id: response?.data?.data?.folders?.[index]?.id,
                    images: tempFolderImages,
                });
            }
            setFolderGalleryItems(tempFolder);
        } catch (error) { }
        setLoader(false);
    };

    const [folderListing, setFolderListing] = useState([]);
    const [foldername, setFoldername] = useState("");

    const listFolders = async () => {
        const response = await apis.listFolders(user_id);
        try {
            setSelectedGalleryCollection((prev) => ({
                ...prev,
                options: response?.data?.data,
            }));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        saveToGallery();
        listFolders();
    }, []);

    const storeFolder = async () => {
        if (foldername === "") {
            toast.error("Collection name is required");
        } else {
            const response = await apis.storeFolder({
                user_id: user_id,
                title: foldername,
            });
            try {
                setSelectedGalleryCollection((prev) => ({
                    ...prev,
                    value: {
                        id: response?.data?.data?.id,
                        name: response?.data?.data?.title,
                    },
                }));
                listFolders()
                setAddToCollection(false);
                setShowTransferType(true);
                setFoldername("");
                setCreateAndOld('')
                setTransferType('')
            } catch (error) {
                toast.error(error?.message);
            }
        }
    };

    const copyAndMoveMethodeFolder = async () => {
        var allImages = folderGalleryItems.reduce(function (accumulator, folder) {
            return accumulator.concat(folder.images);
        }, []);

        var selectedImages = allImages.filter(function (image) {
            return image.selected === true;
        });

        var selectedImageIds = selectedImages.map(function (image) {
            return image.id;
        });
        if (transferType === "move") {
            const data = {
                folder_id: [selectedGalleryCollection?.value?.id],
                user_id: user_id,
                art_gallery_images: selectedImageIds,
                folder_id_remove: selectedFolderId,
            };

            const response = await apis.moveImagesFolder(data);
            try {
                toast.success("Gallery moved successfully");
                saveToGallery();
                setShowTransferType(false);
                setTransferType("");
                setCreateAndOld("");

                setSelectedGalleryCollection((prev) => ({
                    ...prev,
                    value: { id: "", name: "" },
                }));
            } catch (error) {
                toast.error(error?.message);
            }
        } else {
            const data = {
                folder_id: [selectedGalleryCollection?.value?.id],
                user_id: user_id,
                art_gallery_images: selectedImageIds,
            };

            const response = await apis.copyImagesFolder(data);
            try {
                toast.success("Gallery moved successfully");
                saveToGallery();
                setShowTransferType(false);
                setSelectedGalleryCollection((prev) => ({
                    ...prev,
                    value: { id: "", name: "" },
                }));
                setTransferType("");
                setCreateAndOld("");
            } catch (error) {
                toast.error(error?.message);
            }
        }
    };
    const copyAndMoveMethode = async () => {
        if (transferType === "move") {
            var selectedIds = allGalleryItems
                .filter((obj) => obj.selected === true)
                .map((obj) => obj.id);

            const data = {
                folder_id: [selectedGalleryCollection?.value?.id],
                user_id: user_id,
                art_gallery_images: selectedIds,
                folder_id_remove: selectedFolderId,
            };

            const response = await apis.moveImagesFolder(data);
            try {
                toast.success("Gallery moved successfully");
                saveToGallery();
                setShowTransferType(false);
                setSelectedGalleryCollection((prev) => ({
                    ...prev,
                    value: { id: "", name: "" },
                }));
                setTransferType("");
                setCreateAndOld("");
            } catch (error) {
                toast.error(error?.message);
            }
        } else {
            var selectedIds = allGalleryItems
                .filter((obj) => obj.selected === true)
                .map((obj) => obj.id);

            const data = {
                folder_id: [selectedGalleryCollection?.value?.id],
                user_id: user_id,
                art_gallery_images: selectedIds,
            };

            const response = await apis.copyImagesFolder(data);
            try {
                toast.success("Gallery moved successfully");
                saveToGallery();
                setShowTransferType(false);
                setSelectedGalleryCollection((prev) => ({
                    ...prev,
                    value: { id: "", name: "" },
                }));
                setTransferType("");
                setCreateAndOld("");
            } catch (error) {
                toast.error(error?.message);
            }
        }
    };

    const deleteImagesFolder = async () => {
        setLoader(true);
        const data = {
            delete_folder: 1, //Zero by default if you just want to delete images not the entire folder
            art_gallery_images: [], //Only Required When You Want to delete Images
            user_id: user_id,
            folder_id: selectedFolderId, //Zero by default if you just want to delete images that are present in gallery. If you want to delete an image in the folder please pass folder id and  art_gallery_images as an array with multiple ids
        };
        const response = await apis.deleteImagesFolder(data);
        try {
            setShowDeleteFolderConfirmation(false);
            setLoader(false);
            toast.success("Collection deleted successfully");
            saveToGallery();
        } catch (error) {
            setLoader(false);
            toast.error(error?.message);
        }
    };
    const deleteSelectedImagesFolder = async () => {
        setLoader(true);
        if (selectedFolderId === 0) {
            var selectedObjects = allGalleryItems.filter(function (obj) {
                return obj.selected === true;
            });
            var selectedIds = selectedObjects.map(function (obj) {
                return obj.id;
            });
            const data = {
                delete_folder: 0, //Zero by default if you just want to delete images not the entire folder
                art_gallery_images: selectedIds, //Only Required When You Want to delete Images
                user_id: user_id,
                folder_id: selectedFolderId, //Zero by default if you just want to delete images that are present in gallery. If you want to delete an image in the folder please pass folder id and  art_gallery_images as an array with multiple ids
            };
            const response = await apis.deleteImagesFolder(data);
            try {
                setShowDeleteConfirmation(false);
                setLoader(false);
                toast.success("Images deleted successfully");
                saveToGallery();
            } catch (error) {
                setLoader(false);
                toast.error(error?.message);
            }
        } else {
            var allImages = folderGalleryItems.reduce(function (accumulator, folder) {
                // Concatenate the images array of each folder to the accumulator
                return accumulator.concat(folder.images);
            }, []);

            var selectedImages = allImages.filter(function (image) {
                return image.selected === true;
            });

            var selectedImageIds = selectedImages.map(function (image) {
                return image.id;
            });
            const data = {
                delete_folder: 0, //Zero by default if you just want to delete images not the entire folder
                art_gallery_images: selectedImageIds, //Only Required When You Want to delete Images
                user_id: user_id,
                folder_id: selectedFolderId, //Zero by default if you just want to delete images that are present in gallery. If you want to delete an image in the folder please pass folder id and  art_gallery_images as an array with multiple ids
            };
            const response = await apis.deleteImagesFolder(data);
            try {
                setShowDeleteConfirmation(false);
                setLoader(false);
                toast.success("Images deleted successfully");
                saveToGallery();
            } catch (error) {
                setLoader(false);
                toast.error(error?.message);
            }
        }
    };

    const loadmoreGallaryImages = async (page) => {
        setLoader(true);
        const response = await apis.viewArtGallery(user_id, 0, page);
        try {
            let tempImages = [];
            for (
                let index = 0;
                index < response?.data?.data?.images?.length;
                index++
            ) {
                tempImages.push({
                    image: response?.data?.data?.images?.[index]?.image_url,
                    id: response?.data?.data?.images?.[index]?.id,
                    title: "All",
                    selected: false,
                });
            }
            setAllGalleryItems((prev) => [...prev, ...tempImages]);
            setFullGalleryResponse(response?.data?.data);
            setLoader(false);
        } catch (error) {
            setLoader(false);
            toast.error(error?.message);
        }
    };
    const loadmoreFolderImages = async (page, folderId, index, title) => {
        setLoader(true);
        const response = await apis.viewArtGallery(user_id, folderId, page);
        try {
            let tempFolderImages = [];
            for (
                let j = 0;
                j < response?.data?.data?.folders?.[index]?.images?.length;
                j++
            ) {
                tempFolderImages.push({
                    image: response?.data?.data?.folders?.[index]?.images?.[j]?.image_url,
                    id: response?.data?.data?.folders?.[index]?.images?.[j]?.id,
                    title: response?.data?.data?.folders?.[index]?.title,
                    selected: false,
                });
            }

            let updatefolderOldValue = folderGalleryItems?.[index]?.images;

            let newFolderData = {
                title: title,
                id: folderId,
                images: [...updatefolderOldValue, ...tempFolderImages],
            };
            var temp = folderGalleryItems;
            temp.splice(index, 1, newFolderData);
            handlefolderUpdate(temp);
            setFullGalleryResponse(response?.data?.data);
            setLoader(false);
        } catch (error) {
            setLoader(false);
            toast.error(error?.message);
        }
    };

    const handlefolderUpdate = (data) => {
        setTimeout(() => {
            setFolderGalleryItems(data);
        });
    };

    useEffect(() => { }, [folderGalleryItems]);

    return (
        <>
            {loader && <Loader />}
            <div>
                <div className="Arts-holder all">
                    {allGalleryItems.length >= 0 ? (
                        <>
                            {allGalleryItems.map((item, Index) => {
                                return (
                                    <GalleryItem
                                        handleUnselectArt={handleUnselectArt}
                                        handleSelectArt={handleSelectArt}
                                        Image={item.image}
                                        selected={item.selected}
                                        Index={Index}
                                        user={user}
                                        title={item?.title}
                                        setSelectedPart={setSelectedPart}
                                        folderTitle={item?.title}
                                        selectedPart={selectedPart}
                                    />
                                );
                            })}
                        </>
                    ) : (
                        <div className="data-not-avaliable">
                            <h2>No data avaliable</h2>
                        </div>
                    )}
                </div>
                {user === "admin"
                    ? selectFolderCount === 0 &&
                    allGalleryItems.length > 0 && (
                        <div className="gallery-action-buttons" style={{ display: "flex", justifyContent: "space-between" }}>
                            {accountAddress !== "false" ? (
                                <button
                                    onClick={ListGallery}
                                    disabled={selectCount < 1}
                                    className="save-art-btn"
                                >
                                    Listing ({selectCount})
                                </button>
                            ) : (
                                <button
                                    onClick={() => setConnectPopup(true)}
                                    disabled={selectCount < 1}
                                    className="save-art-btn"
                                >
                                    Listing ({selectCount})
                                </button>
                            )}

                            <button
                                disabled={
                                    +fullGalleryResponse?.pagination?.page ===
                                    fullGalleryResponse?.pagination?.total_pages
                                }
                                onClick={() =>
                                    loadmoreGallaryImages(
                                        +fullGalleryResponse?.pagination?.page + 1
                                    )
                                }
                                className="save-art-btn"
                            >
                                Load More
                            </button>

                            <button
                                onClick={() => {
                                    setShowDeleteConfirmation(true);
                                    setSelectedFolderId(0);
                                }}
                                disabled={selectCount < 1}
                                className="save-art-btn"
                            >
                                Delete
                            </button>

                            <button
                                onClick={() => {
                                    setAddToCollection(true);
                                    setSelectedFolderId(0);
                                    setSelectedGalleryCollection((prev) => ({
                                        ...prev,
                                        value: { id: "", name: "" },
                                    }));
                                    setTransferType('');
                                    setCreateAndOld('')
                                }}
                                disabled={selectCount < 1}
                                className="save-art-btn"
                            >
                                Add into Collection ({selectCount})
                            </button>
                        </div>
                    )
                    : ""}
                <HeaderConnectPopup
                    connectPopup={connectPopup}
                    setConnectPopup={setConnectPopup}
                />
            </div>
            {allGalleryItems.length > 0 && (
                <div className="images-folder-collection">
                    {folderGalleryItems?.map((item, Index) => {
                        return (
                            <div className="image-collection-folder-section" key={Index}>
                                <div className="sec-title">
                                    <h3>{item.title}</h3>{" "}
                                    <span
                                        onClick={() => {
                                            setShowDeleteFolderConfirmation(true);
                                            setSelectedFolderId(item?.id);
                                        }}
                                    >
                                        <MdDeleteOutline />
                                    </span>
                                </div>
                                <div className="Arts-holder folder">
                                    {item?.images?.length > 0 ? (
                                        <>
                                            {item?.images?.map((images, i) => {
                                                return (
                                                    <GalleryItem
                                                        handleUnselectArt={handleUnselectArt}
                                                        handleSelectArt={handleSelectArt}
                                                        Image={images?.image}
                                                        selected={images?.selected}
                                                        Index={i}
                                                        user={user}
                                                        title={images?.title}
                                                        setSelectedPart={setSelectedPart}
                                                        selectedPart={selectedPart}
                                                        folderTitle={item?.title}
                                                    />
                                                );
                                            })}
                                        </>
                                    ) : (
                                        <div className="data-not-avaliable">
                                            <h2>No data avaliable</h2>
                                        </div>
                                    )}
                                </div>
                                {item?.images?.length > 0 && (
                                    <>
                                        {user === "admin"
                                            ? selectCount === 0 &&
                                            (selectedPart === "" || selectedPart === item?.title) && (
                                                <div
                                                className="gallery-action-buttons"
                                                >
                                                    {accountAddress !== "false" ? (
                                                        <button
                                                            onClick={ListFolderGallery}
                                                            disabled={selectFolderCount < 1}
                                                            className="save-art-btn"
                                                        >
                                                            Listing ({selectFolderCount})
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => setConnectPopup(true)}
                                                            disabled={selectFolderCount < 1}
                                                            className="save-art-btn"
                                                        >
                                                            Listing ({selectFolderCount})
                                                        </button>
                                                    )}

                                                    <button
                                                        disabled={
                                                            +fullGalleryResponse?.folders?.[Index]
                                                                ?.pagination?.page ===
                                                            fullGalleryResponse?.folders?.[Index]
                                                                ?.pagination?.total_pages
                                                        }
                                                        onClick={() =>
                                                            loadmoreFolderImages(
                                                                +fullGalleryResponse?.folders?.[Index]
                                                                    ?.pagination?.page + 1,
                                                                item?.id,
                                                                Index,
                                                                item?.title
                                                            )
                                                        }
                                                        className="save-art-btn"
                                                    >
                                                        Load More
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setShowDeleteConfirmation(true);
                                                            setSelectedFolderId(item?.id);
                                                        }}
                                                        disabled={selectFolderCount < 1}
                                                        className="save-art-btn"
                                                    >
                                                        Delete
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setAddToFolderCollection(true);
                                                            setSelectedFolderId(item?.id);
                                                            setSelectedGalleryCollection((prev) => ({
                                                                ...prev,
                                                                value: { id: "", name: "" },
                                                            }));
                                                            setTransferType('');
                                                            setCreateAndOld('')
                                                        }}
                                                        disabled={selectFolderCount < 1}
                                                        className="save-art-btn"
                                                    >
                                                        Add into Collection ({selectFolderCount})
                                                    </button>
                                                </div>
                                            )
                                            : ""}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
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
                            <p
                                className={`${createAndOld === "create_new_collection" ? "active" : ""
                                    }`}
                                onClick={() => {
                                    setCreateAndOld("create_new_collection");
                                }}
                            >
                                Create New Collection <span></span>
                            </p>
                            {createAndOld === "create_new_collection" && (
                                <input
                                    type="text"
                                    onChange={(e) => setFoldername(e.target.value)}
                                    name=""
                                    placeholder="Type Collection Name"
                                    id=""
                                />
                            )}
                            <p
                                className={`${createAndOld === "existing_collection" ? "active" : ""
                                    }`}
                                onClick={() => {
                                    setCreateAndOld("existing_collection");
                                }}
                            >
                                Existing Collection <span></span>
                            </p>
                            {createAndOld === "existing_collection" && (
                                <div
                                    className="dd"
                                    onClick={() => {
                                        setShowCollectionDropdown(!showCollectionDropdown);
                                    }}
                                >
                                    <p>
                                        {selectedGalleryCollection?.value?.name === ""
                                            ? "Select Collection"
                                            : selectedGalleryCollection?.value?.name}{" "}
                                        <IoIosArrowDown />
                                    </p>
                                    {showCollectionDropdown && (
                                        <ul className="option">
                                            {selectedGalleryCollection?.options.map((item, index) => {
                                                return (
                                                    <li
                                                        key={index}
                                                        onClick={() => {
                                                            setSelectedGalleryCollection((prev) => ({
                                                                ...prev,
                                                                value: { id: item?.id, name: item?.title },
                                                            }));
                                                        }}
                                                    >
                                                        {item?.title}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            )}
                            <div className="button">
                                {createAndOld === "create_new_collection" ? (
                                    <button
                                        className={`${foldername.length < 3 ? "disable" : ""}`}
                                        onClick={storeFolder}
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        className={`${createAndOld == "" ||
                                                selectedGalleryCollection?.value?.name === ""
                                                ? "disable"
                                                : ""
                                            }`}
                                        onClick={() => {
                                            setAddToCollection(false), setShowTransferType(true);
                                        }}
                                    >
                                        Next
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setAddToCollection(false);
                                    }}
                                >
                                    Cancle
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal
                show={addToFolderCollection}
                onHide={() => setAddToFolderCollection(false)}
                centered
                size="lg"
                className="add-to-collection-modal-wrap"
                backdrop="static"
                keyboard={false}
            >
                <div className="modal-body">
                    <div className="main-data">
                        <div className="header-connect-close">
                            <AiOutlineClose onClick={() => setAddToFolderCollection(false)} />
                        </div>
                        <div className="body">
                            <p
                                className={`${createAndOld === "create_new_collection" ? "active" : ""
                                    }`}
                                onClick={() => {
                                    setCreateAndOld("create_new_collection");
                                }}
                            >
                                Create New Collection <span></span>
                            </p>
                            {createAndOld === "create_new_collection" && (
                                <input
                                    type="text"
                                    onChange={(e) => setFoldername(e.target.value)}
                                    name=""
                                    placeholder="Type Collection Name"
                                    id=""
                                />
                            )}
                            <p
                                className={`${createAndOld === "existing_collection" ? "active" : ""
                                    }`}
                                onClick={() => {
                                    setCreateAndOld("existing_collection");
                                }}
                            >
                                Existing Collection <span></span>
                            </p>
                            {createAndOld === "existing_collection" && (
                                <div
                                    className="dd"
                                    onClick={() => {
                                        setShowCollectionDropdown(!showCollectionDropdown);
                                    }}
                                >
                                    <p>
                                        {selectedGalleryCollection?.value?.name === ""
                                            ? "Select Collection"
                                            : selectedGalleryCollection?.value?.name}{" "}
                                        <IoIosArrowDown />
                                    </p>
                                    {showCollectionDropdown && (
                                        <ul className="option">
                                            <li
                                                onClick={() => {
                                                    setSelectedGalleryCollection((prev) => ({
                                                        ...prev,
                                                        value: { id: 0, name: "Main Gallery" },
                                                    }));
                                                }}
                                            >
                                                Main Gallery
                                            </li>
                                            {selectedGalleryCollection?.options.map((item, index) => {
                                                return (
                                                    <li
                                                        key={index}
                                                        onClick={() => {
                                                            setSelectedGalleryCollection((prev) => ({
                                                                ...prev,
                                                                value: { id: item?.id, name: item?.title },
                                                            }));
                                                        }}
                                                    >
                                                        {item?.title}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            )}
                            <div className="button">
                                {createAndOld === "create_new_collection" ? (
                                    <button
                                        className={`${foldername.length < 3 ? "disable" : ""}`}
                                        onClick={storeFolder}
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        className={`${createAndOld == "" ||
                                                selectedGalleryCollection?.value?.name === ""
                                                ? "disable"
                                                : ""
                                            }`}
                                        onClick={() => {
                                            setAddToFolderCollection(false),
                                                setShowTransferType(true);
                                        }}
                                    >
                                        Next
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setAddToFolderCollection(false);
                                    }}
                                >
                                    Cancle
                                </button>
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
                            <p
                                className={`${transferType === "move" ? "active" : ""}`}
                                onClick={() => {
                                    setTransferType("move");
                                }}
                            >
                                move<span></span>
                            </p>
                            <p
                                className={`${transferType === "copy" ? "active" : ""}`}
                                onClick={() => {
                                    setTransferType("copy");
                                }}
                            >
                                copy<span></span>
                            </p>
                            <div className="button">
                                {selectedFolderId === 0 ? (
                                    <button
                                        onClick={copyAndMoveMethode}
                                        className={`${transferType == "" ? "disable" : ""}`}
                                    >
                                        Done
                                    </button>
                                ) : (
                                    <button
                                        onClick={copyAndMoveMethodeFolder}
                                        className={`${transferType == "" ? "disable" : ""}`}
                                    >
                                        Done
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setShowTransferType(false);
                                    }}
                                >
                                    Cancle
                                </button>
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
                            <AiOutlineClose
                                onClick={() => setShowDeleteConfirmation(false)}
                            />
                        </div>
                        <div className="body">
                            <p>Are you sure?</p>

                            <div className="button">
                                <button onClick={deleteSelectedImagesFolder}>Delete</button>
                                <button onClick={() => setShowDeleteConfirmation(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal
                show={showDeleteFolderConfirmation}
                onHide={() => setShowDeleteFolderConfirmation(false)}
                centered
                size="lg"
                className="delete-modal-wrap"
                backdrop="static"
                keyboard={false}
            >
                <div className="modal-body">
                    <div className="main-data">
                        <div className="header-connect-close">
                            <AiOutlineClose
                                onClick={() => setShowDeleteFolderConfirmation(false)}
                            />
                        </div>
                        <div className="body">
                            <p>Are you sure?</p>

                            <div className="button">
                                <button onClick={deleteImagesFolder}>Delete</button>
                                <button onClick={() => setShowDeleteFolderConfirmation(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Gallery;
