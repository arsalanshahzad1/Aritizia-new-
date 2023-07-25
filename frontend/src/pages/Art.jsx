import { useState } from 'react'
import Header from './landingpage/Header'
import imagenft from '../../public/assets/images/bird.png'
const Art = ({ search, setSearch }) => {
    return (
        <div>
            <Header search={search} setSearch={setSearch} />

            <div className='Arts-holder'>
                <div className='art-img-div'>

                <img src={imagenft} alt="" />
                </div>
            </div>
        </div>
    )
}

export default Art