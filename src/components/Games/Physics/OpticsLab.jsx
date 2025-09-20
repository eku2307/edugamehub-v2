import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, RotateCcw, ArrowLeft, Eye, Lightbulb } from 'lucide-react';

const OpticsLab = () => {
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  
  // Optics parameters
  const [lightIntensity, setLightIntensity] = useState(50);
  const [prismAngle, setPrismAngle] = useState(60);
  const [lensType, setLensType] = useState('convex');
  const [refractiveIndex, setRefractiveIndex] = useState(1.5);
  
  // Light ray settings
  const [lightRays, setLightRays] = useState([]);
  const [showSpectrum, setShowSpectrum] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const drawOpticalSetup = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw light source
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = lightIntensity / 2;
      ctx.beginPath();
      ctx.arc(50, 200, 15, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Draw optical element (prism/lens)
      if (lensType === 'prism') {
        drawPrism(ctx, 300, 200);
      } else {
        drawLens(ctx, 300, 200);
      }
      
      // Draw light rays
      if (isRunning) {
        drawLightRays(ctx);
      }
      
      // Draw screen
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(600, 100, 20, 200);
      
      if (showSpectrum && lensType === 'prism') {
        drawSpectrum(ctx, 650, 150);
      }
    };
    
    const drawPrism = (ctx, x, y) => {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 50, y + 30);
      ctx.lineTo(x + 50, y + 30);
      ctx.lineTo(x, y - 50);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };
    
    const drawLens = (ctx, x, y) => {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      if (lensType === 'convex') {
        ctx.arc(x - 25, y, 50, -Math.PI/3, Math.PI/3);
        ctx.arc(x + 25, y, 50, 2*Math.PI/3, 4*Math.PI/3);
      } else {
        ctx.arc(x + 25, y, 50, Math.PI/3, -Math.PI/3, true);
        ctx.arc(x - 25, y, 50, -2*Math.PI/3, -4*Math.PI/3, true);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };
    
    const drawLightRays = (ctx) => {
      const colors = showSpectrum && lensType === 'prism' 
        ? ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#6366f1', '#8b5cf6']
        : ['#ffffff'];
      
      colors.forEach((color, i) => {
        ctx.strokeStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 5;
        ctx.lineWidth = 2;
        
        // Incident ray
        ctx.beginPath();
        ctx.moveTo(70, 200 + i * 2);
        ctx.lineTo(250, 200 + i * 2);
        ctx.stroke();
        
        // Refracted ray (simplified physics)
        const deviation = lensType === 'prism' 
          ? (i - 3) * 10 + prismAngle / 3
          : lensType === 'convex' ? -10 : 10;
        
        ctx.beginPath();
        ctx.moveTo(350, 200);
        ctx.lineTo(600, 200 + deviation + i * 3);
        ctx.stroke();
      });
      ctx.shadowBlur = 0;
    };
    
    const drawSpectrum = (ctx, x, y) => {
      const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#6366f1', '#8b5cf6'];
      colors.forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.fillRect(x, y + i * 15, 30, 10);
      });
    };
    
    drawOpticalSetup();
  }, [isRunning, lightIntensity, prismAngle, lensType, refractiveIndex, showSpectrum]);

  const startSimulation = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      setScore(score + 10);
    }
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setShowSpectrum(false);
  };

  const toggleSpectrum = () => {
    setShowSpectrum(!showSpectrum);
    if (!showSpectrum) {
      setScore(score + 25);
    }
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/physics" className="btn" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              Optics Lab
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>
              Explore light refraction, reflection, and dispersion with interactive optical elements
            </p>
          </div>
        </div>
        
        <div className="card" style={{ 
          padding: '1rem 1.5rem', 
          background: 'var(--physics-bg)', 
          border: '1px solid var(--physics-accent)',
          minWidth: '120px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Eye size={16} style={{ color: 'var(--physics-text)' }} />
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--physics-text)' }}>
              {score}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--physics-text)', opacity: 0.8 }}>
            Level {level}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        {/* Simulation Canvas */}
        <div className="card">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="game-canvas"
            style={{ 
              width: '100%', 
              height: 'auto',
              backgroundColor: 'var(--bg-secondary)'
            }}
          />
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
            <button 
              className={`btn ${isRunning ? 'danger' : 'primary'}`}
              onClick={startSimulation}
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
              {isRunning ? 'Stop' : 'Start'}
            </button>
            
            <button 
              className="btn" 
              onClick={resetSimulation}
            >
              <RotateCcw size={20} />
              Reset
            </button>
            
            <button 
              className={`btn ${showSpectrum ? 'success' : ''}`}
              onClick={toggleSpectrum}
              disabled={lensType !== 'prism'}
            >
              <Lightbulb size={20} />
              Spectrum
            </button>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="card">
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '700', 
            color: 'var(--text-primary)',
            marginBottom: '1.5rem'
          }}>
            Optical Controls
          </h3>
          
          <div className="form-group">
            <label className="form-label">
              Optical Element
            </label>
            <select
              value={lensType}
              onChange={(e) => setLensType(e.target.value)}
              className="form-select"
              disabled={isRunning}
            >
              <option value="convex">Convex Lens</option>
              <option value="concave">Concave Lens</option>
              <option value="prism">Triangular Prism</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Light Intensity: {lightIntensity}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={lightIntensity}
              onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
              className="slider"
            />
          </div>

          {lensType === 'prism' && (
            <div className="form-group">
              <label className="form-label">
                Prism Angle: {prismAngle}°
              </label>
              <input
                type="range"
                min="30"
                max="90"
                step="5"
                value={prismAngle}
                onChange={(e) => setPrismAngle(parseFloat(e.target.value))}
                className="slider"
                disabled={isRunning}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              Refractive Index: {refractiveIndex}
            </label>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.1"
              value={refractiveIndex}
              onChange={(e) => setRefractiveIndex(parseFloat(e.target.value))}
              className="slider"
              disabled={isRunning}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Glass: ~1.5, Diamond: ~2.4
            </div>
          </div>

          {/* Physics Concepts */}
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px',
            fontSize: '0.875rem'
          }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Snell's Law:
            </h4>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              <div>n₁ sin(θ₁) = n₂ sin(θ₂)</div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', opacity: 0.8 }}>
                Where n = refractive index, θ = angle of incidence/refraction
              </div>
            </div>
          </div>

          {/* Learning Tips */}
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            backgroundColor: 'var(--physics-bg)',
            borderRadius: '8px',
            border: '1px solid var(--physics-accent)'
          }}>
            <h4 style={{ color: 'var(--physics-text)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Key Concepts:
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--physics-text)', lineHeight: 1.4 }}>
              • Convex lenses converge light rays<br/>
              • Concave lenses diverge light rays<br/>
              • Prisms disperse white light into spectrum<br/>
              • Higher refractive index = more bending
            </div>
          </div>
        </div>
      </div>

      {/* Video Tutorial Section */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '700', 
          color: 'var(--text-primary)',
          marginBottom: '1rem'
        }}>
          Learn More: Optics and Light Physics
        </h3>
        <div className="video-container" style={{ position: 'relative', aspectRatio: '16/9' }}>
          <video 
            className="video-player"
            controls
            poster="/videos/optics-poster.jpg"
            style={{ 
              width: '100%', 
              height: '100%',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-secondary)'
            }}
          >
            <source src="/videos/optics-tutorial.mp4" type="video/mp4" />
            <source src="/videos/optics-tutorial.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default OpticsLab;