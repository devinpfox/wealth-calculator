/**
 * API Route for fetching live metal prices
 * GET /api/metals - Returns current live prices for gold and silver
 */

import { NextResponse } from 'next/server';
import { fetchLiveMetalPrices } from '@/lib/metals-api';

export async function GET() {
  try {
    const apiKey = process.env.METALS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Metals API key not configured' },
        { status: 500 }
      );
    }

    const prices = await fetchLiveMetalPrices(apiKey);

    return NextResponse.json(prices);
  } catch (error) {
    console.error('Error fetching metal prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metal prices' },
      { status: 500 }
    );
  }
}
