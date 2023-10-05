import React, { useEffect } from "react";
import AdminHeader from "../../pages/landingpage/AdminHeader";
import { useState } from "react";
import adminApis from "../../service/adminIndex";

import { AiFillDelete } from "react-icons/ai";
import "../DashboardComponents/DashboardCard.css";

function ArtWorkManagement({ search, setSearch }) {
  const [toggleUserDropdown, setToggleUserDropdown] = useState(true);
  const [listCount, setListCount] = useState(0);
  const [list, setList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filter, setFilter] = useState("Yearly");
  const [pagination, setPagination] = useState(null);
  const [nftList, setNftList] = useState([]);

  const viewArtGalleyList = async (page, filter, searchInput) => {
    setListCount(page * 10 - 10);
    const response = await adminApis.viewArtGalleyList(page, filter, searchInput);
    if (response?.status) {
      setList((prev) => [...prev, ...response?.data?.data])
      setPagination(response?.data?.pagination);
      console.log(response?.data?.data, "data me");
      console.log(response?.data?.pagination, "pagination");
    } else {
      console.log("error");
    }
  };

  useEffect(() => {
    if (searchInput == "") {
      viewArtGalleyList(1, filter, searchInput);
    } else if (searchInput.length > 2) {
      viewArtGalleyList(1, filter, searchInput);
    }
  }, [searchInput]);

  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData?.wallet_address;


  return (
    <div className="user-management">
      <AdminHeader search={search} setSearch={setSearch} />
      <div className="user-management-after-header">
        <div className="dashboard-front-section-2">
          <div className="dashboard-front-section-2-row-1">
            <div className="df-s2-r1-c1">
              <div className="User-management-txt">ARTWORK GALLERY</div>
            </div>
            {/* <div className="controls-for-user-management">
              <div
                className="user-sub-dd"
                onClick={() => setShowFilter(!showfilter)}
              >
                <div className="title">
                  {filter} <MdKeyboardArrowDown />
                </div>
                {showfilter && (
                  <div className="options">
                    <h2
                      onClick={() => {
                        viewNftList(
                          +list?.pagination?.page,
                          "yearly",
                          searchInput
                        );
                        setFilter("yearly");
                      }}
                    >
                      Yearly
                    </h2>
                    <h2
                      onClick={() => {
                        viewNftList(
                          +list?.pagination?.page,
                          "monthly",
                          searchInput
                        );
                        setFilter("monthly");
                      }}
                    >
                      Monthly
                    </h2>
                    <h2
                      onClick={() => {
                        viewNftList(
                          +list?.pagination?.page,
                          "weakly",
                          searchInput
                        );
                        setFilter("weekly");
                      }}
                    >
                      Weekly
                    </h2>
                  </div>
                )}
              </div>
              <div className="user-search">
                <input
                  type="search"
                  placeholder="Search"
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <BiSearchAlt2 />
              </div>
            </div> */}
          </div>

        </div>
        <div
          className="table-for-user-management"
        //   style={{ top: selectedNTFIds.length > 0 ? "160px" : "120px" }}
        >
          {list?.length > 0 ? (
            <>
              <div className="row">
                <div className="col-lg-10 mx-auto">
                  <div className="row">
                    <div className='Arts-holder'>
                      

                      {list?.map(res => {
                        return (
                          res?.image_url?.includes("http") && (
                            <div className='art-img-div' key={res.id}>
                              <span className='select-art-btn'>
                                {/* <AiFillDelete fontSize="30px" color="white" /> */}
                              </span>
                              <img src={res?.image_url} alt="" />
                            </div>
                          )
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="user-management-table-contorls"
                style={{ justifyContent: "center" }}
              >
                <button
                  className={`controling-Nft-Load-More ${pagination?.remaining == 0 ? "disable" : ""
                    }`}
                  onClick={() => {
                    viewArtGalleyList(
                      +pagination?.page + 1,
                      filter,
                      searchInput
                    );
                    setIsOpen(null);
                  }}
                >
                  Load More
                </button>
              </div>
            </>
          ) : (
            <div className="empty-messahe">
              <h2>No data avaliable</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArtWorkManagement;
