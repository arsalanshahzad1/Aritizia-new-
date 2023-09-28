import React from 'react'

const Loader = () => {
    return (
        <div style={{
            width: '100vw' , 
            height : '100vh' , 
            position : 'fixed',
            top:"0", 
            left: "0",
            background : 'rgba(0, 0, 0, 0.5)',
            zIndex : '9999',
            overflow: "hidden"
            }}> 
            <section className="sec-loading">
                <div className="one"></div>
            </section>
        </div>
    )
}

export default Loader