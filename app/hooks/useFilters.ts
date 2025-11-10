import { useState } from 'react';
import { Filters } from '../types';

/**
 * Custom hook to manage filter state
 */
export const useFilters = () => {
  const [filters, setFilters] = useState<Filters>({
    aws: true,
    gcp: true,
    azure: true,
    showExchanges: true,
    showRegions: true,
    latencyRange: 'all'
  });

  const toggleProvider = (provider: 'aws' | 'gcp' | 'azure') => {
    setFilters(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const toggleDisplay = (displayType: 'showExchanges' | 'showRegions') => {
    setFilters(prev => ({ ...prev, [displayType]: !prev[displayType] }));
  };

  const setLatencyRange = (range: Filters['latencyRange']) => {
    setFilters(prev => ({ ...prev, latencyRange: range }));
  };

  return {
    filters,
    toggleProvider,
    toggleDisplay,
    setLatencyRange
  };
};
