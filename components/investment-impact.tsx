/**
 * Investment Impact Component
 * Shows personalized historical investment results with animated text
 */

'use client';

import { useEffect, useState } from 'react';

interface InvestmentImpactProps {
  name: string;
  initialInvestment: number;
  asset: 'gold' | 'silver' | 'stocks';
  yearsAgo: number;
  currentValue: number;
  percentIncrease: number;
}

const ASSET_LABELS = {
  gold: 'gold',
  silver: 'silver',
  stocks: 'the S&P 500',
};

export function InvestmentImpact({
  name,
  initialInvestment,
  asset,
  yearsAgo,
  currentValue,
  percentIncrease,
}: InvestmentImpactProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatTimePeriod = (years: number) => {
    if (years === 1) return '1 year';
    if (years < 1) {
      const months = Math.round(years * 12);
      return months === 1 ? '1 month' : `${months} months`;
    }
    return `${years} years`;
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-citadel-gold/10 to-citadel-gold/5 rounded-lg p-8 border-2 border-citadel-gold/30">
      <div
        className={`transition-all duration-1000 ease-out ${
          isVisible
            ? 'translate-x-0 opacity-100'
            : '-translate-x-full opacity-0'
        }`}
      >
        <div className="space-y-4">
          <p className="text-2xl md:text-3xl font-bold text-citadel-navy leading-relaxed">
            <span className="text-citadel-gold">{name}</span>, if you
            would&apos;ve invested{' '}
            <span className="text-citadel-gold">
              {formatCurrency(initialInvestment)}
            </span>{' '}
            into{' '}
            <span className="text-citadel-gold">{ASSET_LABELS[asset]}</span>{' '}
            <span className="text-citadel-gold">
              {formatTimePeriod(yearsAgo)}
            </span>{' '}
            ago, you would have{' '}
            <span className="text-citadel-gold">
              {formatCurrency(currentValue)}
            </span>{' '}
            today!
          </p>
          <p className="text-xl md:text-2xl font-semibold text-green-600">
            That&apos;s a {percentIncrease.toFixed(2)}% increase!
          </p>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-citadel-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-citadel-gold/5 rounded-full blur-2xl"></div>
    </div>
  );
}
