import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import apis from "../../service";

const TableData = () => {
  const navigate = useNavigate();

  const [list, setList] = useState([]);

  const viewNftTopCollections = async () => {

    try {
      const response = await apis.viewNftTopCollections();
      setList(response?.data?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const navigateTo = (id) => {
    navigate(`/collection?id=${id}`);
  };

  useEffect(() => {
    viewNftTopCollections();
  }, []);
  return (
    <div className="collection-table">
      <Table striped="columns">
        <thead>
          <tr>
            <th>Name</th>
            <th>Floor Price</th>
            <th>Status</th>
            <th>Owner</th>
            <th>Item</th>
          </tr>
        </thead>
        <tbody>
          {list.slice(0, 3).map((res, index) => {
            return (
              <tr className="table-details" key={index}>
                <td
                  onClick={() => navigateTo(res?.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="logo-title">
                    <div>
                      <img
                        src={res?.media?.[0]?.original_url}
                        alt=""
                        width={"57px"}
                        height={"57px"}
                        style={{ objectFit: "cover", borderRadius: "50px" }}
                      />
                      <img src="/assets/images/chack.png" alt="" />
                    </div>
                    <div>
                      <p>{res?.name}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="two">
                    <p className="price">{res?.flow_price} ETH</p>
                  </div>
                </td>
                <td>
                  <div className="two">
                    {/* <p className="price">{res?.eth_volume} ETH</p> */}
                    <p className="purple percentage">
                      {res?.coll_status == null ? (
                        <>N/A</>
                      ) : (
                        <>
                          {res?.coll_status > 0 ? (
                            <>+{res?.coll_status}%</>
                          ) : (
                            <>-{res?.coll_status}%</>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                </td>
                <td>
                  <div className="two">
                    <p className="price" style={{ textAlign: "left" }}>
                      {res?.total_owner}
                    </p>
                  </div>
                </td>
                <td>
                  <div className="two">
                    <p className="price" style={{ textAlign: "left" }}>
                      {res?.total_items}
                    </p>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default TableData;
