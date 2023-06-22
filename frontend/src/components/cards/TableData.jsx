import React from 'react';
import Table from 'react-bootstrap/Table';

const TableData = () => {
  return (
    <div className="collection-table">
    <Table striped="columns">
      <thead>
        <tr >
          <th >Name</th>
          <th >Last Price</th>
          <th >24h Change</th>
          <th >Owner</th>
          <th >Item</th>
        </tr>
      </thead>
      <tbody>
        <tr className="table-details">
          <td>
            <div className="logo-title">
              <div>
                <img src="/assets/images/Ellipse-1.png" alt="" />
                <img src="/assets/images/chack.png" alt="" />
              </div>
              <div><p>Bull BTC Club</p></div>
            </div>
          </td>
          <td>
            <div className="two">
              <p className="price">500.59 ETH</p>
              <p className="purple percentage">+6.84%</p>
            </div>
          </td>
          <td>
            <div className="two">
              <p className="price">0.59 ETH</p>
              <p className="purple percentage">+6.84%</p>
            </div>
          </td>
          <td>
            <div className="two">
              <p className="price" style={{ textAlign: 'left' }}>2</p>
            </div>
          </td>
          <td>
            <div className="two">
              <p className="price" style={{ textAlign: 'left' }}>50.1K</p>
            </div>
          </td>
        </tr>
        <tr className="table-details">
          <td>
            <div className="logo-title">
              <div>
                <img src="/assets/images/Ellipse-1.png" alt="" />
                <img src="/assets/images/chack.png" alt="" />
              </div>
              <div><p>Bull BTC Club</p></div>
            </div>
          </td>
          <td>
            <div className="two">
              <p className="price">500.59 ETH</p>
              <p className="red percentage">+6.84%</p>
            </div>
          </td>
          <td>
            <div className="two">
              <p className="price">0.59 ETH</p>
              <p className="red percentage">+6.84%</p>
            </div>
          </td>
          <td>
            <div className="two">
              <p className="price" style={{ textAlign: 'left' }}>-</p>
            </div>
          </td>
          <td>
            <div className="two">
              <p className="price" style={{ textAlign: 'left' }}>50.1K</p>
            </div>
          </td>
        </tr>
        <tr className="table-details">
          <td>
            <div className="logo-title">
              <div>
                <img src="/assets/images/Ellipse-1.png" alt="" />
                <img src="/assets/images/chack.png" alt="" />
              </div>
              <div><p>Bull BTC Club</p></div>
            </div>
          </td>
          <td>
            <div className="two">
              <p className="price">500.59 ETH</p>
              <p className="purple percentage">+6.84%</p>
            </div>
          </td>
          <td>
            <div className="two">
              <p className="price">0.59 ETH</p>
              <p className="purple percentage">+6.84%</p>
            </div>
          </td>
          <td>
            <div className="two">
              <p className="price" style={{ textAlign: 'left' }}>10</p>
            </div>
          </td>
          <td>
            <div className="two">
              <p className="price" style={{ textAlign: 'left' }}>50.1K</p>
            </div>
          </td>
        </tr>

      </tbody>
    </Table>
    </div>
  )
}

export default TableData