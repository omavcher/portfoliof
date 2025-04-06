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
      institution: "The New Era High School Jalgaon",
      description: "Completed my secondary education with focus on science and mathematics.",
      major: "Science Stream",
      period: "2016 - 2020",
      image: "https://cdn.prod.website-files.com/669a11d30bf2c1287ddd77fc/66bfaa951418806d1120d8b4_Rectangle%20100%20(2).png"
    },
    {
      institution: "Engineering College",
      description: "Bachelor's degree in Computer Engineering with specialization in AI.",
      major: "Computer Engineering",
      period: "2020 - 2024",
      image: "https://cdn.prod.website-files.com/669a11d30bf2c1287ddd77fc/66bfaa951418806d1120d8b4_Rectangle%20100%20(2).png"
    }
  ];

  // Experience data
  const experienceData = [
    {
      company: "Tech Solutions Inc.",
      role: "Junior Developer",
      description: "Worked on front-end development using React and backend APIs.",
      period: "2022 - 2023",
      image: "https://cdn.prod.website-files.com/669a11d30bf2c1287ddd77fc/66bfaa951418806d1120d8b4_Rectangle%20100%20(2).png"
    },
    {
      company: "Innovate Labs",
      role: "Software Engineer",
      description: "Led a team to develop a new mobile application with React Native.",
      period: "2023 - Present",
      image: "https://cdn.prod.website-files.com/669a11d30bf2c1287ddd77fc/66bfaa951418806d1120d8b4_Rectangle%20100%20(2).png"
    }
  ];

  // Achievements data
  const achievementsData = [
    {
      title: "Best Project Award",
      description: "Won first prize in college tech fest for innovative AI project.",
      year: "2023",
      image: "https://cdn.prod.website-files.com/669a11d30bf2c1287ddd77fc/66bfaa951418806d1120d8b4_Rectangle%20100%20(2).png"
    },
    {
      title: "Hackathon Winner",
      description: "Developed a solution for local business automation in 48 hours.",
      year: "2022",
      image: "https://cdn.prod.website-files.com/669a11d30bf2c1287ddd77fc/66bfaa951418806d1120d8b4_Rectangle%20100%20(2).png"
    }
  ];

  // Combine all data for horizontal scrolling
  const allItems = [...educationData, ...experienceData, ...achievementsData];

  // Duplicate the items to create seamless looping
  const eduItems = (
    <>
      {[...allItems, ...allItems].map((item, i) => (
        <div className='edu-section-item0' key={i}>
          <img src={item.image} alt='edu' className='edu-section-image'/>
          <TiArrowLeftThick size={200}/>
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

      <div className='experice-section-details3'>
        <div className='experice-details3-text-left-section'>
          {/* Left section content if any */}
        </div>

        <div className='experice-details3-text-right-section' ref={rightSectionRef}>
          {/* Education Items */}
          {educationData.map((edu, index) => (
            <div className={`experice-details3-text-right-item${index % 2 === 0 ? '' : '-reverse'}`} key={`edu-${index}`}>
              <span>
                <FaQuoteLeft size={20} />
                <p>{edu.description}</p>
                <small>{edu.period}</small>
              </span>
              <img src={edu.image} alt='edu' className='experice-details3-text-right-item-image'/>
            </div>
          ))}

          {/* Experience Items */}
          {experienceData.map((exp, index) => (
            <div className={`experice-details3-text-right-item${index % 2 === 0 ? '' : '-reverse'}`} key={`exp-${index}`}>
              <span>
                <FaQuoteLeft size={20} />
                <p><strong>{exp.role}</strong> at {exp.company}: {exp.description}</p>
                <small>{exp.period}</small>
              </span>
              <img src={exp.image} alt='exp' className='experice-details3-text-right-item-image'/>
            </div>
          ))}

          {/* Achievements Items */}
          {achievementsData.map((ach, index) => (
            <div className={`experice-details3-text-right-item${index % 2 === 0 ? '' : '-reverse'}`} key={`ach-${index}`}>
              <span>
                <FaQuoteLeft size={20} />
                <p><strong>{ach.title}</strong>: {ach.description}</p>
                <small>{ach.year}</small>
              </span>
              <img src={ach.image} alt='ach' className='experice-details3-text-right-item-image'/>
            </div>
          ))}

          {/* Duplicate for seamless looping */}
          {[...educationData, ...experienceData, ...achievementsData].map((item, index) => (
            <div className={`experice-details3-text-right-item${index % 2 === 0 ? '' : '-reverse'}`} key={`loop-${index}`}>
              <span>
                <FaQuoteLeft size={20} />
                <p>
                  {item.institution && <>{item.description}</>}
                  {item.company && <><strong>{item.role}</strong> at {item.company}: {item.description}</>}
                  {item.title && <><strong>{item.title}</strong>: {item.description}</>}
                </p>
                <small>{item.period || item.year}</small>
              </span>
              <img src={item.image} alt='item' className='experice-details3-text-right-item-image'/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EduSection;