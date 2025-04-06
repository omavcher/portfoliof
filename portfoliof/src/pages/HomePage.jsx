import React, { useState, useEffect } from 'react';
import './HomePage.css';
import Projects from '../components/HomePage/Projects';
import AboutSection from '../components/HomePage/AboutSection';
import EduSection from '../components/HomePage/EduSection';
import Photos from '../components/HomePage/Photos';
import Marquee from '../components/Marquee';
import About from '../components/About';
import Eyes from '../components/Eyes';

function HomePage() {
  const titles = [
    { text: "Full-Stack Developer", color: "#2563eb" },
    { text: "Code Alchemist 🔮", color: "#7c3aed" },
    { text: "MongoDB Magician 🧙‍♂️", color: "#db2777" },
    { text: "JavaScript Ninja ⚡", color: "#ea580c" },
    { text: "Backend Builder", color: "#059669" },
    { text: "Frontend Fanatic 🎨", color: "#d97706" },
    { text: "Pixel Perfectionist", color: "#0284c7" },
    { text: "Problem Solver 🧠", color: "#4338ca" },
    { text: "Tech Explorer 🌐", color: "#c026d3" },
    { text: "Debugging Warrior 🛠️", color: "#dc2626" },
    { text: "Creative Thinker 💡", color: "#ca8a04" },
    { text: "UI/UX Explorer", color: "#65a30d" },
    { text: "React Rockstar 🚀", color: "#4f46e5" },
    { text: "Engineer of Ideas", color: "#9333ea" },
    { text: "Node.js Navigator", color: "#16a34a" },
    { text: "C++ Craftsman", color: "#0891b2" },
    { text: "Web Wizard ✨", color: "#e11d48" },
    { text: "API Architect", color: "#0d9488" },
    { text: "Dreamer in Code", color: "#7f1d1d" },
    { text: "Engineer with a Vision 👨‍💻", color: "#713f12" }
  ];

  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true);
      setTimeout(() => {
        setCurrentTitleIndex((prevIndex) => 
          prevIndex === titles.length - 1 ? 0 : prevIndex + 1
        );
        setAnimate(false);
      }, 500); // Half of the animation duration
    }, 2500); // Change every 2.5 seconds

    return () => clearInterval(interval);
  }, [titles.length]);

  return (
    <div className='page-main-container-king'>
      <img src='/backgound_coveL.avif' alt='background' className='background-isd3'/>
       
      <div className='page-container-king-dailog3'>
        <h1>Hi, I'm Om Avcher</h1>
        <h3><span 
              className={`animated-title ${animate ? 'animate-out' : 'animate-in'}`}
              style={{ color: titles[currentTitleIndex].color }}
            >
              {titles[currentTitleIndex].text}
            </span></h3>
            <p>Building full-stack solutions <br></br> with modern tech.</p>
      </div>

<Projects/>
{/* <AboutSection/> */}
<EduSection/>
<Photos/>
<Eyes/>
<Marquee/>
<About/>
    </div>
  );
}

export default HomePage;