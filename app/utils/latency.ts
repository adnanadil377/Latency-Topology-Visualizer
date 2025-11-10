import { Arc, Location, HistoricalDataPoint, TimeRange } from '../types';
import { LATENCY_THRESHOLDS } from '../constants/locations';

/**
 * Calculate distance between two geographic points using Haversine formula
 */
export const calculateDistance = (
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) ** 2 + 
    Math.cos(lat1 * Math.PI / 180) * 
    Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/**
 * Generate a random latency value based on distance
 */
export const generateLatency = (distance: number): number => {
  const baseLatency = distance * 0.15;
  return Math.round(baseLatency + Math.random() * 50);
};

/**
 * Generate historical data points for latency visualization
 */
export const generateHistoricalData = (
  srcName: string,
  dstName: string,
  baseLatency: number,
  timeRange: TimeRange
): HistoricalDataPoint[] => {
  const points = timeRange === '1h' ? 12 : 
                timeRange === '24h' ? 24 : 
                timeRange === '7d' ? 7 : 30;
  
  return Array.from({ length: points }, (_, i) => ({
    time: i,
    latency: baseLatency + Math.random() * 20 - 10,
    label: timeRange === '1h' 
      ? `${i * 5}m` 
      : timeRange === '24h' 
        ? `${i}h` 
        : `Day ${i + 1}`
  }));
};

/**
 * Calculate statistics from historical data
 */
export const calculateStats = (data: HistoricalDataPoint[]) => {
  const latencies = data.map(d => d.latency);
  return {
    min: Math.round(Math.min(...latencies)),
    max: Math.round(Math.max(...latencies)),
    avg: Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
  };
};

/**
 * Get color for arc based on latency
 */
export const getArcColor = (latency: number): [string, string] => {
  if (latency < LATENCY_THRESHOLDS.LOW) {
    return ['rgba(0, 255, 0, 0.8)', 'rgba(0, 255, 0, 0.3)'];
  }
  if (latency < LATENCY_THRESHOLDS.MEDIUM) {
    return ['rgba(255, 255, 0, 0.8)', 'rgba(255, 165, 0, 0.3)'];
  }
  return ['rgba(255, 0, 0, 0.8)', 'rgba(255, 0, 0, 0.3)'];
};

/**
 * Get color for a point based on provider type
 */
export const getPointColor = (point: Location): string => {
  if (point.region) {
    // It's a cloud region
    switch (point.provider) {
      case 'AWS': return '#FF9900';
      case 'GCP': return '#4285F4';
      case 'Azure': return '#0078D4';
      default: return '#ffffff';
    }
  }
  // It's an exchange
  return '#00ff88';
};
