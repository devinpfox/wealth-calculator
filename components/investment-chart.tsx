/**
 * Investment Comparison Summary
 * Shows wealth comparison without complex charts
 */

'use client';

import type { ChartDataPoint, AssetType, AssetPerformance } from '@/lib/types';

interface InvestmentChartProps {
  data: ChartDataPoint[];
  selectedAssets: AssetType[];
  performance: AssetPerformance[];
  showProjections?: boolean;
}

export function InvestmentChart({
  data,
  selectedAssets,
  performance,
}: InvestmentChartProps) {
  const hasGold = selectedAssets.includes('gold');
  const hasSilver = selectedAssets.includes('silver');
  const hasStocks = selectedAssets.includes('stocks');

  // Get final values from performance data (same as Performance Summary cards)
  const stocksPerf = performance.find((p) => p.asset === 'stocks');
  const goldPerf = performance.find((p) => p.asset === 'gold');
  const silverPerf = performance.find((p) => p.asset === 'silver');

  const stocksFinalValue = stocksPerf?.endValue || 0;
  const goldFinalValue = goldPerf?.endValue || 0;
  const silverFinalValue = silverPerf?.endValue || 0;

  // Calculate wealth gaps: Metal Value - S&P Value
  const goldGap = goldFinalValue - stocksFinalValue;
  const silverGap = silverFinalValue - stocksFinalValue;

  // Get start year from chart data
  const startYear = data.length > 0
    ? new Date(data[0].date).getFullYear()
    : new Date().getFullYear();

  const formatCurrencyFull = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (!hasStocks || (!hasGold && !hasSilver)) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-12">
          <p className="text-citadel-navy-light">
            Please select at least one precious metal and S&P 500 to compare.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Only show precious metals - no S&P 500 */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Gold */}
          {hasGold && (
            <div className="px-6 py-4 rounded-xl border-3 border-citadel-gold bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg">
              <div className="text-xs font-bold text-citadel-navy/70 mb-2 uppercase tracking-wide">
                Gold Current Value
              </div>
              <div className="text-3xl font-black text-citadel-gold mb-2">
                {formatCurrencyFull(goldFinalValue)}
              </div>
              <div className="pt-2 border-t border-citadel-gold/20">
                <div className="text-xs text-citadel-navy-light mb-1">
                  S&P 500 would be: {formatCurrencyFull(stocksFinalValue)}
                </div>
                <div className="text-lg font-black text-green-700">
                  {formatCurrencyFull(goldGap)} more!
                </div>
              </div>
            </div>
          )}

          {/* Silver */}
          {hasSilver && (
            <div className="px-6 py-4 rounded-xl border-2 border-slate-400 bg-gradient-to-br from-slate-50 to-gray-50 shadow-md">
              <div className="text-xs font-bold text-citadel-navy/70 mb-2 uppercase tracking-wide">
                Silver Current Value
              </div>
              <div className="text-3xl font-black text-slate-700 mb-2">
                {formatCurrencyFull(silverFinalValue)}
              </div>
              <div className="pt-2 border-t border-slate-300">
                <div className="text-xs text-citadel-navy-light mb-1">
                  S&P 500 would be: {formatCurrencyFull(stocksFinalValue)}
                </div>
                <div className="text-lg font-black text-green-700">
                  {formatCurrencyFull(silverGap)} more!
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Simple explanation of the calculation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-900">
            <span className="font-bold">Simple math:</span> Metal Current Value − S&P 500 Current Value = Extra Wealth
          </p>
          {hasGold && (
            <p className="text-xs text-blue-800 mt-1">
              Example: {formatCurrencyFull(goldFinalValue)} (Gold) − {formatCurrencyFull(stocksFinalValue)} (S&P) = {formatCurrencyFull(goldGap)} more
            </p>
          )}
        </div>

        {/* Summary Callout */}
        <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 border-l-4 border-green-600 rounded-r-xl p-5 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg
                className="h-7 w-7 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-black text-citadel-navy mb-2">
                The Bottom Line Since {startYear}
              </h4>
              <div className="space-y-2">
                {hasGold && goldGap > 0 && (
                  <div className="bg-white/60 rounded-lg p-3 border border-green-200">
                    <p className="text-sm font-bold text-citadel-navy mb-1">
                      By choosing <span className="text-citadel-gold">Gold</span> over stocks:
                    </p>
                    <p className="text-3xl font-black text-green-700">
                      {formatCurrencyFull(goldGap)} more wealth!
                    </p>
                  </div>
                )}
                {hasSilver && silverGap > 0 && (
                  <div className="bg-white/60 rounded-lg p-3 border border-slate-200">
                    <p className="text-sm font-bold text-citadel-navy mb-1">
                      By choosing <span className="text-slate-700">Silver</span> over stocks:
                    </p>
                    <p className="text-3xl font-black text-green-700">
                      {formatCurrencyFull(silverGap)} more wealth!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
