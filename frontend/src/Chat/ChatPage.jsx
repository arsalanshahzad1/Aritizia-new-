import React from 'react'
import Header from '../pages/landingpage/Header'
import './Chat.css'
import ChatItem from './ChatItem'
import chatIcon from '../../public/assets/images/notificationIcon.png'
import MyMsg from './MyMsg'
import OtherMsg from './OtherMsg'
function ChatPage({ search, setSearch }) {
    return (
        <div>
            <Header

                search={search}
                setSearch={setSearch}
            />

            <div className='Chat-page'>
                <div className='chat-sidebar'>
                    <h2 className='chat-title'>Chat</h2>
                    <div className='chat-item-holder'>
                        <ChatItem image={chatIcon} name={'FAHAD'} msg={'Hi this is fahad. Can you give me some.....'} />
                        <ChatItem image={chatIcon} name={'FAHAD'} msg={'Hi this is fahad. Can you give me some.....'} />
                        <ChatItem image={chatIcon} name={'FAHAD'} msg={'Hi this is fahad. Can you give me some.....'} />
                        <ChatItem image={chatIcon} name={'FAHAD'} msg={'Hi this is fahad. Can you give me some.....'} />
                        <ChatItem image={chatIcon} name={'FAHAD'} msg={'Hi this is fahad. Can you give me some.....'} />
                        <ChatItem image={chatIcon} name={'FAHAD'} msg={'Hi this is fahad. Can you give me some.....'} />
                        <ChatItem image={chatIcon} name={'FAHAD'} msg={'Hi this is fahad. Can you give me some.....'} />
                    </div>
                </div>
                <div className='chat-area'>
                    <div className='head'>
                        <div className='user'>
                            <div className='img-holder'>
                                <img src={chatIcon} alt="" />
                            </div>
                            <div className='username'>
                                FAHAD
                                <div>
                                    Active
                                    <span>
                                        <svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="2" cy="2" r="2" fill="#2636D9" />
                                        </svg>

                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='chat-canvas'>
                        <MyMsg time={'2 mints'} msg={'Hi this is fahad. Can you give me some nfts Hi this is fahad. Can you give me some nfts Hi this is fahad. Can you give me some nfts Hi this is fahad. Can you give me some nfts'} />
                        <OtherMsg img={chatIcon} time={'2 mints'} msg={'yes maybe'} />
                        <MyMsg time={'2 mints'} msg={'Hi this is fahad. Can you give me some nfts'} />
                        <OtherMsg img={chatIcon} time={'2 mints'} msg={'Sure why not'} />
                        <OtherMsg img={chatIcon} time={'2 mints'} msg={'Good Job'} />
                        <MyMsg time={'2 mints'} msg={'Hi this is fahad. Can you give me some nfts'} />
                        <MyMsg time={'2 mints'} msg={'Hi this is fahad. Can you give me some nfts'} />
                        <MyMsg time={'2 mints'} msg={'Hi this is fahad. Can you give me some nfts'} />
                    </div>

                    <div className='foot'>
                        <input type="text" placeholder='Write message' />
                        <span>
                            <svg width="38" height="37" viewBox="0 0 38 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M37.0107 20.2192H21.9571C21.9571 21.6386 21.9571 23.0264 21.9571 24.4064C21.9571 25.3448 22.0281 26.3069 20.9477 26.7721C19.8674 27.2374 19.1813 26.5356 18.4953 25.8416C16.587 23.9175 14.6629 22.0092 12.7467 20.093C11.5481 18.8944 11.556 18.1137 12.7467 16.8993C14.7496 14.8885 16.7526 12.8776 18.7792 10.8826C19.0798 10.5585 19.4566 10.3146 19.8753 10.1729C20.1165 10.0995 20.3718 10.0851 20.6198 10.1307C20.8677 10.1764 21.1011 10.2808 21.3004 10.4353C21.4996 10.5898 21.659 10.7898 21.765 11.0185C21.871 11.2473 21.9207 11.4981 21.9098 11.75C21.9098 13.1142 21.9098 14.4863 21.9098 15.8505V16.7495H36.8925C36.3326 8.20936 28.7545 0.0161864 18.5032 0.00830078C13.834 0.0130661 9.33887 1.78102 5.91743 4.95828C2.49599 8.13554 0.400665 12.4877 0.050827 17.1438C-0.312996 22.0038 1.26064 26.8104 4.4282 30.5142C7.59577 34.2181 12.1 36.5184 16.9576 36.913C19.371 37.1365 21.8047 36.8817 24.1195 36.1632C26.4343 35.4448 28.5846 34.2767 30.4473 32.7261C32.31 31.1754 33.8485 29.2725 34.9748 27.1264C36.1011 24.9803 36.7929 22.633 37.0107 20.2192Z" fill="#2636D9" />
                            </svg>

                        </span>
                    </div>
                </div>

            </div>




        </div>
    )
}

export default ChatPage