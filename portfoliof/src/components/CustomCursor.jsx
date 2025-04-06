import React, { useState, useEffect, useRef } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [followerPosition, setFollowerPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [hoverState, setHoverState] = useState('default-lcuer95');
  const [color, setColor] = useState('#000000');
  const [particles, setParticles] = useState([]);
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  // Simplified element type detection (removed image/media detection)
  const getHoverState = (element) => {
    if (!element) return 'default-lcuer95';
    if (element.closest('a, [href]')) return 'link-lcuer95';
    if (element.closest('button, [role="button"]')) return 'button-lcuer95';
    if (element.closest('input, textarea, select')) return 'input-lcuer95';
    if (element.closest('[data-cursor="special"]')) return 'special-lcuer95';
    return 'default-lcuer95';
  };

  // Background color detection
  const getBackgroundColor = (element) => {
    if (!element) return '#ffffff';
    
    let bgColor = getComputedStyle(element).backgroundColor;
    let currentElement = element;
    
    while (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
      currentElement = currentElement.parentElement;
      if (!currentElement || currentElement === document.documentElement) {
        bgColor = '#ffffff';
        break;
      }
      bgColor = getComputedStyle(currentElement).backgroundColor;
    }
    
    return bgColor;
  };

  // Color contrast calculation
  const getContrastColor = (bgColor) => {
    if (!bgColor) return '#000000';
    
    const rgb = bgColor.match(/\d+/g);
    if (!rgb || rgb.length < 3) return '#000000';
    
    const [r, g, b] = rgb.map(Number);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  };

  // Particle effect for special interactions
  const createParticles = (x, y, count = 5) => {
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        x,
        y,
        size: Math.random() * 3 + 2,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        speedX: Math.random() * 6 - 3,
        speedY: Math.random() * 6 - 3,
        life: 30 + Math.random() * 20,
        opacity: 1
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  useEffect(() => {
    const addEventListeners = () => {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseenter', onMouseEnter);
      document.addEventListener('mouseleave', onMouseLeave);
      document.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mouseover', onMouseOver);
      document.addEventListener('click', onClick);
    };

    const removeEventListeners = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('click', onClick);
    };

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Smooth follower with easing
      requestAnimationFrame(() => {
        setFollowerPosition(prev => ({
          x: prev.x + (e.clientX - prev.x) * 0.1,
          y: prev.y + (e.clientY - prev.y) * 0.1
        }));
      });

      // Detect background color under cursor
      const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
      const bgColor = getBackgroundColor(elementUnderCursor);
      setColor(getContrastColor(bgColor));
    };

    const onMouseDown = () => {
      setClicked(true);
    };

    const onMouseUp = () => {
      setClicked(false);
    };

    const onMouseLeave = () => {
      setHidden(true);
    };

    const onMouseEnter = () => {
      setHidden(false);
    };

    const onMouseOver = (e) => {
      const newState = getHoverState(e.target);
      if (newState !== hoverState) {
        if (newState === 'special-lcuer95') {
          createParticles(e.clientX, e.clientY, 10);
        }
        setHoverState(newState);
      }
    };

    const onClick = (e) => {
      if (hoverState === 'button-lcuer95' || hoverState === 'special-lcuer95') {
        createParticles(e.clientX, e.clientY, 15);
      }
    };

    addEventListeners();
    return () => removeEventListeners();
  }, [hoverState]);

  // Dynamic size based on hover state (removed media sizing)
  const getCursorSize = () => {
    switch(hoverState) {
      case 'link-lcuer95': return 12;
      case 'button-lcuer95': return 16;
      case 'input-lcuer95': return 6;
      case 'special-lcuer95': return 24;
      default: return 8;
    }
  };

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className={`cursor-lcuer95 ${hoverState} ${clicked ? 'clicked-lcuer95' : ''} ${hidden ? 'hidden-lcuer95' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${getCursorSize()}px`,
          height: `${getCursorSize()}px`,
          backgroundColor: color,
          borderColor: color === '#000000' ? '#ffffff' : '#000000',
          boxShadow: `0 0 10px ${color}`
        }}
      />
      
      {/* Follower dot */}
      <div
        ref={followerRef}
        className={`cursor-follower-lcuer95 ${hoverState} ${clicked ? 'clicked-lcuer95' : ''} ${hidden ? 'hidden-lcuer95' : ''}`}
        style={{
          left: `${followerPosition.x}px`,
          top: `${followerPosition.y}px`,
          backgroundColor: color === '#000000' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
        }}
      />
      
      {/* Particle effects */}
      {particles.map((particle, i) => (
        <div
          key={i}
          className="cursor-particle-lcuer95"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            transform: `scale(${particle.opacity})`
          }}
        />
      ))}
    </>
  );
};

export default CustomCursor;