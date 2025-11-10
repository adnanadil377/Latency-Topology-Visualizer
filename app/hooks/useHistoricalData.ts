import { useState } from 'react';
import { Arc, HistoricalDataPoint, Stats, TimeRange } from '../types';
import { generateHistoricalData, calculateStats } from '../utils/latency';

/**
 * Custom hook to manage selected pair and historical data
 */
export const useHistoricalData = () => {
  const [selectedPair, setSelectedPair] = useState<Arc | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [stats, setStats] = useState<Stats>({ min: 0, max: 0, avg: 0 });
  const [timeRange, setTimeRange] = useState<TimeRange>('1h');

  const selectPair = (arc: Arc) => {
    setSelectedPair(arc);
    const data = generateHistoricalData(arc.src.name, arc.dst.name, arc.latency, timeRange);
    setHistoricalData(data);
    setStats(calculateStats(data));
  };

  const clearSelection = () => {
    setSelectedPair(null);
  };

  const updateTimeRange = (range: TimeRange) => {
    setTimeRange(range);
    if (selectedPair) {
      const data = generateHistoricalData(
        selectedPair.src.name, 
        selectedPair.dst.name, 
        selectedPair.latency, 
        range
      );
      setHistoricalData(data);
      setStats(calculateStats(data));
    }
  };

  return {
    selectedPair,
    historicalData,
    stats,
    timeRange,
    selectPair,
    clearSelection,
    updateTimeRange
  };
};
