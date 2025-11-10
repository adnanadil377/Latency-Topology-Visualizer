# Project Structure

This project has been refactored into a modular architecture for better maintainability, reusability, and testability.

## Directory Structure

```
app/
├── components/          # Reusable UI components
│   ├── ControlPanel.tsx
│   ├── Legend.tsx
│   ├── HistoricalDataPanel.tsx
│   └── GlobeVisualization.tsx
├── hooks/              # Custom React hooks
│   ├── useFilters.ts
│   ├── useLatencyData.ts
│   └── useHistoricalData.ts
├── utils/              # Utility functions
│   └── latency.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── constants/          # Application constants
│   └── locations.ts
├── page.tsx            # Main page component
├── layout.tsx          # Root layout
└── globals.css         # Global styles
```

## Module Descriptions

### Components (`/components`)

**GlobeVisualization.tsx**
- Renders the 3D globe with points and arcs
- Handles globe interactions and visualization

**ControlPanel.tsx**
- Filter controls for cloud providers
- Display toggles for exchanges and regions
- Latency range selector

**Legend.tsx**
- Color coding legend for providers
- Latency color indicators

**HistoricalDataPanel.tsx**
- Displays historical latency data
- Interactive time range selector
- Line chart visualization with statistics

### Custom Hooks (`/hooks`)

**useFilters.ts**
- Manages filter state
- Provides filter toggle functions
- Centralizes filter logic

**useLatencyData.ts**
- Generates and manages latency connections
- Filters data based on user preferences
- Auto-updates latency values periodically

**useHistoricalData.ts**
- Manages selected connection pair
- Generates and updates historical data
- Calculates latency statistics

### Utilities (`/utils`)

**latency.ts**
- `calculateDistance()` - Haversine formula for geographic distance
- `generateLatency()` - Generate latency based on distance
- `generateHistoricalData()` - Create time-series data
- `calculateStats()` - Compute min/max/avg statistics
- `getArcColor()` - Color coding based on latency
- `getPointColor()` - Color coding based on provider

### Types (`/types`)

**index.ts**
- All TypeScript interfaces and types
- Includes: Location, Arc, Filters, Stats, HistoricalDataPoint, TimeRange, CloudProvider

### Constants (`/constants`)

**locations.ts**
- Exchange locations data
- Cloud region data
- Provider color mappings
- Latency thresholds

## Benefits of This Architecture

1. **Separation of Concerns**: Each module has a single, well-defined responsibility
2. **Reusability**: Components and hooks can be easily reused across the application
3. **Testability**: Isolated modules are easier to unit test
4. **Maintainability**: Changes to one module don't cascade to others
5. **Scalability**: Easy to add new features without modifying existing code
6. **Type Safety**: Centralized type definitions ensure consistency
7. **Performance**: Custom hooks optimize state management and re-renders
8. **Code Organization**: Clear file structure makes navigation intuitive

## Key Improvements

- **Before**: Single 446-line file with mixed concerns
- **After**: 12 modular files with clear responsibilities
- Reduced main component from 446 lines to 73 lines
- Extracted 3 custom hooks for state management
- Created 4 reusable UI components
- Centralized types, constants, and utilities

## Development Guidelines

- Add new components in `/components`
- Create custom hooks for complex state logic in `/hooks`
- Place pure functions in `/utils`
- Define types in `/types/index.ts`
- Add configuration data in `/constants`
