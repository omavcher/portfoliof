import React, { useState, useEffect } from 'react';
import { Plus, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../style/AdminPanel.css';
import api from '../config/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/api/projects');
        setProjects(response.data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="tab-content">
      <h2>Projects</h2>
      <Link to="/admin/projects/edit/new" className="add-button">
        <Plus className="button-icon" />
        Add New Project
      </Link>
      {projects.map(project => (
        <div key={project._id} className="item-card">
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <Link to={`/admin/projects/edit/${project._id}`} className="add-button secondary">
            <Edit2 className="button-icon" />
            Edit
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Projects;