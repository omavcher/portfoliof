import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Trash2, ChevronLeft, Plus, X, Edit2 } from 'lucide-react';
import '../style/AdminPanel.css';
import api from '../config/api';

// Cloudinary configuration
const CLOUDINARY_UPLOAD_PRESET = 'portfolio';
const CLOUDINARY_CLOUD_NAME = 'dcvsx2eep';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isNewBlog] = useState(id === 'new');
  const [editingSection, setEditingSection] = useState(null);
  const [error, setError] = useState(null);

  const blogSections = [
    { key: 'introduction', label: 'Introduction' },
    { key: 'beginnings', label: 'Beginnings are hard' },
    { key: 'motivation', label: 'Find motivation' },
    { key: 'focus', label: 'Focus on one thing' },
    { key: 'myths', label: 'Myths about maths' },
    { key: 'codeReview', label: 'Code review' },
    { key: 'experience', label: 'Experience and community' },
    { key: 'practice', label: 'Practise as much as you can' },
    { key: 'process', label: "You can't speed this process" },
    { key: 'summary', label: 'Summary' }
  ];

  const [sections, setSections] = useState(
    blogSections.map(section => ({
      ...section,
      id: crypto.randomUUID()
    }))
  );

  const [blog, setBlog] = useState({
    _id: crypto.randomUUID(),
    title: '',
    short_description: '',
    thumbnail: '',
    reading_time: '',
    keywords: [],
    keywordsInput: '',
    publish_date: new Date().toISOString(),
    content: {
      sections: sections.map(s => ({
        ...s,
        text: '',
        codeSnippets: [],
        links: [],
        images: []
      }))
    }
  });

  useEffect(() => {
    if (!isNewBlog) {
      const fetchBlog = async () => {
        try {
          const response = await api.get(`/api/blogs/${id}`);
          const fetchedBlog = response.data.blog;

          if (!fetchedBlog || !fetchedBlog.content) {
            throw new Error('Invalid blog data received from server');
          }

          setBlog(fetchedBlog);
          const existingSections = fetchedBlog.content.sections || [];
          setSections(prev => {
            const mergedSections = [...prev];
            existingSections.forEach(es => {
              const index = mergedSections.findIndex(s => s.key === es.key);
              if (index === -1) {
                mergedSections.push({ ...es, id: es.id || crypto.randomUUID() });
              } else {
                mergedSections[index] = { ...mergedSections[index], ...es };
              }
            });
            return mergedSections;
          });
        } catch (error) {
          console.error("Error fetching blog:", error);
          setError(`Failed to load blog: ${error.message}`);
        } finally {
          setIsLoading(false);
        }
      };
      fetchBlog();
    } else {
      setIsLoading(false);
    }
  }, [id, isNewBlog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog(prev => ({ ...prev, [name]: value }));
  };

  const handleKeywordsChange = (value) => {
    setBlog(prev => ({
      ...prev,
      keywordsInput: value,
      keywords: value.split(',').map(k => k.trim()).filter(k => k.length > 0)
    }));
  };

  const handleSectionChange = (sectionId, value) => {
    setBlog(prev => ({
      ...prev,
      content: {
        ...prev.content,
        sections: prev.content.sections.map(s =>
          s.id === sectionId ? { ...s, text: value } : s
        )
      }
    }));
  };

  const handleContentItemChange = (sectionId, type, itemId, field, value) => {
    setBlog(prev => ({
      ...prev,
      content: {
        ...prev.content,
        sections: prev.content.sections.map(section =>
          section.id === sectionId ? {
            ...section,
            [type]: section[type].map(item =>
              item.id === itemId ? { ...item, [field]: value } : item
            )
          } : section
        )
      }
    }));
  };

  const deleteItem = (sectionId, type, itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setBlog(prev => ({
        ...prev,
        content: {
          ...prev.content,
          sections: prev.content.sections.map(section =>
            section.id === sectionId ? {
              ...section,
              [type]: section[type].filter(item => item.id !== itemId)
            } : section
          )
        }
      }));
    }
  };

  const addSection = () => {
    const newSection = {
      id: crypto.randomUUID(),
      key: `section${sections.length + 1}`,
      label: `New Section ${sections.length + 1}`,
      text: '',
      codeSnippets: [],
      links: [],
      images: []
    };
    setSections(prev => [...prev, newSection]);
    setBlog(prev => ({
      ...prev,
      content: {
        ...prev.content,
        sections: [...prev.content.sections, newSection]
      }
    }));
  };

  const addItem = (sectionId, type) => {
    const newItem = {
      id: crypto.randomUUID(),
      ...(type === 'codeSnippets' ? { content: '' } :
         type === 'links' ? { url: '', text: '' } :
         { url: '' })
    };
    setBlog(prev => ({
      ...prev,
      content: {
        ...prev.content,
        sections: prev.content.sections.map(section =>
          section.id === sectionId ? {
            ...section,
            [type]: [...section[type], newItem]
          } : section
        )
      }
    }));
  };

  const handleImageUpload = async (sectionId, itemId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should not exceed 2MB');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
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
      handleContentItemChange(sectionId, 'images', itemId, 'url', data.secure_url);
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
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
      setBlog(prev => ({ 
        ...prev, 
        thumbnail: data.secure_url 
      }));
    } catch (error) {
      console.error('Error uploading thumbnail to Cloudinary:', error);
      alert('Failed to upload thumbnail');
    } finally {
      setIsUploading(false);
    }
  };

  const updateSection = (sectionId, field, value) => {
    setSections(prev => prev.map(s =>
      s.id === sectionId ? { ...s, [field]: value } : s
    ));
    setBlog(prev => ({
      ...prev,
      content: {
        ...prev.content,
        sections: prev.content.sections.map(s =>
          s.id === sectionId ? { ...s, [field]: value } : s
        )
      }
    }));
  };

  const validateBlog = () => {
    if (!blog.title.trim()) return "Title is required";
    if (!blog.short_description.trim()) return "Description is required";
    if (!blog.thumbnail.trim()) return "Thumbnail URL is required";
    if (!blog.reading_time.trim()) return "Reading time is required";
    if (blog.keywords.length === 0) return "At least one keyword is required";
    return null;
  };

  const handleSave = async () => {
    const error = validateBlog();
    if (error) {
      alert(error);
      return;
    }

    setIsSaving(true);
    try {
      const blogToSave = {
        ...blog,
        keywords: blog.keywordsInput 
          ? blog.keywordsInput.split(',').map(k => k.trim()).filter(k => k)
          : blog.keywords,
        keywordsInput: undefined,
        publish_date: blog.publish_date || new Date().toISOString()
      };

      if (isNewBlog) {
        await api.post(`/api/blogs/create`, blogToSave);
      } else {
        await api.put(`/api/blogs/edit/${id}`, blogToSave);
      }
      navigate('/admin');
    } catch (error) {
      console.error("Error saving blog:", error);
      alert('Failed to save blog. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await api.delete(`/api/blogs/${id}`);
        navigate('/admin');
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert('Failed to delete blog');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="admin-container-nex4">
        <div className="loading-spinner-nex4">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container-nex4">
        <div className="admin-header-nex4">
          <button 
            className="back-button-nex4 nav-tab"
            onClick={() => navigate('/admin')}
          >
            <ChevronLeft className="tab-icon" size={20} />
            Back to Admin
          </button>
          <h1 className="tab-content-h2">Error</h1>
        </div>
        <div className="error-message-nex4">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container-nex4 admin-panel sjkjwe">
      <div className="admin-header-nex4">
        <button 
          className="back-button-nex4 nav-tab"
          onClick={() => navigate('/admin')}
        >
          <ChevronLeft className="tab-icon" size={20} />
          Back to Admin
        </button>
        <h1 className="tab-content-h2">
          {isNewBlog ? 'Create New Blog' : `Edit Blog: ${blog.title}`}
        </h1>
      </div>

      <div className="project-edit-form-nex4 main-content">
        <div className="form-section-nex4 tab-content">
          <h2 className="tab-content-h2">Basic Information</h2>
          <div className="form-group-nex4 form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={blog.title || ''}
              onChange={handleChange}
              placeholder="Blog title"
              maxLength={100}
              required
            />
          </div>
          <div className="form-group-nex4 form-group">
            <label>Short Description *</label>
            <input
              type="text"
              name="short_description"
              value={blog.short_description || ''}
              onChange={handleChange}
              placeholder="Brief description of the blog"
              maxLength={200}
              required
            />
          </div>
          <div className="form-group-nex4 form-group">
            <label>Thumbnail URL *</label>
            <div className="image-upload-container-nex4 image-input-container">
              <input
                type="text"
                name="thumbnail"
                value={blog.thumbnail || ''}
                onChange={handleChange}
                placeholder="https://example.com/thumbnail.jpg"
                required
                disabled={isUploading}
              />
              <label className="upload-btn-nex4 upload-button">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  hidden
                  disabled={isUploading}
                />
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </label>
            </div>
            {blog.thumbnail && (
              <div className="image-preview-nex4 image-preview">
                <img src={blog.thumbnail} alt="Thumbnail preview" />
              </div>
            )}
          </div>
          <div className="form-group-nex4 form-group">
            <label>Reading Time (minutes) *</label>
            <input
              type="number"
              name="reading_time"
              value={blog.reading_time || ''}
              onChange={handleChange}
              placeholder="5"
              min="1"
              max="999"
              required
            />
          </div>
          <div className="form-group-nex4 form-group">
            <label>Keywords (comma-separated) *</label>
            <input
              type="text"
              value={blog.keywordsInput || blog.keywords.join(', ') || ''}
              onChange={(e) => handleKeywordsChange(e.target.value)}
              placeholder="e.g., programming, javascript, tutorial"
              maxLength={200}
              required
            />
            <div className="keywords-preview-nex4">
              {blog.keywords && blog.keywords.length > 0 && (
                <>
                  <strong>Current keywords:</strong>
                  <div className="keywords-tags-nex4">
                    {blog.keywords.map((keyword, index) => (
                      <span key={index} className="keyword-tag-nex4">{keyword}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="form-section-nex4 tab-content">
          <h2 className="tab-content-h2">Content Sections Configuration</h2>
          {sections.map((section) => (
            <div key={section.id} className="item-card-nex4 item-card">
              {editingSection === section.id ? (
                <>
                  <input
                    className="form-group-input"
                    value={section.key || ''}
                    onChange={(e) => updateSection(section.id, 'key', e.target.value)}
                    placeholder="Section Key"
                  />
                  <input
                    className="form-group-input"
                    value={section.label || ''}
                    onChange={(e) => updateSection(section.id, 'label', e.target.value)}
                    placeholder="Section Label"
                  />
                  <button 
                    className="add-button-nex4 add-button secondary-nex4 secondary" 
                    onClick={() => setEditingSection(null)}
                  >
                    Done
                  </button>
                </>
              ) : (
                <>
                  <span>{section.label} ({section.key})</span>
                  <button 
                    className="add-button-nex4 add-button secondary-nex4 secondary" 
                    onClick={() => setEditingSection(section.id)}
                  >
                    <Edit2 className="button-icon-nex4 button-icon" size={16} />
                  </button>
                </>
              )}
            </div>
          ))}
          <button 
            className="add-button-nex4 add-button secondary-nex4 secondary" 
            onClick={addSection}
          >
            <Plus className="button-icon-nex4 button-icon" />
            Add New Section
          </button>
        </div>

        <div className="form-section-nex4 tab-content">
          <h2 className="tab-content-h2">Content Sections</h2>
          {blog.content.sections.map(section => (
            <div key={section.id} className="item-card-nex4 item-card">
              <div className="form-group-nex4 form-group">
                <label>{section.label}</label>
                <textarea
                  value={section.text || ''}
                  onChange={(e) => handleSectionChange(section.id, e.target.value)}
                  placeholder={`Write the ${section.label.toLowerCase()} section...`}
                  rows={4}
                  maxLength={5000}
                  required
                />
              </div>

              <div className="form-group-nex4 form-group">
                <button 
                  className="add-button-nex4 add-button secondary-nex4 secondary" 
                  onClick={() => addItem(section.id, 'codeSnippets')}
                >
                  <Plus className="button-icon-nex4 button-icon" />
                  Add Code Snippet
                </button>
                {section.codeSnippets && section.codeSnippets.map(snippet => (
                  <div key={snippet.id} className="form-group-nex4 form-group">
                    <textarea
                      value={snippet.content || ''}
                      onChange={(e) => handleContentItemChange(section.id, 'codeSnippets', snippet.id, 'content', e.target.value)}
                      placeholder="Enter your code here..."
                      className="code-editor-nex4 code-editor"
                      rows={6}
                      maxLength={2000}
                    />
                    <button 
                      className="delete-button-nex4 delete-button" 
                      onClick={() => deleteItem(section.id, 'codeSnippets', snippet.id)}
                    >
                      <Trash2 className="button-icon-nex4 button-icon" size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="form-group-nex4 form-group">
                <button 
                  className="add-button-nex4 add-button secondary-nex4 secondary" 
                  onClick={() => addItem(section.id, 'links')}
                >
                  <Plus className="button-icon-nex4 button-icon" />
                  Add Link
                </button>
                {section.links && section.links.map(link => (
                  <div key={link.id} className="form-group-nex4 form-group link-group-nex4">
                    <input
                      value={link.text || ''}
                      onChange={(e) => handleContentItemChange(section.id, 'links', link.id, 'text', e.target.value)}
                      placeholder="Link Text"
                      maxLength={100}
                    />
                    <input
                      value={link.url || ''}
                      onChange={(e) => handleContentItemChange(section.id, 'links', link.id, 'url', e.target.value)}
                      placeholder="https://example.com"
                      maxLength={200}
                    />
                    <button 
                      className="delete-button-nex4 delete-button" 
                      onClick={() => deleteItem(section.id, 'links', link.id)}
                    >
                      <Trash2 className="button-icon-nex4 button-icon" size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="form-group-nex4 form-group">
                <button 
                  className="add-button-nex4 add-button secondary-nex4 secondary" 
                  onClick={() => addItem(section.id, 'images')}
                >
                  <Plus className="button-icon-nex4 button-icon" />
                  Add Image
                </button>
                {section.images && section.images.map(image => (
                  <div key={image.id} className="image-upload-group-nex4 image-upload-group">
                    <label>Image Source</label>
                    <div className="image-input-container-nex4 image-input-container">
                      <input
                        type="text"
                        value={image.url || ''}
                        onChange={(e) => handleContentItemChange(section.id, 'images', image.id, 'url', e.target.value)}
                        placeholder="https://example.com/blog-image.jpg"
                        maxLength={200}
                        disabled={isUploading}
                      />
                      <label className="upload-button-nex4 upload-button">
                        {isUploading ? 'Uploading...' : 'Upload'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(section.id, image.id, e)}
                          hidden
                          disabled={isUploading}
                        />
                      </label>
                      <button 
                        className="delete-button-nex4 delete-button" 
                        onClick={() => deleteItem(section.id, 'images', image.id)}
                        disabled={isUploading}
                      >
                        <Trash2 className="button-icon-nex4 button-icon" size={16} />
                      </button>
                    </div>
                    {image.url && (
                      <div className="image-preview-nex4 image-preview">
                        <img src={image.url} alt="Preview" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="form-actions-nex4">
          <button 
            className="save-btn-nex4 add-button"
            onClick={handleSave}
            disabled={isSaving || isUploading}
          >
            <Save className="button-icon" size={18} />
            {isSaving ? 'Saving...' : 'Save Blog'}
          </button>
          
          {!isNewBlog && (
            <button 
              className="delete-btn-nex4 delete-button"
              onClick={handleDelete}
              disabled={isSaving || isUploading}
            >
              <Trash2 className="button-icon" size={18} />
              Delete Blog
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogEdit;