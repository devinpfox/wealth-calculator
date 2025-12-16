/**
 * Core calculation engine for investment comparison
 * All financial calculations are performed here with full transparency
 */

import { differenceInYears, differenceInMonths, parseISO } from 'date-fns';
import type {
  DataPoint,
  NormalizedDataPoint,
  AssetPerformance,
  ProjectionScenario,
  AssetProjection,
  AssetType,
} from './types';

/**
 * Calculate total return percentage
 */
export function calculateTotalReturn(
  initialValue: number,
  finalValue: number
): number {
  return ((finalValue - initialValue) / initialValue) * 100;
}

/**
 * Calculate Compound Annual Growth Rate (CAGR)
 * Formula: CAGR = (Final Value / Initial Value)^(1/years) - 1
 */
export function calculateCAGR(
  initialValue: number,
  finalValue: number,
  years: number
): number {
  if (years === 0) return 0;
  return (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
}

/**
 * Calculate annualized volatility (standard deviation of returns)
 */
export function calculateVolatility(prices: number[]): number {
  if (prices.length < 2) return 0;

  // Calculate monthly returns
  const monthlyReturns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    const monthlyReturn = (prices[i] - prices[i - 1]) / prices[i - 1];
    monthlyReturns.push(monthlyReturn);
  }

  // Calculate mean
  const mean =
    monthlyReturns.reduce((sum, ret) => sum + ret, 0) / monthlyReturns.length;

  // Calculate variance
  const variance =
    monthlyReturns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) /
    monthlyReturns.length;

  // Annualized volatility = monthly std dev * sqrt(12)
  const monthlyStdDev = Math.sqrt(variance);
  const annualizedVolatility = monthlyStdDev * Math.sqrt(12) * 100;

  return annualizedVolatility;
}

/**
 * Calculate maximum drawdown (peak to trough decline)
 */
export function calculateMaxDrawdown(prices: number[]): number {
  if (prices.length < 2) return 0;

  let maxDrawdown = 0;
  let peak = prices[0];

  for (const price of prices) {
    if (price > peak) {
      peak = price;
    }
    const drawdown = ((peak - price) / peak) * 100;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  return maxDrawdown;
}

/**
 * Find the closest data point to a given date
 */
export function findClosestDataPoint(
  data: DataPoint[],
  targetDate: string
): DataPoint | null {
  if (data.length === 0) return null;

  const target = parseISO(targetDate);
  let closest = data[0];
  let minDiff = Math.abs(
    parseISO(data[0].date).getTime() - target.getTime()
  );

  for (const point of data) {
    const diff = Math.abs(parseISO(point.date).getTime() - target.getTime());
    if (diff < minDiff) {
      minDiff = diff;
      closest = point;
    }
  }

  return closest;
}

/**
 * Normalize asset data to base 100 at start date
 */
export function normalizeData(
  data: DataPoint[],
  startDate: string,
  endDate: string,
  cpiData?: DataPoint[]
): NormalizedDataPoint[] {
  const startPoint = findClosestDataPoint(data, startDate);
  if (!startPoint) return [];

  const startPrice = startPoint.price;
  const startCPI = cpiData
    ? findClosestDataPoint(cpiData, startDate)?.price
    : null;

  return data
    .filter((point) => point.date >= startDate && point.date <= endDate)
    .map((point) => {
      const normalizedIndex = (point.price / startPrice) * 100;

      let realValue: number | undefined;
      if (cpiData && startCPI) {
        const currentCPI = findClosestDataPoint(cpiData, point.date)?.price;
        if (currentCPI) {
          // Adjust for inflation: Real Value = Nominal Value × (CPI_start / CPI_current)
          realValue = normalizedIndex * (startCPI / currentCPI);
        }
      }

      return {
        date: point.date,
        price: point.price,
        normalizedIndex,
        realValue,
      };
    });
}

/**
 * Calculate investment performance for a specific asset
 */
export function calculateAssetPerformance(
  asset: AssetType,
  initialInvestment: number,
  assetData: DataPoint[],
  startDate: string,
  endDate: string,
  cpiData?: DataPoint[]
): AssetPerformance {
  const startPoint = findClosestDataPoint(assetData, startDate);
  const endPoint = findClosestDataPoint(assetData, endDate);

  if (!startPoint || !endPoint) {
    throw new Error(`Unable to find data for ${asset} in the specified range`);
  }

  let startPrice = startPoint.price;
  let endPrice = endPoint.price;

  // Adjust for inflation if CPI data is provided
  if (cpiData && cpiData.length > 0) {
    const startCPI = findClosestDataPoint(cpiData, startDate);
    const endCPI = findClosestDataPoint(cpiData, endDate);

    if (startCPI && endCPI && startCPI.price > 0 && endCPI.price > 0) {
      // Adjust prices for inflation (convert to real values)
      // Real price = Nominal price * (CPI at start / CPI at time)
      startPrice = startPoint.price * (startCPI.price / startCPI.price); // = startPoint.price
      endPrice = endPoint.price * (startCPI.price / endCPI.price);
    }
  }

  // Calculate final value
  const finalValue = initialInvestment * (endPrice / startPrice);

  // Calculate years
  const years = differenceInYears(parseISO(endDate), parseISO(startDate));
  const months = differenceInMonths(parseISO(endDate), parseISO(startDate));
  const exactYears = months / 12;

  // Get all prices in the range for volatility calculation
  const pricesInRange = assetData
    .filter((point) => point.date >= startDate && point.date <= endDate)
    .map((point) => point.price);

  return {
    asset,
    startValue: initialInvestment,
    endValue: finalValue,
    totalReturn: calculateTotalReturn(initialInvestment, finalValue),
    cagr: calculateCAGR(initialInvestment, finalValue, exactYears),
    volatility: calculateVolatility(pricesInRange),
    maxDrawdown: calculateMaxDrawdown(pricesInRange),
  };
}

/**
 * Project future value based on historical patterns
 * Uses historical CAGR and volatility to create three scenarios
 */
export function projectFutureValue(
  currentValue: number,
  historicalCAGR: number, // In percentage
  historicalVolatility: number, // In percentage
  years: number = 5
): ProjectionScenario {
  const cagrDecimal = historicalCAGR / 100;
  const volatilityDecimal = historicalVolatility / 100;

  return {
    conservative: currentValue * Math.pow(1 + (cagrDecimal - volatilityDecimal), years),
    average: currentValue * Math.pow(1 + cagrDecimal, years),
    optimistic: currentValue * Math.pow(1 + (cagrDecimal + volatilityDecimal), years),
  };
}

/**
 * Calculate historical CAGR over a long time period (for projection basis)
 */
export function calculateHistoricalCAGR(
  assetData: DataPoint[],
  yearsBack: number = 50
): number {
  if (assetData.length === 0) return 0;

  const endPoint = assetData[assetData.length - 1];
  const endDate = parseISO(endPoint.date);

  // Go back N years
  const startDateTarget = new Date(endDate);
  startDateTarget.setFullYear(startDateTarget.getFullYear() - yearsBack);
  const startDateStr = startDateTarget.toISOString().split('T')[0];

  const startPoint = findClosestDataPoint(assetData, startDateStr);
  if (!startPoint) return 0;

  const years = differenceInMonths(endDate, parseISO(startPoint.date)) / 12;

  return calculateCAGR(startPoint.price, endPoint.price, years);
}

/**
 * Generate projection for an asset
 */
export function generateAssetProjection(
  asset: AssetType,
  currentValue: number,
  assetData: DataPoint[]
): AssetProjection {
  const historicalCAGR = calculateHistoricalCAGR(assetData, 50);
  const historicalVolatility = calculateVolatility(
    assetData.slice(-600).map((d) => d.price) // Last 50 years
  );

  const fiveYear = projectFutureValue(
    currentValue,
    historicalCAGR,
    historicalVolatility,
    5
  );

  return {
    asset,
    currentValue,
    fiveYear,
    historicalCAGR,
    historicalVolatility,
  };
}

/**
 * Calculate years between two dates
 */
export function getYearsBetween(startDate: string, endDate: string): number {
  const months = differenceInMonths(parseISO(endDate), parseISO(startDate));
  return months / 12;
}
