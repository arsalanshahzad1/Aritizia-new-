import { useState } from 'react'

const NftCard = ({ isClicked, isCompleted, index, img, handleRemoveImage }) => {
    return (
        <div >
            <div className={`${isClicked === "true" ? 'nft-is-clicked' : ""}`} key={index}>
                <img src={img} alt="" />
                <button className="remove-nft-image" onClick={() => handleRemoveImage(index)}>x</button>
            </div>
            {
                isCompleted === "true" &&
                <div className='Completed-layer'>
                    COMPLETED
                </div>
            }
        </div>
    )
}

export default NftCard