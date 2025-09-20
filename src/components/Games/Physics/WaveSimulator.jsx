import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Waves, Trophy } from 'lucide-react';

const WaveSimulator = () => {
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  
  // Wave parameters
  const [frequency, setFrequency] = useState(1);
  const [amplitude, setAmplitude] = useState(50);
  const [waveSpeed, setWaveSpeed] = useState(2);
  const [waveType, setWaveType] = useState('sine');
  const [showInterference, setShowInterference] = useState(false);
  
  // Second wave for interference
  const [frequency2, setFrequency2] = useState(1.5);
  const [amplitude2, setAmplitude2] = useState(30);

  useEffect(() => {
    if (!isRunning || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      drawGrid(ctx);
      
      // Draw wave(s)
      if (showInterference) {
        drawInterferenceWaves(ctx);
      } else {
        drawSingleWave(ctx);
      }
      
      // Draw wave properties info
      drawWaveInfo(ctx);
      
      setTime(prev => prev + 0.1);
      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [isRunning, frequency, amplitude, waveSpeed, waveType, showInterference, frequency2, amplitude2]);

  const drawGrid = (ctx) => {
    ctx.strokeStyle = 'rgba(107, 114, 128, 0.2)';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x < 800; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 400);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y < 400; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(800, y);
      ctx.stroke();
    }
    
    // Center line (equilibrium)
    ctx.strokeStyle = 'rgba(107, 114, 128, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 200);
    ctx.lineTo(800, 200);
    ctx.stroke();
  };

  const drawSingleWave = (ctx) => {
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();

    const wavelength = (waveSpeed / frequency) * 40; // Scale for visualization
    
    for (let x = 0; x < 800; x += 2) {
      let y = 200; // Start at center
      
      if (waveType === 'sine') {
        y += amplitude * Math.sin((2 * Math.PI * x / wavelength) - (time * frequency * 0.5));
      } else if (waveType === 'square') {
        const sineValue = Math.sin((2 * Math.PI * x / wavelength) - (time * frequency * 0.5));
        y += amplitude * Math.sign(sineValue);
      } else if (waveType === 'triangle') {
        const phase = ((2 * Math.PI * x / wavelength) - (time * frequency * 0.5)) % (2 * Math.PI);
        if (phase < Math.PI) {
          y += amplitude * (2 * phase / Math.PI - 1);
        } else {
          y += amplitude * (3 - 2 * phase / Math.PI);
        }
      }
      
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    
    ctx.stroke();
    
    // Highlight wave properties
    drawWaveMarkers(ctx, wavelength);
  };

  const drawInterferenceWaves = (ctx) => {
    const wavelength1 = (waveSpeed / frequency) * 40;
    const wavelength2 = (waveSpeed / frequency2) * 40;
    
    // Draw individual waves
    ctx.globalAlpha = 0.3;
    
    // Wave 1
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < 800; x += 2) {
      const y = 200 + amplitude * Math.sin((2 * Math.PI * x / wavelength1) - (time * frequency * 0.5));
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Wave 2
    ctx.strokeStyle = '#ef4444';
    ctx.beginPath();
    for (let x = 0; x < 800; x += 2) {
      const y = 200 + amplitude2 * Math.sin((2 * Math.PI * x / wavelength2) - (time * frequency2 * 0.5));
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Combined wave
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    for (let x = 0; x < 800; x += 2) {
      const y1 = amplitude * Math.sin((2 * Math.PI * x / wavelength1) - (time * frequency * 0.5));
      const y2 = amplitude2 * Math.sin((2 * Math.PI * x / wavelength2) - (time * frequency2 * 0.5));
      const y = 200 + y1 + y2;
      
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  const drawWaveMarkers = (ctx, wavelength) => {
    // Mark wavelength
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    const startX = 100;
    ctx.beginPath();
    ctx.moveTo(startX, 350);
    ctx.lineTo(startX + wavelength, 350);
    ctx.stroke();
    
    // Wavelength label
    ctx.fillStyle = '#f59e0b';
    ctx.font = '14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('λ = ' + wavelength.toFixed(1) + 'px', startX + wavelength/2, 370);
    
    // Mark amplitude
    ctx.beginPath();
    ctx.moveTo(50, 200);
    ctx.lineTo(50, 200 - amplitude);
    ctx.stroke();
    
    ctx.fillText('A = ' + amplitude, 50, 180);
    
    ctx.setLineDash([]);
  };

  const drawWaveInfo = (ctx) => {
    ctx.fillStyle = 'var(--text-primary)';
    ctx.font = '14px Inter';
    ctx.textAlign = 'left';
    
    const info = [
      `Frequency: ${frequency} Hz`,
      `Period: ${(1/frequency).toFixed(2)} s`,
      `Wavelength: ${((waveSpeed / frequency) * 40).toFixed(1)} px`,
      `Wave Speed: ${waveSpeed} units/s`
    ];
    
    info.forEach((text, index) => {
      ctx.fillText(text, 10, 20 + index * 20);
    });
  };

  const calculateWaveProperties = () => {
    const wavelength = waveSpeed / frequency;
    const period = 1 / frequency;
    return { wavelength, period };
  };

  const checkWaveEquation = () => {
    const { wavelength, period } = calculateWaveProperties();
    const calculatedSpeed = wavelength / period;
    
    if (Math.abs(calculatedSpeed - waveSpeed) < 0.1) {
      setScore(prev => prev + 50);
      alert('Correct! v = λ/T = λf ✓');
    } else {
      alert(`Wave equation: v = λf\nCalculated: ${calculatedSpeed.toFixed(2)}\nActual: ${waveSpeed}`);
    }
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setTime(0);
    setScore(0);
  };

  return (
    <div className="fade-in">
      {/* Theory Section */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <Link to="/physics" className="btn" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              Wave Properties Simulator
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>
              Explore frequency, amplitude, wavelength, and wave interference
            </p>
          </div>
          <div className="score-display" style={{ marginLeft: 'auto' }}>
            <Trophy size={16} style={{ marginRight: '0.5rem' }} />
            {score} points
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h3 style={{ color: 'var(--physics-text)', marginBottom: '1rem', fontSize: '1.25rem' }}>
              Wave Theory
            </h3>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Wave Motion:</strong> Waves are disturbances that transfer energy without transferring matter. They have characteristic properties that define their behavior.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Amplitude (A):</strong> Maximum displacement from equilibrium. Determines the energy and intensity of the wave.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Frequency (f):</strong> Number of complete cycles per second (Hz). Higher frequency means more cycles and higher pitch in sound waves.
              </p>
              <p>
                <strong>Wavelength (λ):</strong> Distance between two consecutive peaks or troughs. Inversely related to frequency.
              </p>
            </div>
          </div>

          <div>
            <h3 style={{ color: 'var(--physics-text)', marginBottom: '1rem', fontSize: '1.25rem' }}>
              Wave Equations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: 'var(--physics-bg)', 
                borderRadius: '8px',
                border: '1px solid var(--physics-accent)'
              }}>
                <strong style={{ color: 'var(--physics-text)' }}>Wave Speed:</strong>
                <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>v = fλ = λ/T</div>
              </div>
              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: 'var(--physics-bg)', 
                borderRadius: '8px',
                border: '1px solid var(--physics-accent)'
              }}>
                <strong style={{ color: 'var(--physics-text)' }}>Period:</strong>
                <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>T = 1/f</div>
              </div>
              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: 'var(--physics-bg)', 
                borderRadius: '8px',
                border: '1px solid var(--physics-accent)'
              }}>
                <strong style={{ color: 'var(--physics-text)' }}>Wave Function:</strong>
                <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>y = A sin(2πft - kx)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Interface */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        {/* Game Canvas */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Waves size={20} />
            Wave Visualization
          </h3>
          
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="game-canvas"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          />
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
            <button 
              className={`btn ${isRunning ? 'danger' : 'primary'}`}
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
              {isRunning ? 'Pause' : 'Start'}
            </button>
            
            <button className="btn" onClick={resetSimulation}>
              <RotateCcw size={20} />
              Reset
            </button>
            
            <button className="btn success" onClick={checkWaveEquation}>
              Check v = λf
            </button>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>
            Wave Controls
          </h3>
          
          {/* Wave Type */}
          <div className="form-group">
            <label className="form-label">Wave Type:</label>
            <select 
              value={waveType} 
              onChange={(e) => setWaveType(e.target.value)}
              className="form-input"
            >
              <option value="sine">Sine Wave</option>
              <option value="square">Square Wave</option>
              <option value="triangle">Triangle Wave</option>
            </select>
          </div>

          {/* Frequency */}
          <div className="form-group">
            <label className="form-label">
              Frequency: {frequency} Hz
            </label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={frequency}
              onChange={(e) => setFrequency(parseFloat(e.target.value))}
              className="slider"
            />
          </div>

          {/* Amplitude */}
          <div className="form-group">
            <label className="form-label">
              Amplitude: {amplitude}
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={amplitude}
              onChange={(e) => setAmplitude(parseInt(e.target.value))}
              className="slider"
            />
          </div>

          {/* Wave Speed */}
          <div className="form-group">
            <label className="form-label">
              Wave Speed: {waveSpeed}
            </label>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.1"
              value={waveSpeed}
              onChange={(e) => setWaveSpeed(parseFloat(e.target.value))}
              className="slider"
            />
          </div>

          {/* Interference Toggle */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showInterference}
                onChange={(e) => setShowInterference(e.target.checked)}
              />
              Show Wave Interference
            </label>
          </div>

          {/* Second Wave Controls (if interference is on) */}
          {showInterference && (
            <>
              <div className="form-group">
                <label className="form-label">
                  Wave 2 Frequency: {frequency2} Hz
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={frequency2}
                  onChange={(e) => setFrequency2(parseFloat(e.target.value))}
                  className="slider"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Wave 2 Amplitude: {amplitude2}
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={amplitude2}
                  onChange={(e) => setAmplitude2(parseInt(e.target.value))}
                  className="slider"
                />
              </div>
            </>
          )}

          {/* Wave Properties Display */}
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            backgroundColor: 'var(--physics-bg)',
            borderRadius: '8px',
            border: '1px solid var(--physics-accent)'
          }}>
            <h4 style={{ color: 'var(--physics-text)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Calculated Properties:
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--physics-text)', lineHeight: 1.4 }}>
              <div>Period: {(1/frequency).toFixed(2)} s</div>
              <div>Wavelength: {((waveSpeed / frequency) * 40).toFixed(1)} px</div>
              <div>Speed: {(frequency * (waveSpeed / frequency) * 40).toFixed(1)} px/s</div>
            </div>
          </div>

          {/* Instructions */}
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            backgroundColor: 'var(--warning-bg)',
            borderRadius: '8px',
            border: '1px solid var(--warning-text)'
          }}>
            <h4 style={{ color: 'var(--warning-text)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Explore:
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--warning-text)', opacity: 0.9, lineHeight: 1.4 }}>
              • Adjust frequency and see wavelength change<br/>
              • Test wave equation v = fλ<br/>
              • Enable interference to see wave superposition<br/>
              • Try different wave shapes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaveSimulator;