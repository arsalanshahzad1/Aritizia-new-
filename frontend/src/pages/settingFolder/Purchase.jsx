import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import apis from '../../service';
function Purchase() {
    const [purchase , setPurchase] = useState([])

    const getPurchase = async () => {
        const response = await apis.getPurchaseHistory();
        console.log(response?.data?.data)
        setPurchase(response?.data?.data)
    
      };
    
      useEffect(() =>{
        getPurchase()
      } , [])
    return (
        <div className="col-lg-12 mx-auto">
            <div className="collection-table pruchase">
                <Table striped="columns">
                    <thead>
                        <tr >
                            <th >S.No</th>
                            <th >Title</th>
                            <th >Purchase Date</th>
                            <th >Price</th>
                            <th >Currency</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchase.map((data , index) =>{
                            return(
                                <tr className="table-details" key={index}>
                            <td>
                                <div className="logo-title">
                                    <div><p>{index + 1}</p></div>
                                </div>
                            </td>
                            <td>
                                <div className="two">
                                    <p className="price">{data?.nft?.title}</p>
                                </div>
                            </td>
                            <td>
                                <div className="two">
                                    <p className="price">{data?.date.substring(0, 13)}</p>
                                </div>
                            </td>
                            <td>
                                <div className="two">
                                    <p className="price" style={{ textAlign: 'left' }}>{data.price}</p>
                                </div>
                            </td>
                            <td>
                                <div className="two">
                                    <p className="price" style={{ textAlign: 'left' }}>{data.nft.collection.payment_type}</p>
                                </div>
                            </td>
                        </tr>
                            )
                        })}
                        

                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default Purchase