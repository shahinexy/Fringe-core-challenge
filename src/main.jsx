import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App, { generateRandomColor } from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="flex items-center justify-center">
    <App 
    color={generateRandomColor()}
    dimensions={{ width: window.innerWidth, height: window.innerHeight }}
    removeBox={() => {}}
    />
    </div>

  </StrictMode>,
)
