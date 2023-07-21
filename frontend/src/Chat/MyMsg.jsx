import React from 'react'
import './Chat.css'
import { AiOutlineFile } from 'react-icons/ai'
import { BsCircleFill } from 'react-icons/bs'
import { BsDownload } from 'react-icons/bs'
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
    }
    const downloadFile = (url , name) => {
        // Replace 'file_url' with the actual URL of the file you want to download
        const fileUrl = 'https://example.com/path/to/your/file.pdf';
        triggerDownload(url , name);
      };
    
      const triggerDownload = (url , name) => {
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
    ;
      };
    return (
        <div className='My-message' style={{ flexDirection: 'column' }}>
            {!data.media?.length ?
                <div style={{ marginLeft: 'auto' }}>
                    <div className='msg'>
                        {data.text}
                    </div>
                    <div className='time'>
                        {data.date}
                    </div>
                </div>
                :
                <>
                    {data.media.map((res, i) => {
                        if (res.mime_type.includes('image/')) {
                            return (
                                <div className='msg-img' style={{ marginLeft: 'auto' }}>
                                    {<img src={res.original_url} alt="" width={'150px'} height={'150px'} style={{ objectFit: 'contain' }} />}
                                    <div className='time'>
                                        {data.date}
                                    </div>
                                </div>
                            )
                        }
                        else{
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
                                                <button onClick={downloadFile(res.original_url , res.file_name)}>
                                                    <BsDownload />
                                                </button>

                                            </div>
                                        </div>

                                    </div>
                                    <div className='time'>
                                        {data.date}
                                    </div>
                                </div>
                            )
                        }
                    })}
                    {/* {data.media[0].mime_type.includes('image/') &&
                        
                    }
                    {data.media[0].mime_type.includes('application/') &&
                        
                    } */}
                </>
            }
        </div>
    )
}

export default MyMsg