/**
 * Main comparison engine that orchestrates all calculations
 */

import { format, addYears, parseISO } from 'date-fns';
import {
  calculateAssetPerformance,
  generateAssetProjection,
  normalizeData,
  getYearsBetween,
} from './calculations';
import { loadHistoricalDataWithLivePrices, getCurrentDate } from './data-loader';
import type {
  UserInput,
  ComparisonResult,
  ChartDataPoint,
  AssetType,
} from './types';

/**
 * Main function to compare investments
 */
export async function compareInvestments(input: UserInput): Promise<ComparisonResult> {
  const { investmentAmount, startYear, selectedAssets, adjustForInflation } =
    input;

  // Load historical data with live prices
  const historicalData = await loadHistoricalDataWithLivePrices();

  // Define date range
  const startDate = `${startYear}-01-01`;
  const endDate = getCurrentDate();

  // Calculate performance for each selected asset
  const performance = selectedAssets.map((asset) => {
    const assetData =
      asset === 'stocks'
        ? historicalData.stocks
        : asset === 'gold'
        ? historicalData.gold
        : historicalData.silver;

    return calculateAssetPerformance(
      asset,
      investmentAmount,
      assetData,
      startDate,
      endDate,
      adjustForInflation ? historicalData.cpi : undefined
    );
  });

  // Generate projections for each asset
  const projections = selectedAssets.map((asset) => {
    const assetData =
      asset === 'stocks'
        ? historicalData.stocks
        : asset === 'gold'
        ? historicalData.gold
        : historicalData.silver;

    const currentPerformance = performance.find((p) => p.asset === asset);
    const currentValue = currentPerformance?.endValue || investmentAmount;

    return generateAssetProjection(asset, currentValue, assetData);
  });

  // Generate chart data
  const chartData = generateChartData(
    investmentAmount,
    startDate,
    endDate,
    selectedAssets,
    historicalData,
    projections,
    adjustForInflation ? historicalData.cpi : undefined
  );

  // Calculate metadata
  const years = getYearsBetween(startDate, endDate);

  return {
    userInput: input,
    performance,
    projections,
    chartData,
    metadata: {
      startDate,
      endDate,
      yearsInvested: Math.round(years * 2) / 2, // Round to nearest 0.5
    },
  };
}

/**
 * Generate chart data with historical and projected values
 */
function generateChartData(
  initialInvestment: number,
  startDate: string,
  endDate: string,
  selectedAssets: AssetType[],
  historicalData: ReturnType<typeof loadHistoricalData>,
  projections: ReturnType<typeof generateAssetProjection>[],
  cpiData?: ReturnType<typeof loadHistoricalData>['cpi']
): ChartDataPoint[] {
  const chartData: ChartDataPoint[] = [];

  // Normalize all asset data
  const normalizedData: Record<AssetType, ReturnType<typeof normalizeData>> = {
    stocks: normalizeData(
      historicalData.stocks,
      startDate,
      endDate,
      cpiData
    ),
    gold: normalizeData(historicalData.gold, startDate, endDate, cpiData),
    silver: normalizeData(historicalData.silver, startDate, endDate, cpiData),
  };

  // Determine which data points to use (based on longest series)
  const longestSeries = selectedAssets.reduce((longest, asset) => {
    const assetSeries = normalizedData[asset];
    return assetSeries.length > longest.length ? assetSeries : longest;
  }, normalizedData[selectedAssets[0]]);

  // Generate historical data points
  for (const point of longestSeries) {
    const dataPoint: ChartDataPoint = {
      date: point.date,
    };

    for (const asset of selectedAssets) {
      const assetPoint = normalizedData[asset].find((p) => p.date === point.date);
      if (assetPoint) {
        const value = cpiData
          ? (assetPoint.realValue || assetPoint.normalizedIndex)
          : assetPoint.normalizedIndex;

        // Convert normalized index to dollar value
        dataPoint[asset] = (value / 100) * initialInvestment;
      }
    }

    chartData.push(dataPoint);
  }

  // Add projected data points (5 years forward)
  const projectionStartDate = parseISO(endDate);
  const projectionEndDate = addYears(projectionStartDate, 5);

  // Generate quarterly projection points
  const projectionPoints: Date[] = [];
  for (let i = 1; i <= 20; i++) {
    // 20 quarters = 5 years
    const quarterDate = new Date(projectionStartDate);
    quarterDate.setMonth(quarterDate.getMonth() + i * 3);
    if (quarterDate <= projectionEndDate) {
      projectionPoints.push(quarterDate);
    }
  }

  for (const projectionDate of projectionPoints) {
    const dataPoint: any = {
      date: format(projectionDate, 'yyyy-MM-dd'),
    };

    const yearsFromNow = (projectionDate.getTime() - projectionStartDate.getTime()) / (1000 * 60 * 60 * 24 * 365);

    for (const asset of selectedAssets) {
      const projection = projections.find((p) => p.asset === asset);
      if (projection) {
        const { fiveYear, historicalCAGR, historicalVolatility } = projection;

        // Calculate intermediate values
        const cagrDecimal = historicalCAGR / 100;
        const volatilityDecimal = historicalVolatility / 100;

        dataPoint[`${asset}ProjectionLow`] =
          projection.currentValue * Math.pow(1 + (cagrDecimal - volatilityDecimal), yearsFromNow);

        dataPoint[`${asset}ProjectionAvg`] =
          projection.currentValue * Math.pow(1 + cagrDecimal, yearsFromNow);

        dataPoint[`${asset}ProjectionHigh`] =
          projection.currentValue * Math.pow(1 + (cagrDecimal + volatilityDecimal), yearsFromNow);
      }
    }

    chartData.push(dataPoint);
  }

  return chartData;
}
