import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import '../style/AdminPanel.css';
import api from '../config/api';

const CLOUDINARY_UPLOAD_PRESET = 'portfolio';
const CLOUDINARY_CLOUD_NAME = 'dcvsx2eep';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

const PersonalInfo = () => {
  const [data, setData] = useState({
    resume: '',
    experience: {
      heading: '',
      title: '',
      highlight: '',
      items: [{
        period: '',
        role: '',
        company: '',
        logo: '',
        link: '',
        location: '',
        description: '',
        responsibilities: [],
        images: [],
        skills: []
      }]
    },
    techStack: {
      frontend: { title: '', items: [{ name: '', icon: '' }] },
      backend: { title: '', items: [{ name: '', icon: '' }] },
      devops: { title: '', items: [{ name: '', icon: '' }] },
      dsa: { title: '', items: [{ name: '', icon: '' }] },
      ai: { title: '', items: [{ name: '', icon: '' }] }
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [profilePreview, setProfilePreview] = useState('');
  const [resumePreview, setResumePreview] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/personal-info');
        const personalInfo = response.data?.personalInfo || {};
        
        const fetchedData = {
          resume: personalInfo?.resume || '',
          experience: {
            heading: personalInfo?.experience?.heading || '',
            title: personalInfo?.experience?.title || '',
            highlight: personalInfo?.experience?.highlight || '',
            items: Array.isArray(personalInfo?.experience?.items) && personalInfo.experience.items.length > 0 
              ? personalInfo.experience.items.map(item => ({
                  period: item?.period || '',
                  role: item?.role || '',
                  company: item?.company || '',
                  logo: item?.logo || '',
                  link: item?.link || '',
                  location: item?.location || '',
                  description: item?.description || '',
                  responsibilities: Array.isArray(item?.responsibilities) ? item.responsibilities : [],
                  images: Array.isArray(item?.images) ? item.images : [],
                  skills: Array.isArray(item?.skills) ? item.skills : []
                }))
              : [{
                  period: '',
                  role: '',
                  company: '',
                  logo: '',
                  link: '',
                  location: '',
                  description: '',
                  responsibilities: [],
                  images: [],
                  skills: []
                }]
          },
          techStack: {
            frontend: {
              title: personalInfo?.techStack?.frontend?.title || '',
              items: Array.isArray(personalInfo?.techStack?.frontend?.items) 
                ? personalInfo.techStack.frontend.items 
                : [{ name: '', icon: '' }]
            },
            backend: {
              title: personalInfo?.techStack?.backend?.title || '',
              items: Array.isArray(personalInfo?.techStack?.backend?.items) 
                ? personalInfo.techStack.backend.items 
                : [{ name: '', icon: '' }]
            },
            devops: {
              title: personalInfo?.techStack?.devops?.title || '',
              items: Array.isArray(personalInfo?.techStack?.devops?.items) 
                ? personalInfo.techStack.devops.items 
                : [{ name: '', icon: '' }]
            },
            dsa: {
              title: personalInfo?.techStack?.dsa?.title || '',
              items: Array.isArray(personalInfo?.techStack?.dsa?.items) 
                ? personalInfo.techStack.dsa.items 
                : [{ name: '', icon: '' }]
            },
            ai: {
              title: personalInfo?.techStack?.ai?.title || '',
              items: Array.isArray(personalInfo?.techStack?.ai?.items) 
                ? personalInfo.techStack.ai.items 
                : [{ name: '', icon: '' }]
            }
          }
        };

        setData(fetchedData);
        setProfilePreview(fetchedData.image || '');
        setResumePreview(fetchedData.resume || '');
      } catch (error) {
        console.error("Error fetching personal info:", error);
        setError("Failed to load personal info from the backend. Please try again later.");
      }
    };
    fetchData();
  }, []);

  const handlePersonalInfoChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
    if (field === 'image') setProfilePreview(value);
    if (field === 'resume') setResumePreview(value);
  };

  const handleFileUpload = (field, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handlePersonalInfoChange(field, e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url;
      }
      throw new Error('Upload failed');
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };

  const handleImageFileUpload = async (experienceIndex, event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const cloudinaryUrl = await uploadToCloudinary(file);
        setData(prev => {
          const newData = JSON.parse(JSON.stringify(prev));
          const images = newData.experience.items[experienceIndex].images || [];
          newData.experience.items[experienceIndex].images = [...images, cloudinaryUrl];
          return newData;
        });
      } catch (error) {
        setError('Failed to upload image to Cloudinary. Please try again.');
      }
    }
  };

  const handleNestedChange = (path, value, index = null) => {
    setData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      let current = newData;
      const parts = path.split('.');
      
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (part.includes('[')) {
          const [key, idx] = part.split('[');
          const arrIndex = parseInt(idx.replace(']', ''));
          if (!current[key]) current[key] = [];
          if (!current[key][arrIndex]) current[key][arrIndex] = {};
          current = current[key][arrIndex];
        } else {
          if (!current[part]) {
            if (i < parts.length - 2 && parts[i+1].includes('[')) {
              current[part] = [];
            } else {
              current[part] = {};
            }
          }
          current = current[part];
        }
      }
      
      const lastKey = parts[parts.length - 1];
      if (index !== null) {
        if (!current[lastKey]) current[lastKey] = [];
        current[lastKey][index] = value;
      } else {
        current[lastKey] = value;
      }
      return newData;
    });
  };

  const addArrayItem = (path) => {
    setData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      let current = newData;
      const parts = path.split('.');
      
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (part.includes('[')) {
          const [key, idx] = part.split('[');
          const arrIndex = parseInt(idx.replace(']', ''));
          current = current[key][arrIndex];
        } else {
          current = current[part];
        }
      }
      
      const lastKey = parts[parts.length - 1];
      if (!current[lastKey]) current[lastKey] = [];
      
      if (lastKey === 'items' && path.includes('experience')) {
        current[lastKey].push({
          period: '',
          role: '',
          company: '',
          logo: '',
          link: '',
          location: '',
          description: '',
          responsibilities: [],
          images: [],
          skills: []
        });
      } else if (lastKey === 'items') {
        current[lastKey].push({ name: '', icon: '' });
      } else {
        current[lastKey].push('');
      }
      
      return newData;
    });
  };

  const removeArrayItem = (path, index) => {
    setData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      let current = newData;
      const parts = path.split('.');
      
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (part.includes('[')) {
          const [key, idx] = part.split('[');
          const arrIndex = parseInt(idx.replace(']', ''));
          current = current[key][arrIndex];
        } else {
          current = current[part];
        }
      }
      
      const lastKey = parts[parts.length - 1];
      if (Array.isArray(current[lastKey])) {
        current[lastKey] = current[lastKey].filter((_, i) => i !== index);
      }
      
      return newData;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put('/api/personal-info', data);
      alert('Personal info saved successfully!');
      setError(null);
    } catch (error) {
      console.error('Error saving:', error);
      setError('Failed to save personal info. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="tab-content">
      {error && <div className="error-message" style={{ color: 'var(--error-color)', marginBottom: '10px' }}>{error}</div>}
      <h2>Personal Information</h2>
            
      <div className="form-group image-upload-group">
        <label>Resume</label>
        <div className="image-input-container">
          <input
            type="text"
            value={data.resume || ''}
            onChange={(e) => handlePersonalInfoChange('resume', e.target.value)}
            placeholder="Enter resume URL"
          />
          <label className="upload-button">
            Upload
            <input type="file" onChange={(e) => handleFileUpload('resume', e)} accept=".pdf,.doc,.docx" />
          </label>
        </div>
        {resumePreview && <div className="image-preview"><embed src={resumePreview} type="application/pdf" /></div>}
      </div>

      {/* Experience Section */}
      <h3>Experience</h3>
      {data.experience?.items?.map((item, index) => (
        <div key={index} className="item-card">
          <div className="form-group">
            <label>Period</label>
            <input
              value={item?.period || ''}
              onChange={(e) => handleNestedChange(`experience.items[${index}].period`, e.target.value)}
              placeholder="Enter period (e.g., APR 2025 - MAY 2025)"
            />
          </div>
          
          <div className="form-group">
            <label>Role</label>
            <input
              value={item?.role || ''}
              onChange={(e) => handleNestedChange(`experience.items[${index}].role`, e.target.value)}
              placeholder="Enter role"
            />
          </div>
          
          <div className="form-group">
            <label>Company</label>
            <input
              value={item?.company || ''}
              onChange={(e) => handleNestedChange(`experience.items[${index}].company`, e.target.value)}
              placeholder="Enter company"
            />
          </div>
          
          <div className="form-group">
            <label>Logo URL</label>
            <input
              value={item?.logo || ''}
              onChange={(e) => handleNestedChange(`experience.items[${index}].logo`, e.target.value)}
              placeholder="Enter logo URL"
            />
          </div>
          
          <div className="form-group">
            <label>Link</label>
            <input
              value={item?.link || ''}
              onChange={(e) => handleNestedChange(`experience.items[${index}].link`, e.target.value)}
              placeholder="Enter company link"
            />
          </div>
          
          <div className="form-group">
            <label>Location</label>
            <input
              value={item?.location || ''}
              onChange={(e) => handleNestedChange(`experience.items[${index}].location`, e.target.value)}
              placeholder="Enter location"
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={item?.description || ''}
              onChange={(e) => handleNestedChange(`experience.items[${index}].description`, e.target.value)}
              placeholder="Enter description"
              rows={3}
            />
          </div>
          
          <div className="form-group">
            <label>Responsibilities</label>
            {item?.responsibilities?.map((resp, respIndex) => (
              <div key={respIndex} className="stack-item">
                <input
                  value={resp || ''}
                  onChange={(e) => handleNestedChange(`experience.items[${index}].responsibilities`, e.target.value, respIndex)}
                  placeholder="Enter responsibility"
                />
                <button className="delete-button" onClick={() => removeArrayItem(`experience.items[${index}].responsibilities`, respIndex)}>
                  <Trash2 className="button-icon" />
                </button>
              </div>
            ))}
            <button className="add-button secondary" onClick={() => addArrayItem(`experience.items[${index}].responsibilities`)}>
              <Plus className="button-icon" /> Add Responsibility
            </button>
          </div>
          
          <div className="form-group">
            <label>Images</label>
            {item?.images?.map((img, imgIndex) => (
              <div key={imgIndex} className="stack-item">
                <input
                  value={img || ''}
                  onChange={(e) => handleNestedChange(`experience.items[${index}].images`, e.target.value, imgIndex)}
                  placeholder="Enter image URL"
                />
                <button className="delete-button" onClick={() => removeArrayItem(`experience.items[${index}].images`, imgIndex)}>
                  <Trash2 className="button-icon" />
                </button>
              </div>
            ))}
            <div className="image-upload-options">
              <div className="image-input-container">
                <input
                  type="text"
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      handleNestedChange(`experience.items[${index}].images`, e.target.value, item.images.length);
                    }
                  }}
                  placeholder="Or enter image URL manually"
                />
              </div>
              <label className="upload-button">
                Upload from Local
                <input
                  type="file"
                  onChange={(e) => handleImageFileUpload(index, e)}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label>Skills</label>
            {item?.skills?.map((skill, skillIndex) => (
              <div key={skillIndex} className="stack-item">
                <input
                  value={skill || ''}
                  onChange={(e) => handleNestedChange(`experience.items[${index}].skills`, e.target.value, skillIndex)}
                  placeholder="Enter skill"
                />
                <button className="delete-button" onClick={() => removeArrayItem(`experience.items[${index}].skills`, skillIndex)}>
                  <Trash2 className="button-icon" />
                </button>
              </div>
            ))}
            <button className="add-button secondary" onClick={() => addArrayItem(`experience.items[${index}].skills`)}>
              <Plus className="button-icon" /> Add Skill
            </button>
          </div>
          
          <button className="delete-button" onClick={() => removeArrayItem('experience.items', index)}>
            <Trash2 className="button-icon" /> Remove Experience
          </button>
        </div>
      ))}
      <button className="add-button" onClick={() => addArrayItem('experience.items')}>
        <Plus className="button-icon" /> Add Experience
      </button>

      {/* Tech Stack Section */}
      <h3>Tech Stack</h3>
      {Object.keys(data.techStack || {}).map(category => (
        <div key={category} className="form-group">
          <label>{category.charAt(0).toUpperCase() + category.slice(1)} Title</label>
          <input
            value={data.techStack?.[category]?.title || ''}
            onChange={(e) => handleNestedChange(`techStack.${category}.title`, e.target.value)}
            placeholder={`Enter ${category} title`}
          />
          
          <div className="stack-grid">
            {data.techStack?.[category]?.items?.map((item, index) => (
              <div key={index} className="stack-item">
                <input
                  value={item?.name || ''}
                  onChange={(e) => handleNestedChange(`techStack.${category}.items[${index}].name`, e.target.value)}
                  placeholder="Enter tech name"
                />
                <input
                  value={item?.icon || ''}
                  onChange={(e) => handleNestedChange(`techStack.${category}.items[${index}].icon`, e.target.value)}
                  placeholder="Enter icon URL"
                />
                <button className="delete-button" onClick={() => removeArrayItem(`techStack.${category}.items`, index)}>
                  <Trash2 className="button-icon" />
                </button>
              </div>
            ))}
          </div>
          
          <button className="add-button secondary" onClick={() => addArrayItem(`techStack.${category}.items`)}>
            <Plus className="button-icon" /> Add {category} Item
          </button>
        </div>
      ))}

      <button className="add-button" onClick={handleSave} disabled={isSaving}>
        <Save className="button-icon" /> {isSaving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
};

export default PersonalInfo;