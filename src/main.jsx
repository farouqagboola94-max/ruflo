import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Admin from './pages/Admin.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    {window.location.pathname === '/admin' ? <Admin /> : <App />}
  </React.StrictMode>,
)
