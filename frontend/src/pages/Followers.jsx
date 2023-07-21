import { useState } from 'react'
import user from '../../public/assets/images/user-pic.png'
function Followers() {
    const [showOptions, setshowOptions] = useState(false)
    return (
        <div className='Follow-row'>
            <div className='left'>
                <div className='img-holder'>
                    <img src={user} alt="" />
                </div>
                <div className='txt'>
                    <p>Monica Lucas</p>
                    <p>161 Followers</p>
                </div>
            </div>
            <div className='right'>

                <button>Follow</button>

                <span onClick={() => { setshowOptions(!showOptions) }}>
                    <svg width="10" height="38" viewBox="0 0 10 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="5" cy="5" r="5" fill="#B5B5B5" />
                        <circle cx="5" cy="19" r="5" fill="#B5B5B5" />
                        <circle cx="5" cy="33" r="5" fill="#B5B5B5" />
                    </svg>
                </span>
                {showOptions &&
                    <div className='options'>
                        <div>Report</div>
                        <div>Block</div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Followers