import React from 'react';
import LanyardCard from './components/LanyardCard';

const LanyardCardExample = () => {
  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'linear-gradient(to bottom, #1a1a1a, #2d2d2d)'
    }}>

      <div style={{ width: '400px', height: '600px' }}>
        <LanyardCard 
          frontImage='/assets/1729360719180.jpg'
          backImage='/assets/Screenshot 2025-04-25 200507.png'
          lanyardColor='#3b82f6'
          name='Sample Card'
          title='Interactive 3D Card'
          company='React Three Fiber'
        />
      </div>
    </div>
  );
};

export default LanyardCardExample;
