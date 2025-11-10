'use client'
import React from 'react';
import { GlobeVisualization } from './components/GlobeVisualization';
import { ControlPanel } from './components/ControlPanel';
import { Legend } from './components/Legend';
import { HistoricalDataPanel } from './components/HistoricalDataPanel';
import { useFilters } from './hooks/useFilters';
import { useLatencyData } from './hooks/useLatencyData';
import { useHistoricalData } from './hooks/useHistoricalData';
import { Location } from './types';

const LatencyVisualizer: React.FC = () => {
  const { filters, toggleProvider, toggleDisplay, setLatencyRange } = useFilters();
  const { arcsData, pointsData } = useLatencyData(filters);
  const {
    selectedPair,
    historicalData,
    stats,
    timeRange,
    selectPair,
    clearSelection,
    updateTimeRange
  } = useHistoricalData();

  // Handle point click
  const handlePointClick = (point: Location) => {
    const relatedArcs = arcsData.filter(arc => 
      arc.src.name === point.name || arc.dst.name === point.name
    );
    
    if (relatedArcs.length > 0) {
      selectPair(relatedArcs[0]);
    }
  };

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: '#0a0e27', 
      position: 'relative', 
      overflow: 'hidden' 
    }}>
      <ControlPanel
        filters={filters}
        onToggleProvider={toggleProvider}
        onToggleDisplay={toggleDisplay}
        onSetLatencyRange={setLatencyRange}
      />

      <Legend />

      {selectedPair && (
        <HistoricalDataPanel
          selectedPair={selectedPair}
          historicalData={historicalData}
          stats={stats}
          timeRange={timeRange}
          onClose={clearSelection}
          onTimeRangeChange={updateTimeRange}
        />
      )}

      <GlobeVisualization
        pointsData={pointsData}
        arcsData={arcsData}
        onPointClick={handlePointClick}
      />
    </div>
  );
};

export default LatencyVisualizer;

