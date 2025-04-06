// Admin/AdminLogin.js
import React, { useState } from 'react';
import '../style/AdminLogin.css';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = onLogin(password);
    if (!success) {
      setError('Incorrect password');
    }
  };

  return (
    <div className="container-inn97">
      <div className="login-card-inn97">
        <div className="header-inn97">
          <h2 className="title-inn97">Admin Portal</h2>
          <div className="divider-inn97"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="form-inn97">
          <div className={`input-group-inn97 ${isFocused ? 'focused-inn97' : ''}`}>
            <input
              type="password"
              id="password-inn97"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              required
              className="input-inn97"
              placeholder=" "
            />
            <label htmlFor="password-inn97" className="label-inn97">Enter Secret Key</label>
            <div className="underline-inn97"></div>
          </div>
          
          {error && <p className="error-message-inn97">{error}</p>}
          
          <button type="submit" className="submit-btn-inn97">
            <span>Authenticate</span>
            <div className="arrow-inn97">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"/>
              </svg>
            </div>
          </button>
        </form>
        
        <div className="footer-note-inn97">
          <p>Restricted access. Unauthorized entry prohibited.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;