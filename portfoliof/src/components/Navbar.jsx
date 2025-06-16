import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { AiFillHome, AiOutlineSearch, AiOutlineLoading3Quarters } from "react-icons/ai";
import { LuChartNetwork } from "react-icons/lu";
import { GiDiplodocus } from "react-icons/gi";
import { FaSnowman } from "react-icons/fa";
import { GrDocumentPdf } from "react-icons/gr";
import { PiMaskHappyDuotone } from "react-icons/pi";
import { FaGithub, FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { RiTwitterXLine } from "react-icons/ri";
import { BsMusicNoteBeamed, BsMusicNoteList } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  // Search data
  const searchData = [
    { title: 'Home', path: '/', category: 'Page', icon: <AiFillHome /> },
    { title: 'Work', path: '/work', category: 'Page', icon: <LuChartNetwork /> },
    { title: 'About', path: '/about', category: 'Page', icon: <FaSnowman /> },
    { title: 'Blog', path: '/blog', category: 'Page', icon: <GiDiplodocus /> },
    { title: 'Guestbook', path: '/guestbook', category: 'Page', icon: <PiMaskHappyDuotone /> },
    { title: 'Resume', path: '/', category: 'Document', icon: <GrDocumentPdf /> },
    { title: 'GitHub', path: 'https://github.com/omavcher', category: 'Social', icon: <FaGithub /> },
    { title: 'LinkedIn', path: 'https://www.linkedin.com/in/omawchar/', category: 'Social', icon: <FaLinkedin /> },
    { title: 'X (Twitter)', path: 'https://twitter.com/omawchar07', category: 'Social', icon: <RiTwitterXLine /> },
    { title: 'Instagram', path: 'https://www.instagram.com/omawchar07/', category: 'Social', icon: <FaInstagram /> },
  ];

  // Music tracks - files should be in public/music directory
  const musicTracks = [
    { title: 'Mere Mehboob Qayamat Hogi', artist: 'Kishore Kumar', url: '/music/1.mp3' },
    { title: 'Ik Raasta Hai Zindagi', artist: 'Kishore Kumar', url: '/music/2.mp3' },
    { title: 'Shape of You', artist: 'Ed Sheeran', url: '/music/3.mp3' },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    
    const handleError = () => {
      console.error('Error playing audio');
      setIsMusicPlaying(false);
      setCurrentTrack(null);
    };

    audioRef.current.addEventListener('error', handleError);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('error', handleError);
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 0) {
      setIsSearching(true);
      setTimeout(() => {
        const results = searchData.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
        setIsSearching(false);
      }, 300);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const playTrack = (track) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = track.url;
      
      const handleCanPlay = () => {
        audioRef.current.play()
          .then(() => {
            setIsMusicPlaying(true);
            setCurrentTrack(track);
          })
          .catch(error => {
            console.error('Error playing audio:', error);
            setIsMusicPlaying(false);
            setCurrentTrack(null);
          });
        audioRef.current.removeEventListener('canplay', handleCanPlay);
      };
      
      audioRef.current.addEventListener('canplay', handleCanPlay);
      audioRef.current.load();
    }
  };

  const toggleMusic = () => {
    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      const randomTrack = musicTracks[Math.floor(Math.random() * musicTracks.length)];
      playTrack(randomTrack);
    }
  };

  const handleResultClick = (path) => {
    if (path.startsWith('http')) {
      window.open(path, '_blank');
    } else {
      navigate(path);
    }
    setSearchQuery('');
    setSearchResults([]);
    setIsMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      <audio 
        ref={audioRef}
        onEnded={() => {
          setIsMusicPlaying(false);
          setCurrentTrack(null);
        }}
      />
      
      <nav className={`navbar-nav084 ${isScrolled ? 'scrolled' : ''} ${isMenuOpen ? 'menu-open' : ''}`}>
        <Link to='/' className="navbar-logo-nav084">
          <img className='navbar-top-mylogos' src='/my_facea.avif' alt='Om Avcher'/>
        </Link>

        <div className="navbar-links-nav084">
          <Link to="/" className="nav-link-nav084">Home</Link>
          <Link to="/work" className="nav-link-nav084">Work</Link>
          <Link to="/about" className="nav-link-nav084">About</Link>
          <Link to="/blog" className="nav-link-nav084">Blog</Link>
          <Link to="/guestbook" className="nav-link-nav084">GuestBook</Link>
        </div>

        <div className="navbar-actions-nav084">
          <button 
            className={`large-screen-btn-play-song ${isMusicPlaying ? 'playing' : ''}`}
            onClick={toggleMusic}
            aria-label={isMusicPlaying ? 'Stop music' : 'Play music'}
          >
            {isMusicPlaying ? <BsMusicNoteBeamed /> : <BsMusicNoteList />}
            {currentTrack && (
              <span className="now-playing-tooltip">
                Now playing: {currentTrack.title}
              </span>
            )}
          </button>
        </div>

        <div className="navbar-hamburger-nav084" onClick={toggleMenu}>
          <div className={`hamburger-icon-nav084 ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="mobile-menu-overlay-nav084" onClick={toggleMenu}>
          <div className="mobile-menu-dialog-nav084" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header-nav084">
              <span className="mobile-menu-close-nav084" onClick={toggleMenu}>
                <IoMdClose size={24} />
              </span>
            </div>
            <div className="mobile-menu-content-nav084">
              <div className="search-box-nav084">
                <div className="search-input-container">
                  <AiOutlineSearch className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search pages..." 
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                  {searchQuery && (
                    <button className="clear-search-btn" onClick={clearSearch}>
                      <IoMdClose size={16} />
                    </button>
                  )}
                </div>
                {isSearching && (
                  <div className="search-loading">
                    <AiOutlineLoading3Quarters className="loading-icon" />
                    <span>Searching...</span>
                  </div>
                )}
                {searchResults.length > 0 && (
                  <div className="search-results-dropdown">
                    {searchResults.map((result, index) => (
                      <div 
                        key={index} 
                        className="search-result-item"
                        onClick={() => handleResultClick(result.path)}
                      >
                        <div className="search-result-content">
                          <span className="search-result-icon">{result.icon}</span>
                          <div className="search-result-info">
                            <div className="search-result-title">{result.title}</div>
                            <div className="search-result-category">{result.category}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {searchQuery && !isSearching && searchResults.length === 0 && (
                  <div className="no-results">No results found for "{searchQuery}"</div>
                )}
              </div>
              
              <div className="mobile-menu-items-nav084">
                <Link to="/" className="mobile-nav-link-nav084" onClick={toggleMenu}><AiFillHome size={20}/> Home</Link>
                <Link to="/work" className="mobile-nav-link-nav084" onClick={toggleMenu}><LuChartNetwork size={20}/> Work</Link>
                <Link to="/about" className="mobile-nav-link-nav084" onClick={toggleMenu}><FaSnowman size={20}/> About</Link>
                <Link to="/blog" className="mobile-nav-link-nav084" onClick={toggleMenu}><GiDiplodocus size={20}/> Blog</Link>
              </div>

              <div className='nav-mobile-decr4'>
                <header>
                  <h4>General</h4>
                </header>
                <Link to='/' style={{marginTop:'0.5rem', width:'100%'}} className="mobile-nav-link-nav084" onClick={toggleMenu}><GrDocumentPdf/> Resume</Link>
                <Link to='/guestbook' style={{marginTop:'0.5rem', width:'100%'}} className="mobile-nav-link-nav084" onClick={toggleMenu}><PiMaskHappyDuotone/> GuestBook</Link>
              </div>

              <div className='nav-mobile-decr4'>
                <header>
                  <h4>Connect</h4>
                </header>
                <Link to='https://github.com/omavcher' style={{marginTop:'0.5rem', width:'100%'}} className="mobile-nav-link-nav084"><FaGithub/> GitHub</Link>
                <Link to='https://www.linkedin.com/in/omawchar/' style={{marginTop:'0.5rem', width:'100%'}} className="mobile-nav-link-nav084"><FaLinkedin/> LinkedIn</Link>
                <Link to='https://twitter.com/omawchar07' style={{marginTop:'0.5rem', width:'100%'}} className="mobile-nav-link-nav084"><RiTwitterXLine/> X (Twitter)</Link>
                <Link to='https://www.instagram.com/omawchar07/' style={{marginTop:'0.5rem', width:'100%'}} className="mobile-nav-link-nav084"><FaInstagram/> Instagram</Link>
              </div>

              <div className="mobile-music-player">
                <button 
                  className={`music-toggle-btn ${isMusicPlaying ? 'playing' : ''}`}
                  onClick={toggleMusic}
                >
                  {isMusicPlaying ? (
                    <>
                      <BsMusicNoteBeamed /> Stop Music
                    </>
                  ) : (
                    <>
                      <BsMusicNoteList /> Play Music
                    </>
                  )}
                </button>
                {currentTrack && isMusicPlaying && (
                  <div className="now-playing-mobile">
                    Now playing: {currentTrack.title} by {currentTrack.artist}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;