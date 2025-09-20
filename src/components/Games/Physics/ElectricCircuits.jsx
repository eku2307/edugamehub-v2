import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, RotateCcw, ArrowLeft, Zap, Battery } from 'lucide-react';

const ElectricCircuits = () => {
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [circuitType, setCircuitType] = useState('series');
  
  // Circuit parameters
  const [voltage, setVoltage] = useState(12);
  const [resistance1, setResistance1] = useState(100);
  const [resistance2, setResistance2] = useState(200);
  const [resistance3, setResistance3] = useState(150);
  
  // Calculated values
  const [current, setCurrent] = useState(0);
  const [power, setPower] = useState(0);
  const [totalResistance, setTotalResistance] = useState(0);

  useEffect(() => {
    // Calculate electrical values
    let totalR, totalI, totalP;
    
    if (circuitType === 'series') {
      totalR = resistance1 + resistance2 + resistance3;
      totalI = voltage / totalR;
      totalP = voltage * totalI;
    } else {
      totalR = 1 / (1/resistance1 + 1/resistance2 + 1/resistance3);
      totalI = voltage / totalR;
      totalP = voltage * totalI;
    }
    
    setTotalResistance(totalR);
    setCurrent(totalI);
    setPower(totalP);
  }, [voltage, resistance1, resistance2, resistance3, circuitType]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const drawCircuit = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set up drawing style
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 3;
      
      if (circuitType === 'series') {
        drawSeriesCircuit(ctx);
      } else {
        drawParallelCircuit(ctx);
      }
      
      // Draw current flow animation if running
      if (isRunning) {
        drawCurrentFlow(ctx);
      }
      
      // Draw measurements
      drawMeasurements(ctx);
    };
    
    const drawSeriesCircuit = (ctx) => {
      // Main circuit path
      ctx.beginPath();
      ctx.moveTo(100, 100);
      ctx.lineTo(700, 100);
      ctx.lineTo(700, 300);
      ctx.lineTo(100, 300);
      ctx.lineTo(100, 100);
      ctx.stroke();
      
      // Battery
      drawBattery(ctx, 150, 300);
      
      // Resistors
      drawResistor(ctx, 300, 100, resistance1, '#ef4444');
      drawResistor(ctx, 450, 100, resistance2, '#22c55e');
      drawResistor(ctx, 600, 100, resistance3, '#3b82f6');
    };
    
    const drawParallelCircuit = (ctx) => {
      // Main horizontal lines
      ctx.beginPath();
      ctx.moveTo(100, 200);
      ctx.lineTo(200, 200);
      ctx.moveTo(600, 200);
      ctx.lineTo(700, 200);
      ctx.stroke();
      
      // Vertical connection lines
      ctx.beginPath();
      ctx.moveTo(200, 120);
      ctx.lineTo(200, 280);
      ctx.moveTo(600, 120);
      ctx.lineTo(600, 280);
      ctx.stroke();
      
      // Parallel branches
      ctx.beginPath();
      ctx.moveTo(200, 150);
      ctx.lineTo(600, 150);
      ctx.moveTo(200, 200);
      ctx.lineTo(600, 200);
      ctx.moveTo(200, 250);
      ctx.lineTo(600, 250);
      ctx.stroke();
      
      // Battery
      drawBattery(ctx, 150, 200);
      
      // Resistors in parallel
      drawResistor(ctx, 400, 150, resistance1, '#ef4444');
      drawResistor(ctx, 400, 200, resistance2, '#22c55e');
      drawResistor(ctx, 400, 250, resistance3, '#3b82f6');
    };
    
    const drawBattery = (ctx, x, y) => {
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      
      // Battery body
      ctx.fillRect(x - 15, y - 20, 30, 15);
      ctx.strokeRect(x - 15, y - 20, 30, 15);
      
      // Battery terminals
      ctx.fillRect(x - 5, y - 25, 10, 5);
      ctx.strokeRect(x - 5, y - 25, 10, 5);
      
      // Voltage label
      ctx.fillStyle = '#374151';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(`${voltage}V`, x, y + 15);
      
      // + and - signs
      ctx.fillText('+', x - 12, y - 10);
      ctx.fillText('-', x + 12, y - 10);
    };
    
    const drawResistor = (ctx, x, y, resistance, color) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      
      // Resistor zigzag pattern
      ctx.beginPath();
      ctx.moveTo(x - 30, y);
      for (let i = 0; i < 6; i++) {
        ctx.lineTo(x - 20 + i * 8, y + (i % 2 === 0 ? -10 : 10));
      }
      ctx.lineTo(x + 30, y);
      ctx.stroke();
      
      // Resistance value label
      ctx.fillStyle = color;
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(`${resistance}Ω`, x, y + 25);
      
      // Current through this resistor
      if (isRunning) {
        const resistorCurrent = circuitType === 'series' ? current : voltage / resistance;
        ctx.fillText(`${resistorCurrent.toFixed(3)}A`, x, y - 25);
      }
    };
    
    const drawCurrentFlow = (ctx) => {
      const time = Date.now() * 0.001;
      ctx.fillStyle = '#fbbf24';
      
      if (circuitType === 'series') {
        // Moving dots for series circuit
        for (let i = 0; i < 8; i++) {
          const progress = (time + i * 0.3) % 2;
          let x, y;
          
          if (progress < 0.5) {
            x = 100 + progress * 1200;
            y = 100;
          } else if (progress < 1) {
            x = 700;
            y = 100 + (progress - 0.5) * 400;
          } else if (progress < 1.5) {
            x = 700 - (progress - 1) * 1200;
            y = 300;
          } else {
            x = 100;
            y = 300 - (progress - 1.5) * 400;
          }
          
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, 2 * Math.PI);
          ctx.fill();
        }
      } else {
        // Moving dots for parallel circuit
        const branches = [150, 200, 250];
        branches.forEach((branchY, index) => {
          for (let i = 0; i < 3; i++) {
            const progress = (time + i * 0.4 + index * 0.2) % 1;
            const x = 200 + progress * 400;
            
            ctx.beginPath();
            ctx.arc(x, branchY, 3, 0, 2 * Math.PI);
            ctx.fill();
          }
        });
      }
    };
    
    const drawMeasurements = (ctx) => {
      // Measurement display box
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 1;
      ctx.fillRect(50, 20, 200, 70);
      ctx.strokeRect(50, 20, 200, 70);
      
      ctx.fillStyle = '#374151';
      ctx.font = '12px Inter';
      ctx.textAlign = 'left';
      ctx.fillText(`Total Resistance: ${totalResistance.toFixed(1)}Ω`, 60, 35);
      ctx.fillText(`Total Current: ${current.toFixed(3)}A`, 60, 50);
      ctx.fillText(`Total Power: ${power.toFixed(2)}W`, 60, 65);
      ctx.fillText(`Circuit Type: ${circuitType}`, 60, 80);
    };
    
    drawCircuit();
  }, [isRunning, voltage, resistance1, resistance2, resistance3, circuitType, current, totalResistance, power]);

  const startSimulation = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      setScore(score + 15);
    }
  };

  const resetCircuit = () => {
    setIsRunning(false);
    setVoltage(12);
    setResistance1(100);
    setResistance2(200);
    setResistance3(150);
  };

  const switchCircuitType = () => {
    setCircuitType(circuitType === 'series' ? 'parallel' : 'series');
    setScore(score + 10);
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
              Electric Circuits Lab
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>
              Build and analyze series and parallel circuits with interactive components
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
            <Zap size={16} style={{ color: 'var(--physics-text)' }} />
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--physics-text)' }}>
              {score}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--physics-text)', opacity: 0.8 }}>
            Circuit Points
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        {/* Circuit Canvas */}
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
              {isRunning ? 'Stop' : 'Power On'}
            </button>
            
            <button 
              className="btn" 
              onClick={resetCircuit}
            >
              <RotateCcw size={20} />
              Reset
            </button>
            
            <button 
              className={`btn ${circuitType === 'parallel' ? 'success' : ''}`}
              onClick={switchCircuitType}
            >
              <Battery size={20} />
              {circuitType === 'series' ? 'Series' : 'Parallel'}
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
            Circuit Controls
          </h3>
          
          <div className="form-group">
            <label className="form-label">
              Voltage Source: {voltage}V
            </label>
            <input
              type="range"
              min="3"
              max="24"
              step="1"
              value={voltage}
              onChange={(e) => setVoltage(parseFloat(e.target.value))}
              className="slider"
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: '#ef4444' }}>
              Resistor 1: {resistance1}Ω
            </label>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={resistance1}
              onChange={(e) => setResistance1(parseFloat(e.target.value))}
              className="slider"
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: '#22c55e' }}>
              Resistor 2: {resistance2}Ω
            </label>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={resistance2}
              onChange={(e) => setResistance2(parseFloat(e.target.value))}
              className="slider"
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: '#3b82f6' }}>
              Resistor 3: {resistance3}Ω
            </label>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={resistance3}
              onChange={(e) => setResistance3(parseFloat(e.target.value))}
              className="slider"
            />
          </div>

          {/* Circuit Calculations */}
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px',
            fontSize: '0.875rem'
          }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Key Formulas:
            </h4>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              <div><strong>Ohm's Law:</strong> V = I × R</div>
              <div><strong>Power:</strong> P = V × I</div>
              <div><strong>Series:</strong> R_total = R₁ + R₂ + R₃</div>
              <div><strong>Parallel:</strong> 1/R_total = 1/R₁ + 1/R₂ + 1/R₃</div>
            </div>
          </div>

          {/* Real-time Measurements */}
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            backgroundColor: 'var(--physics-bg)',
            borderRadius: '8px',
            border: '1px solid var(--physics-accent)'
          }}>
            <h4 style={{ color: 'var(--physics-text)', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
              Live Measurements:
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem' }}>
              <div>
                <div style={{ color: 'var(--physics-text)', opacity: 0.8 }}>Total R:</div>
                <div style={{ color: 'var(--physics-text)', fontWeight: '600' }}>{totalResistance.toFixed(1)}Ω</div>
              </div>
              <div>
                <div style={{ color: 'var(--physics-text)', opacity: 0.8 }}>Current:</div>
                <div style={{ color: 'var(--physics-text)', fontWeight: '600' }}>{current.toFixed(3)}A</div>
              </div>
              <div>
                <div style={{ color: 'var(--physics-text)', opacity: 0.8 }}>Power:</div>
                <div style={{ color: 'var(--physics-text)', fontWeight: '600' }}>{power.toFixed(2)}W</div>
              </div>
              <div>
                <div style={{ color: 'var(--physics-text)', opacity: 0.8 }}>Type:</div>
                <div style={{ color: 'var(--physics-text)', fontWeight: '600' }}>{circuitType}</div>
              </div>
            </div>
          </div>

          {/* Safety Tips */}
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            <h4 style={{ color: '#dc2626', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Safety Notes:
            </h4>
            <div style={{ fontSize: '0.75rem', color: '#dc2626', lineHeight: 1.4 }}>
              • Always check voltage ratings<br/>
              • Use proper wire gauges<br/>
              • Install circuit breakers<br/>
              • Never exceed component limits
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
          Learn More: Circuit Analysis and Design
        </h3>
        <div className="video-container" style={{ position: 'relative', aspectRatio: '16/9' }}>
          <video 
            className="video-player"
            controls
            poster="/videos/circuits-poster.jpg"
            style={{ 
              width: '100%', 
              height: '100%',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-secondary)'
            }}
          >
            <source src="/videos/circuits-tutorial.mp4" type="video/mp4" />
            <source src="/videos/circuits-tutorial.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default ElectricCircuits;