import React, { useEffect, useState } from 'react';
import './NextBlogsComp.css';
import { Link } from 'react-router-dom';
import api from '../config/api';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

function NextBlogsComp({ id }) {
  const [blogData, setBlogData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/api/blogs/random/${id}`);
        setBlogData(response.data);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleNext = () => {
    if (blogData && currentIndex < blogData.blogs.length - 2) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="next-blogs-container-ix93r">
        <h2 className="section-title-ix93r">You Might Also Like</h2>
        <div className="loading-ix93r">Loading blogs...</div>
      </div>
    );
  }

  if (!blogData || !blogData.blogs || blogData.blogs.length === 0) {
    return (
      <div className="next-blogs-container-ix93r">
        <h2 className="section-title-ix93r">You Might Also Like</h2>
        <div className="no-blogs-ix93r">No related blogs found</div>
      </div>
    );
  }

  const visibleBlogs = blogData.blogs.slice(currentIndex, currentIndex + 2);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = blogData && currentIndex < blogData.blogs.length - 2;

  return (
    <div className="next-blogs-container-ix93r">
      <h2 className="section-title-ix93r">You Might Also Like</h2>
      
      <div className="blogs-navigation-container-ix93r">
        <button 
          className={`nav-button-ix93r prev-button-ix93r ${!canGoPrevious ? 'disabled-ix93r' : ''}`}
          onClick={handlePrevious}
          disabled={!canGoPrevious}
          aria-label="Previous blogs"
        >
          <FiChevronLeft />
        </button>
        
        <div className="blogs-wrapper-ix93r">
          <div className="blogs-grid-ix93r">
            {visibleBlogs.map((blog) => (
              <Link 
                key={blog.id} 
                to={`/blog/${blog.id}`} 
                className="blog-card-ix93r"
              >
                <div className="thumbnail-container-ix93r">
                  <img 
                    src={blog.thumbnail} 
                    alt={blog.title} 
                    className="blog-thumbnail-ix93r"
                    loading="lazy"
                  />
                </div>
                <div className="blog-content-ix93r">
                  <h3 className="blog-title-ix93r">{blog.title}</h3>
                  <p className="blog-description-ix93r">{blog.short_description}</p>
                  <span className="read-more-ix93r">Read more →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        <button 
          className={`nav-button-ix93r next-button-ix93r ${!canGoNext ? 'disabled-ix93r' : ''}`}
          onClick={handleNext}
          disabled={!canGoNext}
          aria-label="Next blogs"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}

export default NextBlogsComp;