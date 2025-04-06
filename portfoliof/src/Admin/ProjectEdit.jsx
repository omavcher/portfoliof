import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Trash2, ChevronLeft, Plus, X } from 'lucide-react';
import '../style/AdminPanel.css';
import api from '../config/api';

const CLOUDINARY_UPLOAD_PRESET = 'portfolio';
const CLOUDINARY_CLOUD_NAME = 'dcvsx2eep';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;
const ProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState({
    title: '',
    description: '',
    tagline: '',
    features: [],
    technologies: [],
    color: '#1E90FF',
    secondary: '#FFD700',
    image: '',
    github: '',
    live_link: '',
    is_live_link: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [newTech, setNewTech] = useState('');
  const [isNewProject] = useState(id === 'new');

  const technologyOptions = [
    "HTML", "CSS", "JavaScript", "TypeScript", "Sass", "TailwindCSS",  
    "React", "Next.js", "Vue.js", "Angular", "Svelte",  
    "Bootstrap", "jQuery", "Node.js", "Express.js",  
    "PHP", "Laravel", "Django", "Flask", "FastAPI",  
    "Ruby", "Ruby on Rails", "Spring Boot",  
    "Python", "Java", "C", "C++", "C#", "Go", "Rust", "Swift",  
    "Kotlin", "Dart", "R", " Scala", "Perl", "Lua",  
    "React Native", "Flutter", "Swift", "Kotlin", "Objective-C",  
    "SQL", "MySQL", "PostgreSQL", "MongoDB", "SQLite", "Firebase", "Redis",  
    "R", "MATLAB", "Julia", "TensorFlow", "PyTorch", "Scikit-learn",  
    "Keras", "Pandas", "NumPy",  
    "Docker", "Kubernetes", "Terraform", "AWS", "Google Cloud", "Azure",  
    "CI/CD", "Jenkins", "GitHub Actions",  
    "Ethical Hacking", "Metasploit", "Burp Suite", "Kali Linux",  
    "BharatGPT", "Shakti Processor", "ONDC", "Agnibaan"  
  ];

  useEffect(() => {
    if (!isNewProject) {
      const fetchProject = async () => {
        try {
          const response = await api.get(`/api/projects/${id}`);
          setProject(response.data);
        } catch (error) {
          console.error("Error fetching project:", error);
          navigate('/admin');
        } finally {
          setIsLoading(false);
        }
      };
      fetchProject();
    } else {
      setIsLoading(false);
    }
  }, [id, navigate, isNewProject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && project.features.length < 6) {
      setProject(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setProject(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleAddTech = () => {
    if (newTech && !project.technologies.includes(newTech)) {
      setProject(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTech]
      }));
      setNewTech('');
    }
  };

  const handleRemoveTech = (tech) => {
    setProject(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);  // Changed from 'image' to 'file' as per Cloudinary's API
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  
    try {
      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
  
      const data = await response.json();
      setProject(prev => ({ ...prev, image: data.secure_url }));
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      alert('Failed to upload image');
    }
  };

  const handleSave = async () => {
    if (!project.title.trim()) {
      alert('Title is required');
      return;
    }
    if (!project.description.trim()) {
      alert('Description is required');
      return;
    }
    if (!project.image.trim()) {
      alert('Image is required');
      return;
    }

    setIsSaving(true);
    try {
      if (isNewProject) {
        await api.post(`/api/projects`, {
          ...project,
          _id: crypto.randomUUID()
        });
      } else {
        await api.put(`/api/projects/${id}`, project);
      }
      navigate('/admin');
    } catch (error) {
      console.error("Error saving project:", error);
      alert('Failed to save project. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/api/projects/${id}`);
        navigate('/admin');
      } catch (error) {
        console.error("Error deleting project:", error);
        alert('Failed to delete project');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="admin-container-943c admin-panel">
        <div className="loading-spinner-943c">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-container-943c admin-panel">
      <div className="admin-header-943c">
        <button 
          className="back-button-943c nav-tab"
          onClick={() => navigate('/admin')}
        >
          <ChevronLeft className="tab-icon" size={20} />
          Back to Admin
        </button>
        <h1 className="tab-content-h2">
          {isNewProject ? 'Create New Project' : `Edit Project: ${project.title}`}
        </h1>
      </div>

      <div className="project-edit-form-943c main-content">
        <div className="form-section-943c tab-content">
          <h2 className="tab-content-h2">Basic Information</h2>
          
          <div className="form-group-943c form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={project.title}
              onChange={handleChange}
              placeholder="Project title"
              required
            />
          </div>

          <div className="form-group-943c form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={project.description}
              onChange={handleChange}
              placeholder="Detailed project description"
              rows={5}
              required
            />
          </div>

          <div className="form-group-943c form-group">
            <label>Tagline</label>
            <input
              type="text"
              name="tagline"
              value={project.tagline}
              onChange={handleChange}
              placeholder="Short catchy phrase about the project"
            />
          </div>
        </div>

        <div className="form-section-943c tab-content">
          <h2 className="tab-content-h2">Features</h2>
          <div className="form-group-943c form-group">
            <label>Add Features (Max 6)</label>
            <div className="input-with-button-943c stack-grid">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Enter feature and press Add"
                onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
              />
              <button 
                className="add-feature-btn-943c add-button secondary"
                onClick={handleAddFeature}
                disabled={!newFeature.trim() || project.features.length >= 6}
              >
                <Plus className="button-icon" size={16} />
              </button>
            </div>
            <div className="tags-container-943c stack-grid">
              {project.features.map((feature, index) => (
                <span key={index} className="tag-943c stack-item">
                  {feature}
                  <button 
                    className="remove-tag-btn-943c delete-button"
                    onClick={() => handleRemoveFeature(index)}
                  >
                    <X className="button-icon" size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section-943c tab-content">
          <h2 className="tab-content-h2">Technologies</h2>
          <div className="form-group-943c form-group">
            <label>Add Technologies</label>
            <div className="input-with-button-943c stack-grid">
              <select
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
              >
                <option value="">Select a technology</option>
                {technologyOptions.map((tech, index) => (
                  <option key={index} value={tech}>{tech}</option>
                ))}
              </select>
              <button 
                className="add-tech-btn-943c add-button secondary"
                onClick={handleAddTech}
                disabled={!newTech}
              >
                <Plus className="button-icon" size={16} />
              </button>
            </div>
            <div className="tags-container-943c stack-grid">
              {project.technologies.map((tech, index) => (
                <span key={index} className="tag-943c stack-item">
                  {tech}
                  <button 
                    className="remove-tag-btn-943c delete-button"
                    onClick={() => handleRemoveTech(tech)}
                  >
                    <X className="button-icon" size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section-943c tab-content">
          <h2 className="tab-content-h2">Design</h2>
          <div className="color-group-943c">
            <div className="form-group-943c form-group">
              <label>Primary Color</label>
              <div className="color-input-943c stack-grid">
                <input
                  type="color"
                  name="color"
                  value={project.color}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="color"
                  value={project.color}
                  onChange={handleChange}
                  maxLength={7}
                />
                <div 
                  className="color-preview-943c image-preview" 
                  style={{ backgroundColor: project.color }} 
                />
              </div>
            </div>

            <div className="form-group-943c form-group">
              <label>Secondary Color</label>
              <div className="color-input-943c stack-grid">
                <input
                  type="color"
                  name="secondary"
                  value={project.secondary}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="secondary"
                  value={project.secondary}
                  onChange={handleChange}
                  maxLength={7}
                />
                <div 
                  className="color-preview-943c image-preview" 
                  style={{ backgroundColor: project.secondary }} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-section-943c tab-content">
          <h2 className="tab-content-h2">Media & Links</h2>
          <div className="form-group-943c form-group">
            <label>Project Image *</label>
            <div className="image-upload-container-943c image-input-container">
              <input
                type="text"
                name="image"
                value={project.image}
                onChange={handleChange}
                placeholder="Image URL"
                required
              />
              <label className="upload-btn-943c upload-button">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  hidden
                />
                Upload Image
              </label>
            </div>
            {project.image && (
              <div className="image-preview-943c image-preview">
                <img src={project.image} alt="Project preview" />
              </div>
            )}
          </div>

          <div className="form-group-943c form-group">
            <label>GitHub Repository</label>
            <input
              type="url"
              name="github"
              value={project.github}
              onChange={handleChange}
              placeholder="https://github.com/username/project"
            />
          </div>

          <div className="form-group-943c form-group">
            <label>Live Demo URL</label>
            <input
              type="url"
              name="live_link"
              value={project.live_link}
              onChange={handleChange}
              placeholder="https://your-project.com"
            />
          </div>

          <div className="form-group-943c form-group">
            <label>Live Demo Status</label>
            <select
              name="is_live_link"
              value={project.is_live_link}
              onChange={handleChange}
            >
              <option value={0}>Not Live</option>
              <option value={1}>Live</option>
              <option value={-10}>No Live Demo</option>
            </select>
          </div>
        </div>

        <div className="form-actions-943c">
          <button 
            className="save-btn-943c add-button"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="button-icon" size={18} />
            {isSaving ? 'Saving...' : 'Save Project'}
          </button>
          
          {!isNewProject && (
            <button 
              className="delete-btn-943c delete-button"
              onClick={handleDelete}
            >
              <Trash2 className="button-icon" size={18} />
              Delete Project
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectEdit;