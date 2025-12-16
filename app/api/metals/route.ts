/**
 * API Route for fetching live metal prices
 * GET /api/metals - Returns current live prices for gold, silver, and S&P 500
 */

import { NextResponse } from 'next/server';
import { fetchLiveMetalPrices, fetchLiveSP500Price } from '@/lib/metals-api';

export async function GET() {
  try {
    const apiKey = process.env.METALS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Metals API key not configured' },
        { status: 500 }
      );
    }

    // Fetch metal prices and S&P 500 in parallel
    const [metalPrices, sp500Price] = await Promise.all([
      fetchLiveMetalPrices(apiKey),
      fetchLiveSP500Price().catch((error) => {
        console.error('Failed to fetch S&P 500 price:', error);
        return null; // Don't fail the entire request if S&P 500 fails
      }),
    ]);

    // Combine the prices
    const prices = {
      ...metalPrices,
      sp500: sp500Price || undefined,
    };

    return NextResponse.json(prices);
  } catch (error) {
    console.error('Error fetching prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prices' },
      { status: 500 }
    );
  }
}
