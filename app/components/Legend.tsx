import React from 'react';
import { PROVIDER_COLORS } from '../constants/locations';

export const Legend: React.FC = () => {
  return (
    <div style={{
      position: 'absolute',
      top: 20,
      right: 20,
      background: 'rgba(10, 14, 39, 0.9)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 8,
      padding: 20,
      color: 'white',
      zIndex: 1000,
      backdropFilter: 'blur(10px)'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: 14 }}>Legend</h3>
      
      <div style={{ marginBottom: 8 }}>
        <span style={{ 
          display: 'inline-block', 
          width: 12, 
          height: 12, 
          background: PROVIDER_COLORS.Exchange, 
          borderRadius: '50%', 
          marginRight: 8 
        }}></span>
        Exchanges
      </div>
      
      <div style={{ marginBottom: 8 }}>
        <span style={{ 
          display: 'inline-block', 
          width: 12, 
          height: 12, 
          background: PROVIDER_COLORS.AWS, 
          borderRadius: '50%', 
          marginRight: 8 
        }}></span>
        AWS Regions
      </div>
      
      <div style={{ marginBottom: 8 }}>
        <span style={{ 
          display: 'inline-block', 
          width: 12, 
          height: 12, 
          background: PROVIDER_COLORS.GCP, 
          borderRadius: '50%', 
          marginRight: 8 
        }}></span>
        GCP Regions
      </div>
      
      <div style={{ marginBottom: 8 }}>
        <span style={{ 
          display: 'inline-block', 
          width: 12, 
          height: 12, 
          background: PROVIDER_COLORS.Azure, 
          borderRadius: '50%', 
          marginRight: 8 
        }}></span>
        Azure Regions
      </div>
      
      <hr style={{ 
        border: 'none', 
        borderTop: '1px solid rgba(255, 255, 255, 0.2)', 
        margin: '10px 0' 
      }} />
      
      <div style={{ marginBottom: 5 }}>
        <span style={{ color: '#00ff00' }}>Green</span>: &lt;50ms
      </div>
      <div style={{ marginBottom: 5 }}>
        <span style={{ color: '#ffff00' }}>Yellow</span>: 50-150ms
      </div>
      <div>
        <span style={{ color: '#ff0000' }}>Red</span>: &gt;150ms
      </div>
    </div>
  );
};
