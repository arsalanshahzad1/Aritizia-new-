import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { FaSearch } from "react-icons/fa";

const Search = ({ search, setSearch }) => {


  return (
    <>
      {search ? (
        <section className="search-bar">
          <div className="search-wrap">
            <RxCross2 className="cross" onClick={() => setSearch(false)} />
            <div className="popup-inner">
              <form className="search-form">
                <div className="form-group">
                  <input
                    type="text"
                    id="9953"
                    className="search-field"
                    placeholder="Search"
                  />
                  <button type="submit" className="search-submit">
                    <Link
                      to={"/search"}
                      //   to={`/search/${encodeURIComponent("asdasd")}`}
                      onClick={() => setSearch(false)}
                      style={{ color: "#fff" }}
                    >
                      <FaSearch />
                    </Link>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
};

export default Search;
