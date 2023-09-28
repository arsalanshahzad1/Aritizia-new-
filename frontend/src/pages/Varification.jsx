import React from 'react'
import { Link } from 'react-router-dom';
import VerificationInput from "react-verification-input";

function Varification() {
  return (
    <div className="varification">
        <div className="varification-card">
            <h1 className='title'></h1>
            <p className='desc'></p>
            <p className='email'></p>
            <VerificationInput  length={4}/>
            <p>Didn’t receive code? <Link>Resend</Link></p>
            <button></button>
        </div>
    </div>
  )
}

export default Varification