import { useState, useEffect } from 'react';
import { Arc, Location, Filters } from '../types';
import { EXCHANGES, CLOUD_REGIONS } from '../constants/locations';
import { calculateDistance, generateLatency } from '../utils/latency';

/**
 * Custom hook to manage latency data and connections
 */
export const useLatencyData = (filters: Filters) => {
  const [arcsData, setArcsData] = useState<Arc[]>([]);
  const [pointsData, setPointsData] = useState<Location[]>([]);

  useEffect(() => {
    // Filter data based on selected filters
    const filteredExchanges = EXCHANGES.filter(
      ex => filters[ex.provider.toLowerCase() as keyof Pick<Filters, 'aws' | 'gcp' | 'azure'>] && 
      filters.showExchanges
    );
    
    const filteredRegions = CLOUD_REGIONS.filter(
      reg => filters[reg.provider.toLowerCase() as keyof Pick<Filters, 'aws' | 'gcp' | 'azure'>] && 
      filters.showRegions
    );
    
    setPointsData([...filteredExchanges, ...filteredRegions]);

    // Generate latency connections
    const connections: Arc[] = [];
    filteredExchanges.forEach(exchange => {
      filteredRegions.forEach(region => {
        const distance = calculateDistance(
          exchange.lat, 
          exchange.lng, 
          region.lat, 
          region.lng
        );
        const latency = generateLatency(distance);
        
        // Apply latency range filter
        if (filters.latencyRange === 'low' && latency > 50) return;
        if (filters.latencyRange === 'medium' && (latency < 50 || latency > 150)) return;
        if (filters.latencyRange === 'high' && latency < 150) return;

        connections.push({
          src: exchange,
          dst: region,
          latency,
          distance
        });
      });
    });

    setArcsData(connections);
  }, [filters]);

  // Update latency data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setArcsData(prev => prev.map(arc => ({
        ...arc,
        latency: generateLatency(arc.distance)
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return { arcsData, pointsData };
};
