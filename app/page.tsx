'use client'
import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
  loading: () => <div style={{ width: '100vw', height: '100vh', background: '#0a0e27', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Loading Globe...</div>
});

// Types
interface Location {
  name: string;
  lat: number;
  lng: number;
  location?: string;
  provider: 'AWS' | 'GCP' | 'Azure';
  region?: string;
}

interface Arc {
  src: Location;
  dst: Location;
  latency: number;
  distance: number;
}

interface Filters {
  aws: boolean;
  gcp: boolean;
  azure: boolean;
  showExchanges: boolean;
  showRegions: boolean;
  latencyRange: 'all' | 'low' | 'medium' | 'high';
}

interface Stats {
  min: number;
  max: number;
  avg: number;
}

interface HistoricalDataPoint {
  time: number;
  latency: number;
  label: string;
}

// Mock cryptocurrency exchange locations
const EXCHANGES: Location[] = [
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
const CLOUD_REGIONS: Location[] = [
  { name: 'AWS US-East', lat: 38.9072, lng: -77.0369, provider: 'AWS', region: 'us-east-1' },
  { name: 'AWS EU-West', lat: 53.3498, lng: -6.2603, provider: 'AWS', region: 'eu-west-1' },
  { name: 'AWS AP-South', lat: 19.0760, lng: 72.8777, provider: 'AWS', region: 'ap-south-1' },
  { name: 'GCP US-Central', lat: 41.2619, lng: -95.8608, provider: 'GCP', region: 'us-central1' },
  { name: 'GCP EU-West', lat: 50.4501, lng: 3.8196, provider: 'GCP', region: 'europe-west1' },
  { name: 'Azure US-West', lat: 47.6062, lng: -122.3321, provider: 'Azure', region: 'westus2' },
  { name: 'Azure EU-North', lat: 53.3498, lng: -6.2603, provider: 'Azure', region: 'northeurope' }
];

const LatencyVisualizer: React.FC = () => {
  const globeEl = useRef<any>();
  const [arcsData, setArcsData] = useState<Arc[]>([]);
  const [pointsData, setPointsData] = useState<Location[]>([]);
  const [selectedPair, setSelectedPair] = useState<Arc | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [filters, setFilters] = useState<Filters>({
    aws: true,
    gcp: true,
    azure: true,
    showExchanges: true,
    showRegions: true,
    latencyRange: 'all'
  });
  const [stats, setStats] = useState<Stats>({ min: 0, max: 0, avg: 0 });
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('1h');

  // Generate random latency value
  const generateLatency = (distance: number): number => {
    const baseLatency = distance * 0.15;
    return Math.round(baseLatency + Math.random() * 50);
  };

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // Generate historical data
  const generateHistoricalData = (srcName: string, dstName: string, baseLatency: number): HistoricalDataPoint[] => {
    const points = timeRange === '1h' ? 12 : timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30;
    return Array.from({ length: points }, (_, i) => ({
      time: i,
      latency: baseLatency + Math.random() * 20 - 10,
      label: timeRange === '1h' ? `${i * 5}m` : timeRange === '24h' ? `${i}h` : `Day ${i + 1}`
    }));
  };

  useEffect(() => {
    // Filter data based on selected filters
    const filteredExchanges = EXCHANGES.filter(ex => filters[ex.provider.toLowerCase() as keyof Pick<Filters, 'aws' | 'gcp' | 'azure'>] && filters.showExchanges);
    const filteredRegions = CLOUD_REGIONS.filter(reg => filters[reg.provider.toLowerCase() as keyof Pick<Filters, 'aws' | 'gcp' | 'azure'>] && filters.showRegions);
    
    setPointsData([...filteredExchanges, ...filteredRegions]);

    // Generate latency connections
    const connections: Arc[] = [];
    filteredExchanges.forEach(exchange => {
      filteredRegions.forEach(region => {
        const distance = calculateDistance(exchange.lat, exchange.lng, region.lat, region.lng);
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

  // Handle point click
  const handlePointClick = (point: Location) => {
    const relatedArcs = arcsData.filter(arc => 
      arc.src.name === point.name || arc.dst.name === point.name
    );
    
    if (relatedArcs.length > 0) {
      const arc = relatedArcs[0];
      setSelectedPair(arc);
      const data = generateHistoricalData(arc.src.name, arc.dst.name, arc.latency);
      setHistoricalData(data);
      
      const latencies = data.map(d => d.latency);
      setStats({
        min: Math.round(Math.min(...latencies)),
        max: Math.round(Math.max(...latencies)),
        avg: Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
      });
    }
  };

  const getPointColor = (point: Location): string => {
    if (point.region) {
      // It's a cloud region
      switch (point.provider) {
        case 'AWS': return '#FF9900';
        case 'GCP': return '#4285F4';
        case 'Azure': return '#0078D4';
        default: return '#ffffff';
      }
    } else {
      // It's an exchange
      return '#00ff88';
    }
  };

  const getArcColor = (d: Arc): [string, string] => {
    if (d.latency < 50) return ['rgba(0, 255, 0, 0.8)', 'rgba(0, 255, 0, 0.3)'];
    if (d.latency < 150) return ['rgba(255, 255, 0, 0.8)', 'rgba(255, 165, 0, 0.3)'];
    return ['rgba(255, 0, 0, 0.8)', 'rgba(255, 0, 0, 0.3)'];
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0e27', position: 'relative', overflow: 'hidden' }}>
      {/* Control Panel */}
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
          {(['AWS', 'GCP', 'Azure'] as const).map(provider => (
            <label key={provider} style={{ display: 'block', marginBottom: 5, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={filters[provider.toLowerCase() as keyof Pick<Filters, 'aws' | 'gcp' | 'azure'>]}
                onChange={(e) => setFilters({ ...filters, [provider.toLowerCase()]: e.target.checked })}
                style={{ marginRight: 8 }}
              />
              <span style={{ color: provider === 'AWS' ? '#FF9900' : provider === 'GCP' ? '#4285F4' : '#0078D4' }}>
                {provider}
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
              onChange={(e) => setFilters({ ...filters, showExchanges: e.target.checked })}
              style={{ marginRight: 8 }}
            />
            Exchanges
          </label>
          <label style={{ display: 'block', marginBottom: 5, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filters.showRegions}
              onChange={(e) => setFilters({ ...filters, showRegions: e.target.checked })}
              style={{ marginRight: 8 }}
            />
            Cloud Regions
          </label>
        </div>

        <div>
          <h3 style={{ fontSize: 14, marginBottom: 8 }}>Latency Range</h3>
          <select
            value={filters.latencyRange}
            onChange={(e) => setFilters({ ...filters, latencyRange: e.target.value as Filters['latencyRange'] })}
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

      {/* Legend */}
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
          <span style={{ display: 'inline-block', width: 12, height: 12, background: '#00ff88', borderRadius: '50%', marginRight: 8 }}></span>
          Exchanges
        </div>
        <div style={{ marginBottom: 8 }}>
          <span style={{ display: 'inline-block', width: 12, height: 12, background: '#FF9900', borderRadius: '50%', marginRight: 8 }}></span>
          AWS Regions
        </div>
        <div style={{ marginBottom: 8 }}>
          <span style={{ display: 'inline-block', width: 12, height: 12, background: '#4285F4', borderRadius: '50%', marginRight: 8 }}></span>
          GCP Regions
        </div>
        <div style={{ marginBottom: 8 }}>
          <span style={{ display: 'inline-block', width: 12, height: 12, background: '#0078D4', borderRadius: '50%', marginRight: 8 }}></span>
          Azure Regions
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.2)', margin: '10px 0' }} />
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

      {/* Historical Data Panel */}
      {selectedPair && (
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>
              {selectedPair.src.name} → {selectedPair.dst.name}
            </h3>
            <button
              onClick={() => setSelectedPair(null)}
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
              <div style={{ fontSize: 20, fontWeight: 'bold', color: '#00ff88' }}>{stats.min}ms</div>
            </div>
            <div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Avg Latency</div>
              <div style={{ fontSize: 20, fontWeight: 'bold', color: '#ffff00' }}>{stats.avg}ms</div>
            </div>
            <div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Max Latency</div>
              <div style={{ fontSize: 20, fontWeight: 'bold', color: '#ff6666' }}>{stats.max}ms</div>
            </div>
          </div>

          <div style={{ marginBottom: 10 }}>
            {(['1h', '24h', '7d', '30d'] as const).map(range => (
              <button
                key={range}
                onClick={() => {
                  setTimeRange(range);
                  const data = generateHistoricalData(selectedPair.src.name, selectedPair.dst.name, selectedPair.latency);
                  setHistoricalData(data);
                }}
                style={{
                  background: timeRange === range ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  border: timeRange === range ? '1px solid #00ff88' : '1px solid rgba(255, 255, 255, 0.2)',
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
                contentStyle={{ background: 'rgba(10, 14, 39, 0.9)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: 4 }}
                labelStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="latency" stroke="#00ff88" strokeWidth={2} dot={{ fill: '#00ff88' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Globe */}
      <Globe
        ref={globeEl}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        showAtmosphere={true}
        atmosphereColor="#3a5ba0"
        atmosphereAltitude={0.15}
        
        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.01}
        pointRadius={0.5}
        pointColor={getPointColor}
        pointLabel={(d: any) => `<b>${d.name}</b><br/>${d.location || d.region}<br/>${d.provider}`}
        onPointClick={handlePointClick}
        
        arcsData={arcsData}
        arcStartLat={(d: Arc) => d.src.lat}
        arcStartLng={(d: Arc) => d.src.lng}
        arcEndLat={(d: Arc) => d.dst.lat}
        arcEndLng={(d: Arc) => d.dst.lng}
        arcColor={getArcColor}
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashInitialGap={() => Math.random()}
        arcDashAnimateTime={3000}
        arcStroke={0.5}
        arcAltitude={(d: Arc) => Math.min(0.3, d.latency / 500)}
        arcLabel={(d: Arc) => `<b>${d.src.name} → ${d.dst.name}</b><br/>Latency: ${d.latency}ms<br/>Distance: ${Math.round(d.distance)}km`}
      />
    </div>
  );
};

export default LatencyVisualizer;