import React from 'react'
import { footerData } from '../../StaticData'

const Footer = () => {
  return (
    <footer>
      <div className="footer-wrap">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h1>How It Works</h1>
            </div>
            {footerData.map((data , index) => {
              return (
                <div className="col-lg-3 col-md-6 col-12" key={index}>
                  <div className="footer-inner-wrap">
                    <div className='icon'><img src={data.icon} alt="" /></div>
                    <h2>{data.title}</h2>
                    <p>{data.para}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer