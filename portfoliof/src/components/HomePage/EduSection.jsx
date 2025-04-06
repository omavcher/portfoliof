import React, { useEffect, useRef } from 'react';
import './EduSection.css';
import { TiArrowLeftThick } from "react-icons/ti";
import { FaQuoteLeft } from "react-icons/fa";

function EduSection() {
  const scrollContainerRef = useRef(null);
  const rightSectionRef = useRef(null);

  // Prevent touch events from interfering with auto-scroll
  useEffect(() => {
    const preventTouch = (e) => {
      e.preventDefault();
    };

    const scrollContainer = scrollContainerRef.current;
    const rightSection = rightSectionRef.current;

    if (scrollContainer) {
      scrollContainer.addEventListener('touchstart', preventTouch, { passive: false });
      scrollContainer.addEventListener('touchmove', preventTouch, { passive: false });
    }

    if (rightSection) {
      rightSection.addEventListener('touchstart', preventTouch, { passive: false });
      rightSection.addEventListener('touchmove', preventTouch, { passive: false });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('touchstart', preventTouch);
        scrollContainer.removeEventListener('touchmove', preventTouch);
      }
      if (rightSection) {
        rightSection.removeEventListener('touchstart', preventTouch);
        rightSection.removeEventListener('touchmove', preventTouch);
      }
    };
  }, []);

  // Auto-scroll for horizontal section
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    let animationFrameId;
    let scrollSpeed = 1; // Adjust speed as needed

    const scroll = () => {
      if (scrollContainer) {
        scrollContainer.scrollLeft += scrollSpeed;
        
        // Reset scroll position when reaching the end to create infinite loop
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
  }, []);

  // Auto-scroll for vertical section
  useEffect(() => {
    const rightSection = rightSectionRef.current;
    let animationFrameId;
    let scrollSpeed = 0.5; // Slower speed for vertical scroll

    const scroll = () => {
      if (rightSection) {
        rightSection.scrollTop += scrollSpeed;
        
        // Reset scroll position when reaching the bottom
        if (rightSection.scrollTop >= rightSection.scrollHeight - rightSection.clientHeight) {
          rightSection.scrollTop = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

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

  // Duplicate the items to create seamless looping
  const eduItems = (
    <>
      {[...educationData,...educationData].map((item, i) => (
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
      ))}
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