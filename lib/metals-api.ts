/**
 * Metals API service for fetching live precious metal prices
 * Documentation: https://metals-api.com/documentation
 */

export interface MetalsApiResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: {
    XAU?: number; // Gold (troy ounce)
    XAG?: number; // Silver (troy ounce)
    USD?: number;
  };
}

export interface LiveMetalPrices {
  gold: number; // USD per troy ounce
  silver: number; // USD per troy ounce
  sp500?: number; // S&P 500 index value
  timestamp: number;
  date: string;
}

/**
 * Fetch live metal prices from Metals API
 * The API returns rates in base currency per ounce
 */
export async function fetchLiveMetalPrices(apiKey: string): Promise<LiveMetalPrices> {
  const baseUrl = process.env.METALS_API_BASE_URL || 'https://metals-api.com/api';

  // Fetch latest rates for Gold (XAU) and Silver (XAG) in USD
  const url = `${baseUrl}/latest?access_key=${apiKey}&base=USD&symbols=XAU,XAG`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Metals API error: ${response.status} ${response.statusText}`);
  }

  const data: MetalsApiResponse = await response.json();

  if (!data.success) {
    throw new Error('Metals API request was not successful');
  }

  // The API returns how much of the metal you get per USD
  // We need to invert it to get USD per ounce
  const goldRate = data.rates.XAU;
  const silverRate = data.rates.XAG;

  if (!goldRate || !silverRate) {
    throw new Error('Missing metal price data in API response');
  }

  return {
    gold: 1 / goldRate, // Convert to USD per ounce
    silver: 1 / silverRate, // Convert to USD per ounce
    timestamp: data.timestamp,
    date: data.date,
  };
}

/**
 * Fetch live S&P 500 Total Return Index price
 * Calculates based on price index growth from last known Total Return value
 */
export async function fetchLiveSP500Price(): Promise<number> {
  try {
    // Fetch current S&P 500 Price Index
    const url = 'https://query1.finance.yahoo.com/v8/finance/chart/%5EGSPC?interval=1d&range=1d';
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data?.chart?.result?.[0];
    const meta = result?.meta;

    if (!meta?.regularMarketPrice) {
      throw new Error('Unable to extract S&P 500 price from response');
    }

    const currentPriceIndex = meta.regularMarketPrice;

    // Historical reference point (December 2024):
    // - Total Return Index: 20891.88 (from historical data)
    // - Price Index: approximately 5985 (market close Dec 2024)
    const referenceDate = '2024-12-01';
    const referenceTotalReturn = 20891.88;
    const referencePriceIndex = 5985; // Approximate S&P 500 price index value for Dec 2024

    // Calculate today's Total Return Index by applying the same growth rate
    const growthFactor = currentPriceIndex / referencePriceIndex;
    const estimatedTotalReturn = referenceTotalReturn * growthFactor;

    return estimatedTotalReturn;
  } catch (error) {
    console.error('Error fetching S&P 500 Total Return price:', error);
    throw error;
  }
}

/**
 * Fetch historical metal prices from Metals API for a specific date
 */
export async function fetchHistoricalMetalPrices(
  apiKey: string,
  date: string // Format: YYYY-MM-DD
): Promise<LiveMetalPrices> {
  const baseUrl = process.env.METALS_API_BASE_URL || 'https://metals-api.com/api';

  const url = `${baseUrl}/${date}?access_key=${apiKey}&base=USD&symbols=XAU,XAG`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Metals API error: ${response.status} ${response.statusText}`);
  }

  const data: MetalsApiResponse = await response.json();

  if (!data.success) {
    throw new Error('Metals API request was not successful');
  }

  const goldRate = data.rates.XAU;
  const silverRate = data.rates.XAG;

  if (!goldRate || !silverRate) {
    throw new Error('Missing metal price data in API response');
  }

  return {
    gold: 1 / goldRate,
    silver: 1 / silverRate,
    timestamp: data.timestamp,
    date: data.date,
  };
}
