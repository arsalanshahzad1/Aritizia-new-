import React, { useState } from 'react'
import { BsCheck } from 'react-icons/bs'
import {useNavigate, Link } from 'react-router-dom';
import {  toast } from "react-toastify";
import apis from '../service';

function Login() {
    const [chack, setChack] = useState(false);
    const [loader, setLoader] = useState(false);
  
    const [registerData, setRegisterData] = useState('');
    const navigate = useNavigate()

    const loginWithEmail = async (event) => {
        event.preventDefault()
        try {
            setLoader(true)
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
            console.log(error?.message);
        }
    }

    const onChangeHandler = (e) => {
        const { value, name } = e.target;
        setRegisterData((prevState) => ({ ...prevState, [name]: value }));
        console.log(registerData);
    };
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
                            <p className='desc'>Welcome to Artizia, please enter your login details below to using the app</p>
                            <form onSubmit={loginWithEmail}>
                                <input type="email" name="email" id="" placeholder='Email Address' onChange={onChangeHandler} />
                                <input type="password" name="password" id="" placeholder='Password' onChange={onChangeHandler} />
                                <Link to={''} className='forget-pass'>Forget the password?</Link>
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
        </>
    )
}

export default Login