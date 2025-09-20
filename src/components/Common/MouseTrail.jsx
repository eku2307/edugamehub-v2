import React, { useEffect, useRef } from 'react';

const MouseTrail = () => {
  const trailRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (trailRef.current) {
        trailRef.current.style.left = e.clientX - 10 + 'px';
        trailRef.current.style.top = e.clientY - 10 + 'px';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <div ref={trailRef} className="mouse-trail" />;
};

export default MouseTrail;