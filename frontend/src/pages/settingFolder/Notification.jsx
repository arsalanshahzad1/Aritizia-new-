import React from 'react'
import Form from 'react-bootstrap/Form';

const Notification = () => {
  return (
    <div className="col-lg-10 mx-auto">
      <Form>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-12">
            <div className='notification-sec-wrap'>
              <div>
                <h2>Item Sold</h2>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                // label="Check this switch"
                />
              </div>
              <div><p>When someone purhased your item.</p></div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12">
            <div className='notification-sec-wrap'>
              <div>
                <h2>Auction Expiration</h2>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                // label="Check this switch"
                />
              </div>
              <div><p>When an auction you created ends.</p></div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12">
            <div className='notification-sec-wrap'>
              <div>
                <h2>Bid Activity</h2>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                // label="Check this switch"
                />
              </div>
              <div><p>When someone purhased your item.</p></div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12">
            <div className='notification-sec-wrap'>
              <div>
                <h2>Outbid</h2>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                // label="Check this switch"
                />
              </div>
              <div><p>When an offer you placed is exceeded by another user.</p></div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12">
            <div className='notification-sec-wrap'>
              <div>
                <h2>Price Change</h2>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                // label="Check this switch"
                />
              </div>
              <div><p>When an item you made an offer on changes in price.</p></div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12">
            <div className='notification-sec-wrap'>
              <div>
                <h2>Successful Purchase</h2>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                // label="Check this switch"
                />
              </div>
              <div><p>When you successfully buy an item.</p></div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="notification-button-styling">
            <button className="button-styling">Update Profile</button>
          </div>
        </div>
      </Form>
    </div>
  )
}

export default Notification