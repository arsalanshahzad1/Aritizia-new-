import React, { useState } from 'react'
import { BsCheck } from 'react-icons/bs';
import { useNavigate, Link } from 'react-router-dom'
import Modal from "react-bootstrap/Modal";
import VerificationInput from "react-verification-input";
import apis from '../service';
import { ToastContainer, toast } from "react-toastify";
import EmailMasked from '../components/shared/EmailMasked';



function Register() {
    const [chack, setChack] = useState(false);
    const [varificationPopup, setVarificationPopup] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [registerData, setRegisterData] = useState('');
    const navigate = useNavigate()

    const getOtp = (event) => {
        setOtpCode(event)
    }

    const onChangeHandler = (e) => {
        const { value, name } = e.target;
        setRegisterData((prevState) => ({ ...prevState, [name]: value }));
        console.log(registerData);
    };

    const registerUser = async (event) => {
        event.preventDefault()
        try {
            const response = await apis.register(registerData)
            console.log(response?.data?.data?.status, 'status');
            console.log(response?.data?.message, 'message');
            if (response?.data?.data?.status) {
                toast.success(response?.data?.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                setVarificationPopup(true)
            }
            console.log(response);
        } catch (error) {
            toast.error(error?.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
            console.log(error?.message);
        }
    }
    const verifyOtp = async (event) => {
        event.preventDefault()
        try {
            const response = await apis.verifyOtp({email: registerData?.email , otp : otpCode})
            console.log(response?.data?.status , 'status');
            console.log(response?.data?.message , 'message');
            if (response?.data?.status) {
                toast.success(response?.data?.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                setVarificationPopup(false);
                navigate('/login')
            }
            console.log(response);
        } catch (error) {
            toast.error(error?.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
            console.log(error?.message);
        }
    }
    const resentOtp = async (event) => {
        event.preventDefault()
        try {
            const response = await apis.resendOtp(registerData?.email)
            console.log(response?.data?.status , 'status');
            console.log(response?.data?.message , 'message');
            if (response?.data?.status) {
                toast.success(response?.data?.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
            console.log(response);
        } catch (error) {
            toast.error(error?.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
            console.log(error?.message);
        }
    }


    return (
        <>
            <div className="registor">
                <div className="registor-wrap">
                    <div className="left">
                        <img src="/assets/images/register.png" alt="" />
                    </div>
                    <div className="right">
                        <div className="content">
                            <Link to={'/'}>
                                <img src="/assets/logo/logo.png" alt="logo" />
                            </Link>
                            <h1 className='title'>Create your account</h1>
                            <p className='desc'>Let’s get started</p>
                            <form onSubmit={registerUser}>
                                <input type="text" name="first_name" onChange={onChangeHandler} id="" placeholder='First name' required />
                                <input type="text" name="last_name" onChange={onChangeHandler} id="" placeholder='Last name' required />
                                <input type="email" name="email" onChange={onChangeHandler} id="" placeholder='Email Address' required />
                                <input type="password" name="password" onChange={onChangeHandler} id="" placeholder='Password' required />
                                <div className="term-condition">
                                    <div className="one">
                                        <div className="registor-chack" onClick={() => { setChack(!chack) }}>
                                            <span>
                                                <BsCheck className={`${chack ? "red" : "transparent"}`} />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="two">
                                        <p>I agree to all Term, Privacy Policy and fees</p>
                                    </div>
                                </div>
                                <button type='submit' className={`signup ${!chack ? 'disable' : ''}`}>Sign up</button>
                                <div className="sign-up">
                                    <p>Already have an account? <Link to={'/login'}>Sign in</Link></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                show={varificationPopup}
                onHide={() => setVarificationPopup(false)}
                centered
                size="lg"
                className="varification-modal-wrap"
                backdrop="static"
                keyboard={false}
            >
                <div className="modal-body">
                    <h1 className='title'>Email Verification</h1>
                    <p className="desc">We have sent code to your email:</p>
                    <p className="email"><EmailMasked email={registerData?.email} /></p>
                    <VerificationInput
                        length={4}
                        placeholder=''
                        classNames={{
                            container: "container",
                            character: "character",
                            characterInactive: "character--inactive",
                            characterSelected: "character--selected",
                        }}
                        onChange={getOtp}
                    />
                    <p className="resent-code">Didn’t receive code? <Link onClick={resentOtp}> Resend </Link></p>
                    <button className='varify-code' onClick={verifyOtp}>Verify Account</button>
                </div>
            </Modal>
            <ToastContainer />
        </>

    )
}

export default Register