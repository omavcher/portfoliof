import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import WorkPage from './pages/WorkPage';
import BlogPage from './pages/BlogPage';
import Blog from './pages/Blog';
import GuestBook from './pages/GuestBook';
import AdminPanel from './Admin/AdminPanel';
import AdminLogin from './Admin/AdminLogin';
import NotFound from './pages/NotFound';
import BlogEdit from './Admin/BlogEdit';
import ProjectEdit from './Admin/ProjectEdit';

function App() {
  const location = useLocation();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    setIsAdminAuthenticated(isAdmin);
  }, []);

  // Function to handle admin login
  const handleAdminLogin = (password) => {
    if (password === "omjs2693King") { // Consider moving this to an environment variable
      localStorage.setItem('isAdmin', 'true');
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  // Function to handle admin logout
  const handleAdminLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdminAuthenticated(false);
  };

  return (
    <>
      {/* Conditionally render Navbar */}
      {!location.pathname.startsWith("/admin") && <Navbar />}
      <CustomCursor />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/guestbook" element={<GuestBook />} />
        <Route path="/blog/:Id" element={<Blog />} />
        
        {/* Admin Routes */}
        <Route 
          path="/admin/login-omjs2693" 
          element={
            isAdminAuthenticated ? (
              <Navigate to="/admin" replace />
            ) : (
              <AdminLogin onLogin={handleAdminLogin} />
            )
          } 
        />
        <Route 
          path="/admin" 
          element={
            isAdminAuthenticated ? (
              <AdminPanel onLogout={handleAdminLogout} />
            ) : (
              <Navigate to="/admin/login-omjs2693" replace />
            )
          } 
        />

<Route 
          path="/admin/blog/edit/:id" 
          element={
            isAdminAuthenticated ? (
              <BlogEdit />
            ) : (
              <Navigate to="/admin/login-omjs2693" replace />
            )
          } 
        />

<Route 
          path="/admin/projects/edit/:id" 
          element={
            isAdminAuthenticated ? (
              <ProjectEdit />
            ) : (
              <Navigate to="/admin/login-omjs2693" replace />
            )
          } 
        />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;