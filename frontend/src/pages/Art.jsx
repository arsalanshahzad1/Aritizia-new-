import { useContext, useState } from 'react'
import Header from './landingpage/Header'
import bird from '../../public/assets/images/bird.png'
import { GlobalContext } from '../Context/GlobalContext'
import ArtItem from './ArtItem'
import { useEffect } from 'react'
const Art = ({ search, setSearch }) => {
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

    return (
        < div >
            <Header search={search} setSearch={setSearch} />
            <br /><br /><br /><br />
            <br /><br />
            <h1 style={{ textAlign: 'center' }}>Your Generated Art</h1>
            <div className='Arts-holder'>
                {generatedArts.length > 0 &&

                    generatedArts.map((item, Index) => {
                        return < ArtItem handleUnselectArt={handleUnselectArt} handleSelectArt={handleSelectArt} Image={item.image} selected={item.selected} Index={Index} />
                    })

                }
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>

                <button className='save-art-btn'>Save to Gallery ({selectCount})</button>
            </div>
        </ div>
    )
}

export default Art