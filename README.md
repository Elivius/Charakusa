# K6 Load Testing Web Application

A modern, developer-centric web application for running k6 load tests with an intuitive UI.

## Prerequisites

- **Node.js** 18+ 
- **pnpm** (package manager)
- **k6** installed on your system ([Download k6](https://k6.io/docs/get-started/installation/))

## Installation

1. Install dependencies:
```bash
pnpm install
```

## Running the Application

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

### Test Types
- **Smoke Test**: Minimal load sanity check (2-5 VUs, 1-2 min)
- **Average Load**: Typical real-world load with gradual ramp-up
- **Stress Test**: Beyond normal capacity (200+ VUs)
- **Soak Test**: Extended duration to detect memory leaks
- **Spike Test**: Sudden sharp load increases
- **Breakpoint Test**: Find maximum throughput limits
- **Custom Test**: Fully customizable configuration

### Executor Types
- **Shared Iterations**: Fixed total iterations shared among VUs
- **Per VU Iterations**: Each VU runs a fixed number of iterations
- **Constant VUs**: Fixed number of VUs throughout the test
- **Ramping VUs**: VU count increases/decreases per schedule
- **Constant Arrival Rate**: Fixed iterations per time period
- **Ramping Arrival Rate**: Variable iteration rate over time

### Key Features
- ✅ Visual test type selection
- ✅ Comprehensive request configuration (URL, method, headers, body)
- ✅ Auto-generated k6 scripts with preview
- ✅ Real-time test execution with live console output
- ✅ Detailed metrics visualization (checks, HTTP, execution, network)
- ✅ Export/Import test results (JSON format)
- ✅ Dark/Light theme support
- ✅ Saved configurations (localStorage)
- ✅ Responsive design

## Export/Import Workflow

### Exporting Results
After running a test, click the **Export Results** button to download the test results as a JSON file. This file contains:
- Test configuration
- All metrics (checks, HTTP, execution, network)
- Raw k6 CLI output
- Test duration and status

### Importing Results
To view previously exported results:
1. Click **Import Results** in the sidebar
2. Upload the exported JSON file
3. The application will display the same visualizations as when the test was run

This allows you to preserve and review test results indefinitely without a database.

## Metrics Displayed

### Checks
- Total checks
- Success/failure percentages
- Individual check results with pass/fail counts

### HTTP Metrics
- Request duration (avg, min, max, p90, p95)
- Failed requests percentage
- Total requests and rate (req/s)

### Execution Metrics
- Iterations (total and rate)
- Iteration duration
- Virtual users (current, min, max)

### Network Metrics
- Data received (total and rate)
- Data sent (total and rate)

## Project Structure

```
/app
  /api/k6
    /execute      # K6 test execution endpoint
    /import       # Import results endpoint
  layout.tsx      # Root layout with theme provider
  page.tsx        # Main page
  globals.css     # Global styles
/components
  /ui             # Reusable UI components
  /test-config    # Test configuration components
  /execution      # Execution controls
  /results        # Results visualization
  /layout         # Header and sidebar
/lib
  /k6             # K6 script generation
  /store          # Zustand state management
  /utils          # Utility functions
/types            # TypeScript type definitions
/k6-scripts       # Auto-generated k6 scripts
```

## Development

The application is built with:
- **Next.js 15** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Recharts** for data visualization
- **Lucide React** for icons

## Notes

- K6 scripts are automatically generated and saved to `/k6-scripts` directory
- Test results are stored in the current session only (cleared on refresh)
- Use export/import to preserve results across sessions
- Saved configurations are persisted in localStorage

## License

MIT
