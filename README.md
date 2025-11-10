# 🌍 Latency Topology Visualizer

A real-time 3D network latency visualization tool that displays connections between cryptocurrency exchanges and cloud provider regions on an interactive globe. Built with **Next.js**, **React**, and **react-globe.gl**.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat&logo=three.js&logoColor=white)

## ✨ Features

- 🌐 **Interactive 3D Globe** - Explore global network topology in real-time
- ⚡ **Live Latency Monitoring** - Auto-refreshing latency data every 5 seconds
- 🎨 **Color-Coded Visualization** - Instant visual feedback on connection quality
  - 🟢 Green: <50ms (Excellent)
  - 🟡 Yellow: 50-150ms (Good)
  - 🔴 Red: >150ms (Poor)
- 🔍 **Advanced Filtering** - Filter by cloud provider (AWS, GCP, Azure) and latency range
- 📊 **Historical Analysis** - View latency trends over 1h, 24h, 7d, or 30d periods
- 📈 **Statistical Insights** - Min, max, and average latency calculations
- 🏗️ **Modular Architecture** - Clean, maintainable, and scalable codebase

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/adnanadil377/Latency-Topology-Visualizer.git
cd topology-vis

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure

```
app/
├── components/              # Reusable UI components
│   ├── ControlPanel.tsx    # Filter controls
│   ├── Legend.tsx          # Color legend
│   ├── HistoricalDataPanel.tsx  # Chart display
│   └── GlobeVisualization.tsx   # 3D globe
├── hooks/                   # Custom React hooks
│   ├── useFilters.ts       # Filter state management
│   ├── useLatencyData.ts   # Data generation & updates
│   └── useHistoricalData.ts # Historical analysis
├── utils/                   # Utility functions
│   └── latency.ts          # Calculations & helpers
├── types/                   # TypeScript definitions
│   └── index.ts            # All interfaces & types
├── constants/               # Application constants
│   └── locations.ts        # Exchange & region data
├── page.tsx                 # Main application page
├── layout.tsx               # Root layout
└── globals.css              # Global styles
```

## 🎮 Usage

### Control Panel (Top Left)

**Cloud Providers:**
- Toggle AWS, GCP, or Azure regions on/off
- Each provider has a distinct color

**Display Options:**
- Show/hide cryptocurrency exchanges
- Show/hide cloud regions

**Latency Range Filter:**
- All - Show all connections
- Low - Only <50ms connections
- Medium - Only 50-150ms connections  
- High - Only >150ms connections

### Globe Interaction

- **Click & Drag** - Rotate the globe
- **Scroll** - Zoom in/out
- **Click Point** - View detailed latency information and historical data

### Historical Data Panel (Bottom)

- Appears when you click on any point
- Select time range: 1h, 24h, 7d, or 30d
- View min/max/average latency statistics
- Interactive line chart showing latency trends

## 📦 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Library:** [React 19](https://react.dev/)
- **3D Visualization:** [react-globe.gl](https://github.com/vasturiano/react-globe.gl)
- **Charts:** [Recharts](https://recharts.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)

## 🎯 Key Components

### Custom Hooks

**`useFilters`** - Manages filter state and provides toggle functions
```typescript
const { filters, toggleProvider, toggleDisplay, setLatencyRange } = useFilters();
```

**`useLatencyData`** - Generates connections and auto-refreshes latency
```typescript
const { arcsData, pointsData } = useLatencyData(filters);
```

**`useHistoricalData`** - Handles selection and historical analysis
```typescript
const { selectedPair, historicalData, stats } = useHistoricalData();
```

## 📊 Data Model

**Exchanges:** 8 cryptocurrency exchanges (Binance, Coinbase, Kraken, etc.)

**Cloud Regions:** 7 cloud provider regions across AWS, GCP, and Azure

**Total Connections:** Up to 56 bidirectional connections (8 × 7)

## 🔧 Utility Functions

- `calculateDistance()` - Haversine formula for geographic distance
- `generateLatency()` - Simulates realistic latency based on distance
- `generateHistoricalData()` - Creates time-series data
- `calculateStats()` - Computes min/max/avg statistics
- `getArcColor()` - Color-codes arcs by latency
- `getPointColor()` - Color-codes points by provider

## 🚀 Build & Deploy

### Production Build

```bash
npm run build
npm start
```

### Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/adnanadil377/Latency-Topology-Visualizer)

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

## 📖 Documentation

For detailed architecture information, see [ARCHITECTURE.md](./ARCHITECTURE.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [react-globe.gl](https://github.com/vasturiano/react-globe.gl) - 3D globe visualization
- [Recharts](https://recharts.org/) - Charting library
- [Three.js](https://threejs.org/) - 3D graphics library

---

Made with ❤️ by [adnanadil377](https://github.com/adnanadil377)
