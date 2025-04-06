import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { Settings, Info, BookOpen, FolderKanban, Menu, X } from 'lucide-react';
import PersonalInfo from '../Admin/PersonalInfo';
import Blogs from '../Admin/Blogs';
import Projects from '../Admin/Projects';
import ProjectEdit from '../Admin/ProjectEdit';
import BlogEdit from '../Admin/BlogEdit';
import '../style/AdminPanel.css';
import api from '../config/api';

const AdminPanel = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('about');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return <PersonalInfo />;
      case 'blog':
        return <Blogs />;
      case 'projects':
        return <Projects />;
      default:
        return <PersonalInfo />;
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  if (isLoading) {
    return <div className="admin-panel">Loading...</div>;
  }

  return (
    <div className="admin-panel">
      <div className={`mobile-header ${isMobileMenuOpen ? 'menu-open' : ''}`}>
        <div className="mobile-logo">
          <Settings className="logo-icon" />
          <span>Admin Panel</span>
        </div>
        <button 
          className="hamburger-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="hamburger-icon" /> : <Menu className="hamburger-icon" />}
        </button>
      </div>
      <div className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="logo desktop-only">
          <Settings className="logo-icon" />
          <span>Admin Panel</span>
        </div>
        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => handleTabClick('about')}
          >
            <Info className="tab-icon" />
            <span>Personal Info</span>
          </button>
          <button
            className={`nav-tab ${activeTab === 'blog' ? 'active' : ''}`}
            onClick={() => handleTabClick('blog')}
          >
            <BookOpen className="tab-icon" />
            <span>Blogs</span>
          </button>
          <button
            className={`nav-tab ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => handleTabClick('projects')}
          >
            <FolderKanban className="tab-icon" />
            <span>Projects</span>
          </button>
          <button className="nav-tab" onClick={onLogout}>
            <FolderKanban className="tab-icon" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
      <div className="main-content">
        <Routes>
          <Route path="/" element={renderTabContent()} />
          <Route path="/projects/edit/:id" element={<ProjectEdit />} />
          <Route path="/blog/edit/:id" element={<BlogEdit />} />
          <Route path="*" element={renderTabContent()} />
        </Routes>
      </div>
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminPanel;