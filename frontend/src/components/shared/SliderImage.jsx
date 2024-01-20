import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderConnectPopup from "../../pages/Headers/HeaderConnectPopup";
import EmailSigninPopup from "../../pages/Headers/EmailSigninPopup";
import { GlobalContext } from "../../Context/GlobalContext";
import apis from "../../service";

const SliderImage = () => {
  const { prompt, setprompt } = useContext(GlobalContext);
  const [count, setCount] = useState(0);
  const [prevSearchList, setPrevSearchList] = useState([]);
  const [connectPopup, setConnectPopup] = useState(false);
  const [emailSigninPopup, setEmailSigninPopup] = useState(false);
  const [inputOptions, setInputOptions] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("data")));
  const inputRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 30);

    return () => {
      clearInterval(interval);
    };
  }, []);


  const navigate = useNavigate()
  const handleKeyDown = (e) => {
    if (prevSearchList?.result?.length > 0) {
      setInputOptions(true)
    }
    if (e.key === 'Enter') {
      storeSearchHistory()
      navigate(`/art`)

    }
  };

  const goToPromptSearchPage = () => {
    navigate(`/prompt-search`)
  }
  const handleDocumentClick = (e) => {
    // Check if the click is outside the input field
    // and not on the delete button or the "See All" and "Delete All" elements
    if (
      inputRef.current &&
      !inputRef.current.contains(e.target) &&
      !e.target.closest('.AQZ9Vd') &&
      !e.target.closest('.search-all-delete')
    ) {
      // Perform your action for clicks outside the input field
      setInputOptions(false); // Hide input options when clicked outside
    }
  };

  useEffect(() => {
    // Add click event listener to the document
    document.addEventListener('click', handleDocumentClick);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);


  const getUserSearchHistory = async (prompt, page) => {
    const response = await apis.getUserSearchHistory(user?.id, prompt, page)
    try {
      if (response?.data?.data?.result?.length > 0) {
        setInputOptions(true)
      }
      setPrevSearchList(response?.data?.data)
    } catch (error) {

    }
  }

  const storeSearchHistory = async () => {
    const data = {
      user_id: user?.id,
      search_key: prompt
    }
    const response = await apis.storeSearchHistory(data)
    try {
    } catch (error) {
      console.errpr(error, 'error');
    }
  }

  const getSearchList = () => {
    getUserSearchHistory(inputRef.current.value, 1)
  }
  const DeleteSearchHistoryByName = async (searchText) => {
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
          const updatedList = prevList.result.filter(
            (item) => item.search_term !== searchText
          );

          // Return the updated list
          return { result: updatedList };
        });
      }
    } catch (error) {
      // Handle errors if needed
      console.error('Error deleting search history item:', error);
    }
  };

  const DeleteAllSearchHistory = async () => {
    const data = {
      user_id: user?.id
    }
    try {
      // Make the API call to delete the search history item
      const response = await apis.DeleteAllSearchHistory(data)

      // If the deletion is successful, update the state to remove the deleted item
      if (response?.status === 200) {
        setInputOptions(false)
        setPrevSearchList([]);
      }
    } catch (error) {
      console.error('Error deleting search history item:', error);
    }
  }

  const getPromptValue = (e) => {
    console.log(e.target.value, 'e.target.value');
    setprompt(e.target.value)
    getUserSearchHistory(inputRef.current.value, 1)
  }


  return (
    <>
      <section className="home-first-sec"
        style={{
          background: `url("assets/images/home-one.png") -${count}px 0px / cover`,
        }}
      >
        <div className="home-first-wrap">
          <h1>CREATE YOUR OWN NFT</h1>
          <div className="search" id="prompt">
            {user?.email != null && user ?
              <Link to="/art"> <button>Prompt</button> </Link>
              :
              <button onClick={() => setEmailSigninPopup(true)}>Prompt</button>
            }
            <div className="search-input-wrap">
              <input
                type="text"
                placeholder="A cinematic wide shot of a hamster in a space suite, HD, NFT art, 2:3"
                defaultValue={prompt}
                onChange={(e) => getPromptValue(e)}
                onKeyDown={handleKeyDown}
                onClick={getSearchList}
                ref={inputRef}
              />
              {inputOptions &&
                <>
                  {prevSearchList?.result?.length === 0 ?
                    null
                    :
                    <div className="search-options">
                      <ul className="not-hide">
                        {prevSearchList?.result?.slice(0, 5)?.map((item, index) => {
                          return (
                            <li key={index}>
                              <div className="eIPGRd">
                                <div className="sbic sb27"></div>
                                <div className="pcTkSc" onClick={() => setprompt(item?.search_term)}>
                                  {item?.search_term}
                                </div>
                                <div
                                  className="AQZ9Vd"
                                  aria-atomic="true"
                                  role="button"
                                  aria-label="Delete from history"
                                  id="YjTQcc"
                                >
                                  <div className="sbai JCHpcb" role="presentation" onClick={() => DeleteSearchHistoryByName(item?.search_term)}>
                                    Delete
                                  </div>
                                </div>
                              </div>

                            </li>
                          )
                        })}
                        <li className="search-all-delete">
                          <span onClick={() => { goToPromptSearchPage() }}>See All</span>
                          <span onClick={() => { DeleteAllSearchHistory() }}>Delete All</span>
                        </li>
                      </ul>
                    </div>

                  }
                </>
              }
            </div>
          </div>
          <p>
            Turn AI-Generated Masterpieces into NFTs and Monetize Your Creativity
          </p>
        </div>
      </section>
      <HeaderConnectPopup connectPopup={connectPopup} setConnectPopup={setConnectPopup} />
      <EmailSigninPopup emailSigninPopup={emailSigninPopup} setEmailSigninPopup={setEmailSigninPopup} />
    </>
  );
};

export default SliderImage;
