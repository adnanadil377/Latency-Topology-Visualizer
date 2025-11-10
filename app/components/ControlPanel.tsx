import React from 'react';
import { Filters, CloudProvider } from '../types';
import { PROVIDER_COLORS } from '../constants/locations';

interface ControlPanelProps {
  filters: Filters;
  onToggleProvider: (provider: 'aws' | 'gcp' | 'azure') => void;
  onToggleDisplay: (displayType: 'showExchanges' | 'showRegions') => void;
  onSetLatencyRange: (range: Filters['latencyRange']) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  filters,
  onToggleProvider,
  onToggleDisplay,
  onSetLatencyRange
}) => {
  const providers: Array<{ key: 'aws' | 'gcp' | 'azure'; label: CloudProvider }> = [
    { key: 'aws', label: 'AWS' },
    { key: 'gcp', label: 'GCP' },
    { key: 'azure', label: 'Azure' }
  ];

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      left: 20,
      background: 'rgba(10, 14, 39, 0.9)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 8,
      padding: 20,
      color: 'white',
      zIndex: 1000,
      maxWidth: 300,
      backdropFilter: 'blur(10px)'
    }}>
      <h2 style={{ margin: '0 0 15px 0', fontSize: 18 }}>Control Panel</h2>
      
      <div style={{ marginBottom: 15 }}>
        <h3 style={{ fontSize: 14, marginBottom: 8 }}>Cloud Providers</h3>
        {providers.map(({ key, label }) => (
          <label key={key} style={{ display: 'block', marginBottom: 5, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filters[key]}
              onChange={() => onToggleProvider(key)}
              style={{ marginRight: 8 }}
            />
            <span style={{ color: PROVIDER_COLORS[label] }}>
              {label}
            </span>
          </label>
        ))}
      </div>

      <div style={{ marginBottom: 15 }}>
        <h3 style={{ fontSize: 14, marginBottom: 8 }}>Display</h3>
        <label style={{ display: 'block', marginBottom: 5, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={filters.showExchanges}
            onChange={() => onToggleDisplay('showExchanges')}
            style={{ marginRight: 8 }}
          />
          Exchanges
        </label>
        <label style={{ display: 'block', marginBottom: 5, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={filters.showRegions}
            onChange={() => onToggleDisplay('showRegions')}
            style={{ marginRight: 8 }}
          />
          Cloud Regions
        </label>
      </div>

      <div>
        <h3 style={{ fontSize: 14, marginBottom: 8 }}>Latency Range</h3>
        <select
          value={filters.latencyRange}
          onChange={(e) => onSetLatencyRange(e.target.value as Filters['latencyRange'])}
          style={{
            width: '100%',
            padding: 8,
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 4,
            color: 'white'
          }}
        >
          <option value="all">All</option>
          <option value="low">Low (&lt;50ms)</option>
          <option value="medium">Medium (50-150ms)</option>
          <option value="high">High (&gt;150ms)</option>
        </select>
      </div>
    </div>
  );
};
