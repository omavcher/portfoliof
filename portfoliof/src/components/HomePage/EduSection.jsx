import React, { useEffect, useRef, useState } from 'react';
import './EduSection.css';
import { TiArrowLeftThick } from "react-icons/ti";
import { FaQuoteLeft } from "react-icons/fa";

function EduSection() {
  const scrollContainerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll only for desktop
  useEffect(() => {
    if (isMobile) return; // Don't auto-scroll on mobile

    const scrollContainer = scrollContainerRef.current;
    let animationFrameId;
    let scrollSpeed = 1;

    const scroll = () => {
      if (scrollContainer) {
        scrollContainer.scrollLeft += scrollSpeed;
        
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  // Education data
  const educationData = [
    {
      institution: "The New Era High School",
      description: "Maharashtra State Board of Secondary and Higher Secondary Education",
      major: "Science Stream",
      period: "2011 - 2021",
      image: "/edu/school.avif"
    },{
      institution: "Sant Gadge Baba Amravati University",
      description: "Maharashtra State Board of Secondary and Higher Secondary Education",
      major: "11th - 12th Science Stream",
      period: "2021 - 2023",
      image: "/edu/university.avif"
    },
    {
      institution: "Govindrao Wanjari College Of Engineering & Technology",
      description: "Bachelor's degree in Computer Engineering",
      major: "Computer Engineering",
      period: "2023 - 2027",
      image: "/edu/collage.avif"
    }
  ];

  // Combine all data for horizontal scrolling
  const allItems = [...educationData];

  // Duplicate the items to create seamless looping only for desktop
  const eduItems = (
    <>
      {!isMobile 
        ? [...educationData, ...educationData].map((item, i) => (
            <div className='edu-section-item0' key={i}>
              <img src={item.image} alt='edu' className='edu-section-image'/>
              <TiArrowLeftThick size={150}/>
              <div className='edu-section-item0-text'>
                <h2>{item.institution || item.company || item.title}</h2>
                <p>{item.description}</p>
                <span>
                  <p>{item.major || item.role || item.year}</p>
                  <p>{item.period || item.year}</p>
                </span>
              </div>
            </div>
          ))
        : educationData.map((item, i) => (
            <div className='edu-section-item0' key={i}>
              <img src={item.image} alt='edu' className='edu-section-image'/>
              <TiArrowLeftThick size={150}/>
              <div className='edu-section-item0-text'>
                <h2>{item.institution || item.company || item.title}</h2>
                <p>{item.description}</p>
                <span>
                  <p>{item.major || item.role || item.year}</p>
                  <p>{item.period || item.year}</p>
                </span>
              </div>
            </div>
          ))
      }
    </>
  );

  return (
    <div className='edu-section-conteiner94'>
      <header className='edu-section-header'>
        <h1>From Student to Engineer</h1>
        <p>Key moments in my learning and work journey.</p>
      </header>
      
      <div className='edu-section-codice' ref={scrollContainerRef}>
        {eduItems}
      </div>

      
    </div>
  );
}

export default EduSection;