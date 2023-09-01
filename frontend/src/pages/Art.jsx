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
const Art = ({ search, setSearch }) => {
    const navigate = useNavigate()
    const [loader, setLoader] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const { prompt, setprompt } = useContext(GlobalContext)
    const [generatedArts, setgeneratedArts] = useState([])
    const [base64Images, setBase64Images] = useState()
    const [selectCount, setSelectCount] = useState(0)
    const buttonRef = useRef(null);
    const id = JSON.parse(localStorage.getItem("data"));
    const user_id = id?.id;
    useEffect(() => {
        const count = generatedArts.filter(item => item.selected).length;
        setSelectCount(count)
    }, [generatedArts])
    const handleSelectArt = (index) => {
        console.log("I'm being selected", index);
        const updatedArts = [...generatedArts];
        updatedArts[index].selected = true;
        setgeneratedArts(updatedArts);
    };

    const handleUnselectArt = (index) => {
        console.log("I'm being unselected", index);
        const updatedArts = [...generatedArts];
        updatedArts[index].selected = false;
        setgeneratedArts(updatedArts);
    };



    const [midjourneyId, setMidjourneyId] = useState('')

    const getMidjourneyId = async (event) => {
        // console.log(event , 'adasdasdas');
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
    };

    const getMidjourneyImagesFromId = async () => {
        console.log(midjourneyId, 'id');
        try {
            // const response = await apis.getMidjourneyImagesFromId()
            const response = await apis.getMidjourneyImagesFromId(midjourneyId)
            if (response?.data?.progress < 100 || response?.data?.progress == 'incomplete') {
                getMidjourneyImagesFromId()
            } else {
                let tempImages = []
                for (let index = 0; index < response?.data?.response?.imageUrls?.length; index++) {
                    tempImages.push({ image: response?.data?.response?.imageUrls?.[index], selected: false })
                }
                setgeneratedArts(tempImages)
                setprompt('')
                setLoader(false)
                setMidjourneyId('')
            }
        } catch (error) {
            console.log('error');
            getStabilityImages()
            setMidjourneyId('')
            // setLoader(false)

        }
    }


    useEffect(() => {
        if (midjourneyId !== '') {
            getMidjourneyImagesFromId()
        }

    }, [midjourneyId])

    useEffect(() => {
        console.log('outslide');
        if (prompt !== '') {
            buttonRef.current.click();
        }

    }, [])


    const getStabilityImages = async () => {

        const body = {
            width: 512,
            height: 512,
            steps: 10,
            seed: 0,
            cfg_scale: 0,
            samples: 4,
            style_preset: "anime",
            text_prompts: [
                {
                    text: prompt,
                    weight: 1,
                },
            ],
        };

        try {
            const response = await apis.getStabilityImages(body);
            // let tempimages = []
            // for (let i = 0; i < response?.data?.artifacts.length; i++) {
            //     tempimages.push(response?.data?.artifacts?.[i]?.base64)
            // }
            // setBase64Images(tempimages)
            // console.log(response, 'dddddd');
            // console.log(base64Images, 'dddddd');
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
            let tempImages = []
            for (let index = 0; index < urls.length; index++) {
                tempImages.push({ image: urls?.[index], selected: false, base64Images: response?.data?.artifacts?.[index]?.base64 })
            }
            console.log(response, "data");

            setgeneratedArts(tempImages);
            setprompt('')
            setLoader(false)
        } catch (error) {
            console.error("Error fetching data:", error);
            setgeneratedArts([])
            setErrorMessage('Oops something went wrong, please try again')
            setLoader(false)
            setprompt('')
        }
    };

    const saveToGallery = async () => {
        let readyTobeSaved;
        if (generatedArts?.[0].base64Images) {

            readyTobeSaved = generatedArts.filter(item => item.selected).map(item => item.base64Images)
            console.log(readyTobeSaved, "we are ready to travel to Database")
            // console.log(base64Images
            //     , "we are ready to travel to Database")
        } else {
            readyTobeSaved = generatedArts.filter(item => item.selected).map(item => item.image)
            console.log(readyTobeSaved, "we are ready to travel to Database")
            console.log(generatedArts, "we are ready to travel to Database")
        }

        const sendData = new FormData();
        sendData.append('user_id', user_id);

        for (let i = 0; i < readyTobeSaved.length; i++) {
            sendData.append('gallery_images[]', readyTobeSaved[i]);
        }
        console.log(sendData);
        const response = await apis.createArtGalleryImages(sendData);
        console.log(response);
        if (response.status) {
            // setgeneratedArts([])
            setprompt('')
            setTimeout(() => {
                navigate('/profile')
            }, 3000)
        }
    }

    // useEffect(() => {
    //     console.log(imageUrls, "images array");
    // }, [imageUrls]);

    return (
        < div className='art-page'>
            {loader && <Loader />}

            <Header search={search} setSearch={setSearch} />
            <h1 style={{ textAlign: 'center' }}>Your Generated Art</h1>
            <section className="home-first-section">
                <div className="home-first-wraperr">
                    <div className="search" id="prompt">
                        <button ref={buttonRef} onClick={getMidjourneyId}>Prompt</button>
                        <input
                            type="text"
                            placeholder="A cinematic wide shot of a hamster in a space suite, HD, NFT art, 2:3"
                            value={prompt}
                            onChange={(e) => setprompt(e.target.value)}
                            required
                            minLength={3}
                        />
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
    )
}

export default Art