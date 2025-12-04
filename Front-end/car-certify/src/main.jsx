import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Modal from "react-modal";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'; 
import { GoogleOAuthProvider } from '@react-oauth/google';


Modal.setAppElement("#root");

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId='953984823576-26egdkt3dhg3ic7f93289tjj9g1ms2f0.apps.googleusercontent.com'> 
  <StrictMode>
    <App />
  </StrictMode>
  </GoogleOAuthProvider>

)
