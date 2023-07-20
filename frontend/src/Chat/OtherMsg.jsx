import React from 'react'
import { AiOutlineFile } from 'react-icons/ai'
import { BsCircleFill } from 'react-icons/bs'
import { BsDownload } from 'react-icons/bs'

const OtherMsg = ({ img, data }) => {
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
    return (
        <div className='other-msg'>
            {/* <div className='img-holder'>
                <img src={img} alt="" />
            </div> */}
            {!data?.media?.length ?
                <div>
                    <div className='msg'>
                        {data?.text}
                    </div>
                    <div className='time' style={{ margin: '0px 0px 0px 10px' }}>
                        {data?.date}
                    </div>
                </div>
                :
                <>
                    {data.media.map((res, i) => {
                        if (res.mime_type.includes('image/')) {
                            return (
                                <div className='msg-img'>
                                    {<img src={res?.original_url} alt="" width={'200px'} />}
                                    <div className='time' style={{ margin: '0px 0px 0px 10px' }}>
                                        {data.date}
                                    </div>
                                </div>
                            )
                        }
                        if (res.mime_type.includes('application/')) {
                            return (
                                <div>
                                    <div className='msg-document'>
                                        <div className='wrap'>
                                            <div className='left'><AiOutlineFile /> <span>{res?.file_name.split('.').pop()}</span></div>
                                            <div className='center'>
                                                <div>{res?.file_name}</div>
                                                <div>{formatFileSize(res?.size)} <BsCircleFill /> {res?.file_name.split('.').pop()}</div>
                                            </div>
                                            <div className='right'>
                                                <BsDownload />
                                            </div>
                                        </div>

                                    </div>
                                    <div className='time' style={{ margin: '0px 0px 0px 10px' }}>
                                        {data?.date}
                                    </div>
                                </div>
                            )
                        }

                    })}

                    {/* {data?.media[0]?.mime_type.includes('image/') &&
                        <div className='msg-img'>
                            {<img src={data?.media_file} alt="" width={'200px'} />}
                            <div className='time' style={{ margin: '0px 0px 0px 10px' }}>
                                {data.date}
                            </div>
                        </div>
                    } */}
                    {/* {data?.media[0]?.mime_type.includes('application/') &&
                        <div>
                            <div className='msg-document'>
                                <div className='wrap'>
                                    <div className='left'><AiOutlineFile /> <span>{data?.media[0]?.file_name.split('.').pop()}</span></div>
                                    <div className='center'>
                                        <div>{data?.media[0]?.file_name}</div>
                                        <div>{formatFileSize(data?.media[0]?.size)} <BsCircleFill /> {data?.media[0]?.file_name.split('.').pop()}</div>
                                    </div>
                                    <div className='right'>
                                        <BsDownload />
                                    </div>
                                </div>

                            </div>
                            <div className='time' style={{ margin: '0px 0px 0px 10px' }}>
                                {data?.date}
                            </div>
                        </div>
                    } */}
                </>
            }
        </div>
    )
}

export default OtherMsg