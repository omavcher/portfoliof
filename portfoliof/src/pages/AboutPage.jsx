import React, { useRef, useState, useEffect } from 'react';
import './AboutPage.css';
import { HiDownload } from "react-icons/hi";
import { GrDocumentPdf } from "react-icons/gr";
import { Link } from 'react-router-dom';
import { CiLocationOn } from "react-icons/ci";
import { motion, useScroll, useTransform } from 'framer-motion';
import Marquee from '../components/Marquee';
import About from '../components/About';
import api from '../config/api';
import Loader from '../components/Loader';
function AboutPage() {
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [emojiPosition, setEmojiPosition] = useState({ x: 0, y: 0 });
  const [activeExperience, setActiveExperience] = useState(0);
  const imageRef = useRef(null);
  const experienceRef = useRef(null);
  const experienceItemsRef = useRef([]);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/personal-info`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching:", error);
      }
    };
    
    fetchData();
  }, []);

  const { scrollYProgress } = useScroll({
    target: experienceRef,
    offset: ["start center", "end center"]
  });

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setPosition({ x: 0, y: 0 });
  };
  
  const handleMouseMove = (e) => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const relX = x - centerX;
      const relY = y - centerY;
      
      setPosition({ x: relX / 20, y: relY / 20 });
      setEmojiPosition({ x: x + 20, y: y - 30 });
    }
  };

  useEffect(() => {
    experienceItemsRef.current = experienceRef.current?.querySelectorAll('.expiricnse-details-containera');
    
    const handleScroll = () => {
      if (!experienceRef.current) return;
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      experienceItemsRef.current.forEach((exp, index) => {
        const rect = exp.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;
        const elementBottom = elementTop + rect.height;
        
        if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
          setActiveExperience(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToExperience = (index) => {
    const experience = experienceItemsRef.current[index];
    if (experience) {
      const elementPosition = experience.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - (window.innerHeight / 2) + (experience.offsetHeight / 2);
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  if (!data) {
    return <div> <Loader/> </div>;
  }

  const { personalInfo } = data;

  return (
    <div className='page-main-container-king'>
      <img src='/backgound_coveL.avif' alt='background' className='background-isd3'/>
       
      <div className='page-container-king-dailog3'>
        <p>About Me</p>
        <div className="image-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove}>
          <img 
            ref={imageRef}
            className={`pageod-3j ${isHovering ? 'hovering' : ''}`} 
            src='/my_images/about.avif'
            alt='Blog Header'
            style={{ transform: `rotateX(${position.y}deg) rotateY(${-position.x}deg)` }}
          />
          {isHovering && (
            <div className="hand-emoji" style={{ left: `${emojiPosition.x}px`, top: `${emojiPosition.y}px` }}>
              🖐️
            </div>
          )}
          <div className={`animated-border ${isHovering ? 'active' : ''}`}></div>
        </div>
        <Link 
          to={personalInfo.resume} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="latest-projects-badge"
        >
          <span className="new-badge"><GrDocumentPdf size={15}/></span>
          <h4><strong>View</strong> Resume</h4>
          <HiDownload className="arrow-icon" />
        </Link>
      </div>

      <div className='about-page-info-componetx-dw'>
        <p className='section-subtitle-dw'>MORE ABOUT ME</p>
        <h1 className='headline-dw'>Hi there! I'm <span className='gradient-name-dw'>Om Avcher</span></h1>
        <p className='about-text-dw'>I'm Om Avcher, a passionate and dedicated full-stack developer with hands-on experience in building modern web applications. With a strong foundation in the MERN stack and core Java, I thrive on transforming ideas into scalable, high-performance solutions.</p>
        <p className='about-text-dw'>I believe in learning with purpose and coding with impact.</p>
      </div>

      <div className="experience-heading-dw">
        <p className="section-subtitle-dw">MY JOURNEY</p>
        <h2 className="main-title-dw">
          Experience That Shapes
          <span className="gradient-highlight-dw">Real Impact</span>
        </h2>
      </div>

      <div className='experince-showcasedwdcw' ref={experienceRef}>
        <div className='experience-container-wrapper'>
          <div className='eexperiance-rightfe'>
            {personalInfo.experience.items.map((exp, index) => (
              <div key={exp._id} className='expiricnse-details-containera'>
                <div className='expiricnse-details-tieks sticky-title'>
                  <h6>{exp.period}</h6>
                  <h2>{exp.role}</h2>
                  <span>
                    <img src={exp.logo} alt='company logo'/>
                    <Link to={exp.link}><p style={{color:'white',textDecoration:"none"}}>{exp.company}</p></Link>
                  </span>
                  <span><CiLocationOn/>{exp.location}</span>
                </div>
                <div className='expiricnse-details-contsied3'>
                  <p>{exp.description}</p>
                  <ul>
                    {exp.responsibilities.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                  <div className='expiricnse-details-contsied3-images-cosb'>
                    {exp.images.map((img, idx) => (
                      <img key={idx} src={img} alt='project screenshot'/>
                    ))}
                  </div>
                  <div className='expiricnse-details-contsi-keysw'>
                    {exp.skills.map((skill, idx) => (
                      <span key={idx}>{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='about-page-stack-of-my-tech'>
        {Object.values(personalInfo.techStack).map((section, index) => (
          <section key={index} className='about-pagesection'>
            <header><h2>{section.title}</h2></header>
            <div className='about-section-grid'>
              {section.items.map((tech) => (
                <span key={tech._id}>
                  <img src={tech.icon} alt={tech.name} loading='lazy' />
                  <h4>{tech.name}</h4>
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>

      <Marquee/>
      <About/>
    </div>
  );
}

export default AboutPage;