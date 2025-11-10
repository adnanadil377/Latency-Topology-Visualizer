import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import { Arc, Location } from '../types';
import { getPointColor, getArcColor } from '../utils/latency';

const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: '#0a0e27', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      color: 'white' 
    }}>
      Loading Globe...
    </div>
  )
});

interface GlobeVisualizationProps {
  pointsData: Location[];
  arcsData: Arc[];
  onPointClick: (point: Location) => void;
}

export const GlobeVisualization: React.FC<GlobeVisualizationProps> = ({
  pointsData,
  arcsData,
  onPointClick
}) => {
  const globeEl = useRef<any>(null);

  return (
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
      pointColor={(d: any) => getPointColor(d as Location)}
      pointLabel={(d: any) => `<b>${d.name}</b><br/>${d.location || d.region}<br/>${d.provider}`}
      onPointClick={(point: any) => onPointClick(point as Location)}
      
      arcsData={arcsData}
      arcStartLat={(d: any) => (d as Arc).src.lat}
      arcStartLng={(d: any) => (d as Arc).src.lng}
      arcEndLat={(d: any) => (d as Arc).dst.lat}
      arcEndLng={(d: any) => (d as Arc).dst.lng}
      arcColor={(d: any) => getArcColor((d as Arc).latency)}
      arcDashLength={0.4}
      arcDashGap={0.2}
      arcDashInitialGap={() => Math.random()}
      arcDashAnimateTime={3000}
      arcStroke={0.5}
      arcAltitude={(d: any) => Math.min(0.3, (d as Arc).latency / 500)}
      arcLabel={(d: any) => {
        const arc = d as Arc;
        return `<b>${arc.src.name} → ${arc.dst.name}</b><br/>Latency: ${arc.latency}ms<br/>Distance: ${Math.round(arc.distance)}km`;
      }}
    />
  );
};
