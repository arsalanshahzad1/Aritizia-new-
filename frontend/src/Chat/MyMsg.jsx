// import React from 'react'
// import './Chat.css'
// import { AiOutlineFile } from 'react-icons/ai'
// import { BsCircleFill } from 'react-icons/bs'
// import { BsDownload } from 'react-icons/bs'
// const MyMsg = ({ data }) => {
//     const formatFileSize = (sizeInBytes) => {
//         const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
//         let size = sizeInBytes;
//         let unitIndex = 0;

//         while (size >= 1024 && unitIndex < units.length - 1) {
//             size /= 1024;
//             unitIndex++;
//         }

//         return `${size.toFixed(2)} ${units[unitIndex]}`;
//     }

//     return (
//         <div className='My-message' style={{ flexDirection: 'column' }}>
//             {!data.media?.length ?
//                 <div style={{ marginLeft: 'auto' }}>
//                     <div className='msg'>
//                         {data.text}
//                     </div>
//                     <div className='time'>
//                         {data.date}
//                     </div>
//                 </div>
//                 :
//                 <>
//                     {data.media.map((res, i) => {
//                         if (res.mime_type.includes('image/')) {
//                             return (
//                                 <div className='msg-img' style={{ marginLeft: 'auto' }}>
//                                     {<img src={res.original_url} alt="" width={'150px'} height={'150px'} style={{ objectFit: 'contain' }} />}
//                                     <div className='time'>
//                                         {data.date}
//                                     </div>
//                                 </div>
//                             )
//                         }
//                         else{
//                             return (
//                                 <div style={{ marginLeft: 'auto' }}>
//                                     <div className='msg-document'>
//                                         <div className='wrap'>
//                                             <div className='left'><AiOutlineFile /> <span>{res.file_name.split('.').pop()}</span></div>
//                                             <div className='center'>
//                                                 <div>{res.file_name}</div>
//                                                 <div>{formatFileSize(res.size)} <BsCircleFill /> {res.file_name.split('.').pop()}</div>
//                                             </div>
//                                             <div className='right'>
//                                                 <button >
//                                                     <BsDownload />
//                                                 </button>

//                                             </div>
//                                         </div>

//                                     </div>
//                                     <div className='time'>
//                                         {data.date}
//                                     </div>
//                                 </div>
//                             )
//                         }
//                     })}
//                 </>
//             }
//         </div>
//     )
// }

// export default MyMsg

import React from 'react';
import './Chat.css';
import { AiOutlineFile } from 'react-icons/ai';
import { BsCircleFill, BsDownload } from 'react-icons/bs';

const MyMsg = ({ data }) => {
    const formatFileSize = (sizeInBytes) => {
        const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        let size = sizeInBytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(2)} ${units[unitIndex]}`;
    };

    const hasMedia = data?.media?.length > 0;
    const hasText = data?.text && data?.text.trim() !== '';

    return (
        <div className='My-message' style={{ flexDirection: 'column' }}>
            {hasMedia && data?.media.map((res, i) => {
                if (res.mime_type.includes('image/')) {
                    return (
                        <div className='msg-img' style={{ marginLeft: 'auto' }}>
                            {<img src={res.original_url} alt="" width={'150px'} height={'150px'} style={{ objectFit: 'contain' }} />}
                            
                            <div className='time'>
                            {hasText ? null : 
                                data?.date
                            }
                            </div>
                        </div>
                    )
                }
                else {
                    return (
                        <div style={{ marginLeft: 'auto' }}>
                            <div className='msg-document'>
                                <div className='wrap'>
                                    <div className='left'><AiOutlineFile /> <span>{res.file_name.split('.').pop()}</span></div>
                                    <div className='center'>
                                        <div>{res.file_name}</div>
                                        <div>{formatFileSize(res.size)} <BsCircleFill /> {res.file_name.split('.').pop()}</div>
                                    </div>
                                    <div className='right'>
                                      
                                            <BsDownload />
                                      

                                    </div>
                                </div>

                            </div>
                            <div className='time'>
                            {hasText ? null : 
                                data.date
                            }
                            </div>
                        </div>
                    )
                }
            })}

            {hasText && (
                <div style={{ marginLeft: 'auto' }}>
                    <div className='msg'>
                        {data?.text}
                    </div>
                    <div className='time'>
                        {data?.date}
                    </div>
                    
                </div>
            )}
        </div>
    );
};

export default MyMsg;
