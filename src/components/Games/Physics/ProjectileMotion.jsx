import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, RotateCcw, ArrowLeft, Trophy, Target } from 'lucide-react';

const ProjectileMotion = () => {
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  
  // Physics parameters
  const [gravity, setGravity] = useState(9.8);
  const [velocity, setVelocity] = useState(20);
  const [angle, setAngle] = useState(45);
  
  // Target settings
  const [target] = useState({ x: 600, y: 350, width: 50, height: 100 });
  const [hitTarget, setHitTarget] = useState(false);

  useEffect(() => {
    if (!isRunning || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let t = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw target
      ctx.fillStyle = hitTarget ? '#10b981' : '#ef4444';
      ctx.fillRect(target.x, target.y, target.width, target.height);
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('🎯', target.x + target.width/2, target.y + target.height/2 + 6);
      
      // Calculate projectile motion
      const vx = velocity * Math.cos(angle * Math.PI / 180);
      const vy = velocity * Math.sin(angle * Math.PI / 180);
      
      const x = vx * t;
      const y = vy * t - 0.5 * gravity * t * t;
      
      // Check if projectile hits ground
      if (y < 0) {
        setIsRunning(false);
        setAttempts(prev => prev + 1);
        return;
      }
      
      // Check if projectile hits target
      const projectileX = x * 6 + 50;
      const projectileY = canvas.height - y * 6 - 50;
      
      if (!hitTarget && 
          projectileX >= target.x && projectileX <= target.x + target.width &&
          projectileY >= target.y && projectileY <= target.y + target.height) {
        setHitTarget(true);
        setScore(prev => prev + 100);
        
        // Add bonus for accuracy
        const centerHit = Math.abs((projectileX - (target.x + target.width/2))) < 10;
        if (centerHit) {
          setScore(prev => prev + 50);
        }
      }
      
      // Draw projectile with trail effect
      ctx.shadowColor = '#3b82f6';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(projectileX, projectileY, 6, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw trajectory path
      ctx.shadowBlur = 0;
      ctx.strokeStyle = hitTarget ? '#10b981' : '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      for (let i = 0; i <= t; i += 0.1) {
        const px = vx * i * 6 + 50;
        const py = canvas.height - (vy * i - 0.5 * gravity * i * i) * 6 - 50;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw velocity vector at launch
      if (t < 1) {
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(50, canvas.height - 50);
        ctx.lineTo(50 + vx * 3, canvas.height - 50 - vy * 3);
        ctx.stroke();
        
        // Arrow head
        const arrowX = 50 + vx * 3;
        const arrowY = canvas.height - 50 - vy * 3;
        ctx.fillStyle = '#8b5cf6';
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX - 8, arrowY + 4);
        ctx.lineTo(arrowX - 8, arrowY - 4);
        ctx.fill();
      }
      
      t += 0.02;
      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [isRunning, gravity, velocity, angle, hitTarget]);

  const resetSimulation = () => {
    setIsRunning(false);
    setHitTarget(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Redraw target
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(target.x, target.y, target.width, target.height);
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('🎯', target.x + target.width/2, target.y + target.height/2 + 6);
    }
  };

  const launchProjectile = () => {
    if (!isRunning) {
      resetSimulation();
      setTimeout(() => setIsRunning(true), 100);
    } else {
      setIsRunning(false);
    }
  };

  const accuracy = attempts > 0 ? Math.round((score / (attempts * 100)) * 100) : 0;

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
              Projectile Motion Simulator
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>
              Learn about trajectory, velocity, and gravity by launching projectiles at targets
            </p>
          </div>
        </div>
        
        <div className="card" style={{ 
          padding: '1rem 1.5rem', 
          background: 'var(--success-bg)', 
          border: '1px solid var(--success-text)',
          minWidth: '120px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Trophy size={16} style={{ color: 'var(--success-text)' }} />
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success-text)' }}>
              {score}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success-text)', opacity: 0.8 }}>
            Accuracy: {accuracy}%
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        {/* Game Canvas */}
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
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
            <button 
              className={`btn ${isRunning ? 'danger' : 'primary'}`}
              onClick={launchProjectile}
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
              {isRunning ? 'Stop' : 'Launch'}
            </button>
            
            <button 
              className="btn" 
              onClick={resetSimulation}
              disabled={isRunning}
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
            Physics Controls
          </h3>
          
          <div className="form-group">
            <label className="form-label">
              Gravity: {gravity} m/s²
            </label>
            <input
              type="range"
              min="1"
              max="20"
              step="0.1"
              value={gravity}
              onChange={(e) => setGravity(parseFloat(e.target.value))}
              className="slider"
              disabled={isRunning}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Earth gravity: 9.8 m/s²
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Initial Velocity: {velocity} m/s
            </label>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={velocity}
              onChange={(e) => setVelocity(parseFloat(e.target.value))}
              className="slider"
              disabled={isRunning}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Launch Angle: {angle}°
            </label>
            <input
              type="range"
              min="0"
              max="90"
              step="1"
              value={angle}
              onChange={(e) => setAngle(parseFloat(e.target.value))}
              className="slider"
              disabled={isRunning}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Optimal angle: 45° for maximum range
            </div>
          </div>

          {/* Physics Formulas */}
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px',
            fontSize: '0.875rem'
          }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Physics Formulas:
            </h4>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              <div>x = v₀ cos(θ) × t</div>
              <div>y = v₀ sin(θ) × t - ½gt²</div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', opacity: 0.8 }}>
                Where v₀ = initial velocity, θ = angle, t = time, g = gravity
              </div>
            </div>
          </div>

          {/* Game Stats */}
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            backgroundColor: 'var(--physics-bg)',
            borderRadius: '8px',
            border: '1px solid var(--physics-accent)'
          }}>
            <h4 style={{ color: 'var(--physics-text)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Game Statistics:
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem' }}>
              <div>
                <div style={{ color: 'var(--physics-text)', opacity: 0.8 }}>Attempts:</div>
                <div style={{ color: 'var(--physics-text)', fontWeight: '600' }}>{attempts}</div>
              </div>
              <div>
                <div style={{ color: 'var(--physics-text)', opacity: 0.8 }}>Hits:</div>
                <div style={{ color: 'var(--physics-text)', fontWeight: '600' }}>{Math.floor(score / 100)}</div>
              </div>
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
          Learn More: Projectile Motion Concepts
        </h3>
        <div className="video-container" style={{ position: 'relative', aspectRatio: '16/9' }}>
          <video 
            className="video-player"
            controls
            poster="/videos/projectile-motion-poster.jpg"
            style={{ 
              width: '100%', 
              height: '100%',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-secondary)'
            }}
          >
            <source src="/videos/projectile-motion-tutorial.mp4" type="video/mp4" />
            <source src="/videos/projectile-motion-tutorial.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default ProjectileMotion;
