import { useContext, useState } from 'react'
import Header from './landingpage/Header'
import bird from '../../public/assets/images/bird.png'
import { GlobalContext } from '../Context/GlobalContext'
import ArtItem from './ArtItem'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TNL } from 'tnl-midjourney-api';
const Art = ({ search, setSearch }) => {
    const TNL_API_KEY = '79717817-c7c3-46a3-af8b-75843d6f7bfb';
    const tnl = new TNL(TNL_API_KEY);
    const promptt = 'a cat playing the piano';
    const response = tnl.imagine(promptt);

    console.log(JSON.stringify(response), 'response');
    const navigate = useNavigate()

    const { prompt, setprompt } = useContext(GlobalContext)
    const [generatedArts, setgeneratedArts] = useState([
        {
            image: bird,
            selected: false
        },
        {
            image: bird,
            selected: false
        },
        {
            image: bird,
            selected: false
        },
        {
            image: bird,
            selected: false
        },
    ])
    const [selectCount, setSelectCount] = useState(0)
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

    const saveToGallery = () => {
        const readyTobeSaved = generatedArts.filter(item => item.selected).map(item => item.image)
        console.log(readyTobeSaved, "we are ready to travel to Database")
        setgeneratedArts([])
        setprompt('')
        navigate('/profile')

    }

    return (
        < div className='art-page'>
            <Header search={search} setSearch={setSearch} />
            <h1 style={{ textAlign: 'center' }}>Your Generated Art</h1>
            <section className="home-first-section">
                <div className="home-first-wraperr">
                    <div className="search" id="prompt">

                        <button>Prompt</button>

                        <input
                            type="text"
                            placeholder="A cinematic wide shot of a hamster in a space suite, HD, NFT art, 2:3"
                            defaultValue={prompt}
                            onChange={(e) => setprompt(e.target.value)}
                        />
                    </div>
                </div>
                <div className="connect-wallet-mobile">
                    <button
                        // onClick={connectWallet}
                        className={`connect-wallet`}
                    >
                        {/*  className="connect-wallet"> */}
                        Connect Wallet
                    </button>
                </div>
            </section>
            {/* <div className='Arts-holder'>
                {generatedArts.length > 0 &&

                    generatedArts.map((item, Index) => {
                        return < ArtItem handleUnselectArt={handleUnselectArt} handleSelectArt={handleSelectArt} Image={item.image} selected={item.selected} Index={Index} />
                    })

                }
            </div> */}
            {/* <div style={{ display: "flex", justifyContent: "center" }}>

                <button onClick={saveToGallery} disabled={selectCount < 1} className='save-art-btn'>Save to Gallery ({selectCount})</button>
            </div> */}
        </ div>
    )
}

export default Art