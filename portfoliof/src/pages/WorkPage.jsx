import React, { useEffect, useRef, useState } from 'react';
import './WorkPage.css';
import { motion, useScroll, useInView } from 'framer-motion';
import { AiFillFire, AiFillGithub } from "react-icons/ai";
import { Link } from 'react-router-dom';
import { CgArrowRight } from "react-icons/cg";
import { GoDotFill } from "react-icons/go";
import { FaGithub } from "react-icons/fa6";
import { GiSpiderWeb } from "react-icons/gi";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import Marquee from '../components/Marquee';
import About from '../components/About';
import api from '../config/api';
import Loader from '../components/Loader';

const latestProject = {
    name: "Echo Heart",
    Link: "https://op.versel.in",
};

const techImages = {
    "Next.js": "https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg",
    "React": "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    "Node.js":"https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
    "Express.js": "https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png",
    "MongoDB" : "https://webimages.mongodb.com/_com_assets/cms/mongodb_logo1-76twgcu2dm.png",
    "TailwindCSS" : "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg",
    "TypeScript": "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg",
    "CSS": "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg",
    "JavaScript": "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
    "Python": "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
    "Java": "https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg",
    "C": "https://upload.wikimedia.org/wikipedia/commons/1/19/C_Logo.png",
    "C++": "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg",
    "C#": "https://upload.wikimedia.org/wikipedia/commons/4/4f/Csharp_Logo.png",
    "PHP": "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg",
    "Ruby": "https://upload.wikimedia.org/wikipedia/commons/7/73/Ruby_logo.svg",
    "Swift": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Swift_logo.svg",
    "Kotlin": "https://upload.wikimedia.org/wikipedia/commons/7/74/Kotlin_Icon.png",
    "Go": "https://upload.wikimedia.org/wikipedia/commons/0/05/Go_Logo_Blue.svg",
    "Rust": "https://upload.wikimedia.org/wikipedia/commons/d/d5/Rust_programming_language_black_logo.svg",
    "Dart": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Dart-logo.png",
    "Perl": "https://upload.wikimedia.org/wikipedia/commons/9/9c/Perl_logo.svg",
    "R": "https://upload.wikimedia.org/wikipedia/commons/1/1b/R_logo.svg",
    "Scala": "https://upload.wikimedia.org/wikipedia/commons/3/39/Scala-full-color.svg",
    "Lua": "https://upload.wikimedia.org/wikipedia/commons/c/cf/Lua-Logo.svg",
    "Haskell": "https://upload.wikimedia.org/wikipedia/commons/1/1c/Haskell-Logo.svg",
    "Objective-C": "https://upload.wikimedia.org/wikipedia/commons/6/6f/Objective-C_logo.png",
    "Elixir": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Elixir_logo.png",
    "F#": "https://upload.wikimedia.org/wikipedia/commons/5/5d/F_Sharp_logo.svg",
    "Julia": "https://upload.wikimedia.org/wikipedia/commons/1/1f/Julia_Programming_Language_Logo.svg",
    "Shell": "https://upload.wikimedia.org/wikipedia/commons/8/82/Bash_logo.png",
    "COBOL": "https://upload.wikimedia.org/wikipedia/commons/8/8a/COBOL_logo.svg",
    "Erlang": "https://upload.wikimedia.org/wikipedia/commons/4/44/Erlang_logo.svg",
    "MATLAB": "https://upload.wikimedia.org/wikipedia/commons/2/21/Matlab_Logo.png",
    "Fortran": "https://upload.wikimedia.org/wikipedia/commons/b/b8/Fortran_logo.svg",
    "Prolog": "https://upload.wikimedia.org/wikipedia/commons/7/75/Prolog_icon.svg",
    "VB.NET": "https://upload.wikimedia.org/wikipedia/commons/4/40/VB.NET_Logo.svg"
};

function WorkPage() {
    const [activeProject, setActiveProject] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 790);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const scrollContainerRef = useRef(null);
    const imageRefs = useRef([]);
    const aboutRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [emojiPosition, setEmojiPosition] = useState({ x: 0, y: 0 });
    const imageRef = useRef(null);
    const [projectsData, setProjectsData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/api/projects`);
                setProjectsData(response.data.projects);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        
        fetchData();
    }, []);

    const { scrollYProgress } = useScroll({
        target: scrollContainerRef,
        offset: ["start start", "end end"]
    });

    const isInView = useInView(aboutRef, { once: true });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 790);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleTabletMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const angle = Math.atan2(y - centerY, x - centerX);
        
        setCursorPosition({
            x: e.clientX + Math.cos(angle) - 280,
            y: e.clientY + Math.sin(angle) - 280,
        });
    };

    const handleImageMouseEnter = () => setIsHovering(true);
    const handleImageMouseLeave = () => setIsHovering(false);

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

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
            
            setPosition({
                x: relX / 20,
                y: relY / 20
            });
            
            setEmojiPosition({
                x: x + 20,
                y: y - 30
            });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                const scrollPosition = scrollContainerRef.current.scrollTop;
                const containerHeight = scrollContainerRef.current.clientHeight;

                const newIndex = imageRefs.current.findIndex((ref) => {
                    if (!ref) return false;
                    const rect = ref.getBoundingClientRect();
                    const containerRect = scrollContainerRef.current.getBoundingClientRect();
                    const relativeTop = rect.top - containerRect.top;
                    return relativeTop <= containerHeight / 2 && relativeTop + rect.height >= containerHeight / 2;
                });

                if (newIndex !== -1 && newIndex !== activeProject) {
                    setActiveProject(newIndex);
                }
            }
        };

        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, [activeProject]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.43, 0.13, 0.23, 0.96]
            }
        }
    };

    if (!projectsData) {
        return <div> <Loader/> </div>;
    }

    return (
        <div className='page-main-container-king'>
            <img src='/backgound_coveL.avif' alt='background' className='background-isd3'/>
            
            <div className='page-container-king-dailog3'>
                <p>Things I've Built</p>
                <div 
                    className="image-container"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                >
                    <img 
                        ref={imageRef}
                        className={`pageod-3j ${isHovering ? 'hovering' : ''}`} 
                        src='/my_images/work.avif' 
                        alt='my Work'
                        style={{
                            transform: `rotateX(${position.y}deg) rotateY(${-position.x}deg)`
                        }}
                    />
                    {isHovering && (
                        <div 
                            className="hand-emoji"
                            style={{
                                left: `${emojiPosition.x}px`,
                                top: `${emojiPosition.y}px`,
                            }}
                        >
                            🖐️
                        </div>
                    )}
                    <div className={`animated-border ${isHovering ? 'active' : ''}`}></div>
                </div>

                {latestProject.Link !== "none" ? (
                    <Link to={latestProject.Link} className="latest-projects-badge" target="_blank">
                        <span className="new-badge">New</span>
                        <h4><strong>{latestProject.name}</strong> is live!</h4>
                        <FaRegArrowAltCircleRight className="arrow-icon" />
                    </Link>
                ) : (
                    <div className="latest-projects-badge">
                        <span className="new-badge">New</span>
                        <h4><strong>{latestProject.name}</strong> is coming soon!</h4>
                        <GoDotFill className="arrow-icon" />
                    </div>
                )}
            </div>

            {isMobile ? (
                <section className="project-work-mobiles">
                    {projectsData.map((project, index) => (
                        <motion.div 
                            className="project-work-x-mobilesi"
                            key={project._id}
                            variants={itemVariants}
                        >
                            <motion.div
                                className="project-image-contamsinc"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Link 
                                    to={project.live_link}
                                    className="tablet-frame-mobile" 
                                    style={{
                                        background: `linear-gradient(to bottom, ${project.color} 70%, black 110%)`
                                    }}
                                    onMouseMove={handleTabletMouseMove}
                                    onMouseEnter={handleImageMouseEnter}
                                    onMouseLeave={handleImageMouseLeave}
                                >
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <p>{project.tagline}</p>
                                    </motion.span>

                                    <motion.img 
                                        src={project.image} 
                                        alt={project.title}
                                        className="project-image"
                                        initial={{ scale: 1.1 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.8 }}
                                    />
                                </Link>
                                <div className="image-overlay" />
                            </motion.div>

                            <motion.div 
                                className='project-work-x-mobiles-detia'
                                variants={itemVariants}
                            >
                                <h3>{project.title}</h3>
                                <p>{project.description}</p>

                                <motion.div 
                                    className='project-work-x-mobiles-techs'
                                    variants={containerVariants}
                                >
                                    {project.technologies.map((tech, i) => (
                                        <motion.span 
                                            key={i}
                                            style={{backgroundColor:`${project.color}`, color:`${project.secondary}`}}
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            {tech}
                                        </motion.span>
                                    ))}
                                </motion.div>

                                <motion.div 
                                    className='project-work-x-mobiles-btn-cons'
                                    variants={containerVariants}
                                >
                                    <motion.span 
                                        className='button-profsx'
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <FaGithub /> Source code
                                    </motion.span>
                                    <motion.span 
                                        className='button-profsx'
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <GiSpiderWeb /> Website
                                    </motion.span>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    ))}
                </section>
            ) : (
                <section className="project-work-laptops">
                    <motion.div 
                        className="project-work-x-laptops" 
                        ref={scrollContainerRef}
                    >
                        <motion.div 
                            className="projects-split-container"
                            variants={containerVariants}
                        >
                            <motion.div 
                                className="project-images-column"
                                variants={containerVariants}
                            >
                                {projectsData.map((project, index) => (
                                    <motion.div
                                        key={project._id}
                                        className="project-image-container"
                                        ref={(el) => (imageRefs.current[index] = el)}
                                        variants={itemVariants}
                                        whileHover={{ y: -10 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Link 
                                            to={project.live_link}
                                            className="tablet-frame" 
                                            style={{
                                                background: `linear-gradient(to bottom, ${project.color} 70%, black 110%)`
                                            }}
                                            onMouseMove={handleTabletMouseMove}
                                            onMouseEnter={handleImageMouseEnter}
                                            onMouseLeave={handleImageMouseLeave}
                                        >
                                            <motion.span
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ duration: 0.4 }}
                                            >
                                                <p>{project.tagline}</p>
                                                <p><CgArrowRight /></p>
                                            </motion.span>

                                            <motion.img 
                                                src={project.image} 
                                                alt={project.title}
                                                className="project-image-ls"
                                                initial={{ scale: 1.1 }}
                                                animate={{ scale: 1 }}
                                                transition={{ duration: 0.8 }}
                                            />

                                            {project.is_live_link === 1 && (
                                                <motion.div
                                                    className="tablate-link-cursur"
                                                    animate={{
                                                        x: cursorPosition.x - 50,
                                                        y: cursorPosition.y - 50,
                                                        opacity: isHovering ? 1 : 0.9,
                                                        scale: isHovering ? 1.1 : 1,
                                                    }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 400,
                                                        damping: 30
                                                    }}
                                                >
                                                    <p>See Website</p>
                                                </motion.div>
                                            )}

                                            {project.is_live_link === 0 && (
                                                <motion.div
                                                    className="tablate-link-cursur-0"
                                                    animate={{
                                                        x: cursorPosition.x - 50,
                                                        y: cursorPosition.y - 50,
                                                        opacity: isHovering ? 1 : 0.9,
                                                        scale: isHovering ? 1.1 : 1,
                                                    }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 400,
                                                        damping: 30
                                                    }}
                                                >
                                                    <p><GoDotFill />Coming Soon</p>
                                                </motion.div>
                                            )}
                                        </Link>
                                        <div className="image-overlay" />
                                    </motion.div>
                                ))}
                            </motion.div>

                            <motion.div 
                                className="project-details-column"
                                variants={itemVariants}
                            >
                                <motion.div 
                                    className="project-details"
                                    variants={containerVariants}
                                >
                                    <motion.div 
                                        className="project-title-container"
                                        key={projectsData[activeProject]._id}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <h2 className="project-title">
                                            {projectsData[activeProject].title}  
                                            <Link to={`${projectsData[activeProject].github}`}>
                                                <AiFillGithub size={25} style={{color:'white'}} />
                                            </Link>
                                        </h2>
                                    </motion.div>
                                    
                                    <motion.p 
                                        className="project-description"
                                        key={`${projectsData[activeProject]._id}-desc`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.4, delay: 0.2 }}
                                    >
                                        {projectsData[activeProject].description}
                                    </motion.p>

                                    <motion.div 
                                        className="features-container"
                                        variants={containerVariants}
                                    >
                                        <ul className="features-list">
                                            {projectsData[activeProject].features.map((feature, i) => (
                                               

 <motion.li 
                                                    key={i} 
                                                    className="feature-item"
                                                    variants={itemVariants}
                                                    whileHover={{ x: 5 }}
                                                >
                                                    <span style={{color:`${projectsData[activeProject].color}`}} className="feature-plus">
                                                        <AiFillFire />
                                                    </span>
                                                    <span>{feature}</span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </motion.div>

                                    <motion.div 
                                        className="tech-container"
                                        variants={containerVariants}
                                    >
                                        <motion.div 
                                            className="tech-list"
                                            variants={containerVariants}
                                        >
                                            {projectsData[activeProject].technologies.map((tech, i) => (
                                                <motion.span 
                                                    key={i} 
                                                    className="tech-item"
                                                    variants={itemVariants}
                                                    whileHover={{ scale: 1.1 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                >
                                                    <img 
                                                        src={techImages[tech]} 
                                                        alt={tech} 
                                                        style={{ width: '20px', height: '20px', marginRight: '5px' }} 
                                                    />
                                                    {tech}
                                                </motion.span>
                                            ))}
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </section>
            )}
            
            <motion.div
                ref={aboutRef}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8 }}
            />
            <Marquee/>
            <About/>
        </div>
    );
}

export default WorkPage;
