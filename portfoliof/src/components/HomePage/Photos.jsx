import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Photos.css';

function Photos() {
  // Generate image paths
  const generateImagePaths = () => {
    const paths = [];
    for (let i = 1; i <= 15; i++) {
      paths.push(`/photo/p_${i.toString().padStart(3, '0')}.avif`);
    }
    return paths;
  };

  const images = generateImagePaths();
  const [displayedImages, setDisplayedImages] = useState([]);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const movementThreshold = 100;
  const displayDuration = 5000; // Increased to 5 seconds
  const maxImages = 7; // Maximum number of images to show
  const mobileIntervalRef = useRef(null);

  // Generate random position within container
  const getRandomPosition = () => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const containerRect = containerRef.current.getBoundingClientRect();
    return {
      x: Math.random() * (containerRect.width - 200), // Account for image width
      y: Math.random() * (containerRect.height - 200) // Account for image height
    };
  };

  // Generate random tilt between -15 and 15 degrees
  const getRandomTilt = () => Math.floor(Math.random() * 30) - 15;

  const createNewImage = (x, y) => {
    return {
      id: Date.now(),
      x,
      y,
      src: images[Math.floor(Math.random() * images.length)],
      tilt: getRandomTilt(),
      scale: 0.8 + Math.random() * 0.4
    };
  };

  const handleMouseMove = (e) => {
    if (isMobile || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;
    
    const distance = Math.sqrt(
      Math.pow(x - lastPosRef.current.x, 2) + 
      Math.pow(y - lastPosRef.current.y, 2)
    );

    if (distance >= movementThreshold) {
      lastPosRef.current = { x, y };
      const newImage = createNewImage(x, y);
      setDisplayedImages(prev => {
        const updated = [...prev, newImage];
        if (updated.length > maxImages) {
          return updated.slice(-maxImages);
        }
        return updated;
      });

      // Auto-remove after duration
      setTimeout(() => {
        setDisplayedImages(prev => prev.filter(img => img.id !== newImage.id));
      }, displayDuration);
    }
  };

  // Handle mobile auto-appearing photos
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const showRandomImage = () => {
      const position = getRandomPosition();
      const newImage = createNewImage(position.x, position.y);
      
      setDisplayedImages(prev => {
        const updated = [...prev, newImage];
        if (updated.length > maxImages) {
          return updated.slice(-maxImages);
        }
        return updated;
      });

      // Auto-remove after duration
      setTimeout(() => {
        setDisplayedImages(prev => prev.filter(img => img.id !== newImage.id));
      }, displayDuration);
    };

    // Show initial images with delay
    const initialImages = Math.floor(Math.random() * 3) + 5; // Random number between 5-7
    for (let i = 0; i < initialImages; i++) {
      setTimeout(showRandomImage, i * 800); // Increased delay between initial images
    }

    // Set up interval for continuous appearance
    mobileIntervalRef.current = setInterval(showRandomImage, 3000); // Increased interval

    return () => {
      if (mobileIntervalRef.current) {
        clearInterval(mobileIntervalRef.current);
      }
    };
  }, [isMobile]);

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
        <div className="content-wrapper">
          <h1>Hey, I'm Om 👋</h1>
          <p>A passionate full-stack developer exploring AI, APIs, and scalable SaaS solutions.</p>
          <div className="highlight-box">
            <h2>Tech Explorer 🚀</h2>
            <p>I love building real-world products that solve problems — from AI chat apps to powerful APIs. Let's innovate together!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Photos;