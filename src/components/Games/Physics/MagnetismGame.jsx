import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Magnet, Trophy } from 'lucide-react';

const MagnetismGame = () => {
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedTool, setSelectedTool] = useState('compass');
  const [magnetStrength, setMagnetStrength] = useState(5);
  const [showFieldLines, setShowFieldLines] = useState(true);

  // Game objects
  const [magnets, setMagnets] = useState([
    { x: 200, y: 200, strength: 5, polarity: 'N', type: 'bar' },
    { x: 600, y: 200, strength: 5, polarity: 'S', type: 'bar' }
  ]);
  const [compasses, setCompasses] = useState([]);
  const [ironFilings, setIronFilings] = useState([]);

  useEffect(() => {
    // Generate iron filings
    const filings = [];
    for (let i = 0; i < 100; i++) {
      filings.push({
        x: Math.random() * 800,
        y: Math.random() * 400,
        angle: 0
      });
    }
    setIronFilings(filings);
  }, []);

  useEffect(() => {
    if (!isRunning || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw magnetic field lines if enabled
      if (showFieldLines) {
        drawFieldLines(ctx);
      }

      // Draw magnets
      magnets.forEach(magnet => {
        drawMagnet(ctx, magnet);
      });

      // Draw and update iron filings
      ironFilings.forEach(filing => {
        const field = calculateMagneticField(filing.x, filing.y);
        filing.angle = Math.atan2(field.y, field.x);
        drawIronFiling(ctx, filing);
      });

      // Draw compasses
      compasses.forEach(compass => {
        const field = calculateMagneticField(compass.x, compass.y);
        compass.angle = Math.atan2(field.y, field.x);
        drawCompass(ctx, compass);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [isRunning, magnets, showFieldLines, ironFilings, compasses]);

  const calculateMagneticField = (x, y) => {
    let fieldX = 0;
    let fieldY = 0;

    magnets.forEach(magnet => {
      const dx = x - magnet.x;
      const dy = y - magnet.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 10) {
        const strength = magnet.strength * 1000 / (distance * distance);
        const direction = magnet.polarity === 'N' ? 1 : -1;
        fieldX += direction * strength * dx / distance;
        fieldY += direction * strength * dy / distance;
      }
    });

    return { x: fieldX, y: fieldY };
  };

  const drawFieldLines = (ctx) => {
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.lineWidth = 1;

    // Draw field lines from north poles
    magnets.filter(m => m.polarity === 'N').forEach(magnet => {
      for (let angle = 0; angle < 360; angle += 20) {
        const rad = angle * Math.PI / 180;
        let x = magnet.x + Math.cos(rad) * 30;
        let y = magnet.y + Math.sin(rad) * 30;

        ctx.beginPath();
        ctx.moveTo(x, y);

        // Trace field line
        for (let step = 0; step < 100; step++) {
          const field = calculateMagneticField(x, y);
          const fieldMag = Math.sqrt(field.x * field.x + field.y * field.y);
          
          if (fieldMag < 0.1) break;
          
          x += (field.x / fieldMag) * 2;
          y += (field.y / fieldMag) * 2;
          
          if (x < 0 || x > 800 || y < 0 || y > 400) break;
          
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    });
  };

  const drawMagnet = (ctx, magnet) => {
    ctx.save();
    ctx.translate(magnet.x, magnet.y);

    // Draw bar magnet
    const width = 80;
    const height = 20;

    // North pole (red)
    ctx.fillStyle = magnet.polarity === 'N' ? '#ef4444' : '#3b82f6';
    ctx.fillRect(-width/2, -height/2, width/2, height);

    // South pole (blue)
    ctx.fillStyle = magnet.polarity === 'N' ? '#3b82f6' : '#ef4444';
    ctx.fillRect(0, -height/2, width/2, height);

    // Labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('N', -width/4, 5);
    ctx.fillText('S', width/4, 5);

    ctx.restore();
  };

  const drawIronFiling = (ctx, filing) => {
    ctx.save();
    ctx.translate(filing.x, filing.y);
    ctx.rotate(filing.angle);
    
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-3, 0);
    ctx.lineTo(3, 0);
    ctx.stroke();
    
    ctx.restore();
  };

  const drawCompass = (ctx, compass) => {
    ctx.save();
    ctx.translate(compass.x, compass.y);

    // Compass body
    ctx.fillStyle = '#f3f4f6';
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Needle
    ctx.save();
    ctx.rotate(compass.angle);
    
    // North end (red)
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(12, 0);
    ctx.lineTo(8, -3);
    ctx.lineTo(8, 3);
    ctx.fill();

    // South end (blue)
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-12, 0);
    ctx.lineTo(-8, -3);
    ctx.lineTo(-8, 3);
    ctx.fill();

    ctx.restore();
    ctx.restore();
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedTool === 'compass') {
      setCompasses(prev => [...prev, { x, y, angle: 0 }]);
      setScore(prev => prev + 10);
    } else if (selectedTool === 'magnet') {
      setMagnets(prev => [...prev, { 
        x, y, 
        strength: magnetStrength, 
        polarity: 'N', 
        type: 'bar' 
      }]);
      setScore(prev => prev + 20);
    }
  };

  const flipMagnetPolarity = (index) => {
    setMagnets(prev => prev.map((magnet, i) => 
      i === index ? { ...magnet, polarity: magnet.polarity === 'N' ? 'S' : 'N' } : magnet
    ));
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setCompasses([]);
    setMagnets([
      { x: 200, y: 200, strength: 5, polarity: 'N', type: 'bar' },
      { x: 600, y: 200, strength: 5, polarity: 'S', type: 'bar' }
    ]);
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
              Magnetism Explorer
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>
              Discover magnetic fields, poles, and electromagnetic interactions
            </p>
          </div>
          <div className="score-display" style={{ marginLeft: 'auto' }}>
            <Trophy size={16} style={{ marginRight: '0.5rem' }} />
            {score} points
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Theory */}
          <div>
            <h3 style={{ color: 'var(--physics-text)', marginBottom: '1rem', fontSize: '1.25rem' }}>
              Understanding Magnetism
            </h3>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Magnetic Fields:</strong> Invisible force fields that surround magnets. Field lines emerge from the north pole and enter the south pole, forming closed loops.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Magnetic Poles:</strong> Every magnet has two poles - north (N) and south (S). Like poles repel each other, while opposite poles attract.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Field Strength:</strong> Decreases with distance according to the inverse square law: F ∝ 1/r²
              </p>
              <p>
                <strong>Compass Behavior:</strong> A compass needle aligns with magnetic field lines, always pointing from south to north pole of the field.
              </p>
            </div>
          </div>

          {/* Key Concepts */}
          <div>
            <h3 style={{ color: 'var(--physics-text)', marginBottom: '1rem', fontSize: '1.25rem' }}>
              Key Concepts
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: 'var(--physics-bg)', 
                borderRadius: '8px',
                border: '1px solid var(--physics-accent)'
              }}>
                <strong style={{ color: 'var(--physics-text)' }}>Magnetic Force:</strong>
                <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>F = k(m₁m₂)/r²</div>
              </div>
              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: 'var(--physics-bg)', 
                borderRadius: '8px',
                border: '1px solid var(--physics-accent)'
              }}>
                <strong style={{ color: 'var(--physics-text)' }}>Field Lines:</strong>
                <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Density indicates field strength</div>
              </div>
              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: 'var(--physics-bg)', 
                borderRadius: '8px',
                border: '1px solid var(--physics-accent)'
              }}>
                <strong style={{ color: 'var(--physics-text)' }}>Earth's Magnetism:</strong>
                <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Geographic and magnetic poles differ</div>
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
            <Magnet size={20} />
            Interactive Magnetic Field
          </h3>
          
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            onClick={handleCanvasClick}
            className="game-canvas"
            style={{ 
              cursor: selectedTool === 'compass' ? 'crosshair' : 'copy',
              backgroundColor: 'var(--bg-secondary)'
            }}
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
          </div>
        </div>

        {/* Controls Panel */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>
            Tools & Controls
          </h3>
          
          {/* Tool Selection */}
          <div className="form-group">
            <label className="form-label">Select Tool:</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button 
                className={`btn ${selectedTool === 'compass' ? 'primary' : ''}`}
                onClick={() => setSelectedTool('compass')}
              >
                🧭 Compass (+10 pts)
              </button>
              <button 
                className={`btn ${selectedTool === 'magnet' ? 'primary' : ''}`}
                onClick={() => setSelectedTool('magnet')}
              >
                🧲 Magnet (+20 pts)
              </button>
            </div>
          </div>

          {/* Magnet Strength */}
          {selectedTool === 'magnet' && (
            <div className="form-group">
              <label className="form-label">
                Magnet Strength: {magnetStrength}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={magnetStrength}
                onChange={(e) => setMagnetStrength(parseInt(e.target.value))}
                className="slider"
              />
            </div>
          )}

          {/* Field Lines Toggle */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showFieldLines}
                onChange={(e) => setShowFieldLines(e.target.checked)}
              />
              Show Field Lines
            </label>
          </div>

          {/* Magnet Controls */}
          <div className="form-group">
            <label className="form-label">Existing Magnets:</label>
            {magnets.map((magnet, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '0.5rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '6px',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontSize: '0.875rem' }}>
                  Magnet {index + 1} ({magnet.polarity})
                </span>
                <button 
                  className="btn" 
                  onClick={() => flipMagnetPolarity(index)}
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                >
                  Flip
                </button>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            backgroundColor: 'var(--warning-bg)',
            borderRadius: '8px',
            border: '1px solid var(--warning-text)'
          }}>
            <h4 style={{ color: 'var(--warning-text)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              How to Play:
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--warning-text)', opacity: 0.9, lineHeight: 1.4 }}>
              • Click to place compasses or magnets<br/>
              • Watch how field lines guide compass needles<br/>
              • Flip magnet poles to see field changes<br/>
              • Observe attraction and repulsion forces
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagnetismGame;