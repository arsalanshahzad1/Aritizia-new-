import React, { useContext, useEffect } from 'react'
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { AiOutlineClose } from "react-icons/ai";
import { Store } from '../../Context/Store';

function EmailSigninPopup({ emailSigninPopup, setEmailSigninPopup }) {
    const user = localStorage.getItem("data")
    const userr = JSON.parse(localStorage.getItem("data"))
    const { account, connectWallet, checkIsWalletConnected } = useContext(Store);
    const accountAddress = localStorage.getItem("userAddress")

    useEffect(() => {
        checkIsWalletConnected()
    }, [account])
    return (
        <Modal
            show={emailSigninPopup}
            onHide={() => setEmailSigninPopup(false)}
            centered
            size="lg"
            className="header-connect-modal-wrap"
            backdrop="static"
            keyboard={false}
        >
            <div className="modal-body">
                <div className="top"></div>
                <div className="top-right-center"></div>
                <div className="right"></div>
                <div className="right-bottom-center"></div>
                <div className="bottom"></div>
                <div className="bottom-left-center"></div>
                <div className="left"></div>
                <div className="left-top-center"></div>
                <div className="main-data">
                    <div className="header-connect-close">
                        <AiOutlineClose onClick={() => setEmailSigninPopup(false)} />
                    </div>
                    <div className="logo">
                        <div><img src="/assets/logo/logo.png" alt="" /></div>
                        <div><img src="/assets/logo/logo-title-dark.png" alt="" /></div>
                    </div>
                    <div className="buttom-group">
                        <Link to={'/register'}>
                            <button>Sign-Up with Email</button>
                        </Link>

                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default EmailSigninPopup
