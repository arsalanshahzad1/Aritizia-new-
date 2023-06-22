import React from 'react'

const EditProfile = () => {
    return (
        <>
            <div className="col-lg-7 col-md-7">
                <div className='inputfield-edit-profile'>
                    <div>

                        <div><p>Username</p> <p></p></div>
                        <input type="text" placeholder='Enter username' />
                    </div>
                    <div>

                        <div><p>Custom URL</p> <p></p></div>
                        <input type="url" placeholder='Enter your custom URL' />
                    </div>
                    <div>

                        <div><p>Bio</p> <p></p></div>
                        <input type="text" placeholder='Tell the world who are you!' />
                    </div>
                    <div>

                        <div><p>Email Address</p> <p></p></div>
                        <input type="email" placeholder='Enter email' />
                    </div>
                    <div>
                        <div><p>Your site</p> <p>optional</p></div>
                        <input type="url" placeholder='Enter website URL' />
                    </div>
                    <div>

                        <div><p>Instagram URL</p><p></p></div>
                        <input type="url" placeholder='Enter twitter URL' />
                    </div>
                    <div>

                        <div> <p>Twitter URL</p> <p></p></div>
                        <input type="url" placeholder='Enter instagram URL' />
                    </div>
                    <div>

                        <div><p>Wallet Address</p> <p></p></div>
                        <input type="text" placeholder='Enter wallet address' />
                    </div>
                    <div>
                        <div> <p>Phone Number</p> <p></p></div>
                        <input type="tel" placeholder='Enter your phone number' />
                    </div>
                    <div>
                        <button>Update Profile</button>
                    </div>
                </div>
            </div>
            <div className="col-lg-5 col-md-5">
                <div className='upload-image-cover'>
                    <div className='upload-img'>
                        <h2>Profile Image</h2>
                        <img src="/assets/images/user-pic.png" alt="" width={'100%'} />
                        <button>Upload</button>
                    </div>
                    <div className='upload-img'>
                        <h2>Cover Image</h2>
                        <img src="/assets/images/profile-1.png" alt="" width={'100%'} />
                        <button>Upload</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditProfile