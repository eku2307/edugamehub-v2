import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, RotateCcw, ArrowLeft, TrendingUp, Zap } from 'lucide-react';

const CalculusVisualizer = () => {
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  
  // Calculus visualization state
  const [selectedFunction, setSelectedFunction] = useState('quadratic');
  const [showDerivative, setShowDerivative] = useState(false);
  const [showIntegral, setShowIntegral] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(50);
  const [xValue, setXValue] = useState(0);
  const [integrationBounds, setIntegrationBounds] = useState([-2, 2]);
  
  // Function parameters
  const [functionParams, setFunctionParams] = useState({
    a: 1,
    b: 0,
    c: 0,
    d: 0
  });
  
  // Analysis data
  const [analysisData, setAnalysisData] = useState({
    slope: 0,
    area: 0,
    criticalPoints: [],
    inflectionPoints: []
  });

  const functions = {
    linear: {
      name: 'Linear: f(x) = ax + b',
      func: (x, params) => params.a * x + params.b,
      derivative: (x, params) => params.a,
      integral: (x, params) => (params.a * x * x) / 2 + params.b * x,
      color: '#3b82f6',
      derivativeColor: '#ec4899',
      defaultParams: { a: 2, b: 1, c: 0, d: 0 }
    },
    quadratic: {
      name: 'Quadratic: f(x) = ax² + bx + c',
      func: (x, params) => params.a * x * x + params.b * x + params.c,
      derivative: (x, params) => 2 * params.a * x + params.b,
      integral: (x, params) => (params.a * x * x * x) / 3 + (params.b * x * x) / 2 + params.c * x,
      color: '#10b981',
      derivativeColor: '#f59e0b',
      defaultParams: { a: 1, b: -2, c: 1, d: 0 }
    },
    cubic: {
      name: 'Cubic: f(x) = ax³ + bx² + cx + d',
      func: (x, params) => params.a * x * x * x + params.b * x * x + params.c * x + params.d,
      derivative: (x, params) => 3 * params.a * x * x + 2 * params.b * x + params.c,
      integral: (x, params) => (params.a * x * x * x * x) / 4 + (params.b * x * x * x) / 3 + (params.c * x * x) / 2 + params.d * x,
      color: '#8b5cf6',
      derivativeColor: '#ef4444',
      defaultParams: { a: 0.1, b: 0, c: -1, d: 0 }
    },
    sine: {
      name: 'Trigonometric: f(x) = a·sin(bx) + c',
      func: (x, params) => params.a * Math.sin(params.b * x) + params.c,
      derivative: (x, params) => params.a * params.b * Math.cos(params.b * x),
      integral: (x, params) => -(params.a / params.b) * Math.cos(params.b * x) + params.c * x,
      color: '#f59e0b',
      derivativeColor: '#06b6d4',
      defaultParams: { a: 2, b: 1, c: 0, d: 0 }
    },
    exponential: {
      name: 'Exponential: f(x) = a·e^(bx) + c',
      func: (x, params) => params.a * Math.exp(params.b * x) + params.c,
      derivative: (x, params) => params.a * params.b * Math.exp(params.b * x),
      integral: (x, params) => (params.a / params.b) * Math.exp(params.b * x) + params.c * x,
      color: '#dc2626',
      derivativeColor: '#16a34a',
      defaultParams: { a: 1, b: 0.5, c: 0, d: 0 }
    }
  };

  useEffect(() => {
    // Set default parameters when function changes
    setFunctionParams(functions[selectedFunction].defaultParams);
    setShowDerivative(false);
    setShowIntegral(false);
  }, [selectedFunction]);

  useEffect(() => {
    // Update analysis data
    const currentFunc = functions[selectedFunction];
    const slope = currentFunc.derivative(xValue, functionParams);
    const area = calculateDefiniteIntegral();
    
    setAnalysisData({
      slope,
      area,
      criticalPoints: findCriticalPoints(),
      inflectionPoints: findInflectionPoints()
    });
  }, [selectedFunction, functionParams, xValue, integrationBounds]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const drawCalculusVisualization = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw coordinate system
      drawCoordinateSystem(ctx);
      
      // Draw main function
      drawFunction(ctx);
      
      // Draw derivative if enabled
      if (showDerivative) {
        drawDerivative(ctx);
      }
      
      // Draw integral if enabled
      if (showIntegral) {
        drawIntegral(ctx);
      }
      
      // Draw analysis points
      drawAnalysisPoints(ctx);
      
      // Draw tangent line at current x
      if (showDerivative) {
        drawTangentLine(ctx);
      }
      
      // Animation effects
      if (isRunning) {
        drawAnimationEffects(ctx);
      }
    };
    
    const drawCoordinateSystem = (ctx) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = 40;
      
      // Grid
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.1)';
      ctx.lineWidth = 1;
      
      // Vertical lines
      for (let x = centerX % scale; x < canvas.width; x += scale) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = centerY % scale; y < canvas.height; y += scale) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Axes
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 2;
      
      // X-axis
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(canvas.width, centerY);
      ctx.stroke();
      
      // Y-axis
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, canvas.height);
      ctx.stroke();
      
      // Axis labels
      ctx.fillStyle = '#374151';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      
      // X-axis numbers
      for (let i = -10; i <= 10; i++) {
        if (i !== 0) {
          const x = centerX + i * scale;
          if (x > 0 && x < canvas.width) {
            ctx.fillText(i.toString(), x, centerY + 20);
          }
        }
      }
      
      // Y-axis numbers
      ctx.textAlign = 'right';
      for (let i = -6; i <= 6; i++) {
        if (i !== 0) {
          const y = centerY - i * scale;
          if (y > 0 && y < canvas.height) {
            ctx.fillText(i.toString(), centerX - 10, y + 5);
          }
        }
      }
      
      // Origin
      ctx.textAlign = 'right';
      ctx.fillText('0', centerX - 10, centerY + 15);
    };
    
    const drawFunction = (ctx) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = 40;
      const currentFunc = functions[selectedFunction];
      
      ctx.strokeStyle = currentFunc.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      let firstPoint = true;
      for (let pixelX = 0; pixelX < canvas.width; pixelX += 2) {
        const x = (pixelX - centerX) / scale;
        const y = currentFunc.func(x, functionParams);
        const pixelY = centerY - y * scale;
        
        // Skip if y is too large or NaN
        if (isNaN(y) || Math.abs(y) > 20) continue;
        
        if (firstPoint) {
          ctx.moveTo(pixelX, pixelY);
          firstPoint = false;
        } else {
          ctx.lineTo(pixelX, pixelY);
        }
      }
      ctx.stroke();
      
      // Function label
      ctx.fillStyle = currentFunc.color;
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('f(x)', 20, 30);
    };
    
    const drawDerivative = (ctx) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = 40;
      const currentFunc = functions[selectedFunction];
      
      ctx.strokeStyle = currentFunc.derivativeColor;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      
      let firstPoint = true;
      for (let pixelX = 0; pixelX < canvas.width; pixelX += 2) {
        const x = (pixelX - centerX) / scale;
        const dy = currentFunc.derivative(x, functionParams);
        const pixelY = centerY - dy * scale;
        
        if (isNaN(dy) || Math.abs(dy) > 20) continue;
        
        if (firstPoint) {
          ctx.moveTo(pixelX, pixelY);
          firstPoint = false;
        } else {
          ctx.lineTo(pixelX, pixelY);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Derivative label
      ctx.fillStyle = currentFunc.derivativeColor;
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText("f'(x)", 20, 50);
    };
    
    const drawIntegral = (ctx) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = 40;
      const currentFunc = functions[selectedFunction];
      
      const startX = integrationBounds[0];
      const endX = integrationBounds[1];
      const startPixelX = centerX + startX * scale;
      const endPixelX = centerX + endX * scale;
      
      // Fill area under curve
      ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
      ctx.beginPath();
      
      // Start from x-axis
      ctx.moveTo(startPixelX, centerY);
      
      // Trace along function
      for (let pixelX = startPixelX; pixelX <= endPixelX; pixelX += 2) {
        const x = (pixelX - centerX) / scale;
        const y = currentFunc.func(x, functionParams);
        const pixelY = centerY - y * scale;
        
        if (!isNaN(y) && Math.abs(y) < 20) {
          ctx.lineTo(pixelX, pixelY);
        }
      }
      
      // Close path to x-axis
      ctx.lineTo(endPixelX, centerY);
      ctx.closePath();
      ctx.fill();
      
      // Draw boundary lines
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.moveTo(startPixelX, 0);
      ctx.lineTo(startPixelX, canvas.height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(endPixelX, 0);
      ctx.lineTo(endPixelX, canvas.height);
      ctx.stroke();
      
      // Integration bounds labels
      ctx.fillStyle = '#8b5cf6';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(startX.toString(), startPixelX, canvas.height - 10);
      ctx.fillText(endX.toString(), endPixelX, canvas.height - 10);
    };
    
    const drawTangentLine = (ctx) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = 40;
      const currentFunc = functions[selectedFunction];
      
      const pixelX = centerX + xValue * scale;
      const y = currentFunc.func(xValue, functionParams);
      const pixelY = centerY - y * scale;
      const slope = currentFunc.derivative(xValue, functionParams);
      
      if (isNaN(y) || isNaN(slope)) return;
      
      // Draw point
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(pixelX, pixelY, 6, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw tangent line
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      const lineLength = 100;
      const startX = pixelX - lineLength;
      const endX = pixelX + lineLength;
      const startY = pixelY + slope * lineLength;
      const endY = pixelY - slope * lineLength;
      
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      // Display values
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`x = ${xValue.toFixed(2)}`, pixelX + 10, pixelY - 10);
      ctx.fillText(`f(x) = ${y.toFixed(2)}`, pixelX + 10, pixelY + 5);
      ctx.fillText(`f'(x) = ${slope.toFixed(2)}`, pixelX + 10, pixelY + 20);
    };
    
    const drawAnalysisPoints = (ctx) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = 40;
      const currentFunc = functions[selectedFunction];
      
      // Draw critical points
      analysisData.criticalPoints.forEach(point => {
        const pixelX = centerX + point.x * scale;
        const y = currentFunc.func(point.x, functionParams);
        const pixelY = centerY - y * scale;
        
        if (!isNaN(y) && Math.abs(y) < 20) {
          ctx.fillStyle = point.type === 'max' ? '#10b981' : '#f59e0b';
          ctx.beginPath();
          ctx.arc(pixelX, pixelY, 8, 0, 2 * Math.PI);
          ctx.fill();
          
          ctx.strokeStyle = '#1f2937';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
      
      // Draw inflection points
      analysisData.inflectionPoints.forEach(point => {
        const pixelX = centerX + point.x * scale;
        const y = currentFunc.func(point.x, functionParams);
        const pixelY = centerY - y * scale;
        
        if (!isNaN(y) && Math.abs(y) < 20) {
          ctx.fillStyle = '#8b5cf6';
          ctx.beginPath();
          ctx.rect(pixelX - 5, pixelY - 5, 10, 10);
          ctx.fill();
          
          ctx.strokeStyle = '#1f2937';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    };
    
    const drawAnimationEffects = (ctx) => {
      const time = Date.now() * 0.002;
      
      // Animated calculus symbols
      const symbols = ['∫', '∂', 'Δ', '∑', 'lim', 'd/dx'];
      symbols.forEach((symbol, index) => {
        const x = 100 + Math.sin(time + index) * 50;
        const y = 100 + Math.cos(time + index * 0.7) * 30;
        const alpha = 0.3 + Math.sin(time + index) * 0.2;
        
        ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`;
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(symbol, x, y);
      });
      
      // Animated point tracing derivative
      if (showDerivative) {
        const traceX = -5 + (time % 10);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = 40;
        const currentFunc = functions[selectedFunction];
        
        const pixelX = centerX + traceX * scale;
        const dy = currentFunc.derivative(traceX, functionParams);
        const pixelY = centerY - dy * scale;
        
        if (!isNaN(dy) && Math.abs(dy) < 20) {
          ctx.fillStyle = 'rgba(236, 72, 153, 0.8)';
          ctx.beginPath();
          ctx.arc(pixelX, pixelY, 4, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    };
    
    drawCalculusVisualization();
  }, [selectedFunction, functionParams, showDerivative, showIntegral, xValue, integrationBounds, isRunning, analysisData]);

  const calculateDefiniteIntegral = () => {
    const currentFunc = functions[selectedFunction];
    const [a, b] = integrationBounds;
    const n = 1000; // Number of subdivisions for numerical integration
    const dx = (b - a) / n;
    let sum = 0;
    
    // Simpson's rule for numerical integration
    for (let i = 0; i <= n; i++) {
      const x = a + i * dx;
      const weight = (i === 0 || i === n) ? 1 : (i % 2 === 0) ? 2 : 4;
      sum += weight * currentFunc.func(x, functionParams);
    }
    
    return (dx / 3) * sum;
  };

  const findCriticalPoints = () => {
    const points = [];
    const currentFunc = functions[selectedFunction];
    
    // Numerical approach to find critical points
    for (let x = -5; x <= 5; x += 0.1) {
      const derivative = currentFunc.derivative(x, functionParams);
      const nextDerivative = currentFunc.derivative(x + 0.1, functionParams);
      
      // Check if derivative changes sign (indicating a critical point)
      if (Math.abs(derivative) < 0.01 || 
          (derivative > 0 && nextDerivative < 0) || 
          (derivative < 0 && nextDerivative > 0)) {
        
        const secondDerivative = getSecondDerivative(x);
        const type = secondDerivative > 0 ? 'min' : secondDerivative < 0 ? 'max' : 'inflection';
        
        points.push({ x: parseFloat(x.toFixed(2)), type });
      }
    }
    
    return points;
  };

  const findInflectionPoints = () => {
    const points = [];
    
    for (let x = -5; x <= 5; x += 0.1) {
      const secondDerivative = getSecondDerivative(x);
      const nextSecondDerivative = getSecondDerivative(x + 0.1);
      
      // Check if second derivative changes sign
      if ((secondDerivative > 0 && nextSecondDerivative < 0) || 
          (secondDerivative < 0 && nextSecondDerivative > 0)) {
        points.push({ x: parseFloat(x.toFixed(2)) });
      }
    }
    
    return points;
  };

  const getSecondDerivative = (x) => {
    const currentFunc = functions[selectedFunction];
    const h = 0.001;
    const f1 = currentFunc.derivative(x + h, functionParams);
    const f2 = currentFunc.derivative(x - h, functionParams);
    return (f1 - f2) / (2 * h);
  };

  const resetVisualization = () => {
    setShowDerivative(false);
    setShowIntegral(false);
    setIsRunning(false);
    setXValue(0);
    setIntegrationBounds([-2, 2]);
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/math" className="btn" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              Calculus Visualizer
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>
              Explore derivatives, integrals, and function analysis with interactive visualizations
            </p>
          </div>
        </div>
        
        <div className="card" style={{ 
          padding: '1rem 1.5rem', 
          background: 'var(--math-bg)', 
          border: '1px solid var(--math-accent)',
          minWidth: '120px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <TrendingUp size={16} style={{ color: 'var(--math-text)' }} />
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--math-text)' }}>
              {score}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--math-text)', opacity: 0.8 }}>
            Level {level}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        {/* Calculus Canvas */}
        <div className="card">
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="game-canvas"
            style={{ 
              width: '100%', 
              height: 'auto',
              backgroundColor: 'var(--bg-secondary)'
            }}
          />
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
            <button 
              className={`btn ${showDerivative ? 'danger' : 'primary'}`}
              onClick={() => {
                setShowDerivative(!showDerivative);
                setScore(prev => prev + 10);
              }}
            >
              <TrendingUp size={20} />
              {showDerivative ? 'Hide' : 'Show'} Derivative
            </button>
            
            <button 
              className={`btn ${showIntegral ? 'danger' : 'success'}`}
              onClick={() => {
                setShowIntegral(!showIntegral);
                setScore(prev => prev + 15);
              }}
            >
              <Zap size={20} />
              {showIntegral ? 'Hide' : 'Show'} Integral
            </button>
            
            <button 
              className={`btn ${isRunning ? 'danger' : 'primary'}`}
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
              {isRunning ? 'Stop' : 'Animate'}
            </button>
            
            <button 
              className="btn" 
              onClick={resetVisualization}
            >
              <RotateCcw size={20} />
              Reset
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
            Function Controls
          </h3>
          
          <div className="form-group">
            <label className="form-label">
              Function Type
            </label>
            <select
              value={selectedFunction}
              onChange={(e) => setSelectedFunction(e.target.value)}
              className="form-select"
            >
              {Object.entries(functions).map(([key, func]) => (
                <option key={key} value={key}>{func.name}</option>
              ))}
            </select>
          </div>

          {/* Function Parameters */}
          <div style={{ marginTop: '1rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Parameters:
            </h4>
            
            <div className="form-group">
              <label className="form-label">a = {functionParams.a}</label>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.1"
                value={functionParams.a}
                onChange={(e) => setFunctionParams(prev => ({...prev, a: parseFloat(e.target.value)}))}
                className="slider"
              />
            </div>

            {selectedFunction !== 'linear' && (
              <div className="form-group">
                <label className="form-label">b = {functionParams.b}</label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={functionParams.b}
                  onChange={(e) => setFunctionParams(prev => ({...prev, b: parseFloat(e.target.value)}))}
                  className="slider"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">c = {functionParams.c}</label>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.1"
                value={functionParams.c}
                onChange={(e) => setFunctionParams(prev => ({...prev, c: parseFloat(e.target.value)}))}
                className="slider"
              />
            </div>

            {selectedFunction === 'cubic' && (
              <div className="form-group">
                <label className="form-label">d = {functionParams.d}</label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={functionParams.d}
                  onChange={(e) => setFunctionParams(prev => ({...prev, d: parseFloat(e.target.value)}))}
                  className="slider"
                />
              </div>
            )}
          </div>

          {/* Analysis Point */}
          {showDerivative && (
            <div className="form-group">
              <label className="form-label">
                Analysis Point: x = {xValue.toFixed(2)}
              </label>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.1"
                value={xValue}
                onChange={(e) => setXValue(parseFloat(e.target.value))}
                className="slider"
              />
            </div>
          )}

          {/* Integration Bounds */}
          {showIntegral && (
            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Integration Bounds:
              </h4>
              
              <div className="form-group">
                <label className="form-label">Lower bound: {integrationBounds[0]}</label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={integrationBounds[0]}
                  onChange={(e) => setIntegrationBounds([parseFloat(e.target.value), integrationBounds[1]])}
                  className="slider"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Upper bound: {integrationBounds[1]}</label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={integrationBounds[1]}
                  onChange={(e) => setIntegrationBounds([integrationBounds[0], parseFloat(e.target.value)])}
                  className="slider"
                />
              </div>
            </div>
          )}

          {/* Analysis Results */}
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px'
          }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Analysis Results:
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {showDerivative && (
                <div>Slope at x={xValue.toFixed(2)}: {analysisData.slope.toFixed(3)}</div>
              )}
              {showIntegral && (
                <div>Area [{integrationBounds[0]}, {integrationBounds[1]}]: {analysisData.area.toFixed(3)}</div>
              )}
              <div>Critical Points: {analysisData.criticalPoints.length}</div>
              <div>Inflection Points: {analysisData.inflectionPoints.length}</div>
            </div>
          </div>

          {/* Critical Points Details */}
          {analysisData.criticalPoints.length > 0 && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              backgroundColor: 'var(--math-bg)',
              borderRadius: '8px',
              border: '1px solid var(--math-accent)',
              maxHeight: '150px',
              overflowY: 'auto'
            }}>
              <h4 style={{ color: 'var(--math-text)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                Critical Points:
              </h4>
              <div style={{ fontSize: '0.75rem', color: 'var(--math-text)', lineHeight: 1.4 }}>
                {analysisData.criticalPoints.map((point, index) => (
                  <div key={index} style={{ marginBottom: '0.25rem' }}>
                    x = {point.x} ({point.type})
                    <span style={{ 
                      color: point.type === 'max' ? '#10b981' : '#f59e0b',
                      marginLeft: '0.5rem'
                    }}>
                      ●
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learning Notes */}
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px'
          }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Key Concepts:
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              • Derivative = Rate of change<br/>
              • Integral = Area under curve<br/>
              • Critical points: f'(x) = 0<br/>
              • Inflection points: f''(x) = 0<br/>
              • Fundamental Theorem of Calculus
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculusVisualizer;