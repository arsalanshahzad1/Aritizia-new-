import React, { useEffect, useState } from 'react'

const SliderImage = () => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
          setCount((prevCount) => prevCount + 1);
        }, 30);
    
        return () => {
          clearInterval(interval);
        };
      }, []);
    return (
        <section className="home-first-sec" style={{ background: `url("assets/images/home-one.png") -${count}px 0px / cover` }}>
          
                        <div className="home-first-wrap">
                            <h1>CREATE YOUR OWN NFT</h1>
                            <div className="search">
                                <button>Prompt</button>
                                <input type="text" placeholder="A cinematic wide shot of a hamster in a space suit, HD, 2:3" />
                            </div>
                            <p>Turn AI-Generated Masterpieces into NFTs and Monetize Your Creativity</p>
   
            </div>
            <div className="connect-wallet-mobile">
                <button className='connect-wallet'>Connect Wallet</button>
            </div>
        </section>
    )
}

export default SliderImage