import React, { useEffect, useState } from 'react'
import DashboardToggle from '../SVG/DashboardToggle'
import { useContext } from 'react'
import { GlobalContext } from '../../Context/GlobalContext'
import { NavLink, useLocation } from 'react-router-dom'
import { IoCloseSharp } from "react-icons/io5"

function Sidebar() {
    const location = useLocation();
    console.log(location.pathname);
    // useEffect(() =>{} , [currentURL])
    const { sidebarCollapsed, setsidebarCollapsed, DashboardActiveTab, setDashboardActiveTab } = useContext(GlobalContext)
    return (
        <div className={`Sidebar ${sidebarCollapsed && 'sidebar-collapsed'}`}>
            <div className='sidebar-inner'>
               { 
                sidebarCollapsed ? 
                    <div onClick={() => setsidebarCollapsed(!sidebarCollapsed)} className='dashboard-toggle'>
                        <DashboardToggle />
                    </div> : 
                    <div onClick={() => setsidebarCollapsed(!sidebarCollapsed)} className='dashboard-toggle'>
                       <IoCloseSharp fontSize="40px"/>
                    </div>
                    
                }
                <div className={`sidebar-nav}`}>
                    <NavLink to="/dashboard">
                        <div onClick={() => setDashboardActiveTab("dashboard")} className={`sidebar-nav-item ${location.pathname === '/dashboard' ? "active-sidebar-item" : ""}`}>
                            <div className='svg-div'>
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.5759 -0.000488281H11.3266C11.3832 -0.000488281 11.4398 0.0399217 11.5005 0.0520589C12.4018 0.186431 13.226 0.637107 13.8255 1.32346C14.4251 2.00982 14.7609 2.8871 14.773 3.79842C14.7932 6.16922 14.773 8.54005 14.773 10.9109C14.7678 11.1733 14.738 11.4347 14.684 11.6917C14.5047 12.5598 14.0321 13.3398 13.3455 13.9005C12.659 14.4612 11.8003 14.7684 10.914 14.7705C9.06935 14.7988 7.22061 14.8231 5.376 14.815C4.6594 14.8132 3.94408 14.7564 3.23617 14.6451C1.67472 14.3942 0.594646 13.5528 0.20226 11.9628C0.109221 11.5946 0.0647233 11.2143 0 10.8421V3.81461C0 3.70538 0.048503 3.60017 0.0606386 3.49094C0.121612 2.71111 0.425071 1.96995 0.928541 1.37137C1.43201 0.772784 2.11021 0.346796 2.86799 0.153202C3.10261 0.0884705 3.34128 0.0480606 3.5759 -0.000488281Z" fill="white" fillOpacity="0.3" />
                                    <path d="M19.7449 -0.000488281H27.6168C27.6613 0.0205437 27.7073 0.0380796 27.7544 0.0520589C28.5979 0.188185 29.3716 0.60275 29.9522 1.22963C30.5328 1.85651 30.8869 2.65966 30.9582 3.51118C31.0391 4.81796 30.9906 6.13281 30.9865 7.44363C30.9865 8.65735 30.9866 9.90753 30.938 11.1334C30.9148 12.0951 30.5119 13.0085 29.8175 13.6741C29.044 14.4039 28.0124 14.7968 26.9494 14.7665C24.6315 14.7988 22.3096 14.8069 19.9917 14.7665C18.9802 14.74 18.0196 14.3172 17.3167 13.5893C16.6138 12.8613 16.2248 11.8863 16.2337 10.8744C16.2337 8.54406 16.2337 6.2138 16.2337 3.88346C16.2163 3.21712 16.3821 2.55877 16.713 1.9802C17.044 1.40164 17.5274 0.92501 18.1106 0.602323C18.6348 0.349478 19.1821 0.147615 19.7449 -0.000488281Z" fill="white" fillOpacity="0.3" />
                                    <path d="M0.00390625 27.3167V20.0343C0.00390625 19.9372 0.0444057 19.8402 0.0524962 19.7431C0.0898177 19.2492 0.224474 18.7676 0.448721 18.326C0.672968 17.8844 0.982365 17.4914 1.35909 17.1699C2.09589 16.5393 3.03918 16.2023 4.00872 16.2233C5.27892 16.199 6.55313 16.199 7.82333 16.2233C9.01262 16.2233 10.206 16.199 11.3872 16.3082C12.1501 16.3354 12.8802 16.6246 13.4549 17.1272C14.0296 17.6297 14.4137 18.3148 14.5425 19.0674C14.7208 19.9558 14.8102 20.8598 14.8094 21.7659C14.8418 23.5096 14.8094 25.2533 14.7892 27.0011C14.7936 27.5315 14.6917 28.0575 14.4894 28.5479C14.2871 29.0382 13.9886 29.4831 13.6115 29.8561C13.2343 30.2291 12.7863 30.5227 12.2938 30.7196C11.8013 30.9165 11.2743 31.0126 10.744 31.0023H7.91231C6.44794 31.0023 4.98364 31.0347 3.52737 30.9538C2.71784 30.9137 1.94479 30.6047 1.33075 30.0756C0.716706 29.5465 0.296742 28.8276 0.13743 28.0328C0.0929325 27.786 0.0524488 27.5513 0.00390625 27.3167Z" fill="white" fillOpacity="0.3" />
                                    <path d="M30.9859 23.5133C31.0022 24.4963 30.822 25.4726 30.4557 26.3849C30.0895 27.2973 29.5447 28.1273 28.8533 28.8261C28.1618 29.5249 27.3378 30.0786 26.4295 30.4545C25.5212 30.8304 24.5469 31.0209 23.564 31.015C22.581 31.0091 21.6091 30.8067 20.7054 30.4199C19.8016 30.0331 18.9843 29.4696 18.3013 28.7625C17.6184 28.0554 17.0837 27.2189 16.7285 26.3022C16.3733 25.3854 16.2048 24.4069 16.233 23.4242C16.2532 19.4796 19.6189 16.2187 23.6601 16.2349C25.594 16.237 27.4487 17.003 28.8208 18.3661C30.1928 19.7293 30.9709 21.5792 30.9859 23.5133Z" fill="white" fillOpacity="0.3" />
                                </svg>
                            </div>
                            {!sidebarCollapsed &&
                                <div className='sidebar-nav-txt'>
                                    Dashboard
                                </div>
                            }
                        </div>
                    </NavLink>
                    <NavLink to='/dashboard/user-management'>
                        <div onClick={() => setDashboardActiveTab("user-management")} className={`sidebar-nav-item ${location.pathname === '/dashboard/user-management' ? "active-sidebar-item" : ""}`}>
                            <div className='svg-div'>
                                <svg width="36" height="29" viewBox="0 0 36 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.639 28.9999L11.4589 28.1578C11.1577 28.0947 10.8628 28.0043 10.5781 27.8875C8.30691 27.115 8.09829 26.7906 8.40729 24.4344C8.6236 22.7503 8.83217 21.0662 9.1798 19.4053C9.52758 17.6467 10.4762 16.0637 11.863 14.9277C13.2499 13.7918 14.9887 13.1735 16.7814 13.1788C17.989 13.1301 19.1984 13.2105 20.389 13.4183C21.9433 13.7742 23.3495 14.6022 24.4145 15.7889C25.4795 16.9756 26.1511 18.4628 26.3373 20.0464C26.569 21.7305 26.8265 23.4094 27.1098 25.0832C27.3107 26.4428 27.1099 26.8523 25.8584 27.4703C23.9907 28.279 21.9837 28.7171 19.9488 28.7604C19.1763 28.8067 18.45 28.7604 17.7084 28.7604L17.639 28.9999Z" fill="white" fillOpacity="0.3" />
                                    <path d="M17.7159 2.44785e-09C18.9402 3.44357e-05 20.1368 0.363704 21.1541 1.04485C22.1714 1.726 22.9636 2.69391 23.43 3.82588C23.8964 4.95785 24.0159 6.20283 23.7736 7.4029C23.5314 8.60298 22.9382 9.70418 22.0692 10.5666C21.2003 11.429 20.0948 12.0138 18.893 12.247C17.6911 12.4802 16.447 12.3513 15.3186 11.8764C14.1902 11.4016 13.2283 10.6022 12.5548 9.57984C11.8814 8.55745 11.5266 7.35804 11.5358 6.1338C11.5481 4.50278 12.2046 2.94269 13.3622 1.7937C14.5199 0.644709 16.0849 -4.58719e-05 17.7159 2.44785e-09Z" fill="white" fillOpacity="0.3" />
                                    <path d="M28.5621 23.8319C28.2763 22.0474 28.0599 20.3169 27.6968 18.6097C27.2771 16.868 26.3463 15.2914 25.0239 14.0827C25.7776 13.6226 26.619 13.3252 27.4944 13.2094C28.3698 13.0937 29.2598 13.1622 30.1071 13.4107C31.3399 13.7161 32.4574 14.3728 33.3241 15.3012C34.1908 16.2296 34.7694 17.3898 34.9895 18.6406C35.1131 19.2123 35.1516 19.8148 35.3139 20.3788C35.4283 20.7661 35.4037 21.1812 35.2443 21.5522C35.0848 21.9233 34.8007 22.2268 34.441 22.4104C33.0528 23.2933 31.4506 23.782 29.8059 23.8241C29.3965 23.855 29.0102 23.8319 28.5621 23.8319Z" fill="white" fillOpacity="0.3" />
                                    <path d="M10.3073 14.067C7.93573 16.8326 7.92045 16.8713 6.80803 23.8471C4.49049 23.8471 2.21155 23.6308 0.403865 21.9159C0.266137 21.7697 0.15946 21.5971 0.0904089 21.4085C0.0213581 21.22 -0.00864259 21.0193 0.00214322 20.8188C0.0971567 19.8467 0.27808 18.8851 0.542865 17.945C0.820907 17.0225 1.29383 16.1706 1.92965 15.4466C2.56548 14.7227 3.34941 14.1436 4.22833 13.7488C5.10726 13.354 6.06067 13.1527 7.02417 13.1583C7.98766 13.1639 8.93873 13.3763 9.81302 13.7813C9.94435 13.8585 10.091 13.9511 10.3073 14.067Z" fill="white" fillOpacity="0.3" />
                                    <path d="M6.98546 3.23682C7.41692 3.29349 7.84493 3.37338 8.26776 3.47625C9.48833 3.81615 9.60428 4.00159 9.49613 5.24533C9.30123 6.86758 9.61138 8.51053 10.3844 9.95C10.6548 10.429 10.5003 10.7224 10.1836 11.0082C9.47949 11.7201 8.5597 12.179 7.56748 12.3132C6.57527 12.4474 5.56639 12.2494 4.69847 11.7502C3.83056 11.251 3.15231 10.4785 2.76945 9.55337C2.3866 8.62821 2.32064 7.60234 2.58198 6.6358C2.84936 5.66908 3.42319 4.81525 4.21716 4.20236C5.01113 3.58947 5.98255 3.25067 6.98546 3.23682Z" fill="white" fillOpacity="0.3" />
                                    <path d="M28.3609 3.14404C29.3718 3.19667 30.341 3.56364 31.1332 4.1938C31.9254 4.82396 32.501 5.68577 32.7797 6.65892C33.0365 7.627 32.9656 8.65294 32.578 9.5765C32.1905 10.5001 31.5083 11.2694 30.6375 11.7643C29.7668 12.2592 28.7565 12.4519 27.7647 12.3124C26.7729 12.1728 25.8554 11.7087 25.1551 10.9927C24.9931 10.8724 24.8847 10.6934 24.8529 10.4942C24.8212 10.295 24.8685 10.0914 24.9849 9.92673C25.8495 8.32853 26.123 6.47661 25.7574 4.69671C25.6725 4.24092 25.8038 3.99375 26.1978 3.85469C26.9163 3.60749 27.6425 3.3758 28.3609 3.14404Z" fill="white" fillOpacity="0.3" />
                                </svg>
                            </div>
                            {!sidebarCollapsed &&
                                <div className='sidebar-nav-txt'>
                                    User management
                                </div>
                            }
                        </div>
                    </NavLink>
                    <NavLink to='/dashboard/control-content'>
                        <div onClick={() => setDashboardActiveTab("control-content")} className={`sidebar-nav-item ${location.pathname === '/dashboard/control-content' ? "active-sidebar-item" : ""}`}>
                            <div className='svg-div'>
                                <svg width="37" height="32" viewBox="0 0 37 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.00915357 16.0016V4.66567C-0.030169 4.0428 0.067602 3.41902 0.295683 2.83568C0.523763 2.25234 0.87689 1.723 1.3319 1.28269C1.78692 0.842375 2.3332 0.501142 2.93441 0.281984C3.53562 0.0628268 4.17819 -0.0293118 4.81893 0.0115705H22.1045C22.745 -0.0338045 23.3883 0.0546222 23.9908 0.270768C24.5933 0.486914 25.141 0.825684 25.5975 1.26464C26.0541 1.7036 26.4087 2.23252 26.6375 2.81568C26.8664 3.39885 26.9644 4.02274 26.9246 4.64567C26.9246 12.2162 26.9246 19.7934 26.9246 27.3773C26.9622 27.9945 26.8644 28.6124 26.6378 29.1902C26.4112 29.768 26.0609 30.2925 25.6101 30.7288C25.1592 31.1651 24.6181 31.5032 24.0226 31.721C23.4272 31.9387 22.7909 32.0309 22.1559 31.9916C16.3666 31.9916 10.5843 31.9916 4.80864 31.9916C4.16834 32.0327 3.52636 31.9404 2.92563 31.7212C2.32489 31.502 1.77911 31.1608 1.32488 30.7203C0.870646 30.2798 0.518297 29.7501 0.291417 29.1668C0.0645377 28.5834 -0.0317039 27.9596 0.00915357 27.3373V16.0016ZM8.55961 23.2225C7.53192 23.2225 6.5043 23.2225 5.54855 23.2225C5.27599 23.2159 5.01171 23.3147 4.81416 23.4974C4.61661 23.68 4.50183 23.9315 4.49501 24.1964C4.4882 24.4613 4.59012 24.7179 4.77803 24.9099C4.96594 25.1019 5.22455 25.2134 5.49711 25.2201C7.55249 25.2201 9.58726 25.2201 11.6015 25.2201C11.8741 25.2201 12.1354 25.1147 12.3281 24.9274C12.5209 24.7401 12.6292 24.4862 12.6292 24.2213C12.6292 23.9564 12.5209 23.7025 12.3281 23.5152C12.1354 23.3278 11.8741 23.2225 11.6015 23.2225C10.5738 23.2126 9.56675 23.2225 8.55961 23.2225ZM8.4876 8.78064H11.5707C11.8432 8.78064 12.1048 8.67534 12.2975 8.48804C12.4903 8.30073 12.5984 8.04677 12.5984 7.78189C12.5984 7.517 12.4903 7.2628 12.2975 7.07549C12.1048 6.88819 11.8432 6.78314 11.5707 6.78314C9.51529 6.78314 7.48052 6.78314 5.46625 6.78314C5.19369 6.78314 4.93237 6.88819 4.73964 7.07549C4.54691 7.2628 4.43856 7.517 4.43856 7.78189C4.43856 8.04677 4.54691 8.30073 4.73964 8.48804C4.93237 8.67534 5.19369 8.78064 5.46625 8.78064H8.4876ZM18.3844 8.78064H21.4057C21.6783 8.78064 21.9396 8.67534 22.1324 8.48804C22.3251 8.30073 22.4334 8.04677 22.4334 7.78189C22.4334 7.517 22.3251 7.2628 22.1324 7.07549C21.9396 6.88819 21.6783 6.78314 21.4057 6.78314C19.3504 6.78314 17.295 6.78314 15.3013 6.78314C15.0288 6.78314 14.7672 6.88819 14.5745 7.07549C14.3817 7.2628 14.2736 7.517 14.2736 7.78189C14.2736 8.04677 14.3817 8.30073 14.5745 8.48804C14.7672 8.67534 15.0288 8.78064 15.3013 8.78064H18.3844ZM8.52875 12.8854C9.55644 12.8854 10.4917 12.8854 11.4681 12.8854C12.4444 12.8854 12.7732 12.4759 12.7527 11.8866C12.7321 11.2974 12.2594 10.8879 11.4989 10.8879C9.53603 10.8879 7.57315 10.8879 5.59998 10.8879C4.82921 10.8879 4.37683 11.2774 4.36655 11.8866C4.35627 12.4959 4.81874 12.8854 5.65116 12.8854H8.52875ZM18.3638 12.8854C19.3915 12.8854 20.3266 12.8854 21.3132 12.8854C22.125 12.8854 22.608 12.4759 22.5875 11.8866C22.5669 11.2974 22.0942 10.8879 21.3234 10.8879C19.3606 10.8879 17.3977 10.8879 15.4348 10.8879C14.6538 10.8879 14.2119 11.2774 14.2016 11.8866C14.1913 12.4959 14.6435 12.8854 15.4245 12.8854C16.4008 12.8954 17.3875 12.8854 18.3227 12.8854H18.3638ZM8.52875 16.9804H11.4783C12.2902 16.9804 12.7732 16.5709 12.7527 15.9816C12.7321 15.3923 12.2594 14.9828 11.4886 14.9828H5.59998C4.82921 14.9828 4.37683 15.3823 4.36655 15.9816C4.35627 16.5809 4.80864 16.9804 5.57941 16.9804H8.52875ZM8.52875 21.0853H11.4783C12.2902 21.0853 12.7732 20.6659 12.7527 20.0866C12.7321 19.5073 12.2594 19.0878 11.4886 19.0878C9.52916 19.0878 7.5663 19.0878 5.59998 19.0878C4.82921 19.0878 4.37683 19.4973 4.36655 20.0866C4.35627 20.6758 4.80864 21.0853 5.57941 21.0853C6.56599 21.0953 7.55244 21.0853 8.52875 21.0853ZM16.7503 25.27H18.2918C18.4349 25.2706 18.5767 25.2421 18.7078 25.1864C18.8389 25.1307 18.9565 25.049 19.0533 24.9465C19.15 24.844 19.2237 24.7229 19.2696 24.5912C19.3154 24.4594 19.3324 24.3198 19.3195 24.1813C19.3063 23.9252 19.1922 23.6837 19.0009 23.5071C18.8095 23.3305 18.5557 23.2322 18.2918 23.2325C17.2641 23.2325 16.3291 23.2325 15.3425 23.2325C15.2024 23.2244 15.0621 23.2441 14.9302 23.2906C14.7983 23.3371 14.6775 23.4094 14.5755 23.503C14.4734 23.5965 14.3921 23.7096 14.3366 23.8348C14.2811 23.9601 14.2528 24.0949 14.2531 24.2313C14.2529 24.3668 14.281 24.5008 14.3359 24.6253C14.3907 24.7499 14.471 24.8623 14.5719 24.9557C14.6729 25.0492 14.7923 25.1217 14.923 25.1688C15.0536 25.216 15.193 25.2368 15.3322 25.23C15.7741 25.29 16.2673 25.27 16.7503 25.27Z" fill="white" fillOpacity="0.3" />
                                    <path d="M29.1548 6.72314H35.9683V24.571H29.1548V6.72314Z" fill="white" fillOpacity="0.3" />
                                    <path d="M29.1133 26.708H35.9782C35.9782 27.7068 36.0604 28.7055 35.9782 29.7043C35.8892 30.3327 35.57 30.909 35.0792 31.3272C34.5884 31.7455 33.9591 31.9778 33.3063 31.9814C32.7925 31.9814 32.2786 31.9814 31.7648 31.9814C31.1034 31.9508 30.4753 31.6897 29.996 31.2458C29.5166 30.8019 29.2179 30.2051 29.1544 29.5645C29.103 28.8854 29.1544 28.1962 29.1544 27.5171L29.1133 26.708Z" fill="white" fillOpacity="0.3" />
                                    <path d="M35.5982 4.63565H29.5347C30.0588 3.6369 30.5623 2.6382 31.0659 1.69938C31.2612 1.32984 31.4257 0.960456 31.6415 0.610893C31.7277 0.447296 31.8587 0.309799 32.0201 0.213928C32.1815 0.118058 32.3671 0.0673828 32.5563 0.0673828C32.7454 0.0673828 32.9308 0.118058 33.0922 0.213928C33.2536 0.309799 33.3846 0.447296 33.4708 0.610893C34.2005 1.89928 34.8583 3.22741 35.5982 4.63565Z" fill="white" fillOpacity="0.3" />
                                </svg>
                            </div>
                            {!sidebarCollapsed &&
                                <div className='sidebar-nav-txt'>
                                    Control Content
                                </div>
                            }
                        </div>
                    </NavLink>
                    {/* <NavLink to='/dashboard/artwork-management'>
                        <div onClick={() => setDashboardActiveTab("artwork-management")} className={`sidebar-nav-item ${location.pathname === '/dashboard/artwork-management' ? "active-sidebar-item" : ""}`}>
                            <div className='svg-div'>
                                <svg width="34" height="38" viewBox="0 0 34 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M32.9701 26.7742L30.2733 23.5203L21.3346 12.7411C21.2107 12.5711 21.0478 12.4326 20.8593 12.3371C20.6708 12.2417 20.4621 12.192 20.2503 12.192C20.0386 12.192 19.8298 12.2417 19.6413 12.3371C19.4528 12.4326 19.2898 12.5711 19.1659 12.7411L13.3285 19.7993L12.0194 18.4478C11.716 18.1363 11.424 17.8192 11.1206 17.5077C10.9891 17.3433 10.8217 17.2105 10.631 17.1192C10.4403 17.0279 10.2312 16.9804 10.0194 16.9804C9.80757 16.9804 9.59848 17.0279 9.40778 17.1192C9.21708 17.2105 9.0496 17.3433 8.9181 17.5077L0.524391 26.2124C0.378315 26.357 0.237929 26.5127 0.0356699 26.7241C0.0356699 26.5238 0.00192716 26.407 0.00192716 26.2958C0.00192716 20.908 0.00192716 15.5314 0.00192716 10.1658C-0.0131184 9.86728 0.0601879 9.57093 0.212888 9.31305C0.365588 9.05517 0.591054 8.84705 0.861544 8.71421C5.79816 5.89981 10.7347 3.078 15.6713 0.248772C15.9218 0.0865285 16.2147 0 16.5141 0C16.8134 0 17.1063 0.0865285 17.3568 0.248772C22.3234 3.09654 27.2956 5.94052 32.2734 8.78088C32.5056 8.8976 32.6997 9.07713 32.8329 9.29866C32.9662 9.52018 33.0333 9.7746 33.0263 10.0323V26.5239C32.9982 26.5573 32.9869 26.6073 32.9701 26.7742ZM7.63725 12.1905C7.63837 12.9808 7.8762 13.753 8.32088 14.4093C8.76556 15.0657 9.39699 15.5767 10.1352 15.8777C10.8734 16.1786 11.6852 16.2559 12.4678 16.0998C13.2504 15.9437 13.9685 15.5613 14.5315 15.0009C15.0944 14.4405 15.4767 13.7272 15.63 12.9516C15.7833 12.176 15.7007 11.3728 15.3926 10.6437C15.0845 9.91457 14.5649 9.2924 13.8994 8.85584C13.2339 8.41928 12.4526 8.18797 11.6543 8.19127C11.1253 8.19273 10.6017 8.29735 10.1135 8.49911C9.62532 8.70088 9.18208 8.99588 8.80906 9.36723C8.43603 9.73858 8.14064 10.1791 7.93956 10.6635C7.73848 11.1479 7.63577 11.6668 7.63725 12.1905Z" fill="white" fillOpacity="0.3" />
                                    <path d="M1.59229 28.9715L10.0197 20.2447L11.8905 22.1969C13.4899 23.8656 15.0874 25.5342 16.683 27.2028C16.8626 27.429 17.1095 27.5935 17.3887 27.6733C17.6679 27.7532 17.9655 27.7443 18.2392 27.6478C18.459 27.5746 18.6557 27.4461 18.8101 27.2749C18.9645 27.1037 19.0713 26.8957 19.12 26.6713C19.1687 26.4469 19.1577 26.2139 19.088 25.9951C19.0183 25.7762 18.8924 25.5791 18.7225 25.423C17.6606 24.3106 16.5874 23.1981 15.5199 22.0857C15.4132 21.9801 15.3122 21.8687 15.1942 21.7408L20.2506 15.6226L31.3355 29.0105L30.9423 29.2496C26.4476 31.8156 21.9623 34.3834 17.4863 36.9531C17.1913 37.1487 16.8443 37.2531 16.4892 37.2531C16.1341 37.2531 15.787 37.1487 15.492 36.9531C10.9711 34.3389 6.43889 31.7433 1.89556 29.1662L1.59229 28.9715Z" fill="white" fillOpacity="0.3" />
                                </svg>
                            </div>
                            {!sidebarCollapsed &&
                                <div className='sidebar-nav-txt'>
                                    Artwork Management
                                </div>
                            }
                        </div>
                    </NavLink> */}
                    <NavLink to='/dashboard/analytic-tool'>
                        <div onClick={() => setDashboardActiveTab("analytic-tool")} className={`sidebar-nav-item ${location.pathname === '/dashboard/analytic-tool' ? "active-sidebar-item" : ""}`}>
                            <div className='svg-div'>
                                <svg width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23.9904 8.18679V10.1014C23.9748 10.3587 24.0142 10.6162 24.1062 10.8569C24.1981 11.0976 24.3404 11.316 24.5235 11.4972C24.7067 11.6785 24.9264 11.8185 25.168 11.908C25.4096 11.9975 25.6675 12.0343 25.9245 12.0159H29.8629C30.0445 11.9971 30.2281 12.0197 30.3998 12.0818C30.5715 12.1438 30.727 12.2439 30.8546 12.3745C30.9823 12.505 31.0788 12.6628 31.137 12.8359C31.1951 13.009 31.2135 13.1931 31.1907 13.3743C31.1521 15.4063 30.3785 17.3553 29.0131 18.8602C27.6476 20.3652 25.7831 21.324 23.765 21.5589C21.6322 21.8358 19.4752 21.2737 17.7488 19.9909C16.0223 18.7081 14.8612 16.8048 14.5102 14.6824C14.3128 13.5567 14.3469 12.4025 14.6103 11.2904C14.8737 10.1783 15.3609 9.13154 16.0423 8.21408C16.7236 7.29662 17.5847 6.5277 18.573 5.95426C19.5614 5.38082 20.6562 5.01486 21.7907 4.8788C22.0884 4.84196 22.3877 4.82027 22.6876 4.8137C22.8598 4.79896 23.0332 4.82156 23.1959 4.8799C23.3586 4.93824 23.5069 5.03097 23.6305 5.15179C23.7542 5.27262 23.8503 5.4186 23.9124 5.57995C23.9745 5.7413 24.0011 5.91422 23.9904 6.08678C23.9954 6.78846 23.9904 7.48511 23.9904 8.18679Z" fill="white" fillOpacity="0.3" />
                                    <path d="M10.7776 31.2113H3.58742V15.208C3.55715 14.9373 3.58817 14.6634 3.67819 14.4063C3.76821 14.1493 3.91493 13.9159 4.10744 13.7233C4.29995 13.5307 4.53323 13.384 4.79017 13.2939C5.0471 13.2039 5.32111 13.1729 5.59167 13.2031C6.70403 13.2031 7.81635 13.2031 8.92871 13.2031C9.17349 13.1927 9.41783 13.2328 9.64642 13.321C9.87502 13.4091 10.0829 13.5435 10.2573 13.7156C10.4318 13.8877 10.5689 14.0939 10.6602 14.3213C10.7514 14.5487 10.7947 14.7925 10.7876 15.0375C10.7876 20.3503 10.7876 25.6614 10.7876 30.9708C10.7876 31.051 10.7826 31.1211 10.7776 31.2113Z" fill="white" fillOpacity="0.3" />
                                    <path d="M0 36.0031V33.6274H35.9664V35.9831L0 36.0031Z" fill="white" fillOpacity="0.3" />
                                    <path d="M31.1963 9.61502H27.789C27.6327 9.63376 27.4742 9.62093 27.323 9.57733C27.1717 9.53373 27.0307 9.46018 26.9083 9.36111C26.7859 9.26205 26.6846 9.13941 26.6104 9.0005C26.5362 8.8616 26.4906 8.70925 26.4763 8.55241C26.4221 8.29533 26.3953 8.03322 26.3962 7.7705C26.3962 5.63537 26.3962 3.49868 26.3962 1.36021C26.3736 1.17555 26.3937 0.988119 26.4551 0.812511C26.5166 0.636902 26.6175 0.477738 26.7502 0.347405C26.8829 0.217071 27.0439 0.119006 27.2206 0.0608281C27.3972 0.00264969 27.5849 -0.0140932 27.7691 0.0118825C29.7995 0.0523491 31.7461 0.828691 33.2474 2.19669C34.7486 3.5647 35.7023 5.43138 35.9313 7.44978C35.9614 7.72043 35.9865 7.99604 35.9915 8.2717C36.0133 8.45029 35.9948 8.63156 35.9373 8.80203C35.8798 8.9725 35.7849 9.12785 35.6594 9.25673C35.5339 9.38562 35.3811 9.48474 35.2123 9.54674C35.0434 9.60873 34.8627 9.63208 34.6837 9.61502H31.1963Z" fill="white" fillOpacity="0.3" />
                                    <path d="M21.5859 31.2066H14.4056V24.7913C14.3822 24.5285 14.4164 24.2637 14.5058 24.0154C14.5952 23.7672 14.7376 23.5414 14.9232 23.3539C15.1087 23.1664 15.333 23.0216 15.5802 22.9297C15.8274 22.8377 16.0918 22.8008 16.3548 22.8215C17.5022 22.8215 18.6546 22.8215 19.8021 22.8215C20.0369 22.8195 20.2698 22.8643 20.4871 22.9533C20.7044 23.0423 20.9019 23.1736 21.0679 23.3397C21.234 23.5058 21.3652 23.7032 21.4541 23.9206C21.5431 24.138 21.5879 24.371 21.5859 24.6058C21.5859 26.756 21.5859 28.9012 21.5859 31.0514C21.5896 31.1031 21.5896 31.1549 21.5859 31.2066Z" fill="white" fillOpacity="0.3" />
                                    <path d="M0 2.38268V0.0471191H16.7706V2.40275L0 2.38268Z" fill="white" fillOpacity="0.3" />
                                    <path d="M32.3939 31.2117H25.2187C25.2187 31.1165 25.1936 31.0213 25.1936 30.9261C25.1936 30.044 25.1936 29.1568 25.1936 28.2697C25.1866 28.0252 25.2298 27.7817 25.3203 27.5545C25.4109 27.3272 25.5468 27.1209 25.72 26.9482C25.8931 26.7754 26.0998 26.6399 26.3272 26.55C26.5547 26.4601 26.7981 26.4176 27.0425 26.4252C28.215 26.4252 29.3925 26.4252 30.5499 26.4252C30.7912 26.4197 31.031 26.4632 31.255 26.5529C31.4791 26.6426 31.6827 26.7766 31.8536 26.9471C32.0245 27.1175 32.1591 27.3209 32.2493 27.5447C32.3396 27.7685 32.3837 28.0083 32.3789 28.2496C32.4039 29.222 32.3939 30.1993 32.3939 31.2117Z" fill="white" fillOpacity="0.3" />
                                    <path d="M0 7.184V4.82837H10.7578V7.184H0Z" fill="white" fillOpacity="0.3" />
                                </svg>
                            </div>
                            {!sidebarCollapsed &&
                                <div className='sidebar-nav-txt'>
                                    Analytic Tool
                                </div>
                            }
                        </div>
                    </NavLink>

                </div>
            </div>
        </div>
    )
}

export default Sidebar