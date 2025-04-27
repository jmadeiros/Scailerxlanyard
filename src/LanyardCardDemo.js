import React from 'react';
import LanyardCard from './components/LanyardCard';

// Sample Demo Component
const LanyardCardDemo = () => {
  return (
    <div className="lanyard-demo-container">
      <h1>Interactive Lanyard Card Demo</h1>
      <p>Click to flip and hover to interact with the cards.</p>
      
      <div className="cards-container">
        <div className="card-wrapper">
          <LanyardCard 
            frontImage="/assets/person1.jpg" 
            backImage="/assets/card-back-1.png"
            lanyardColor="#3b82f6"
            name="John Doe"
            title="Senior Developer"
            company="Acme Inc."
          />
        </div>
        
        <div className="card-wrapper">
          <LanyardCard 
            frontImage="/assets/person2.jpg" 
            backImage="/assets/card-back-2.png"
            lanyardColor="#10b981"
            name="Jane Smith"
            title="Product Manager"
            company="Tech Solutions"
          />
        </div>
      </div>
      
      {/* Add some CSS to the page */}
      <style jsx>{`
        .lanyard-demo-container {
          padding: 2rem;
          background: linear-gradient(to bottom, #1a1a1a, #2d2d2d);
          min-height: 100vh;
          color: white;
          text-align: center;
        }
        
        h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        
        p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          color: #aaaaaa;
        }
        
        .cards-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 2rem;
        }
        
        .card-wrapper {
          width: 100%;
          max-width: 400px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          overflow: hidden;
          padding: 1rem;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default LanyardCardDemo; 