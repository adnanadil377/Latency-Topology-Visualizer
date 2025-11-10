// Location and Network Types
export interface Location {
  name: string;
  lat: number;
  lng: number;
  location?: string;
  provider: 'AWS' | 'GCP' | 'Azure';
  region?: string;
}

export interface Arc {
  src: Location;
  dst: Location;
  latency: number;
  distance: number;
}

// Filter Types
export interface Filters {
  aws: boolean;
  gcp: boolean;
  azure: boolean;
  showExchanges: boolean;
  showRegions: boolean;
  latencyRange: 'all' | 'low' | 'medium' | 'high';
}

// Statistics Types
export interface Stats {
  min: number;
  max: number;
  avg: number;
}

// Historical Data Types
export interface HistoricalDataPoint {
  time: number;
  latency: number;
  label: string;
}

export type TimeRange = '1h' | '24h' | '7d' | '30d';

export type CloudProvider = 'AWS' | 'GCP' | 'Azure';
