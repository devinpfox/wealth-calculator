/**
 * Data loader utility for historical market data
 */

import goldData from '@/data/gold-monthly.json';
import sp500Data from '@/data/sp500-monthly.json';
import silverData from '@/data/silver-monthly.json';
import cpiData from '@/data/cpi-monthly.json';
import metadata from '@/data/metadata.json';

import type { AssetData, DataPoint } from './types';
import type { LiveMetalPrices } from './metals-api';

/**
 * Fetch live metal prices from our API route
 */
export async function fetchLiveMetalPrices(): Promise<LiveMetalPrices> {
  const response = await fetch('/api/metals');

  if (!response.ok) {
    throw new Error(`Failed to fetch live metal prices: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Load all historical market data with live prices appended
 */
export async function loadHistoricalDataWithLivePrices(): Promise<AssetData> {
  try {
    const livePrices = await fetchLiveMetalPrices();

    // Get today's date in YYYY-MM-DD format
    const today = livePrices.date;

    // Clone the historical data arrays
    const goldDataWithLive = [...(goldData as DataPoint[])];
    const silverDataWithLive = [...(silverData as DataPoint[])];

    // Check if we already have data for today
    const hasGoldToday = goldDataWithLive.some(d => d.date === today);
    const hasSilverToday = silverDataWithLive.some(d => d.date === today);

    // Append live prices if we don't have them yet
    if (!hasGoldToday) {
      goldDataWithLive.push({
        date: today,
        price: livePrices.gold,
      });
    } else {
      // Update today's price if it exists
      const goldIndex = goldDataWithLive.findIndex(d => d.date === today);
      if (goldIndex !== -1) {
        goldDataWithLive[goldIndex].price = livePrices.gold;
      }
    }

    if (!hasSilverToday) {
      silverDataWithLive.push({
        date: today,
        price: livePrices.silver,
      });
    } else {
      // Update today's price if it exists
      const silverIndex = silverDataWithLive.findIndex(d => d.date === today);
      if (silverIndex !== -1) {
        silverDataWithLive[silverIndex].price = livePrices.silver;
      }
    }

    return {
      gold: goldDataWithLive,
      stocks: sp500Data as DataPoint[],
      silver: silverDataWithLive,
      cpi: cpiData as DataPoint[],
    };
  } catch (error) {
    console.error('Error loading live prices, falling back to historical data:', error);
    // Fallback to historical data if live prices fail
    return loadHistoricalData();
  }
}

/**
 * Load all historical market data (without live prices)
 */
export function loadHistoricalData(): AssetData {
  return {
    gold: goldData as DataPoint[],
    stocks: sp500Data as DataPoint[],
    silver: silverData as DataPoint[],
    cpi: cpiData as DataPoint[],
  };
}

/**
 * Get available years for selection
 */
export function getAvailableYears(): number[] {
  const years: number[] = [];
  const startYear = new Date(metadata.coverage.startDate).getFullYear();
  const endYear = new Date(metadata.coverage.endDate).getFullYear();

  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  return years;
}

/**
 * Get metadata about the data sources
 */
export function getMetadata() {
  return metadata;
}

/**
 * Get the current date (end of data coverage)
 * This will return today's date if live prices are being used
 */
export function getCurrentDate(): string {
  // Return today's date in YYYY-MM-DD format
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Validate if a year is within the available range
 */
export function isValidYear(year: number): boolean {
  const startYear = new Date(metadata.coverage.startDate).getFullYear();
  const endYear = new Date(metadata.coverage.endDate).getFullYear();
  return year >= startYear && year <= endYear;
}
