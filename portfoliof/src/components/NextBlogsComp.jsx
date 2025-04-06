import React, { useEffect, useState } from 'react';
import './NextBlogsComp.css';
import { Link } from 'react-router-dom';
import api from '../config/api';

function NextBlogsComp({ id }) {
  const [blogData, setBlogData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/blogs/random/${id}`);
        setBlogData(response.data);
      } catch (error) {
        console.error("Error fetching blog data:", error);
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

  if (!blogData || !blogData.blogs) {
    return <div className="loading-3dhi">Loading blogs...</div>;
  }

  const visibleBlogs = blogData.blogs.slice(currentIndex, currentIndex + 2);

  return (
    <div className="next-blogs-container-3dhi">
      <h2 className="section-title-3dhi">You Might Also Like</h2>
      
      <div className="blogs-wrapper-3dhi">
        <div className="blogs-grid-3dhi">
          {visibleBlogs.map((blog) => (
            <Link 
              key={blog.id} 
              to={`/blog/${blog.id}`} 
              className="blog-card-3dhi"
            >
              <div className="thumbnail-container-3dhi">
                <img 
                  src={blog.thumbnail} 
                  alt={blog.title} 
                  className="blog-thumbnail-3dhi"
                  loading="lazy"
                />
              </div>
              <div className="blog-content-3dhi">
                <h3 className="blog-title-3dhi">{blog.title}</h3>
                <p className="blog-description-3dhi">{blog.short_description}</p>
                <span className="read-more-3dhi">Read more →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NextBlogsComp;