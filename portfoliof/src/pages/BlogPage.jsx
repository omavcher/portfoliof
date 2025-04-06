import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaRegArrowAltCircleRight } from 'react-icons/fa';
import { GoDotFill, GoClock } from 'react-icons/go';
import { IoSearch } from 'react-icons/io5';
import './BlogPage.css';
import Marquee from '../components/Marquee';
import About from '../components/About';
import SnakeGame from '../components/SnakeGame';
import api from '../config/api';
import Loader from '../components/Loader';

const topics = [
  "nextjs", "react", "css", "tailwindcss", "java", "flexbox", "design",
  "tips", "grid", "tools", "vite", "core-concept", "git", "pattern",
  "typescript", "setup", "form", "swift", "web", "animation"
];

function BlogPage() {
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [emojiPosition, setEmojiPosition] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 790);
  const [latestBlog, setLatestBlog] = useState(null);
  
  const imageRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchBoxRef = useRef(null);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 790);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (searchInputRef.current && searchBoxRef.current) {
          searchInputRef.current.focus();
          searchBoxRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Fetch blog data and find latest blog
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/blog/overview`);
        const blogs = response.data.blogOverview;
        
        // Sort blogs by publish date to find the latest one
        const sortedBlogs = [...blogs].sort((a, b) => 
          new Date(b.publish_date) - new Date(a.publish_date));
        
        setBlogData(blogs);
        
        // Set the latest blog if there are any blogs
        if (sortedBlogs.length > 0) {
          const latest = sortedBlogs[0];
          setLatestBlog({
            id: latest._id,
            title: latest.title,
            publishDate: latest.publish_date
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Check if a blog was published within the last 7 days
  const isRecentlyPublished = (publishDate) => {
    const publishTime = new Date(publishDate).getTime();
    const currentTime = new Date().getTime();
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    return (currentTime - publishTime) <= sevenDaysInMs;
  };

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

  // Filter Blogs
  const filteredBlogs = blogData ? blogData.filter(blog => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = query ? 
      blog.title.toLowerCase().includes(query) || 
      blog.short_description.toLowerCase().includes(query) : true;
    const matchesTopic = activeTopic ? 
      blog.keywords.some(keyword => keyword.toLowerCase() === activeTopic.toLowerCase()) : true;
    return matchesSearch && matchesTopic;
  }) : [];

  const handleTopicClick = (topic) => {
    setActiveTopic(activeTopic === topic ? null : topic);
  };

  if (loading) {
    return <div className="loading-container"> <Loader/>  </div>;
  }

  return (
    <div className='page-main-container-king'>
      <img src='/backgound_coveL.avif' alt='background' className='background-isd3'/>
      
      <div className='page-container-king-dailog3'>
        <p>Welcome to My Blog</p>
        <div 
          className="image-container"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          <img 
            ref={imageRef}
            className={`pageod-3j ${isHovering ? 'hovering' : ''}`} 
            src='/my_images/blog.avif' 
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

        {latestBlog ? (
          <Link to={`/blog/${latestBlog.id}`} className="latest-projects-badge" target="_blank">
            <span className="new-badge">New</span>
            <h4><strong>New Blog</strong> is live!</h4>
            <FaRegArrowAltCircleRight className="arrow-icon" />
          </Link>
        ) : (
          <div className="latest-projects-badge">
            <span className="new-badge">New</span>
            <h4><strong>Blog</strong> is coming soon!</h4>
            <GoDotFill className="arrow-icon" />
          </div>
        )}

        <div 
          ref={searchBoxRef}
          className={`search-box-blogt ${isSearchFocused ? 'focused' : ''}`}
        >
          <input 
            ref={searchInputRef}
            type="text"
            placeholder="Search blog posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          <span className="shortcut-bogdr">Shift + S</span>
        </div>
      </div>

      <div className="topics-container">
        {topics.map((topic, index) => (
          <div 
            key={index} 
            className={`topic-tag ${activeTopic === topic ? 'active' : ''}`}
            onClick={() => handleTopicClick(topic)}
          >
            {topic}
          </div>
        ))}
      </div>

      {/* Main Blog Content Area */}
      <div className="blog-page-container">
        {/* Left Column - Blog Posts */}
        <div className="blog-posts-column">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <Link 
                to={`/blog/${blog._id}`} 
                key={blog._id} 
                className="blog-card"
              >
                <img 
                  src={blog.thumbnail} 
                  alt={blog.title} 
                  className="blog-thumbnail" 
                />
                <div className="blog-content">
                  <div className="blog-date">
                    {new Date(blog.publish_date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                    {isRecentlyPublished(blog.publish_date) && (
                      <span className="blog-badge">Recently released</span>
                    )}
                  </div>
                  <h3 className="blog-title">{blog.title}</h3>
                  <p className="blog-excerpt">{blog.short_description}</p>
                  <div className="read-time">
                    <GoClock style={{ color: '#07a256' }} size={16} /> {blog.reading_time} min read
                  </div>
                  <div className="blog-tags">
                    {blog.keywords.map((keyword, index) => (
                      <span key={index} className="blog-tag">{keyword}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="no-results-message">
              No blogs match your search or topic filter.
            </div>
          )}
        </div>

        {/* Right Column - Snake Game (hidden on mobile) */}
        {!isMobile && (
          <div className="snake-game-column">
            <SnakeGame />
          </div>
        )}
      </div>
      
      
      <Marquee/>
      <About/>
    </div>
  );
}

export default BlogPage;