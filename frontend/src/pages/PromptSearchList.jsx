import React, { useEffect, useRef, useState } from 'react'
import Header from './landingpage/Header'
import Footer from './landingpage/Footer'
import PageTopSection from '../components/shared/PageTopSection'
import { FiSearch } from "react-icons/fi";
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import apis from '../service';


const PromptSearchList = () => {
    const [prevSearchList, setPrevSearchList] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("data")));
    const inputRef = useRef(null);

    const getUserSearchHistory = async (prompt, page) => {
        const response = await apis.getUserSearchHistory(user?.id, prompt, page)
        try {
            setPrevSearchList(response?.data?.data)
            console.log(response?.data?.data, 'response?.data?.data');
        } catch (error) {

        }
    }

    useEffect(() => {
        getUserSearchHistory(inputRef.current.value, 1)
    }, [])

    const getPromptValue = (e) => {
        // setprompt(e.target.value)
        getUserSearchHistory(inputRef.current.value, 1)
    }

    const deleteSearchHistoryByName = async (searchText) => {
        const data = {
            user_id: user?.id,
            search_term: searchText,
        };

        try {
            // Make the API call to delete the search history item
            const response = await apis.DeleteSearchHistoryByName(data);

            // If the deletion is successful, update the state to remove the deleted item
            if (response?.status) {
                setPrevSearchList((prevList) => {
                    // Filter out the deleted item based on the search term
                    const updatedList = prevList?.result.filter(
                        (item) => item?.search_term !== searchText
                    );

                    // Return a new object with the updated result array and the same pagination object
                    return { ...prevList, result: updatedList };
                });
            }
        } catch (error) {
            // Handle errors if needed
            console.error('Error deleting search history item:', error);
        }
    };

    const deleteAllSearchHistory = async () => {
        const data = {
            user_id: user?.id
        }
        try {
            // Make the API call to delete the search history item
            const response = await apis.DeleteAllSearchHistory(data)

            // If the deletion is successful, update the state to remove the deleted item
            console.log(response?.status, 'status');
            if (response?.status === 200) {
                setPrevSearchList([]);
            }
        } catch (error) {
            console.error('Error deleting search history item:', error);
        }
    }
    return (
        <>
            <Header />
            <div className="prompt-search-page">
                <PageTopSection title={"All Prompt Search History"} />
                <div className="container">
                    <div className="row">
                        <div className="search-input">
                            <div className="top">
                                <div>
                                    <input
                                        type="text"
                                        name=""
                                        id=""
                                        placeholder='Search'
                                        ref={inputRef}
                                        onChange={(e) => { getPromptValue(e) }}
                                    />
                                    <FiSearch />
                                </div>
                                <button onClick={() => { deleteAllSearchHistory }}>Clear All History</button>
                            </div>
                            {prevSearchList?.result?.length > 0 ?
                                <>
                                    <div className="middle">
                                        <ul>
                                            {
                                                prevSearchList?.result?.map((item, index) => {
                                                    return (
                                                        <li key={index}><p className='message'>{item?.search_term}</p>
                                                            <p className='action' onClick={() => { deleteSearchHistoryByName(item?.search_term) }}>X</p></li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>
                                    <div className="bottom">
                                        <div className="b-wrap">
                                            <span className='pages-count'>{prevSearchList?.pagination?.page}</span>

                                            <p className='page'>of Pages {prevSearchList?.pagination?.total_pages}</p>

                                            <div className={`prev ${+prevSearchList?.pagination?.page === 1 ? 'disable' : ''}`}

                                                onClick={() => { getUserSearchHistory(inputRef?.current?.value, +prevSearchList?.pagination?.page - 1) }}

                                            ><IoIosArrowBack /></div>

                                            <div className={`next ${+prevSearchList?.pagination?.page === prevSearchList?.pagination?.total_pages ? 'disable' : ''}`}

                                                onClick={() => { getUserSearchHistory(inputRef?.current?.value, +prevSearchList?.pagination?.page + 1) }}

                                            ><IoIosArrowForward /></div>
                                        </div>
                                    </div>
                                </>
                                :
                                <div class="data-not-avaliable"><h2>No data avaliable</h2></div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default PromptSearchList