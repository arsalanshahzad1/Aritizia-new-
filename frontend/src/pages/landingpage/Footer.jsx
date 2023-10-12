import React from 'react'
import { footerData } from '../../StaticData'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
      <div className="footer-wrap">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h1>How It Works</h1>
            </div>
            {footerData.map((data, index) => {
              return (
                <div className="col-lg-3 col-md-6 col-12" key={index}>
                  <div className="footer-inner-wrap">
                    <div className='icon'><img src={data?.icon} alt="" /></div>
                    <h2>{data?.title}</h2>
                    <p>{data?.para}</p>
                  </div>
                </div>
              )
            })}
          </div>
         
        </div>
      </div>
      <div className="footer-bottom">
            <div className="footer-bottom-wrap">
              <div className="one">
                <Link>
                  <div>
                    <img src="/assets/logo/logo.png" alt="" />
                  </div>
                  <div>
                    <img src="/assets/logo/logo-title-light.png" alt="" />
                  </div>
                </Link>
              </div>
              <div className="two">
                <ul>
                  <li>
                    <Link>
                      <img src="/assets/social-icons/blade.png" alt="" />
                    </Link>
                  </li>
                  <li>
                    <Link to={"https://www.instagram.com/artizia.io/"}>
                      <img src="/assets/social-icons/insta.png" alt="" />
                    </Link>
                  </li>
                  <li>
                    <Link to={"https://www.youtube.com/@ArtiziaLLC"}>
                      <img src="/assets/social-icons/youtube.png" alt="" />
                    </Link>
                  </li>
                  <li>
                    <Link to={"https://www.linkedin.com/company/artizia-io"}>
                      <img src="/assets/social-icons/linkdin.png" alt="" />
                    </Link>
                  </li>
                  <li>
                    <Link>
                      <img src="/assets/social-icons/monkey.png" alt="" />
                    </Link>
                  </li>
                  <li>
                    <Link to={"https://www.tiktok.com/@artizia.io"}>
                      <img src="/assets/social-icons/tictoc.png" alt="" />
                    </Link>
                  </li>
                  <li>
                    <Link to={"https://www.facebook.com/profile.php?id=100095110465607"}>
                      <img src="/assets/social-icons/facebook.png" alt="" />
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="three">
                <ul>
                  <li>
                    <p>
                    <Link to="/terms">
                      TERMS
                    </Link>
                    <p>&</p>
                    <Link to="/privacy-policy">
                      POLICY
                    </Link>
                    </p>
                    
                    
                  </li>
                  <li>
                    <Link>
                      <p><span>Contact us :</span> Info@artizia.io </p>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
    </footer>
  )
}

export default Footer