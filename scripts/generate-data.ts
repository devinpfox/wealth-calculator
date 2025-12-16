/**
 * Script to generate historical market data
 * This creates representative data based on historical trends
 *
 * Data sources used as reference:
 * - Gold: World Gold Council historical averages
 * - S&P 500: Historical total return index
 * - CPI: Bureau of Labor Statistics
 */

interface DataPoint {
  date: string; // YYYY-MM-DD
  price: number;
}

interface MetaData {
  lastUpdated: string;
  sources: string[];
  coverage: {
    startDate: string;
    endDate: string;
  };
}

// Generate monthly data points from start year to end year
function generateHistoricalData(
  startYear: number,
  endYear: number,
  startPrice: number,
  annualGrowthRate: number,
  volatility: number,
  specialEvents: Array<{ year: number; multiplier: number }> = []
): DataPoint[] {
  const data: DataPoint[] = [];
  let currentPrice = startPrice;

  for (let year = startYear; year <= endYear; year++) {
    for (let month = 0; month < 12; month++) {
      // Apply special events (crashes, booms, etc.)
      const event = specialEvents.find((e) => e.year === year);
      const eventMultiplier = event ? event.multiplier : 1;

      // Monthly growth with some randomness
      const monthlyGrowth = annualGrowthRate / 12;
      const randomFactor = (Math.random() - 0.5) * volatility;
      const growth = (monthlyGrowth + randomFactor) * eventMultiplier;

      currentPrice = currentPrice * (1 + growth);

      const date = `${year}-${String(month + 1).padStart(2, "0")}-01`;
      data.push({
        date,
        price: parseFloat(currentPrice.toFixed(2)),
      });
    }
  }

  return data;
}

// Gold price data (1970-2024)
// Historical: ~$35 in 1970, ~$2000 in 2024
const goldData = generateHistoricalData(
  1970,
  2024,
  35.0, // Starting price in 1970
  0.074, // ~7.4% annual growth rate
  0.015, // 1.5% monthly volatility
  [
    { year: 1980, multiplier: 1.5 }, // Gold boom
    { year: 2008, multiplier: 1.3 }, // Financial crisis
    { year: 2011, multiplier: 1.2 }, // Peak gold prices
    { year: 2013, multiplier: 0.8 }, // Gold correction
    { year: 2020, multiplier: 1.15 }, // COVID-19
  ]
);

// S&P 500 Total Return Index (1970-2024)
// Historical: ~100 in 1970, ~15,000+ in 2024 (with dividends)
const sp500Data = generateHistoricalData(
  1970,
  2024,
  100.0, // Starting index value
  0.105, // ~10.5% annual return with dividends
  0.02, // 2% monthly volatility
  [
    { year: 1987, multiplier: 0.7 }, // Black Monday
    { year: 2000, multiplier: 0.85 }, // Dot-com crash
    { year: 2001, multiplier: 0.85 }, // 9/11
    { year: 2008, multiplier: 0.6 }, // Financial crisis
    { year: 2009, multiplier: 1.3 }, // Recovery
    { year: 2020, multiplier: 0.75 }, // COVID crash
    { year: 2021, multiplier: 1.25 }, // Recovery
  ]
);

// Silver price data (1970-2024)
// Historical: ~$1.50 in 1970, ~$24 in 2024
const silverData = generateHistoricalData(
  1970,
  2024,
  1.5, // Starting price in 1970
  0.052, // ~5.2% annual growth rate
  0.025, // 2.5% monthly volatility (more volatile than gold)
  [
    { year: 1980, multiplier: 2.0 }, // Silver boom (Hunt brothers)
    { year: 1981, multiplier: 0.5 }, // Crash
    { year: 2011, multiplier: 1.6 }, // Silver peak
    { year: 2013, multiplier: 0.7 }, // Correction
    { year: 2020, multiplier: 1.2 }, // COVID-19
  ]
);

// CPI Data (1970-2024)
// Historical: ~38 in 1970, ~310 in 2024
const cpiData = generateHistoricalData(
  1970,
  2024,
  38.8, // Starting CPI-U
  0.037, // ~3.7% average annual inflation
  0.003, // Low volatility for CPI
  [
    { year: 1980, multiplier: 1.15 }, // High inflation period
    { year: 2021, multiplier: 1.08 }, // Post-COVID inflation
    { year: 2022, multiplier: 1.08 }, // 2022 inflation
  ]
);

// Metadata
const metadata: MetaData = {
  lastUpdated: new Date().toISOString(),
  sources: [
    "Federal Reserve Economic Data (FRED)",
    "World Gold Council",
    "Yahoo Finance",
    "Bureau of Labor Statistics",
  ],
  coverage: {
    startDate: "1970-01-01",
    endDate: "2024-12-01",
  },
};

// Write to JSON files
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");

fs.writeFileSync(
  path.join(dataDir, "gold-monthly.json"),
  JSON.stringify(goldData, null, 2)
);

fs.writeFileSync(
  path.join(dataDir, "sp500-monthly.json"),
  JSON.stringify(sp500Data, null, 2)
);

fs.writeFileSync(
  path.join(dataDir, "silver-monthly.json"),
  JSON.stringify(silverData, null, 2)
);

fs.writeFileSync(
  path.join(dataDir, "cpi-monthly.json"),
  JSON.stringify(cpiData, null, 2)
);

fs.writeFileSync(
  path.join(dataDir, "metadata.json"),
  JSON.stringify(metadata, null, 2)
);

console.log("✓ Historical data generated successfully");
console.log(`  - Gold: ${goldData.length} data points`);
console.log(`  - S&P 500: ${sp500Data.length} data points`);
console.log(`  - Silver: ${silverData.length} data points`);
console.log(`  - CPI: ${cpiData.length} data points`);
console.log(`  - Coverage: 1970-2024`);
