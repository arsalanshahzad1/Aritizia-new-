import React, { useState } from 'react'
import { BsCheck } from 'react-icons/bs'
import { useNavigate, Link } from 'react-router-dom';
import { toast } from "react-toastify";
import apis from '../service';
import Loader from '../components/shared/Loader';
import Modal from "react-bootstrap/Modal";
import EmailMasked from '../components/shared/EmailMasked';
import VerificationInput from 'react-verification-input';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

function Login({loader,setLoader}) {
    const [chack, setChack] = useState(false);
    // const [loader, setLoader] = useState(false);
    const [forget, setForget] = useState(false);
    const [changePass, setChangePass] = useState(false);
    const [registerData, setRegisterData] = useState('');
    const [varificationPopup, setVarificationPopup] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate()
    const [showPass, setShowPass] = useState(false);
    const [showResetPass, setShowResetPass] = useState(false);

    const loginWithEmail = async (event) => {
        event.preventDefault()
        setLoader(true)
        try {
            const response = await apis.loginWithEmail(registerData)
            console.log(response?.data?.data, 'data');
            console.log(response?.data?.data?.status, 'status');
            console.log(response?.data?.message, 'message');
            if (response?.data?.data?.status) {
                toast.success(response?.data?.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                localStorage.removeItem("data")
                localStorage.setItem("data", JSON.stringify(response?.data?.data));
                navigate('/')
            }

            setLoader(false)
            console.log(response);
        } catch (error) {

            setLoader(false)
            toast.error(error?.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
            if(error?.message === 'Please verify your email before logging in.'){
                resentOtp();
                setVarificationPopup(true)
            }
            console.log(error?.message);

        }
    }

    const onChangeHandler = (e) => {
        const { value, name } = e.target;
        setRegisterData((prevState) => ({ ...prevState, [name]: value }));
        console.log(registerData);
    };

    const forgetPassword = async (event) => {
        event.preventDefault()
        setLoader(true)
        try {
            const response = await apis.forgotPassword({ email: email })
            if(response.status){
                setForget(false)
                setChangePass(true)
                toast.success(response?.data?.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                setLoader(false)
            }
        } catch (error) {
            toast.error(error.message , {
                position: toast.POSITION.TOP_RIGHT,
            });   
            setLoader(false)
        }
    }

    const resendForgotOtp = async (event) => {
        event.preventDefault()
        setLoader(true)
        try {
            const response = await apis.resendForgotOtp({email:email})
            if (response?.data?.status) {
                toast.success(response?.data?.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
            console.log(response);
            setLoader(false)
        } catch (error) {
            toast.error(error?.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
            console.log(error?.message);
            setLoader(false)
        }
    }

    const forgotVerify = async (event) =>{
        event.preventDefault()
        setLoader(true)
        try {
            const response = await apis.forgotVerify({email:email , otp : otpCode , password: password})
            if (response?.data?.status) {
                toast.success(response?.data?.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                setChangePass(false)
                
            }
            setLoader(false)
        } catch (error) {
            toast.error(error?.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
            setLoader(false)
        }
    }

    const getOtp = (event) => {
        setOtpCode(event)
    }

    const resentOtp = async (event) => {
        event.preventDefault()
        try {
            const response = await apis.resendOtp(email)
            console.log(response?.data?.status, 'status');
            console.log(response?.data?.message, 'message');
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

    const verifyOtp = async (event) => {
        event.preventDefault()
        try {
            const response = await apis.verifyOtp({ email: registerData?.email, otp: otpCode })
            console.log(response?.data?.status, 'status');
            console.log(response?.data?.message, 'message');
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

    console.log(password, 'sdasdasda');
    return (
        <>
            {loader && <Loader />}
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
                            <h1 className='title'>Account Login</h1>
                            <p className='desc'>Welcome to Artizia, please enter your login details below.</p>
                            <form onSubmit={loginWithEmail}>
                                <input type="email" name="email" id="" placeholder='Email Address' onChange={onChangeHandler} />
                                <div className="pass">
                                <input type={showPass ? "text" : "password"} name="password" id="" placeholder='Password' onChange={onChangeHandler} />
                                {showPass ?<span onClick={() =>{setShowPass(!showPass)}}><FaRegEye/></span>  : <span onClick={() =>{setShowPass(!showPass)}}><FaRegEyeSlash/></span> }
                                </div>
                                <Link to={''} className='forget-pass' onClick={() => setForget(true)}>Forgot Password?</Link>
                                <button type='submit' disabled={loader} className={`signup ${loader ? 'disable' : ''}`}>Sign in</button>
                                <div className="or">
                                    <div className='middle-line'></div>
                                    <span>OR</span>
                                </div>
                                <button type='button' className={`signin`}><Link to={'/register'}>Sign up</Link></button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                show={forget}
                onHide={() => setForget(false)}
                centered
                size="lg"
                className="varification-modal-wrap"
                backdrop="static"
                keyboard={false}
            >
                <div className="modal-body">
                    <form onSubmit={forgetPassword}>
                        <h1 className='title'>Forget Password</h1>
                        <input type="email" onChange={(e) => { setEmail(e.target.value) }} id='email' placeholder='Enter email' className='email-forget' required />
                        <p className="desc-forget">We’ll send a verification OTP code to this email if it matches an existing Aritizia account.</p>
                        {/* <p className="email">
                        <EmailMasked email={registerData?.email} />
                        </p> */}
                        {/* <VerificationInput
                        length={4}
                        placeholder=''
                        classNames={{
                            container: "container",
                            character: "character",
                            characterInactive: "character--inactive",
                            characterSelected: "character--selected",
                        }}
                        onChange={}
                    /> */}
                        {/* <p className="resent-code">Didn’t receive code? <Link onClick={resentOtp}> Resend </Link></p> */}
                        <button className='varify-code'>Next</button>
                    </form>
                        <button className='back' onClick={() => setForget(false)}>Cancle</button>
                </div>
            </Modal>
            <Modal
                show={changePass}
                onHide={() => setChangePass(false)}
                centered
                size="lg"
                className="varification-modal-wrap"
                backdrop="static"
                keyboard={false}
            >
                <div className="modal-body">
                    <form onSubmit={forgotVerify}>
                        <h1 className='title'>Forget Password</h1>
                        <input type="email" value={email} disabled id='email' placeholder='Enter email' className='password-forget' required />
                        <div className="pass">
                        <input type={showResetPass ? "text":"password"}  onChange={(e) => setPassword(e.target.value)} placeholder='Enter new password' className='password-forget' required />
                        {showResetPass ?<span onClick={() =>{setShowResetPass(!showResetPass)}}><FaRegEye/></span>  : <span onClick={() =>{setShowResetPass(!showResetPass)}}><FaRegEyeSlash/></span> }
                        </div>
                        <p className='resent-code-login' onClick={resendForgotOtp}>Recent code</p>
                        {/* <p className="email">
                        <EmailMasked email={registerData?.email} />
                        </p> */}
                        <p className="desc-change" style={{textAlign : 'center'}}>We have sent code to your email</p>
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
                        {/* <p className="resent-code">Didn’t receive code? <Link onClick={resentOtp}> Resend </Link></p> */}
                        <button className='varify-code' style={{marginTop:'40px'}}>Submit</button>
                    </form>
                </div>
            </Modal>
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
                    <p className="email"><EmailMasked email={email} /></p>
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
        </>
    )
}

export default Login