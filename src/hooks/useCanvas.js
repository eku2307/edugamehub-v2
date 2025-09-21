import { useEffect, useRef, useCallback } from 'react';

// This makes canvas games work smooth on mobile
export const useCanvas = (draw, options = {}) => {
  const canvasRef = useRef(null);
  
  const { responsive = true } = options;

  // Function to make canvas fit screen perfectly
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    const isMobile = window.innerWidth <= 768;
    
    // Get container size
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight || (containerWidth * 0.6);
    
    // Use lower resolution on mobile for speed
    const pixelRatio = isMobile ? 1 : (window.devicePixelRatio || 1);
    
    // Set display size
    canvas.style.width = containerWidth + 'px';
    canvas.style.height = containerHeight + 'px';
    
    // Set actual size
    canvas.width = containerWidth * pixelRatio;
    canvas.height = containerHeight * pixelRatio;
    
    // Make drawing look good
    const ctx = canvas.getContext('2d');
    ctx.scale(pixelRatio, pixelRatio);
    
    // Mobile optimizations
    if (isMobile) {
      ctx.imageSmoothingEnabled = false; // Faster on mobile
    }
  }, []);

  // Resize when screen changes
  useEffect(() => {
    if (responsive) {
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      window.addEventListener('orientationchange', () => {
        setTimeout(resizeCanvas, 100); // Small delay for orientation
      });
      
      return () => {
        window.removeEventListener('resize', resizeCanvas);
        window.removeEventListener('orientationchange', resizeCanvas);
      };
    }
  }, [responsive, resizeCanvas]);

  // Drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    const render = () => {
      draw(ctx, canvas);
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [draw]);

  return canvasRef;
};