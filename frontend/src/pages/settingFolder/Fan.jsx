import user from '../../../public/assets/images/user-pic.png'
import { useState } from 'react'
function Fan() {
    const [showConfirmation, setshowConfirmation] = useState(false)
    return (
        <>
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
                    <button onClick={() => setshowConfirmation(true)} className='unfollow no-margin'>Remove</button>
                </div>
            </div>
            {showConfirmation && (
                <>
                    <div className='BackScreen-dark'>
                        <div className='confirmation-pop-up'>
                            <p className='weight-600'>Are you sure you want to remove this Fan ?</p>
                            <div className="popUp-btn-group">
                                <div
                                    className="button-styling-outline btnCC"
                                >
                                    <div onClick={() => setshowConfirmation(false)} className="btnCCin">Cancel</div>
                                </div>
                                <div className="button-styling btnCC">
                                    Confirm
                                </div>

                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
export default Fan