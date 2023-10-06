import React from 'react'
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { AiOutlineClose } from "react-icons/ai";
import {
    connectWallet,
    getProviderOrSigner,
} from "../../methods/walletManager";

function HeaderConnectPopup({ connectPopup, setConnectPopup }) {
    const user = localStorage.getItem("data")

    return (
        <Modal
            show={connectPopup}
            onHide={() => setConnectPopup(false)}
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
                        <AiOutlineClose onClick={() => setConnectPopup(false)} />
                    </div>
                    <div className="logo">
                        <div><img src="/assets/logo/logo.png" alt="" /></div>
                        <div><img src="/assets/logo/logo-title-dark.png" alt="" /></div>
                    </div>
                    <div className="buttom-group">
                        <button onClick={connectWallet}>Connect Wallet</button>
                    </div>
                    {user === "false" &&
                        <div className="buttom-group">
                            <Link to={'/login'}>
                                <button>Sign-In</button>
                            </Link>
                            <Link to={'/register'}>
                                <button>Sign-Up</button>
                            </Link>
                        </div>
                    }
                </div>
            </div>
        </Modal>
    )
}

export default HeaderConnectPopup