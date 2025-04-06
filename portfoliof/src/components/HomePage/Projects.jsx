import React, { useState, useEffect, useRef } from 'react';
import './Projects.css';
import { Link } from 'react-router-dom';
import { FaGithub } from "react-icons/fa";
import { GiSpiderWeb } from "react-icons/gi";
import { motion, AnimatePresence } from 'framer-motion';

// Custom hook to check screen size
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

const projectsData = [
  {
    id: 1,
    title: "Project 1",
    description: "Innovative and immersive advertising campaign for Citroën's new electric ë-C3, featuring dynamic motion designs projected onto the vehicle to accentuate its design and electric nature.",
    image: "https://media.gettyimages.com/id/471521667/photo/custom-harley-davidson-motorbike.jpg?s=612x612&w=0&k=20&c=i2D1HtKpFKuyuK_eh9y1ZJP1ZuhRMYtXIb7dxI0MK7Y=",
    githubLink: "",
    demoLink: ""
  },
  {
    id: 2,
    title: "Project 2",
    description: "A cutting-edge e-commerce platform with AI-powered recommendations and seamless checkout experience for modern shoppers.",
    image: "https://media.gettyimages.com/id/458872245/photo/harley-davidson.jpg?s=612x612&w=0&k=20&c=IZmkOgsIPp3IfMtoR5nhDxallBhHazJwQAcj6_M0wYk=",
    githubLink: "",
    demoLink: ""
  },
  {
    id: 3,
    title: "Project 3",
    description: "Health tracking mobile application that integrates with wearable devices to provide real-time health analytics and personalized insights.",
    image: "https://media.gettyimages.com/id/2147946175/photo/perth-australia-harley-reid-of-the-eagles-celebrates-after-scoring-a-goal-during-the-2024-afl.jpg?s=612x612&w=0&k=20&c=mWSlc9aekRjf1DvIMJyLb00msWioGn2Rd5_-5E7yKDo=",
    githubLink: "",
    demoLink: ""
  },
  {
    id: 4,
    title: "Project 4",
    description: "Virtual reality training simulator for medical professionals to practice complex surgical procedures in a risk-free environment.",
    image: "https://media.gettyimages.com/id/1390297176/photo/the-city.jpg?s=612x612&w=0&k=20&c=zvaSIXxmA_Vfz82aB4RA7ZxQMXKeGNzMJkiWX2Es_SM=",
    githubLink: "",
    demoLink: ""
  },
  {
    id: 5,
    title: "Project 5",
    description: "Blockchain-based voting system ensuring secure, transparent, and tamper-proof elections for government organizations.",
    image: "https://media.gettyimages.com/id/596574727/photo/golden-gate-bridge-from-below.jpg?s=2048x2048&w=gi&k=20&c=dYJcyuCFvSD5oa1J7FqgtD9natyJyay9R1mRAMIVI14=",
    githubLink: "",
    demoLink: ""
  },
  {
    id: 6,
    title: "Project 6",
    description: "Smart home automation system with voice control and machine learning capabilities to adapt to residents' habits and preferences.",
    image: "https://media.gettyimages.com/id/471521667/photo/custom-harley-davidson-motorbike.jpg?s=612x612&w=0&k=20&c=i2D1HtKpFKuyuK_eh9y1ZJP1ZuhRMYtXIb7dxI0MK7Y=",
    githubLink: "",
    demoLink: ""
  }
];

function Projects() {
  const isMobile = useIsMobile();
  const [activeProject, setActiveProject] = useState(0);
  const [direction, setDirection] = useState(1);
  const titlesContainerRef = useRef(null);
  const prevActiveProjectRef = useRef(0);
  const projectTitlesRef = useRef([]);

  // Desktop scroll effect
  useEffect(() => {
    if (!isMobile) {
      const handleScroll = () => {
        if (titlesContainerRef.current && projectTitlesRef.current.length > 0) {
          const container = titlesContainerRef.current;
          const containerTop = container.getBoundingClientRect().top;
          const containerHeight = container.clientHeight;
          
          let closestIndex = 0;
          let minDistance = Infinity;
          
          projectTitlesRef.current.forEach((title, index) => {
            if (title) {
              const titleRect = title.getBoundingClientRect();
              const titleCenter = (titleRect.top + titleRect.bottom) / 2;
              const containerCenter = containerTop + (containerHeight / 2);
              const distance = Math.abs(titleCenter - containerCenter);
              
              if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
              }
            }
          });
          
          if (closestIndex !== activeProject && closestIndex >= 0 && closestIndex < projectsData.length) {
            setDirection(closestIndex > prevActiveProjectRef.current ? 1 : -1);
            prevActiveProjectRef.current = closestIndex;
            setActiveProject(closestIndex);
          }
        }
      };

      const container = titlesContainerRef.current;
      if (container) {
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
      }
    }
  }, [activeProject, isMobile]);

  // Desktop scroll handler
  const scrollToProject = (index) => {
    setDirection(index > activeProject ? 1 : -1);
    setActiveProject(index);
    if (titlesContainerRef.current && projectTitlesRef.current[index]) {
      const container = titlesContainerRef.current;
      const title = projectTitlesRef.current[index];
      const containerHeight = container.clientHeight;
      const titleHeight = title.clientHeight;
      const scrollTo = title.offsetTop - (containerHeight / 2) + (titleHeight / 2);
      
      container.scrollTo({
        top: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  // Mobile navigation handlers
  const handleNext = () => {
    setActiveProject((prev) => (prev + 1) % projectsData.length);
  };

  const handlePrev = () => {
    setActiveProject((prev) => (prev - 1 + projectsData.length) % projectsData.length);
  };

  // Animation variants
  const desktopItemVariants = {
    enter: (direction) => ({
      y: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      y: 0,
      opacity: 1
    },
    exit: (direction) => ({
      y: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  const mobileItemVariants = {
    enter: {
      x: 100,
      opacity: 0
    },
    center: {
      x: 0,
      opacity: 1
    },
    exit: {
      x: -100,
      opacity: 0
    }
  };

  const titleVariants = {
    inactive: {
      opacity: 0.5,
      scale: 1,
      transition: { duration: 0.3 }
    },
    active: {
      opacity: 1,
      scale: 1.05,
      transition: { duration: 0.3 }
    },
    hover: {
      opacity: 0.8,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="projects-container-homepage-9">
      {isMobile ? (
        <div className="mobile-view">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Projects That Speak
          </motion.h2>

          <div className="mobile-projects-container">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject}
                variants={mobileItemVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="mobile-project-card"
              >
                <img 
                  src={projectsData[activeProject].image} 
                  alt={projectsData[activeProject].title}
                  className="mobile-project-image"
                />
                <div className="mobile-project-content">
                  <h3>{projectsData[activeProject].title}</h3>
                  <p>{projectsData[activeProject].description}</p>
                  <div className="mobile-project-links">
                    <Link to={projectsData[activeProject].githubLink} className='projsbtme'>
                      <FaGithub /> GitHub
                    </Link>
                    <Link to={projectsData[activeProject].demoLink} className='projsbtme'>
                      <GiSpiderWeb/> Demo
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mobile-navigation">
              <button onClick={handlePrev} className="nav-button">← Prev</button>
              <span>{activeProject + 1} / {projectsData.length}</span>
              <button onClick={handleNext} className="nav-button">Next →</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="desktop-view-9o2">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Projects That Speak
          </motion.h2>

          <div className="projects-list-warp-9">
            <div className="project-itemsac-9">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={activeProject}
                  custom={direction}
                  variants={desktopItemVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className='project-itrwm3'
                >
                  <motion.img 
                    src={projectsData[activeProject].image} 
                    alt={projectsData[activeProject].title} 
                    className="project-image-9"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  />
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {projectsData[activeProject].title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    {projectsData[activeProject].description}
                  </motion.p>
                  <motion.div 
                    className="project-itemsac-9ops"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <Link to={projectsData[activeProject].githubLink} className='projsbtme'><FaGithub /> GitHub</Link>
                    <Link to={projectsData[activeProject].demoLink} className='projsbtme'><GiSpiderWeb/> Live Demo</Link>
                  </motion.div>      
                </motion.div>
              </AnimatePresence>
            </div>

            <div className='project-tirles-9' ref={titlesContainerRef}>
              {projectsData.map((project, index) => (
                <motion.h3 
                  key={project.id}
                  ref={el => projectTitlesRef.current[index] = el}
                  variants={titleVariants}
                  initial="inactive"
                  animate={index === activeProject ? "active" : "inactive"}
                  whileHover="hover"
                  onClick={() => scrollToProject(index)}
                >
                  {project.title}
                </motion.h3>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;