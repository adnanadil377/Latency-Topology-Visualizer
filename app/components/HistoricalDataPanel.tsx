import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Arc, HistoricalDataPoint, Stats, TimeRange } from '../types';

interface HistoricalDataPanelProps {
  selectedPair: Arc;
  historicalData: HistoricalDataPoint[];
  stats: Stats;
  timeRange: TimeRange;
  onClose: () => void;
  onTimeRangeChange: (range: TimeRange) => void;
}

export const HistoricalDataPanel: React.FC<HistoricalDataPanelProps> = ({
  selectedPair,
  historicalData,
  stats,
  timeRange,
  onClose,
  onTimeRangeChange
}) => {
  const timeRanges: TimeRange[] = ['1h', '24h', '7d', '30d'];

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      background: 'rgba(10, 14, 39, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 8,
      padding: 20,
      color: 'white',
      zIndex: 1000,
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 15 
      }}>
        <h3 style={{ margin: 0, fontSize: 16 }}>
          {selectedPair.src.name} → {selectedPair.dst.name}
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: 'white',
            padding: '5px 10px',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>

      <div style={{ display: 'flex', gap: 20, marginBottom: 15 }}>
        <div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Min Latency</div>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#00ff88' }}>
            {stats.min}ms
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Avg Latency</div>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#ffff00' }}>
            {stats.avg}ms
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Max Latency</div>
          <div style={{ fontSize: 20, fontWeight: 'bold', color: '#ff6666' }}>
            {stats.max}ms
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        {timeRanges.map(range => (
          <button
            key={range}
            onClick={() => onTimeRangeChange(range)}
            style={{
              background: timeRange === range 
                ? 'rgba(0, 255, 136, 0.2)' 
                : 'rgba(255, 255, 255, 0.1)',
              border: timeRange === range 
                ? '1px solid #00ff88' 
                : '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '5px 15px',
              marginRight: 5,
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            {range}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={historicalData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="label" stroke="rgba(255,255,255,0.5)" />
          <YAxis stroke="rgba(255,255,255,0.5)" />
          <Tooltip
            contentStyle={{ 
              background: 'rgba(10, 14, 39, 0.9)', 
              border: '1px solid rgba(255, 255, 255, 0.2)', 
              borderRadius: 4 
            }}
            labelStyle={{ color: '#fff' }}
          />
          <Line 
            type="monotone" 
            dataKey="latency" 
            stroke="#00ff88" 
            strokeWidth={2} 
            dot={{ fill: '#00ff88' }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
