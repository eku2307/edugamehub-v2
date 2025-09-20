import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Trophy, RotateCcw, Eye, EyeOff } from 'lucide-react';

// Changed from GraphingCalculator to GraphingCalculator (already correct)
const GraphingCalculator = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [functions, setFunctions] = useState([
    { id: 1, equation: 'x^2', color: '#3b82f6', visible: true },
    { id: 2, equation: 'sin(x)', color: '#ef4444', visible: false },
    { id: 3, equation: 'cos(x)', color: '#10b981', visible: false }
  ]);
  const [newFunction, setNewFunction] = useState('');
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [showGrid, setShowGrid] = useState(true);

  useEffect(() => {
    drawGraph();
  }, [functions, zoom, panX, panY, showGrid]);

  const drawGraph = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Calculate scale
    const scale = 20 * zoom;
    const centerX = width / 2 + panX;
    const centerY = height / 2 + panY;

    // Draw grid
    if (showGrid) {
      drawGrid(ctx, width, height, scale, centerX, centerY);
    }

    // Draw axes
    drawAxes(ctx, width, height, centerX, centerY);

    // Draw functions
    functions.forEach(func => {
      if (func.visible) {
        drawFunction(ctx, func, width, height, scale, centerX, centerY);
      }
    });

    // Draw axis labels
    drawLabels(ctx, width, height, scale, centerX, centerY);
  };

  const drawGrid = (ctx, width, height, scale, centerX, centerY) => {
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = centerX % scale; x < width; x += scale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = centerY % scale; y < height; y += scale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawAxes = (ctx, width, height, centerX, centerY) => {
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;

    // X-axis
    if (centerY >= 0 && centerY <= height) {
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Arrow
      ctx.beginPath();
      ctx.moveTo(width - 10, centerY - 5);
      ctx.lineTo(width, centerY);
      ctx.lineTo(width - 10, centerY + 5);
      ctx.stroke();
    }

    // Y-axis
    if (centerX >= 0 && centerX <= width) {
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.stroke();

      // Arrow
      ctx.beginPath();
      ctx.moveTo(centerX - 5, 10);
      ctx.lineTo(centerX, 0);
      ctx.lineTo(centerX + 5, 10);
      ctx.stroke();
    }
  };

  const drawLabels = (ctx, width, height, scale, centerX, centerY) => {
    ctx.fillStyle = '#374151';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';

    // X-axis labels
    if (centerY >= 0 && centerY <= height) {
      for (let x = centerX % scale; x < width; x += scale) {
        const value = Math.round((x - centerX) / scale);
        if (value !== 0) {
          ctx.fillText(value.toString(), x, centerY + 15);
        }
      }
    }

    // Y-axis labels
    if (centerX >= 0 && centerX <= width) {
      ctx.textAlign = 'right';
      for (let y = centerY % scale; y < height; y += scale) {
        const value = Math.round((centerY - y) / scale);
        if (value !== 0) {
          ctx.fillText(value.toString(), centerX - 5, y + 4);
        }
      }
    }

    // Origin
    if (centerX >= 0 && centerX <= width && centerY >= 0 && centerY <= height) {
      ctx.textAlign = 'right';
      ctx.fillText('0', centerX - 5, centerY - 5);
    }
  };

  const drawFunction = (ctx, func, width, height, scale, centerX, centerY) => {
    ctx.strokeStyle = func.color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    let started = false;
    for (let px = 0; px < width; px += 2) {
      const x = (px - centerX) / scale;
      const y = evaluateFunction(func.equation, x);

      if (y !== null && !isNaN(y) && isFinite(y)) {
        const py = centerY - y * scale;
        
        if (py >= -50 && py <= height + 50) { // Extended bounds
          if (!started) {
            ctx.moveTo(px, py);
            started = true;
          } else {
            ctx.lineTo(px, py);
          }
        } else {
          started = false;
        }
      } else {
        started = false;
      }
    }
    ctx.stroke();
  };

  const evaluateFunction = (equation, x) => {
    try {
      // Replace mathematical functions and constants
      let expr = equation.toLowerCase()
        .replace(/\^/g, '**')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/ln/g, 'Math.log')
        .replace(/log/g, 'Math.log10')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/abs/g, 'Math.abs')
        .replace(/pi/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/x/g, `(${x})`);

      return eval(expr);
    } catch (error) {
      return null;
    }
  };

  const addFunction = () => {
    if (newFunction.trim()) {
      const colors = ['#8b5cf6', '#f59e0b', '#06b6d4', '#ec4899', '#84cc16'];
      const newId = Math.max(...functions.map(f => f.id), 0) + 1;
      
      setFunctions(prev => [...prev, {
        id: newId,
        equation: newFunction.trim(),
        color: colors[newId % colors.length],
        visible: true
      }]);
      
      setNewFunction('');
      setScore(prev => prev + 10);
    }
  };

  const toggleFunction = (id) => {
    setFunctions(prev => prev.map(func => 
      func.id === id ? { ...func, visible: !func.visible } : func
    ));
  };

  const removeFunction = (id) => {
    setFunctions(prev => prev.filter(func => func.id !== id));
  };

  const resetView = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  const presetFunctions = [
    'x^2', '2*x + 1', 'sin(x)', 'cos(x)', 'tan(x)', 
    'x^3', 'sqrt(x)', '1/x', 'abs(x)', 'ln(x)'
  ];

  return (
    <div className="fade-in">
      {/* Theory Section */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <Link to="/math" className="btn" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              Interactive Graphing Calculator
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>
              Plot functions, explore transformations, and analyze mathematical relationships
            </p>
          </div>
          <div className="score-display" style={{ marginLeft: 'auto' }}>
            <Trophy size={16} style={{ marginRight: '0.5rem' }} />
            {score} points
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h3 style={{ color: 'var(--math-text)', marginBottom: '1rem', fontSize: '1.25rem' }}>
              Function Analysis
            </h3>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Functions:</strong> Mathematical relationships between input (x) and output (y) values. 
                Each x-value corresponds to exactly one y-value.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Domain:</strong> All possible x-values for which the function is defined.
              </p>
              <p>
                <strong>Range:</strong> All possible y-values that the function can output.
              </p>
            </div>
          </div>

          <div>
            <h3 style={{ color: 'var(--math-text)', marginBottom: '1rem', fontSize: '1.25rem' }}>
              Function Types
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: 'var(--math-bg)', 
                borderRadius: '8px',
                border: '1px solid var(--math-accent)'
              }}>
                <strong style={{ color: 'var(--math-text)' }}>Linear:</strong>
                <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>f(x) = mx + b (straight line)</div>
              </div>
              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: 'var(--math-bg)', 
                borderRadius: '8px',
                border: '1px solid var(--math-accent)'
              }}>
                <strong style={{ color: 'var(--math-text)' }}>Quadratic:</strong>
                <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>f(x) = ax² + bx + c (parabola)</div>
              </div>
              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: 'var(--math-bg)', 
                borderRadius: '8px',
                border: '1px solid var(--math-accent)'
              }}>
                <strong style={{ color: 'var(--math-text)' }}>Trigonometric:</strong>
                <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>sin(x), cos(x), tan(x) (periodic)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Interface */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={20} />
          Graphing Calculator
        </h3>
        
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="game-canvas"
          style={{ backgroundColor: 'var(--bg-secondary)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}
        />

        {/* Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Function Management */}
          <div>
            <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Manage Functions:</h4>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={newFunction}
                onChange={(e) => setNewFunction(e.target.value)}
                placeholder="Enter function (e.g., x^2)"
                className="form-input"
                style={{ flex: 1 }}
              />
              <button className="btn primary" onClick={addFunction}>
                Add
              </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h5 style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Quick Functions:</h5>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {presetFunctions.map((func, index) => (
                  <button
                    key={index}
                    className="btn"
                    onClick={() => {
                      setNewFunction(func);
                      addFunction();
                    }}
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                  >
                    {func}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h5 style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Active Functions:</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {functions.map(func => (
                  <div key={func.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    padding: '0.5rem',
                    backgroundColor: 'var(--math-bg)',
                    borderRadius: '6px',
                    border: `1px solid ${func.color}`
                  }}>
                    <button
                      onClick={() => toggleFunction(func.id)}
                      style={{ color: func.visible ? func.color : '#6b7280' }}
                    >
                      {func.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <span style={{ 
                      flex: 1, 
                      color: func.visible ? 'var(--text-primary)' : '#6b7280',
                      textDecoration: func.visible ? 'none' : 'line-through'
                    }}>
                      f(x) = {func.equation}
                    </span>
                    <button
                      onClick={() => removeFunction(func.id)}
                      style={{ color: '#ef4444' }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* View Controls */}
          <div>
            <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>View Controls:</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  Zoom: {zoom.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="form-range"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  Pan X: {panX}
                </label>
                <input
                  type="range"
                  min="-300"
                  max="300"
                  step="10"
                  value={panX}
                  onChange={(e) => setPanX(parseInt(e.target.value))}
                  className="form-range"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  Pan Y: {panY}
                </label>
                <input
                  type="range"
                  min="-200"
                  max="200"
                  step="10"
                  value={panY}
                  onChange={(e) => setPanY(parseInt(e.target.value))}
                  className="form-range"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="showGrid"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                />
                <label htmlFor="showGrid" style={{ color: 'var(--text-secondary)' }}>
                  Show Grid
                </label>
              </div>

              <button className="btn" onClick={resetView}>
                <RotateCcw size={16} style={{ marginRight: '0.5rem' }} />
                Reset View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphingCalculator;