import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from "@react-oauth/google"



createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId='458955325015-7mtnrggb7ehqpeeeticd46p84d337gu7.apps.googleusercontent.com'>
  <StrictMode>
    <App />
  </StrictMode>
  </GoogleOAuthProvider>,
)
