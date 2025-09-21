import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout/Layout';
import MouseTrail from './components/Common/MouseTrail';

// Import Pages
import Dashboard from './pages/Dashboard';
import Physics from './pages/Physics';
import Chemistry from './pages/Chemistry';
import Math from './pages/Math';
import Biology from './pages/Biology';
import Analytics from './pages/Analytics';
import Videos from './pages/Videos';

// Import Styles - MOBILE CSS FIRST!
import './styles/mobile.css';  // 👈 MOBILE FIXES FIRST
import './styles/globals.css'; // 👈 THEN REGULAR CSS

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          {/* Only show mouse trail on desktop */}
          {window.innerWidth > 768 && <MouseTrail />}
          <Layout>
            <Routes>
              {/* Main Pages */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/physics" element={<Physics />} />
              <Route path="/physics/:gameId" element={<Physics />} />
              <Route path="/chemistry" element={<Chemistry />} />
              <Route path="/chemistry/:gameId" element={<Chemistry />} />
              <Route path="/math" element={<Math />} />
              <Route path="/math/:gameId" element={<Math />} />
              <Route path="/biology" element={<Biology />} />
              <Route path="/biology/:gameId" element={<Biology />} />
              <Route path="/analytics" element={<Analytics />} />

              {/* Videos Section */}
              <Route path="/videos" element={<Videos />} />
              <Route path="/videos/:subject" element={<Videos />} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;