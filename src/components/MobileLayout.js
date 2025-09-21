import React from 'react';
import { useMobile } from '../hooks/useMobile';

const MobileLayout = ({ children, sidebar }) => {
  const { isMobile } = useMobile();
  
  if (isMobile) {
    // On mobile, stack everything vertically
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '100%',
        padding: '0.5rem'
      }}>
        {children}
        {sidebar}
      </div>
    );
  }
  
  // On desktop, keep side-by-side layout
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 350px',
      gap: '2rem'
    }}>
      {children}
      {sidebar}
    </div>
  );
};

export default MobileLayout;