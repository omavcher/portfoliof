import { BrowserRouter } from "react-router-dom";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

const GOOGLE_CLIENT_ID = '273920667679-85i343d6q2eibbc7e597ougsflo7u6c0.apps.googleusercontent.com';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
        </GoogleOAuthProvider>
  </StrictMode>,
)
