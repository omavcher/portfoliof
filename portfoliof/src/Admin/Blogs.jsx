import React, { useState, useEffect } from 'react';
import { Plus, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../style/AdminPanel.css';
import api from '../config/api';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get('/api/blogs');
        setBlogs(response.data.blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="tab-content">
      <h2>Blogs</h2>
      <Link to="/admin/blog/edit/new" className="add-button">
        <Plus className="button-icon" />
        Add New Blog
      </Link>
      {blogs.map(blog => (
        <div key={blog._id} className="item-card">
          <h3>{blog.title}</h3>
          <p>{blog.short_description}</p>
          <Link to={`/admin/blog/edit/${blog._id}`} className="add-button secondary">
            <Edit2 className="button-icon" />
            Edit
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Blogs;