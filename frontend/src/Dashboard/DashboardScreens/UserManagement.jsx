import React from 'react'
import Header from '../../pages/landingpage/Header'

function UserManagement({ search, setSearch }) {
    return (
        <div className='user-management'>
            <Header

                search={search}
                setSearch={setSearch}
            />
            <div className='user-management-after-header'>
                <div className='dashboard-front-section-2'>
                    <div className='dashboard-front-section-2-row-1'>
                        <div className='df-s2-r1-c1'>
                            <div className='User-management-txt'>USER MANAGEMENT</div>

                        </div>
                        <div className='controls-for-user-management'>
                            <div className='dashboard-drop-down'>
                                Monthly
                                <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.98009 9C6.83131 8.98977 6.68991 8.92162 6.57886 8.80668L5.74292 7.84011L0.334397 1.56713C0.252801 1.46609 0.179994 1.35599 0.117044 1.23847L0 1.04514L0 0.70687C0.14211 0.262251 0.376164 0.0592894 0.668743 0.0592894C0.790901 0.0633694 0.911057 0.0963116 1.02176 0.156158C1.13247 0.216005 1.23139 0.301472 1.31244 0.407238C2.7001 2.03106 4.09334 3.642 5.49215 5.24005L6.99683 6.98953L12.7397 0.329896C12.8838 0.143929 13.0845 0.0296689 13.2998 0.010973C13.3717 -0.00365766 13.4453 -0.00365766 13.5172 0.010973C13.6237 0.0483471 13.7207 0.115497 13.7994 0.206539C13.8782 0.297582 13.9363 0.409686 13.9686 0.532896C14.0021 0.657133 14.0089 0.788914 13.9885 0.91689C13.9681 1.04487 13.9211 1.16521 13.8516 1.26749L13.7345 1.40283L12.8986 2.36939L7.53185 8.58438C7.40778 8.71781 7.25914 8.81694 7.09714 8.87434L6.98009 9Z" fill="#929292" />
                                </svg>

                            </div>
                            <div className='search-div-small'>
                                <svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.1889 20.0218C17.9957 20.0188 17.8095 19.9496 17.6612 19.8259C17.6037 19.7835 17.5528 19.7327 17.5104 19.6751L14.0881 16.2678L13.8167 16.1773C12.3296 17.3656 10.4884 18.0235 8.58504 18.0468C7.858 18.0448 7.13396 17.9537 6.42909 17.7754C4.39054 17.2841 2.61325 16.04 1.45381 14.2927C0.591552 13.0114 0.0932032 11.5202 0.01185 9.97792C-0.0695031 8.43566 0.269192 6.90023 0.99187 5.53535C1.71455 4.17046 2.79411 3.02729 4.11542 2.22771C5.43672 1.42813 6.9502 1.00213 8.49459 0.995117C10.5915 1.01111 12.6113 1.78795 14.1785 3.18123C15.8036 4.63958 16.8078 6.66538 16.9845 8.84172C17.1612 11.0181 16.4969 13.1793 15.1284 14.8807L15.0379 15.0013L15.1584 15.0918L15.3695 15.2426L18.7015 18.5745C18.8223 18.6715 18.9122 18.8016 18.9604 18.9488C19.0086 19.096 19.0129 19.2541 18.9729 19.4037C18.9294 19.5792 18.8287 19.7351 18.6868 19.847C18.5448 19.959 18.3696 20.0205 18.1889 20.0218ZM8.49459 2.63847C6.66724 2.63847 4.91478 3.36437 3.62265 4.6565C2.33052 5.94864 1.60454 7.70114 1.60454 9.52849C1.60454 11.3558 2.33052 13.1083 3.62265 14.4005C4.91478 15.6926 6.66724 16.4185 8.49459 16.4185C10.3195 16.4146 12.0691 15.69 13.3623 14.4024C14.6555 13.1148 15.3878 11.3685 15.3997 9.54358C15.4037 8.63948 15.2293 7.74348 14.8865 6.90687C14.5437 6.07026 14.0393 5.30947 13.4021 4.66807C12.7649 4.02668 12.0075 3.51726 11.1731 3.16899C10.3388 2.82072 9.44397 2.64044 8.53986 2.63847H8.49459Z" fill="#C0C0C0" />
                                </svg>
                                Search

                            </div>
                        </div>
                    </div>
                </div>
                <div className='table-for-user-management'>
                    <table className='data-table'>
                        <thead>
                            <tr>
                                <td>Sl. No.</td>
                                <td>Wallet Address</td>
                                <td>Name</td>
                                <td>Total NFTs</td>
                                <td>Email</td>
                                <td>Phone Number</td>
                                <td>Action</td>
                            </tr>
                            <hr className='space-between-rows'></hr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>01</td>
                                <td>xasda2678xafasqw897654as</td>
                                <td>Naqi</td>
                                <td>120</td>
                                <td>naqi@pluton.com</td>
                                <td>00 000 0000000</td>
                                <td>
                                    <svg width="25" height="6" viewBox="0 0 25 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="3" cy="3" r="3" fill="#B600D1" />
                                        <circle cx="13" cy="3" r="3" fill="#B600D1" />
                                        <circle cx="22" cy="3" r="3" fill="#B600D1" />
                                    </svg>
                                </td>
                            </tr>
                            <hr className='space-between-rows'></hr>
                            <tr>
                                <td>01</td>
                                <td>xasda2678xafasqw897654as</td>
                                <td>Naqi</td>
                                <td>120</td>
                                <td>naqi@pluton.com</td>
                                <td>00 000 0000000</td>
                                <td>
                                    <svg width="25" height="6" viewBox="0 0 25 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="3" cy="3" r="3" fill="#B600D1" />
                                        <circle cx="13" cy="3" r="3" fill="#B600D1" />
                                        <circle cx="22" cy="3" r="3" fill="#B600D1" />
                                    </svg>
                                </td>
                            </tr>
                            <hr className='space-between-rows'></hr>
                            <tr>
                                <td>01</td>
                                <td>xasda2678xafasqw897654as</td>
                                <td>Naqi</td>
                                <td>120</td>
                                <td>naqi@pluton.com</td>
                                <td>00 000 0000000</td>
                                <td>
                                    <svg width="25" height="6" viewBox="0 0 25 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="3" cy="3" r="3" fill="#B600D1" />
                                        <circle cx="13" cy="3" r="3" fill="#B600D1" />
                                        <circle cx="22" cy="3" r="3" fill="#B600D1" />
                                    </svg>
                                </td>
                            </tr>
                            <hr className='space-between-rows'></hr>
                            <tr>
                                <td>01</td>
                                <td>xasda2678xafasqw897654as</td>
                                <td>Naqi</td>
                                <td>120</td>
                                <td>naqi@pluton.com</td>
                                <td>00 000 0000000</td>
                                <td>
                                    <svg width="25" height="6" viewBox="0 0 25 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="3" cy="3" r="3" fill="#B600D1" />
                                        <circle cx="13" cy="3" r="3" fill="#B600D1" />
                                        <circle cx="22" cy="3" r="3" fill="#B600D1" />
                                    </svg>
                                </td>
                            </tr>
                            <hr className='space-between-rows'></hr>
                            <tr>
                                <td>01</td>
                                <td>xasda2678xafasqw897654as</td>
                                <td>Naqi</td>
                                <td>120</td>
                                <td>naqi@pluton.com</td>
                                <td>00 000 0000000</td>
                                <td>
                                    <svg width="25" height="6" viewBox="0 0 25 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="3" cy="3" r="3" fill="#B600D1" />
                                        <circle cx="13" cy="3" r="3" fill="#B600D1" />
                                        <circle cx="22" cy="3" r="3" fill="#B600D1" />
                                    </svg>

                                </td>
                            </tr>
                            <hr className='space-between-rows'></hr>
                            <tr>
                                <td>01</td>
                                <td>xasda2678xafasqw897654as</td>
                                <td>Naqi</td>
                                <td>120</td>
                                <td>naqi@pluton.com</td>
                                <td>00 000 0000000</td>
                                <td>
                                    <svg width="25" height="6" viewBox="0 0 25 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="3" cy="3" r="3" fill="#B600D1" />
                                        <circle cx="13" cy="3" r="3" fill="#B600D1" />
                                        <circle cx="22" cy="3" r="3" fill="#B600D1" />
                                    </svg>

                                </td>
                            </tr>
                            <hr className='space-between-rows'></hr>
                            <tr>
                                <td>01</td>
                                <td>xasda2678xafasqw897654as</td>
                                <td>Naqi</td>
                                <td>120</td>
                                <td>naqi@pluton.com</td>
                                <td>00 000 0000000</td>
                                <td>
                                    <svg width="25" height="6" viewBox="0 0 25 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="3" cy="3" r="3" fill="#B600D1" />
                                        <circle cx="13" cy="3" r="3" fill="#B600D1" />
                                        <circle cx="22" cy="3" r="3" fill="#B600D1" />
                                    </svg>

                                </td>
                            </tr>
                            <hr className='space-between-rows'></hr>
                            <tr>
                                <td>01</td>
                                <td>xasda2678xafasqw897654as</td>
                                <td>Naqi</td>
                                <td>120</td>
                                <td>naqi@pluton.com</td>
                                <td>00 000 0000000</td>
                                <td>
                                    <svg width="25" height="6" viewBox="0 0 25 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="3" cy="3" r="3" fill="#B600D1" />
                                        <circle cx="13" cy="3" r="3" fill="#B600D1" />
                                        <circle cx="22" cy="3" r="3" fill="#B600D1" />
                                    </svg>

                                </td>
                            </tr>
                            <hr className='space-between-rows'></hr>
                            <tr>
                                <td>01</td>
                                <td>xasda2678xafasqw897654as</td>
                                <td>Naqi</td>
                                <td>120</td>
                                <td>naqi@pluton.com</td>
                                <td>00 000 0000000</td>
                                <td>
                                    <svg width="25" height="6" viewBox="0 0 25 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="3" cy="3" r="3" fill="#B600D1" />
                                        <circle cx="13" cy="3" r="3" fill="#B600D1" />
                                        <circle cx="22" cy="3" r="3" fill="#B600D1" />
                                    </svg>

                                </td>
                            </tr>
                            <hr className='space-between-rows'></hr>
                            <tr>
                                <td>01</td>
                                <td>xasda2678xafasqw897654as</td>
                                <td>Naqi</td>
                                <td>120</td>
                                <td>naqi@pluton.com</td>
                                <td>00 000 0000000</td>
                                <td>
                                    <svg width="25" height="6" viewBox="0 0 25 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="3" cy="3" r="3" fill="#B600D1" />
                                        <circle cx="13" cy="3" r="3" fill="#B600D1" />
                                        <circle cx="22" cy="3" r="3" fill="#B600D1" />
                                    </svg>

                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}

export default UserManagement