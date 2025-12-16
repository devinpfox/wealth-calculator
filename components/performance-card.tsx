/**
 * Performance Card Component
 * Displays investment performance metrics for a single asset
 */

import type { AssetPerformance } from '@/lib/types';

interface PerformanceCardProps {
  performance: AssetPerformance;
}

const ASSET_CONFIG = {
  stocks: {
    name: 'S&P 500 Total Return',
    color: 'border-citadel-navy-light',
    bgColor: 'glass',
    textColor: 'text-citadel-navy',
  },
  gold: {
    name: 'Gold',
    color: 'border-citadel-gold',
    bgColor: 'glass-gold',
    textColor: 'text-citadel-gold-dark',
  },
  silver: {
    name: 'Silver',
    color: 'border-gray-400',
    bgColor: 'glass',
    textColor: 'text-gray-700',
  },
};

export function PerformanceCard({ performance }: PerformanceCardProps) {
  const config = ASSET_CONFIG[performance.asset];
  const isPositive = performance.totalReturn >= 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  return (
    <div
      className={`rounded-lg border-2 ${config.color} ${config.bgColor} p-6 shadow-elegant hover:shadow-elegant-gold transition-all duration-300`}
    >
      <div className="mb-4">
        <h3 className={`text-lg font-bold ${config.textColor}`}>
          {config.name}
        </h3>
      </div>

      <div className="space-y-3">
        {/* Starting Investment */}
        <div>
          <p className="text-sm text-citadel-navy-light">Starting Investment</p>
          <p className="text-xl font-semibold text-citadel-navy">
            {formatCurrency(performance.startValue)}
          </p>
        </div>

        {/* Current Value */}
        <div>
          <p className="text-sm text-citadel-navy-light">Current Value</p>
          <p className="text-2xl font-bold text-citadel-navy">
            {formatCurrency(performance.endValue)}
          </p>
        </div>

        {/* Total Return */}
        <div>
          <p className="text-sm text-citadel-navy-light">Total Return</p>
          <p
            className={`text-xl font-bold ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {formatPercent(performance.totalReturn)}
          </p>
        </div>
      </div>
    </div>
  );
}
