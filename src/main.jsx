import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary';
import App from './App.jsx'
import './api/client'; 
import './general.css'
import './variables.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
  <ErrorBoundary>
    <BrowserRouter>
      <App />
    </BrowserRouter>  
  </ErrorBoundary>
  </>
)
