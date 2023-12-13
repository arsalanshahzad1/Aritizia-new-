import React, { useEffect, useRef, useState } from "react";
import Header from "../pages/landingpage/Header";
import "./Chat.css";
import ChatItem from "./ChatItem";
import MyMsg from "./MyMsg";
import OtherMsg from "./OtherMsg";
import apis from "../service";
import { HiOutlinePaperClip } from "react-icons/hi";
import laravelEcho from "../socket/index";
import { RxCross2 } from "react-icons/rx";
import { AiOutlinePlus } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";

function ChatPage({ search, setSearch }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [userMessagesListing, setUserMessagesListing] = useState("");
  const [userMessagesDetails, setUserMessagesDetails] = useState("");
  const [userDetails, setUserDetails] = useState("");
  const [chatIndex, setChatIndex] = useState(null);
  const textMessage = useRef("");
  const [fileMessages, setFileMessages] = useState("");
  const [showFileMessages, setShowFileMessages] = useState("");
  const data = { sender_id: "", receiver_id: "", message: "", media_file: "" };
  const params = useParams();
  const [activeUserId, setActiveUserId] = useState(params.id);
  const id = JSON.parse(localStorage.getItem("data"));
  const [disableSend , setDisableSend] = useState(true)
  const [showChatList , setShowChatList] = useState(true)
  const user_id = id?.id;
  const acceptedFileTypes = [
    ".png",
    ".webp",
    ".jpg",
    ".jpeg",
    ".pdf",
    ".doc",
    ".docx",
    ".txt",
  ];

  const ChatUsers = async () => {
    try {
      const response = await apis.getChatUsers(user_id);
      if (response.status) {
        setUserMessagesListing(response.data);
      } else {
        toast.error("getting some error");
      }
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const ChatMessage = async (id) => {

    try {
      // setChatIndex(index)
      setActiveUserId(id);
      const response = await apis.getChatMessages(user_id, id);
      if (response.status) {
        setUserMessagesDetails(response?.data?.data);
        setUserDetails(response?.data?.user);
        // console.log(userDetails, "userDetails");
      } else {
        toast.error("getting some error");
      }
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const handleImageUpload = (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      setFileMessages((prevState) => [...prevState, file]);
      // Check if the file is an image based on its MIME type
      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        setShowFileMessages((prevState) => [
          ...prevState,
          <img key={i} src={imageUrl} alt={`Image ${i}`} />,
        ]);
      } else {
        setShowFileMessages((prevState) => [
          ...prevState,
          <p key={i}>{file.name}</p>,
        ]);
      }

      //   setFileMessages((prevState) => [...prevState, file]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const removeImage = (index) => {
    const newShowMessages = [...showFileMessages];
    const newFileMessages = [...fileMessages];
    newShowMessages.splice(index, 1);
    newFileMessages.splice(index, 1);
    setShowFileMessages(newShowMessages);
    setFileMessages(newFileMessages);
  };

  const sendChat = async (e) => {
    e.preventDefault();

    data.sender_id = user_id;
    data.receiver_id = activeUserId;
    data.message = textMessage.current.value;
    data.media_file = fileMessages;

    if (data?.message != "" || data?.media_file != "") {
      const sendData = new FormData();
      sendData.append("sender_id", data?.sender_id);
      sendData.append("receiver_id", data?.receiver_id);
      sendData.append("message", data?.message);

      for (let i = 0; i < fileMessages.length; i++) {
        sendData.append("media_file[]", fileMessages[i]);
      }
      try {
        const response = await apis.postChatMessages(sendData);

        if (response?.status) {
          // console.log(response, "send-chat-response");
          setUserMessagesDetails((prevState) => [
            response?.data?.data,
            ...prevState,
          ]);
          textMessage.current.value = "";
          setShowFileMessages("");
          setFileMessages("");
          setDisableSend(true)
        }
      } catch (e) {
        console.log("Error: ", e);
        setDisableSend(true)
      }
    } else {
      toast.error("Data can no be empty");
      setDisableSend(true)
    }
  };

  useEffect(() => {
    ChatUsers();
  }, [userMessagesDetails, showFileMessages, fileMessages]);

  useEffect(() => {
    ChatMessage(params.id);
  }, [params, userMessagesDetails]);

  useEffect(() => {}, [userMessagesDetails]);

  useEffect(() => {
    const id = JSON.parse(localStorage.getItem("data"));
    const user_id = id?.id;
    const channel = laravelEcho.channel("chat-channel-" + user_id);
    channel.listen(".chat-event", (data) => {

      if (data?.data?.sender_id == activeUserId) {
        setUserMessagesDetails((prevState) => [data?.data, ...prevState]);
      } else {
        ChatUsers();
      }
    });

    return () => {
      channel.stopListening(".chat-event");
    };
  }, [userMessagesDetails, userMessagesListing]);
  
  return (
    <div>
      <Header search={search} setSearch={setSearch} />

      <div className="Chat-page" id="hide-on-mobile-new">
        <div className="chat-sidebar">
          <h2 className="chat-title">Chat</h2>
          <div className="chat-item-holder">
            <>
              {userMessagesListing ? (
                <>
                  {userMessagesListing.data.map((data, index) => {
                    return (
                      <ChatItem
                        ChatMessage={ChatMessage}
                        data={data}
                        index={index}
                        activeUserId={activeUserId}
                      />
                    );
                  })}
                </>
              ) : (
                <div className="chat-loading">
                  <p>No Chats </p>
                </div>    
              )}
            </>
          </div>
        </div>
        <div className="chat-area">
          {userMessagesDetails.length > 0 ? (
            <>
              <div className="head">
                <div className="user">
                  <div className="img-holder">
                    {userDetails?.profile_image == null ? (
                      <img src="../public/assets/images/user-none.png" alt="" />
                    ) : (
                      <img src={userDetails?.profile_image} alt="" />
                    )}
                  </div>
                  <div className="username">
                    {/* FAHAD */}
                    {userDetails?.username}
                    {/* {userDetails?.first_name == null ?
                                            'User' + activeUserId
                                            :
                                            userDetails?.first_name
                                        } */}
                    <div>
                      Active
                      <span>
                        <svg
                          width="4"
                          height="4"
                          viewBox="0 0 4 4"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="2" cy="2" r="2" fill="#2636D9" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="chat-canvas">
                {userMessagesDetails?.map((data, index) => {
                  if (data?.chat_by === user_id) {
                    return (
                      <MyMsg
                        data={data}
                        time={"2 mints"}
                        msg={
                          "Hi this is fahad. Can you give me some nfts Hi this is fahad. Can you give me some nfts Hi this is fahad. Can you give me some nfts Hi this is fahad. Can you give me some nfts"
                        }
                      />
                    );
                  } else {
                    return (
                      <OtherMsg
                        data={data}
                        img={userMessagesListing[chatIndex]?.profile_image}
                      />
                    );
                  }
                })}
              </div>
              <div className="foot">
                <div className="foot-wrap">
                  <div className="display-images-List">
                    {showFileMessages.length > 0 ? (
                      <>
                        {showFileMessages.map((data, i) => {
                          return (
                            <div
                              onClick={() => removeImage(i)}
                              style={{ position: "relative" }}
                            >
                              {data}
                              <RxCross2 className="cross" />
                            </div>
                          );
                        })}
                        <span onClick={handleButtonClick} className="plus-wrap">
                          <input
                            ref={fileInputRef}
                            type="file"
                            style={{ display: "none" }}
                            onChange={handleImageUpload}
                            multiple
                            accept={acceptedFileTypes.join(", ")}
                          />
                          <AiOutlinePlus />
                        </span>
                      </>
                    ) : null}
                  </div>
                  <div className="foot-wrap-input">
                    {showFileMessages.length < 1 && (
                      <span className="upload-file" onClick={handleButtonClick}>
                        <input
                          ref={fileInputRef}
                          type="file"
                          style={{ display: "none" }}
                          onChange={handleImageUpload}
                          multiple
                          accept={acceptedFileTypes.join(", ")}
                        />
                        <HiOutlinePaperClip />
                      </span>
                    )}
                    <input
                      type="text"
                      placeholder="Write message"
                      defaultValue={textMessage?.current?.value}
                      ref={textMessage}
                    />
                    <span style={{pointerEvents : disableSend ? '' : 'none'}} onClick={(e) => {sendChat(e) ; setDisableSend(false)}}>
                      <svg
                        style={{ transform: "rotate(90deg)" }}
                        width="38"
                        height="37"
                        viewBox="0 0 38 37"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M37.0107 20.2192H21.9571C21.9571 21.6386 21.9571 23.0264 21.9571 24.4064C21.9571 25.3448 22.0281 26.3069 20.9477 26.7721C19.8674 27.2374 19.1813 26.5356 18.4953 25.8416C16.587 23.9175 14.6629 22.0092 12.7467 20.093C11.5481 18.8944 11.556 18.1137 12.7467 16.8993C14.7496 14.8885 16.7526 12.8776 18.7792 10.8826C19.0798 10.5585 19.4566 10.3146 19.8753 10.1729C20.1165 10.0995 20.3718 10.0851 20.6198 10.1307C20.8677 10.1764 21.1011 10.2808 21.3004 10.4353C21.4996 10.5898 21.659 10.7898 21.765 11.0185C21.871 11.2473 21.9207 11.4981 21.9098 11.75C21.9098 13.1142 21.9098 14.4863 21.9098 15.8505V16.7495H36.8925C36.3326 8.20936 28.7545 0.0161864 18.5032 0.00830078C13.834 0.0130661 9.33887 1.78102 5.91743 4.95828C2.49599 8.13554 0.400665 12.4877 0.050827 17.1438C-0.312996 22.0038 1.26064 26.8104 4.4282 30.5142C7.59577 34.2181 12.1 36.5184 16.9576 36.913C19.371 37.1365 21.8047 36.8817 24.1195 36.1632C26.4343 35.4448 28.5846 34.2767 30.4473 32.7261C32.31 31.1754 33.8485 29.2725 34.9748 27.1264C36.1011 24.9803 36.7929 22.633 37.0107 20.2192Z"
                          fill="#2636D9"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="no-message-selected">No Message Selected</div>
          )}
        </div>
      </div>
      <div className="Chat-page" id="hide-on-desktop-new" style={{}}>
        {showChatList ?
        <div className="chat-sidebar" style={{width:'100%' , padding : '0px 10px' , borderRadius : '20px'}}>
          <h2 className="chat-title">Chat</h2>
          <div className="chat-item-holder">
            <>
              {userMessagesListing ? (
                <>
                  {userMessagesListing.data.map((data, index) => {
                    return (
                      <ChatItem
                        ChatMessage={ChatMessage}
                        data={data}
                        index={index}
                        activeUserId={activeUserId}
                        setShowChatList={setShowChatList}
                        showChatList={showChatList}
                      />
                    );
                  })}
                </>
              ) : (
                <div className="chat-loading">
                  <p>No Chats </p>
                </div>    
              )}
            </>
          </div>
        </div>
        :
        <div className="chat-area" style={{width:'100%'}}>
          {userMessagesDetails.length > 0 ? (
            <>
              <div className="head" style={{borderRadius : '20px'}}>
                <div className="user">
                  <span onClick={() => setShowChatList(true)}><FaArrowLeft /></span>
                  <div className="img-holder" style={{marginLeft : '10px'}}>
                    {userDetails?.profile_image == null ? (
                      <img src="../public/assets/images/user-none.png" alt="" />
                    ) : (
                      <img src={userDetails?.profile_image} alt="" />
                    )}
                  </div>
                  <div className="username">
                    {/* FAHAD */}
                    {userDetails?.username}
                    {/* {userDetails?.first_name == null ?
                                            'User' + activeUserId
                                            :
                                            userDetails?.first_name
                                        } */}
                    <div>
                      Active
                      <span>
                        <svg
                          width="4"
                          height="4"
                          viewBox="0 0 4 4"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="2" cy="2" r="2" fill="#2636D9" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="chat-canvas">
                {userMessagesDetails?.map((data, index) => {
                  if (data?.chat_by === user_id) {
                    return (
                      <MyMsg
                        data={data}
                        time={"2 mints"}
                        msg={
                          "Hi this is fahad. Can you give me some nfts Hi this is fahad. Can you give me some nfts Hi this is fahad. Can you give me some nfts Hi this is fahad. Can you give me some nfts"
                        }
                      />
                    );
                  } else {
                    return (
                      <OtherMsg
                        data={data}
                        img={userMessagesListing[chatIndex]?.profile_image}
                      />
                    );
                  }
                })}
              </div>
              <div className="foot">
                <div className="foot-wrap">
                  <div className="display-images-List">
                    {showFileMessages.length > 0 ? (
                      <>
                        {showFileMessages.map((data, i) => {
                          return (
                            <div
                              onClick={() => removeImage(i)}
                              style={{ position: "relative" }}
                            >
                              {data}
                              <RxCross2 className="cross" />
                            </div>
                          );
                        })}
                        <span onClick={handleButtonClick} className="plus-wrap">
                          <input
                            ref={fileInputRef}
                            type="file"
                            style={{ display: "none" }}
                            onChange={handleImageUpload}
                            multiple
                            accept={acceptedFileTypes.join(", ")}
                          />
                          <AiOutlinePlus />
                        </span>
                      </>
                    ) : null}
                  </div>
                  <div className="foot-wrap-input">
                    {showFileMessages.length < 1 && (
                      <span className="upload-file" onClick={handleButtonClick}>
                        <input
                          ref={fileInputRef}
                          type="file"
                          style={{ display: "none" }}
                          onChange={handleImageUpload}
                          multiple
                          accept={acceptedFileTypes.join(", ")}
                        />
                        <HiOutlinePaperClip />
                      </span>
                    )}
                    <input
                      type="text"
                      placeholder="Write message"
                      defaultValue={textMessage?.current?.value}
                      ref={textMessage}
                    />
                    <span style={{pointerEvents : disableSend ? '' : 'none'}} onClick={(e) => {sendChat(e) ; setDisableSend(false)}}>
                      <svg
                        style={{ transform: "rotate(90deg)" }}
                        width="38"
                        height="37"
                        viewBox="0 0 38 37"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M37.0107 20.2192H21.9571C21.9571 21.6386 21.9571 23.0264 21.9571 24.4064C21.9571 25.3448 22.0281 26.3069 20.9477 26.7721C19.8674 27.2374 19.1813 26.5356 18.4953 25.8416C16.587 23.9175 14.6629 22.0092 12.7467 20.093C11.5481 18.8944 11.556 18.1137 12.7467 16.8993C14.7496 14.8885 16.7526 12.8776 18.7792 10.8826C19.0798 10.5585 19.4566 10.3146 19.8753 10.1729C20.1165 10.0995 20.3718 10.0851 20.6198 10.1307C20.8677 10.1764 21.1011 10.2808 21.3004 10.4353C21.4996 10.5898 21.659 10.7898 21.765 11.0185C21.871 11.2473 21.9207 11.4981 21.9098 11.75C21.9098 13.1142 21.9098 14.4863 21.9098 15.8505V16.7495H36.8925C36.3326 8.20936 28.7545 0.0161864 18.5032 0.00830078C13.834 0.0130661 9.33887 1.78102 5.91743 4.95828C2.49599 8.13554 0.400665 12.4877 0.050827 17.1438C-0.312996 22.0038 1.26064 26.8104 4.4282 30.5142C7.59577 34.2181 12.1 36.5184 16.9576 36.913C19.371 37.1365 21.8047 36.8817 24.1195 36.1632C26.4343 35.4448 28.5846 34.2767 30.4473 32.7261C32.31 31.1754 33.8485 29.2725 34.9748 27.1264C36.1011 24.9803 36.7929 22.633 37.0107 20.2192Z"
                          fill="#2636D9"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="no-message-selected">No Message Selected</div>
          )}
        </div>
      }
      </div>
    </div>
  );
}

export default ChatPage;
