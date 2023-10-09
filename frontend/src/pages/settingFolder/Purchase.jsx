import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import apis from '../../service';
import Loader from '../../components/shared/Loader';
function Purchase() {
    const [purchase , setPurchase] = useState([])

    const getPurchase = async () => {
        try{
            const response = await apis.getPurchaseHistory();
            setPurchase(response?.data?.data)
            setLoader(false)
        }catch{
            setLoader(false)
            console.log(e, "purchase error")
        }
    };
    
    useEffect(() =>{
        getPurchase()
    } , [])

      const [loader, setLoader] = useState(true)
      return (
        <>
            {loader && <Loader/>}
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
                                        <p className="price" style={{ textAlign: 'left' }}>{data?.price}</p>
                                    </div>
                                </td>
                                <td>
                                    <div className="two">
                                        <p className="price" style={{ textAlign: 'left' }}>{data.nft?.collection?.payment_type}</p>
                                    </div>
                                </td>
                            </tr>
                                )
                            })}
                            

                        </tbody>
                    </Table>

                    {purchase.length <= 0 ?
                        <div class="data-not-avaliable">
                            <h2>No data avaliable</h2>
                        </div> : ""
                    }
                </div>
            </div>
        </>
    )
}

export default Purchase