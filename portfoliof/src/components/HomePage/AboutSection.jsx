import React, { useEffect, useRef, useState } from 'react';
import './AboutSection.css';
import { Lenis as ReactLenis } from '@studio-freight/react-lenis';
import locomotiveScroll from 'locomotive-scroll';

function AboutSection() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [images, setImages] = useState([]);
  const [frameCount, setFrameCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize Locomotive Scroll
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const scroll = new locomotiveScroll({
        el: containerRef.current,
        smooth: true,
        multiplier: 0.5,
      });

      return () => {
        scroll.destroy();
      };
    }
  }, []);

  // Load images
  useEffect(() => {
    const loadImages = async () => {
      try {
        const totalFrames = 120; // Change this to your actual frame count
        const loadedImages = [];
        
        for (let i = 1; i <= totalFrames; i++) {
          const frameNumber = i.toString().padStart(4, '0');
          const img = new Image();
          img.src = `/about_img/frame_${frameNumber}.jpeg`;
          
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = () => {
              console.error(`Error loading image: frame_${frameNumber}.jpeg`);
              resolve();
            };
          });
          
          loadedImages.push(img);
        }
        
        setImages(loadedImages);
        setFrameCount(totalFrames);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };

    loadImages();
  }, []);

  // Handle scroll and update canvas
  useEffect(() => {
    if (!isLoading && images.length > 0 && typeof window !== 'undefined') {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = windowSize.width / 2; // Half width for right column
      canvas.height = windowSize.height;
      
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollFraction = Math.min(1, Math.max(0, scrollPosition / maxScroll));
        const frameIndex = Math.min(
          frameCount - 1,
          Math.floor(scrollFraction * frameCount)
        );
        
        if (images[frameIndex]) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          const img = images[frameIndex];
          const hRatio = canvas.width / img.width;
          const vRatio = canvas.height / img.height;
          const ratio = Math.min(hRatio, vRatio); // Changed to Math.min to ensure full image fits
          const centerShiftX = (canvas.width - img.width * ratio) / 2;
          const centerShiftY = (canvas.height - img.height * ratio) / 2;
          
          ctx.drawImage(
            img,
            0, 0, img.width, img.height,
            centerShiftX, centerShiftY, img.width * ratio, img.height * ratio
          );
        }
      };

      window.addEventListener('scroll', handleScroll);
      handleScroll();

      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isLoading, images, frameCount, windowSize]);

  return (
    <ReactLenis root>
      <div ref={containerRef} className="container-about3">
        <div className="row-about3">
          {/* Left Column - Content */}
          <div className="col-left-about3">
            <div className="content-about3">
              <h1 className="title-about3">About Us</h1>
              <p className="text-about3">
                This innovative scroll effect creates a video-like experience
                using a sequence of images. As you scroll, the frames animate
                smoothly on the right side.
              </p>
              <div className="features-about3">
                <div className="feature-item-about3">
                  <h3>Smooth Animation</h3>
                  <p>60fps scroll-triggered animation</p>
                </div>
                <div className="feature-item-about3">
                  <h3>Responsive Design</h3>
                  <p>Works on all device sizes</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Canvas Animation */}
          <div className="col-right-about3">
            <div className="canvas-container-about3">
              {isLoading ? (
                <div className="loading-about3">Loading frames...</div>
              ) : (
                <canvas
                  ref={canvasRef}
                  className="animation-canvas-about3"
                />
              )}
            </div>
          </div>
        </div>
        
        <div 
          className="scroll-content-about3" 
          style={{ height: `${frameCount * 5}px` }}
        />
      </div>
    </ReactLenis>
  );
}

export default AboutSection;