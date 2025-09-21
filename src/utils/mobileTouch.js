// This handles touch events for mobile games
export const addTouchSupport = (canvas, handlers = {}) => {
  let touchStart = { x: 0, y: 0 };
  let isTouching = false;

  const getTouchPos = (touch) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    touchStart = getTouchPos(touch);
    isTouching = true;
    
    if (handlers.onStart) {
      handlers.onStart(touchStart.x, touchStart.y);
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isTouching) return;
    
    const touch = e.touches[0];
    const pos = getTouchPos(touch);
    
    if (handlers.onMove) {
      handlers.onMove(pos.x, pos.y, touchStart.x, touchStart.y);
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    isTouching = false;
    
    if (handlers.onEnd) {
      handlers.onEnd();
    }
  };

  // Add touch listeners
  canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
  canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
  canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
  canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });

  // Also support mouse for desktop
  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    if (handlers.onStart) handlers.onStart(pos.x, pos.y);
  });

  // Cleanup function
  return () => {
    canvas.removeEventListener('touchstart', handleTouchStart);
    canvas.removeEventListener('touchmove', handleTouchMove);
    canvas.removeEventListener('touchend', handleTouchEnd);
    canvas.removeEventListener('touchcancel', handleTouchEnd);
  };
};