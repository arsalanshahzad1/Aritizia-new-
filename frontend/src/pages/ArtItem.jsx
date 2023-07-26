import { useState, useEffect } from 'react'
const ArtItem = ({ handleSelectArt, handleUnselectArt, Image, Index, selected }) => {
    const [isSelected, setIsSelected] = useState(selected)

    useEffect(() => {
        setIsSelected(selected)
    }, [selected])

    console.log(Image, "image in art")
    const selectDecision = () => {
        if (selected) {
            handleUnselectArt(Index)
        }
        else {
            handleSelectArt(Index)
        }
    }
    return (
        <div className='art-img-div'>
            <span onClick={selectDecision} className='select-art-btn'>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="18" r="18" fill={`${selected ? "#B600D1" : "#7F7E7E"}`} fill-opacity="0.5" />
                    <path d="M16.29 22.9999C16.1452 23.0021 16.0014 22.9743 15.8676 22.918C15.7337 22.8617 15.6125 22.7781 15.5113 22.6724L11.3176 18.4016C11.114 18.1894 11 17.9043 11 17.6074C11 17.3105 11.114 17.0254 11.3176 16.8131C11.4197 16.7087 11.5411 16.6258 11.6747 16.5692C11.8083 16.5126 11.9516 16.4835 12.0962 16.4835C12.2409 16.4835 12.3841 16.5126 12.5177 16.5692C12.6514 16.6258 12.7727 16.7087 12.8749 16.8131L16.29 20.2967L23.1201 13.3296C23.2223 13.2251 23.3437 13.1422 23.4773 13.0857C23.6109 13.0291 23.7541 13 23.8988 13C24.0434 13 24.1867 13.0291 24.3203 13.0857C24.4539 13.1422 24.5753 13.2251 24.6774 13.3296C24.7797 13.4332 24.8608 13.5564 24.9161 13.6921C24.9715 13.8279 25 13.9734 25 14.1204C25 14.2674 24.9715 14.4129 24.9161 14.5486C24.8608 14.6843 24.7797 14.8075 24.6774 14.9111L17.0754 22.6655C16.9731 22.772 16.8508 22.8564 16.7159 22.9139C16.581 22.9713 16.4362 23.0006 16.29 22.9999Z" fill="white" />
                </svg>
            </span>
            {isSelected &&
                <div className='selected-tint-art'></div>
            }
            <img src={Image} alt="" />
        </div>
    )
}

export default ArtItem