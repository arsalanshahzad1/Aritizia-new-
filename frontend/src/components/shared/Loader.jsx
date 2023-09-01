import React from 'react'

const Loader = () => {
    return (
        <div style={{
            width: '100%' , 
            height : '100vh' , 
            top : '0' , 
            position : 'absolute' , 
            background : 'rgba(0, 0, 0, 0.5)',
            zIndex : '9999'
            }}> 
            <section class="sec-loading">
                <div class="one"></div>
            </section>
        </div>
    )
}

export default Loader