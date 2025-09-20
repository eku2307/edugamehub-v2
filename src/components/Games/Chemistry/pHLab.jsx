import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FlaskConical, Trophy, RotateCcw, Droplets } from 'lucide-react';

// Changed from pHLab to PHLab (uppercase P)
const PHLab = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [currentSolution, setCurrentSolution] = useState({ pH: 7, concentration: 0.001, type: 'neutral' });
  const [selectedIndicator, setSelectedIndicator] = useState('universal');
  const [userGuess, setUserGuess] = useState('');

  const indicators = {
    universal: {
      name: 'Universal Indicator',
      colors: {
        0: '#ff0000', 2: '#ff4500', 4: '#ffa500', 6: '#ffff00',
        7: '#90ee90', 8: '#00ff00', 10: '#0000ff', 12: '#4b0082', 14: '#8b00ff'
      }
    },
    phenolphthalein: {
      name: 'Phenolphthalein',
      colors: { 0: '#ffffff', 8.2: '#ffffff', 8.3: '#ff69b4', 14: '#ff1493' }
    },
    litmus: {
      name: 'Litmus Paper',
      colors: { 0: '#ff6b6b', 7: '#dda0dd', 14: '#4169e1' }
    }
  };

  const solutions = [
    { name: 'Hydrochloric Acid', pH: 1, type: 'strong acid', formula: 'HCl' },
    { name: 'Lemon Juice', pH: 2, type: 'weak acid', formula: 'Citric Acid' },
    { name: 'Coffee', pH: 5, type: 'weak acid', formula: 'Various' },
    { name: 'Pure Water', pH: 7, type: 'neutral', formula: 'H₂O' },
    { name: 'Baking Soda', pH: 9, type: 'weak base', formula: 'NaHCO₃' },
    { name: 'Ammonia', pH: 11, type: 'weak base', formula: 'NH₃' },
    { name: 'Sodium Hydroxide', pH: 13, type: 'strong base', formula: 'NaOH' }
  ];

  useEffect(() => {
    generateNewSolution();
  }, []);

  useEffect(() => {
    drawBeaker();
  }, [currentSolution, selectedIndicator]);

  const generateNewSolution = () => {
    const randomSolution = solutions[Math.floor(Math.random() * solutions.length)];
    setCurrentSolution(randomSolution);
    setUserGuess('');
  };

  const drawBeaker = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw beaker
    const beakerX = 200;
    const beakerY = 150;
    const beakerWidth = 200;
    const beakerHeight = 200;

    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(beakerX, beakerY);
    ctx.lineTo(beakerX, beakerY + beakerHeight - 20);
    ctx.arcTo(beakerX, beakerY + beakerHeight, beakerX + 20, beakerY + beakerHeight, 20);
    ctx.lineTo(beakerX + beakerWidth - 20, beakerY + beakerHeight);
    ctx.arcTo(beakerX + beakerWidth, beakerY + beakerHeight, beakerX + beakerWidth, beakerY + beakerHeight - 20, 20);
    ctx.lineTo(beakerX + beakerWidth, beakerY);
    ctx.stroke();

    // Draw solution with indicator color
    const solutionColor = getIndicatorColor(currentSolution.pH, selectedIndicator);
    ctx.fillStyle = solutionColor;
    ctx.fillRect(beakerX + 5, beakerY + 50, beakerWidth - 10, beakerHeight - 70);

    // Draw measurement marks
    for (let i = 1; i <= 5; i++) {
      const y = beakerY + 30 + i * 30;
      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(beakerX + beakerWidth + 5, y);
      ctx.lineTo(beakerX + beakerWidth + 15, y);
      ctx.stroke();
      
      ctx.fillStyle = '#374151';
      ctx.font = '12px Inter';
      ctx.textAlign = 'left';
      ctx.fillText(`${6-i}00mL`, beakerX + beakerWidth + 20, y + 4);
    }

    // Draw pH scale
    drawpHScale(ctx, 50, 100);

    // Draw labels
    ctx.fillStyle = '#374151';
    ctx.font = '16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Solution Beaker', beakerX + beakerWidth/2, beakerY - 10);
    ctx.fillText(`Indicator: ${indicators[selectedIndicator].name}`, beakerX + beakerWidth/2, beakerY + beakerHeight + 30);
  };

  const drawpHScale = (ctx, x, y) => {
    const scaleWidth = 500;
    const scaleHeight = 30;

    // Draw pH scale background
    for (let i = 0; i <= 14; i++) {
      const color = getIndicatorColor(i, 'universal');
      ctx.fillStyle = color;
      ctx.fillRect(x + (i * scaleWidth / 14), y, scaleWidth / 14, scaleHeight);
    }

    // Draw scale border
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, scaleWidth, scaleHeight);

    // Draw pH numbers
    ctx.fillStyle = '#374151';
    ctx.font = '14px Inter';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 14; i++) {
      ctx.fillText(i.toString(), x + (i * scaleWidth / 14) + (scaleWidth / 28), y + scaleHeight + 15);
    }

    // Draw labels
    ctx.font = '12px Inter';
    ctx.fillText('ACIDIC', x + 100, y - 10);
    ctx.fillText('NEUTRAL', x + scaleWidth/2, y - 10);
    ctx.fillText('BASIC', x + scaleWidth - 100, y - 10);

    // Draw current pH indicator
    if (currentSolution.pH !== undefined) {
      const indicatorX = x + (currentSolution.pH * scaleWidth / 14);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(indicatorX, y - 5);
      ctx.lineTo(indicatorX + 10, y - 15);
      ctx.lineTo(indicatorX - 10, y - 15);
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = '#000000';
      ctx.fill();
    }
  };

  const getIndicatorColor = (pH, indicator) => {
    const ind = indicators[indicator];
    if (!ind) return '#90ee90';

    const colors = ind.colors;
    const pHValues = Object.keys(colors).map(Number).sort((a, b) => a - b);

    for (let i = 0; i < pHValues.length; i++) {
      if (pH <= pHValues[i]) {
        return colors[pHValues[i]];
      }
    }

    return colors[pHValues[pHValues.length - 1]];
  };

  const checkGuess = () => {
    const guess = parseFloat(userGuess);
    const actual = currentSolution.pH;
    const difference = Math.abs(guess - actual);

    if (difference <= 0.5) {
      const points = difference === 0 ? 30 : 20;
      setScore(prev => prev + points);
      alert(`Excellent! pH = ${actual}. +${points} points!`);
    } else if (difference <= 1) {
      setScore(prev => prev + 10);
      alert(`Close! pH = ${actual}. +10 points!`);
    } else {
      alert(`Not quite. The pH is ${actual}. Try again!`);
    }
  };

  return (
    <div className="fade-in">
      {/* Theory Section */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <Link to="/chemistry" className="btn" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              pH Laboratory
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>
              Explore acids, bases, and pH through interactive experiments
            </p>
          </div>
          <div className="score-display" style={{ marginLeft: 'auto' }}>
            <Trophy size={16} style={{ marginRight: '0.5rem' }} />
            {score} points
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h3 style={{ color: 'var(--chemistry-text)', marginBottom: '1rem', fontSize: '1.25rem' }}>
              pH and Acid-Base Theory
            </h3>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong>pH Scale:</strong> Measures hydrogen ion concentration from 0-14. 
                Lower values are acidic, 7 is neutral, higher values are basic.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Acids:</strong> Substances that donate protons (H⁺) in solution. 
                Examples: HCl, citric acid, vinegar.
              </p>
              <p>
                <strong>Bases:</strong> Substances that accept protons or donate hydroxide ions (OH⁻). 
                Examples: NaOH, ammonia, soap.
              </p>
            </div>
          </div>

          <div>
            <h3 style={{ color: 'var(--chemistry-text)', marginBottom: '1rem', fontSize: '1.25rem' }}>
              pH Formula
            </h3>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--chemistry-bg)', 
              borderRadius: '8px',
              border: '1px solid var(--chemistry-accent)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--chemistry-text)', marginBottom: '0.5rem' }}>
                pH = -log[H⁺]
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--chemistry-text)', opacity: 0.8 }}>
                Where [H⁺] is hydrogen ion concentration
              </div>
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              • pH 0-6.9: Acidic<br/>
              • pH 7: Neutral<br/>
              • pH 7.1-14: Basic/Alkaline
            </div>
          </div>
        </div>
      </div>

      {/* Game Interface */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FlaskConical size={20} />
          pH Testing Lab
        </h3>
        
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="game-canvas"
          style={{ backgroundColor: 'var(--bg-secondary)', marginBottom: '1.5rem' }}
        />

        {/* Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Solution Info */}
          <div>
            <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Current Solution:</h4>
            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--chemistry-bg)',
              borderRadius: '8px',
              border: '1px solid var(--chemistry-accent)'
            }}>
              <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--chemistry-text)', marginBottom: '0.5rem' }}>
                {currentSolution.name}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--chemistry-text)', opacity: 0.8 }}>
                Formula: {currentSolution.formula}<br/>
                Type: {currentSolution.type}
              </div>
            </div>
          </div>

          {/* Indicator Selection */}
          <div>
            <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Indicator:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {Object.entries(indicators).map(([key, indicator]) => (
                <button
                  key={key}
                  className={`btn ${selectedIndicator === key ? 'primary' : ''}`}
                  onClick={() => setSelectedIndicator(key)}
                  style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                >
                  <Droplets size={16} style={{ marginRight: '0.5rem' }} />
                  {indicator.name}
                </button>
              ))}
            </div>
          </div>

          {/* pH Guess */}
          <div>
            <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Your pH Estimate:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="number"
                min="0"
                max="14"
                step="0.1"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                placeholder="Enter pH (0-14)"
                className="form-input"
              />
              <button className="btn primary" onClick={checkGuess} disabled={!userGuess}>
                Test pH
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <button className="btn" onClick={generateNewSolution}>
            New Solution
          </button>
          <button className="btn" onClick={() => setScore(0)}>
            <RotateCcw size={20} />
            Reset Score
          </button>
        </div>
      </div>
    </div>
  );
};

// Changed from pHLab to PHLab
export default PHLab;