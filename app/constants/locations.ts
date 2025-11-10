import { Location } from '../types';

// Mock cryptocurrency exchange locations
export const EXCHANGES: Location[] = [
  { name: 'Binance', lat: 35.6762, lng: 139.6503, location: 'Tokyo', provider: 'AWS', region: 'ap-northeast-1' },
  { name: 'Coinbase', lat: 37.7749, lng: -122.4194, location: 'San Francisco', provider: 'GCP', region: 'us-west1' },
  { name: 'Kraken', lat: 51.5074, lng: -0.1278, location: 'London', provider: 'AWS', region: 'eu-west-2' },
  { name: 'Bybit', lat: 1.3521, lng: 103.8198, location: 'Singapore', provider: 'AWS', region: 'ap-southeast-1' },
  { name: 'OKX', lat: 22.3193, lng: 114.1694, location: 'Hong Kong', provider: 'Azure', region: 'eastasia' },
  { name: 'Deribit', lat: 52.3676, lng: 4.9041, location: 'Amsterdam', provider: 'GCP', region: 'europe-west4' },
  { name: 'Bitfinex', lat: 48.8566, lng: 2.3522, location: 'Paris', provider: 'Azure', region: 'francecentral' },
  { name: 'Huobi', lat: 37.5665, lng: 126.9780, location: 'Seoul', provider: 'AWS', region: 'ap-northeast-2' }
];

// Cloud provider regions
export const CLOUD_REGIONS: Location[] = [
  { name: 'AWS US-East', lat: 38.9072, lng: -77.0369, provider: 'AWS', region: 'us-east-1' },
  { name: 'AWS EU-West', lat: 53.3498, lng: -6.2603, provider: 'AWS', region: 'eu-west-1' },
  { name: 'AWS AP-South', lat: 19.0760, lng: 72.8777, provider: 'AWS', region: 'ap-south-1' },
  { name: 'GCP US-Central', lat: 41.2619, lng: -95.8608, provider: 'GCP', region: 'us-central1' },
  { name: 'GCP EU-West', lat: 50.4501, lng: 3.8196, provider: 'GCP', region: 'europe-west1' },
  { name: 'Azure US-West', lat: 47.6062, lng: -122.3321, provider: 'Azure', region: 'westus2' },
  { name: 'Azure EU-North', lat: 53.3498, lng: -6.2603, provider: 'Azure', region: 'northeurope' }
];

export const PROVIDER_COLORS = {
  AWS: '#FF9900',
  GCP: '#4285F4',
  Azure: '#0078D4',
  Exchange: '#00ff88'
} as const;

export const LATENCY_THRESHOLDS = {
  LOW: 50,
  MEDIUM: 150
} as const;
