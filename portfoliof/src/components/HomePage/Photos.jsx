import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Photos.css';

function Photos() {
  // Generate image paths
  const generateImagePaths = () => {
    const paths = [];
    for (let i = 1; i <= 5; i++) {
      paths.push(`/photo/p_${i.toString().padStart(3, '0')}.jpeg`);
    }
    return paths;
  };

  const images = generateImagePaths();
  const [displayedImages, setDisplayedImages] = useState([]);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const movementThreshold = 100;
  const displayDuration = 3000;

  // Generate random tilt between -15 and 15 degrees
  const getRandomTilt = () => Math.floor(Math.random() * 30) - 15;

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;
    
    const distance = Math.sqrt(
      Math.pow(x - lastPosRef.current.x, 2) + 
      Math.pow(y - lastPosRef.current.y, 2)
    );

    if (distance >= movementThreshold) {
      lastPosRef.current = { x, y };
      
      const newImage = {
        id: Date.now(),
        x,
        y,
        src: images[Math.floor(Math.random() * images.length)],
        tilt: getRandomTilt(),
        scale: 0.8 + Math.random() * 0.4 // Random scale between 0.8-1.2
      };

      setDisplayedImages(prev => [...prev, newImage]);

      // Auto-remove after duration
      setTimeout(() => {
        setDisplayedImages(prev => prev.filter(img => img.id !== newImage.id));
      }, displayDuration);
    }
  };

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      const preloadBatch = (start, end) => {
        for (let i = start; i < end; i++) {
          new Image().src = images[i];
        }
      };
      
      // Preload in chunks of 20
      for (let i = 0; i < images.length; i += 20) {
        setTimeout(() => preloadBatch(i, i + 20), i * 10);
      }
    };
    
    preloadImages();
  }, [images]);

  return (
    <div 
      ref={containerRef}
      className="photos-container" 
      onMouseMove={handleMouseMove}
    >
      {displayedImages.map((img) => (
        <motion.div
          key={img.id}
          className="image-wrapper"
          initial={{ 
            opacity: 0,
            scale: 0.5,
            rotate: img.tilt - 10,
            x: '-50%',
            y: '-50%'
          }}
          animate={{ 
            opacity: 1,
            scale: img.scale,
            rotate: img.tilt,
            x: '-50%',
            y: '-50%',
            transition: {
              type: 'spring',
              stiffness: 500,
              damping: 20
            }
          }}
          exit={{
            opacity: 0,
            scale: 0.5,
            rotate: img.tilt + 10,
            transition: { duration: 0.3 }
          }}
          style={{
            position: 'absolute',
            left: img.x,
            top: img.y,
            originX: 0.5,
            originY: 0.5
          }}
        >
          <motion.img
            src={img.src}
            alt=""
            className="gallery-image"
            loading="lazy"
            whileHover={{ scale: 1.1 }}
          />
        </motion.div>
      ))}


<div className="photos-poder">
  <h1>My Photos</h1>
  


  </div>


    </div>
  );
}

export default Photos;