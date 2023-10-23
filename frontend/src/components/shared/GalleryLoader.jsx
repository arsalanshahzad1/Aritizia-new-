import React, { useEffect, useState } from 'react'

function GalleryLoader() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    '/assets/gallery-loader/gallery-loader-1.jpg',
    '/assets/gallery-loader/gallery-loader-2.jpg',
    '/assets/gallery-loader/gallery-loader-3.jpg',
    '/assets/gallery-loader/gallery-loader-4.jpg',
    '/assets/gallery-loader/gallery-loader-5.jpg',
    '/assets/gallery-loader/gallery-loader-6.jpg',
    '/assets/gallery-loader/gallery-loader-7.jpg',
    '/assets/gallery-loader/gallery-loader-8.jpg',
    // Add more image URLs as needed
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);
  return (

    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: "0",
      left: "0",
      background: 'rgba(0, 0, 0, 0.5)',
      zIndex: '9999',
      overflow: "hidden"
    }}>
      <section className="sec-loading">
        <div className="image-wrap">
        <img
          src={images[currentImageIndex]}
          alt={`Image ${currentImageIndex + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        </div>
        <p>Your Art Masterpiece is in Process</p>
      </section>
    </div>
  )
}

export default GalleryLoader