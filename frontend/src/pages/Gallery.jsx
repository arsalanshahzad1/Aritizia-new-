import { useState } from 'react'
import bird from '../../public/assets/images/bird.png'
import ArtItem from './ArtItem'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GalleryItem from './GalleryItem'
import apis from '../service'
const Gallery = () => {
    const navigate = useNavigate()
    const id = JSON.parse(localStorage.getItem("data"));
    const user_id = id?.id;
    const [GalleryItems, setGalleryItems] = useState([])
    const [selectCount, setSelectCount] = useState(0)
    useEffect(() => {
        const count = GalleryItems.filter(item => item.selected).length;
        setSelectCount(count)
    }, [GalleryItems])
    const handleSelectArt = (index) => {
        console.log("I'm being selected", index);
        const updatedArts = [...GalleryItems];
        updatedArts[index].selected = true;
        setGalleryItems(updatedArts);
    };
    const handleUnselectArt = (index) => {
        console.log("I'm being unselected", index);
        const updatedArts = [...GalleryItems];
        updatedArts[index].selected = false;
        setGalleryItems(updatedArts);
    };
    const ListGallery = async () => {
        const readyTobeListed = GalleryItems.filter(item => item.selected).map(item => item.image)
        console.log(readyTobeListed, "we are ready to travel to Database")
        // const imageDataObject = {};
        const imageDataObject = [];
        for (let i = 0; i < readyTobeListed.length; i++) {
            try {
                const imageUrl = readyTobeListed[i];
                console.log(imageUrl, 'bbbbbb');
                const imageFile = await convertImageUrlToImageFile(imageUrl , i);
                console.log(imageFile , 'nnnnn');
                // Use the index `i` as the key and the image File as the value
                // imageDataObject[i] = imageFile;
                imageDataObject.push(imageFile);


            } catch (error) {
                console.error(`Error fetching image for URL ${readyTobeListed[i]}:`, error);
            }
            console.log(imageDataObject);

        }

        // console.log(imageDataObject);
        // navigate('/create/multiple')
        navigate(
            '/create/multiple',
            {
              state: {
                artGallery: imageDataObject
              },
            }
          )
        // setGalleryItems([])
        // setprompt('')
    }

    const convertImageUrlToImageFile = async (url , i) => {
        try {
            if (url.includes("http")) {
                // Download the image from the URL
                const imageUrl = url;
                const response = await fetch(url);
                console.log(response);

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
                // console.log('base64');
                // const base64url = `data:image/png;base64,${url}`;
                // fetch(base64url)
                //     .then(res => res.blob())
                //     .then(blob => {
                //         const file = new File([blob], `image${i}.png`, { type: "image/png" });
                //         console.log(file , 'fileee');
                //         return (
                //             file
                //         )
                //     })
                // Download the image from the URL
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

            // console.log(file);
            // Set the image file in state
            // setImageFile(file);
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
        try {
            const response = await apis.viewArtGallery(user_id);
            console.log(response, 'sdasdsad');
            let tempImages = []
            for (let index = 0; index < response?.data?.data?.length; index++) {
                tempImages.push({ image: response?.data?.data?.[index]?.image_url, selected: false })
            }
            setGalleryItems(tempImages)
        } catch (error) {
        }
    }

    useEffect(() => {
        saveToGallery()
    }, [])
    return (
        < div >
            <div className='Arts-holder'>
                {GalleryItems.length > 0 &&
                    GalleryItems.map((item, Index) => {
                        return < GalleryItem handleUnselectArt={handleUnselectArt} handleSelectArt={handleSelectArt} Image={item.image} selected={item.selected} Index={Index} />
                    })
                }
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <button onClick={ListGallery} disabled={selectCount < 1} className='save-art-btn'>Listing ({selectCount})</button>
            </div>
            <Link to='/' onClick={scrollToPrompt}>
                <div className='create-nft-button'>
                    <svg width="84" height="84" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M39.2592 0.501953H44.4842C45.8721 0.706048 47.3007 0.828441 48.5661 1.07336C57.0739 2.51569 64.9278 6.55337 71.0515 12.6332C77.1751 18.713 81.2691 26.5376 82.7725 35.0348C83.0582 36.5451 83.2214 38.0962 83.4255 39.6066V44.8314L83.0583 47.8112C82.1724 54.3639 79.7415 60.6121 75.9662 66.0406C72.191 71.4692 67.1794 75.9228 61.3447 79.0338C55.51 82.1448 49.0192 83.8242 42.4079 83.9337C35.7965 84.0432 29.2538 82.5796 23.3193 79.6635C17.3848 76.7474 12.2284 72.4624 8.27548 67.1618C4.32251 61.8612 1.68613 55.6969 0.58379 49.1771C-0.518551 42.6574 -0.0552623 35.969 1.93537 29.6635C3.92601 23.358 7.38704 17.6159 12.033 12.9109C18.0906 6.70199 25.9686 2.58426 34.5243 1.15495C36.1979 0.869215 37.7489 0.706048 39.2592 0.501953Z" fill="url(#paint0_linear_1307_227)" />
                        <path d="M49.0046 31.6506H39.8488C39.3197 31.6506 38.8121 31.8608 38.4379 32.235C38.0637 32.6092 37.8535 33.1167 37.8535 33.6459C37.8535 34.1751 38.0637 34.6826 38.4379 35.0568C38.8121 35.431 39.3197 35.6412 39.8488 35.6412H42.4485V49.7055C42.4485 50.2347 42.6587 50.7422 43.0329 51.1164C43.4071 51.4906 43.9146 51.7008 44.4438 51.7008C44.973 51.7008 45.4805 51.4906 45.8547 51.1164C46.2289 50.7422 46.4391 50.2347 46.4391 49.7055V35.6384H49.0046C49.5338 35.6384 50.0413 35.4281 50.4155 35.0539C50.7897 34.6798 50.9999 34.1722 50.9999 33.643C50.9999 33.1138 50.7897 32.6063 50.4155 32.2321C50.0413 31.8579 49.5338 31.6477 49.0046 31.6477V31.6506Z" fill="white" />
                        <path d="M33.0878 39.6632H28.145V35.6384H33.0878C33.617 35.6384 34.1245 35.4281 34.4987 35.0539C34.8729 34.6798 35.0831 34.1722 35.0831 33.643C35.0831 33.1138 34.8729 32.6063 34.4987 32.2321C34.1245 31.8579 33.617 31.6477 33.0878 31.6477H26.1526C25.5908 31.8148 25.0958 32.1544 24.7377 32.6184C24.3796 33.0824 24.1765 33.6473 24.1572 34.2331V49.6998C24.1572 50.229 24.3674 50.7365 24.7416 51.1107C25.1158 51.4849 25.6234 51.6951 26.1526 51.6951C26.6818 51.6951 27.1893 51.4849 27.5635 51.1107C27.9377 50.7365 28.1479 50.229 28.1479 49.6998V43.6511H33.0906C33.6198 43.6511 34.1273 43.4408 34.5015 43.0666C34.8757 42.6924 35.086 42.1849 35.086 41.6557C35.086 41.1265 34.8757 40.619 34.5015 40.2448C34.1273 39.8706 33.6198 39.6604 33.0906 39.6604L33.0878 39.6632Z" fill="white" />
                        <path d="M18.2195 31.6506C17.6903 31.6506 17.1828 31.8608 16.8086 32.235C16.4344 32.6092 16.2241 33.1167 16.2241 33.6459V42.2743L10.9451 33.1328C10.9451 33.1072 10.9166 33.0872 10.9023 33.0644C10.4947 32.2549 9.89323 31.6392 8.99533 31.6392C8.46614 31.6392 7.95862 31.8494 7.58442 32.2236C7.21022 32.5978 7 33.1053 7 33.6345V49.6912C7 50.2204 7.21022 50.7279 7.58442 51.1021C7.95862 51.4763 8.46614 51.6866 8.99533 51.6866C9.52453 51.6866 10.032 51.4763 10.4062 51.1021C10.7804 50.7279 10.9907 50.2204 10.9907 49.6912V41.1911L16.264 50.3126C16.3066 50.3871 16.3542 50.4585 16.4066 50.5264C16.8427 51.1991 17.4156 51.6951 18.2223 51.6951C18.7515 51.6951 19.259 51.4849 19.6332 51.1107C20.0074 50.7365 20.2177 50.229 20.2177 49.6998V33.6459C20.2177 33.3836 20.1659 33.1239 20.0655 32.8817C19.965 32.6394 19.8178 32.4193 19.6322 32.234C19.4466 32.0487 19.2263 31.9017 18.9839 31.8016C18.7415 31.7015 18.4817 31.6502 18.2195 31.6506Z" fill="white" />
                        <path d="M66.7453 43.6913V44.2259C66.7453 46.529 66.7453 48.832 66.7453 51.135C66.7618 51.3791 66.7266 51.6239 66.642 51.8535C66.5574 52.0832 66.4252 52.2927 66.2542 52.4684C66.0831 52.6441 65.8769 52.7821 65.6489 52.8735C65.4209 52.9648 65.176 53.0076 64.9304 52.9989C64.6847 52.9902 64.4436 52.9303 64.2227 52.8231C64.0017 52.7158 63.8059 52.5636 63.6478 52.3763C63.4897 52.189 63.3727 51.9707 63.3047 51.7356C63.2367 51.5006 63.2192 51.2539 63.253 51.0116V43.6913H55.7931C55.5012 43.7009 55.2117 43.6371 54.9512 43.5057C54.6907 43.3744 54.4677 43.1797 54.3029 42.9399C54.1381 42.7 54.0368 42.4226 54.0083 42.1334C53.9798 41.8443 54.0251 41.5526 54.14 41.2855C54.2725 40.9419 54.5131 40.6501 54.826 40.4537C55.1388 40.2573 55.5071 40.1668 55.8758 40.1957H63.253V39.6816C63.253 37.3786 63.253 35.0755 63.253 32.7725C63.2453 32.4811 63.3118 32.1926 63.4464 31.9337C63.5809 31.6749 63.7791 31.4541 64.0225 31.292C64.2659 31.1298 64.5465 31.0316 64.8383 31.0064C65.1301 30.9813 65.4236 31.03 65.6914 31.1481C66.0257 31.2813 66.3094 31.5158 66.5023 31.8185C66.6951 32.1211 66.7873 32.4764 66.7659 32.8342C66.7659 35.1166 66.7659 37.3785 66.7659 39.661V40.1957H74.2051C74.4943 40.1893 74.7806 40.2542 75.0386 40.3845C75.2965 40.5148 75.5181 40.7064 75.6837 40.9424C75.8493 41.1784 75.9537 41.4515 75.9878 41.7373C76.0218 42.0231 75.9845 42.3129 75.8789 42.5809C75.7481 42.9229 75.5115 43.2148 75.2033 43.4144C74.895 43.6139 74.531 43.7109 74.1637 43.6913H66.7659H66.7453Z" fill="white" />
                        <defs>
                            <linearGradient id="paint0_linear_1307_227" x1="41.7127" y1="0.501953" x2="41.7127" y2="83.9395" gradientUnits="userSpaceOnUse">
                                <stop stopcolor="#2538CB" />
                                <stop offset="1" stopcolor="#B501D1" />
                            </linearGradient>
                        </defs>
                    </svg>

                </div>
            </Link>

        </ div>
    )
}

export default Gallery