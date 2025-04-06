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
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

// Debounce utility to limit scroll event frequency
function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const projectsData = [
  // Your projects data remains unchanged
  {
    id: 1,
    title: "Heartecho",
    description: "Chat with 20+ AI GFs & BFs that respond instantly in their own unique tone. Built with MERN stack, Heartecho offers secure, real-time digital companionship.",
    image: "/thumb_home/echoheart.avif",
    githubLink: "",
    demoLink: "https://www.heartecho.in/"
  },
  {
    id: 2,
    title: "TempMail",
    description: "Get 10-minute disposable emails, send bulk mails, and auto-generate stunning templates. AI-powered, fast, and privacy-first — TempMail simplifies email like never before.",
    image: "/thumb_home/tempmail.avif",
    githubLink: "https://github.com/omavcher/TempEmial.git",
    demoLink: "https://tempemail07.vercel.app/"
  },
  {
    id: 3,
    title: "Cre8AI",
    description: "Turn your ideas into AI-generated videos in seconds using Hugging Face & Google AI. Just type your story, pick a platform, and watch the magic happen.",
    image: "/thumb_home/cre8ai.avif",
    githubLink: "https://github.com/omavcher/Cre8AI-Ai-Video-Generat-Mern.git",
    demoLink: "https://cre8ai.vercel.app/"
  },
  {
    id: 4,
    title: "PERFECT 11",
    description: "Create your dream batting lineup and compete like a pro in live IPL-style matches. Real-time scoring, player stats & strategy — the ultimate cricket fan experience.",
    image: "/thumb_home/perfect11.avif",
    githubLink: "https://github.com/omavcher/MERN-Fantasy-Sports-App-Perfect-11.git",
    demoLink: "https://perfect-11.vercel.app/"
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
      const handleScroll = debounce(() => {
        if (titlesContainerRef.current && projectTitlesRef.current.length > 0) {
          const container = titlesContainerRef.current;
          const containerRect = container.getBoundingClientRect();
          const containerCenter = containerRect.top + containerRect.height / 2;

          let closestIndex = 0;
          let minDistance = Infinity;

          projectTitlesRef.current.forEach((title, index) => {
            if (title) {
              const titleRect = title.getBoundingClientRect();
              const titleCenter = titleRect.top + titleRect.height / 2;
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
      }, 100); // Debounce delay of 100ms

      const container = titlesContainerRef.current;
      if (container) {
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
      }
    }
  }, [activeProject, isMobile]);

  // Scroll to project on click
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
    enter: { x: 100, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 }
  };

  const titleVariants = {
    inactive: { opacity: 0.5, scale: 1, transition: { duration: 0.3 } },
    active: { opacity: 1, scale: 1.05, transition: { duration: 0.3 } },
    hover: { opacity: 0.8, transition: { duration: 0.2 } }
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
                    <Link to={projectsData[activeProject].githubLink} className="projsbtme">
                      <FaGithub /> GitHub
                    </Link>
                    <Link to={projectsData[activeProject].demoLink} className="projsbtme">
                      <GiSpiderWeb /> Demo
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
                  className="project-itrwm3"
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
                    <Link to={projectsData[activeProject].githubLink} className="projsbtme">
                      <FaGithub /> GitHub
                    </Link>
                    <Link to={projectsData[activeProject].demoLink} className="projsbtme">
                      <GiSpiderWeb /> Live Demo
                    </Link>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="project-tirles-9" ref={titlesContainerRef}>
              {projectsData.map((project, index) => (
                <motion.h3
                  key={project.id}
                  ref={(el) => (projectTitlesRef.current[index] = el)}
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