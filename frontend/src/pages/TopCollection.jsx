import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import apis from "../service";
import EmailSigninPopup from "./Headers/EmailSigninPopup";
import Header from "./landingpage/Header";
import Footer from "./landingpage/Footer";
import Loader from "../components/shared/Loader";
import PageTopSection from "../components/shared/PageTopSection";
import { toast } from "react-toastify";
import { ethers } from "ethers";

const TopCollection = ({ loader, setLoader }) => {
    const navigate = useNavigate();
    //const [loader, setLoader] = useState(false)
    const [emailSigninPopup, setEmailSigninPopup] = useState(false);

    const userData = JSON.parse(localStorage.getItem('data'))

    const [list, setList] = useState([]);

    const viewNftTopCollections = async () => {
        setLoader(true)
        try {
            const response = await apis.viewNftTopCollections();
            setList(response?.data?.data);
            setLoader(false)
        } catch (error) {
            // console.log(error.message);
            setLoader(false)
            toast.success(error.message, {
                position: toast.POSITION.TOP_CENTER,
            });
        }
    };

    const navigateTo = (id) => {
        if (userData && userData?.email != null) {
            navigate(`/collection?id=${id}`);
        } else {
            setEmailSigninPopup(true)
        }
    };

    useEffect(() => {
        viewNftTopCollections();
    }, []);
    return (
        <>
            {loader && <Loader />}
            <Header />
            <PageTopSection title={'Collections'} />
            { loader ?

                <div className="col-lg-12 col-md-12 mt-5">
                    <div className="carddd is-loading">
                        <div className="content">
                            <h2></h2>
                            <h2></h2>
                            <h2></h2>
                            <h2></h2>
                            <h2></h2>
                            <h2></h2>
                        </div>
                    </div>
                </div>

                :
                <div className="top-collection-pahe">
                    <section className="home-four-sec">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="header">
                                    </div>
                                </div>
                                <div className="col-lg-12">
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
                                                {list.map((res, index) => {
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
                                                                    {/* <p className="price">{res?.flow_price} ETH</p> */}
                                                                    <p className="price">{Number(ethers.utils.formatEther(res?.flow_price?.toString()))?.toFixed(5)} ETH</p>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="two">
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
                                        <EmailSigninPopup emailSigninPopup={emailSigninPopup} setEmailSigninPopup={setEmailSigninPopup} />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            }
            <Footer />
        </>

    );
};

export default TopCollection;
