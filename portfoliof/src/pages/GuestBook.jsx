import React, { useEffect, useRef, useState } from 'react';
import './GuestBook.css';
import { GoDotFill, GoClock } from 'react-icons/go';
import { FaPencilAlt } from "react-icons/fa";
import Marquee from '../components/Marquee';
import About from '../components/About';
import LocomotiveScroll from 'locomotive-scroll';
import gsap from "gsap";
import { useGoogleLogin } from '@react-oauth/google';
import api from '../config/api';
import { PiCloverFill } from "react-icons/pi";

function GuestBook() {
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [emojiPosition, setEmojiPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const scrollRef = useRef(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [user, setUser] = useState(() => {
    // Load user from localStorage on initial render
    const savedUser = localStorage.getItem('guestbookUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [message, setMessage] = useState('');
  const [guestbookEntries, setGuestbookEntries] = useState([]);

  // Save user to localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('guestbookUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('guestbookUser');
    }
  }, [user]);

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
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      smoothMobile: true,
      inertia: 0.8,
      getDirection: true,
    });

    return () => scroll.destroy();
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".works-main-top-container",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/api/guestbook`);
        if (response.data.success) {
          setGuestbookEntries(response.data.messages);
        }
      } catch (error) {
        console.error('Error fetching guestbook entries:', error);
      }
    };
    fetchMessages();
  }, []);

  const handleLoginBtn = () => {
    if (!user) {
      setIsDialogOpen(true);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
      })
      .then(res => res.json())
      .then(data => {
        const userData = {
          name: data.name,
          avatar: data.picture,
          id: data.sub
        };
        setUser(userData);
        setIsDialogOpen(false);
      })
      .catch(error => console.error("Google Login Error:", error));
    },
    onError: () => console.error("Google Login Failed")
  });

  const handleLogout = () => {
    setUser(null);
    setMessage('');
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!user || !message.trim()) return;

    const newEntry = {
      id: Date.now(),
      name: user.name,
      avatar: user.avatar,
      date: new Date().toUTCString(),
      message: message.trim()
    };

    try {
      const response = await api.post(`/api/guestbook`, newEntry);
      if (response.data.success) {
        setGuestbookEntries([newEntry, ...guestbookEntries]);
        setMessage('');
      }
    } catch (error) {
      console.error('Error submitting message:', error);
    }
  };



  return (
    <div className='page-main-container-king' ref={scrollRef}>
      <img src='/backgound_coveL.avif' alt='background' className='background-isd3'/>
       
      <div className='page-container-king-dailog3'>
        <p>Welcome to the Guestbook</p>
        <div 
          className="image-container"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          <img 
            ref={imageRef}
            className={`pageod-3j ${isHovering ? 'hovering' : ''}`} 
            src='/my_images/guestbook.avif' 
            alt='Blog Header'
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
        <div className="latest-projects-badge">
          <span className="new-badge">Say Hello!</span>
          <h4>Leave Your Mark</h4>
          <FaPencilAlt className="arrow-icon" />
        </div>
      </div>

      <div className='guest-page-contin-main'>
        <div className='guset-book-coe'>
          <span><PiCloverFill size={20} /> Your Message Means a Lot!</span>
          <p>Thank you for signing my guestbook! 🙌 Your words mean a lot to me. Stay awesome! 🚀✨</p>
        </div>

        <div className='login-conaite-guse'>
          <button onClick={handleLoginBtn}>
            {user ? 'Logged in' : 'Login'}
          </button>
          {!user && (
            <p>💡 Have something to share? Please sign in with Google to leave a message!</p>
          )}
        </div>

        {user && (
          <form onSubmit={handleMessageSubmit} className='guest-message-form'>
            <div className="user-profile-header">
              <img src={user.avatar} alt={user.name} className="user-avatar" referrerPolicy="no-referrer" />
              <div className="user-info">
                <h4 className="user-name">{user.name}</h4>
                <button 
                  type="button" 
                  className="logout-btn" 
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
            
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Leave your message here (max 100 characters)..."
              className='guest-message-input'
              maxLength={100}
            />
            
            <div className={`character-counter ${message.length > 80 ? 'warning' : ''} ${message.length === 100 ? 'error' : ''}`}>
              {message.length}/100
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="clear-btn"
                onClick={() => setMessage('')}
              >
                Clear
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={!message.trim()}
              >
                Submit
              </button>
            </div>
          </form>
        )}

        {isDialogOpen && !user && (
          <div className="login-dialog-overlay" onClick={() => setIsDialogOpen(false)}>
            <div className="login-dialog-container" onClick={(e) => e.stopPropagation()}>
              <button className="close-dialog-btn" onClick={() => setIsDialogOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <div className="dialog-header">
                <div className="dialog-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Sign in to leave a message</h3>
                <p>Google login is required to leave a message</p>
              </div>
              
              <div className="login-options">
                <button 
                  className="login-btn google-btn"
                  onClick={loginWithGoogle}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#FFC107"/>
                    <path d="M3.15302 7.3455L6.43852 9.755C7.32752 7.554 9.48052 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15902 2 4.82802 4.1685 3.15302 7.3455Z" fill="#FF3D00"/>
                    <path d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.6055 17.5455 13.3575 18 12 18C9.39902 18 7.19052 16.3415 6.35852 14.027L3.09752 16.5395C4.75252 19.778 8.11352 22 12 22Z" fill="#4CAF50"/>
                    <path d="M21.8055 10.0415H21V10H12V14H17.6515C17.2555 15.1185 16.536 16.083 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#1976D2"/>
                  </svg>
                  Continue with Google
                </button>
              </div>
              
              <div className="dialog-footer">
                <p>By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></p>
              </div>
            </div>
          </div>
        )}

        <div className='gueset-continer-ded'>
          {guestbookEntries.map(entry => (
            <div key={entry.id} className='guest-usrdcx'>
              <span className='guest-usrx-cssw'>
                <img src={entry.avatar} alt={entry.name} referrerPolicy="no-referrer" />
                <span className='guest-detaislx'>
                  <h4>{entry.name}</h4>
                  <p>{entry.date}</p>
                </span>
              </span>
              <p className='guest-detaislx-ep'>{entry.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GuestBook;