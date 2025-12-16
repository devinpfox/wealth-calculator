/**
 * Input Form Component
 * Allows users to configure their investment comparison
 */

'use client';

import { useState, useEffect } from 'react';
import type { UserInput, AssetType } from '@/lib/types';
import { getAvailableYears } from '@/lib/data-loader';

interface InputFormProps {
  onCalculate: (input: UserInput) => void;
  defaultName?: string;
}

export function InputForm({ onCalculate, defaultName }: InputFormProps) {
  const currentYear = new Date().getFullYear();
  const availableYears = getAvailableYears();

  const [name, setName] = useState<string>(defaultName || '');

  // Update name when defaultName changes
  useEffect(() => {
    if (defaultName) {
      setName(defaultName);
    }
  }, [defaultName]);
  const [investmentAmount, setInvestmentAmount] = useState<string>('10000');
  const [startYear, setStartYear] = useState<number>(currentYear - 10);
  const [selectedAssets, setSelectedAssets] = useState<AssetType[]>(['stocks', 'gold', 'silver']);
  const [adjustForInflation, setAdjustForInflation] = useState<boolean>(false);

  const handleAssetToggle = (asset: AssetType) => {
    setSelectedAssets((prev) => {
      if (prev.includes(asset)) {
        // Don't allow deselecting all assets
        if (prev.length === 1) return prev;
        return prev.filter((a) => a !== asset);
      } else {
        return [...prev, asset];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(investmentAmount.replace(/,/g, ''));
    if (isNaN(amount) || amount < 100 || amount > 10000000) {
      alert('Please enter a valid investment amount between $100 and $10,000,000');
      return;
    }

    if (selectedAssets.length === 0) {
      alert('Please select at least one asset to compare');
      return;
    }

    onCalculate({
      name: name.trim() || undefined,
      investmentAmount: amount,
      startYear,
      selectedAssets,
      adjustForInflation,
    });
  };

  const formatCurrencyInput = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    // Format with commas
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvestmentAmount(formatCurrencyInput(e.target.value));
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-lg shadow-elegant p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-citadel-navy mb-2">
          Investment Calculator
        </h2>
        <p className="text-sm text-citadel-navy-light">
          Compare historical performance of stocks, gold, and silver
        </p>
      </div>

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-citadel-navy mb-2">
          Your Name (Optional)
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 border-2 border-citadel-gold/30 rounded-md focus:ring-2 focus:ring-citadel-gold focus:border-citadel-gold bg-white/80"
          placeholder="Enter your name"
        />
        <p className="mt-1 text-xs text-citadel-navy-light">
          See a personalized investment message
        </p>
      </div>

      {/* Investment Amount */}
      <div>
        <label htmlFor="amount" className="block text-sm font-semibold text-citadel-navy mb-2">
          Investment Amount (USD)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-citadel-gold font-semibold">
            $
          </span>
          <input
            type="text"
            id="amount"
            value={investmentAmount}
            onChange={handleAmountChange}
            className="w-full pl-8 pr-4 py-2.5 border-2 border-citadel-gold/30 rounded-md focus:ring-2 focus:ring-citadel-gold focus:border-citadel-gold bg-white/80"
            placeholder="10,000"
          />
        </div>
        <p className="mt-1 text-xs text-citadel-navy-light">
          Minimum: $100 • Maximum: $10,000,000
        </p>
      </div>

      {/* Start Year */}
      <div>
        <label htmlFor="year" className="block text-sm font-semibold text-citadel-navy mb-2">
          Investment Start Year
        </label>
        <select
          id="year"
          value={startYear}
          onChange={(e) => setStartYear(parseInt(e.target.value))}
          className="w-full px-4 py-2.5 border-2 border-citadel-gold/30 rounded-md focus:ring-2 focus:ring-citadel-gold focus:border-citadel-gold bg-white/80"
        >
          {availableYears.reverse().map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-citadel-navy-light">
          How long ago did you want to invest?
        </p>
      </div>

      {/* Asset Selection */}
      <div>
        <label className="block text-sm font-semibold text-citadel-navy mb-3">
          Assets to Compare
        </label>
        <div className="space-y-2">
          <label className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-citadel-gold/5 transition-colors">
            <input
              type="checkbox"
              checked={selectedAssets.includes('stocks')}
              onChange={() => handleAssetToggle('stocks')}
              className="w-4 h-4 text-citadel-navy border-citadel-navy/30 rounded focus:ring-citadel-gold"
            />
            <span className="text-sm text-citadel-navy">
              S&P 500 Total Return
              <span className="ml-2 text-xs text-citadel-navy-light">
                (includes reinvested dividends)
              </span>
            </span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-citadel-gold/5 transition-colors">
            <input
              type="checkbox"
              checked={selectedAssets.includes('gold')}
              onChange={() => handleAssetToggle('gold')}
              className="w-4 h-4 text-citadel-gold border-citadel-gold rounded focus:ring-citadel-gold"
            />
            <span className="text-sm text-citadel-navy font-medium">Gold</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-citadel-gold/5 transition-colors">
            <input
              type="checkbox"
              checked={selectedAssets.includes('silver')}
              onChange={() => handleAssetToggle('silver')}
              className="w-4 h-4 text-gray-600 border-gray-400 rounded focus:ring-gray-500"
            />
            <span className="text-sm text-citadel-navy">
              Silver
              <span className="ml-2 text-xs text-citadel-navy-light">(bonus)</span>
            </span>
          </label>
        </div>
      </div>

      {/* Inflation Toggle */}
      <div>
        <label className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-citadel-gold/5 transition-colors">
          <div>
            <span className="block text-sm font-semibold text-citadel-navy">
              Adjust for Inflation
            </span>
            <span className="text-xs text-citadel-navy-light">
              Show real returns (purchasing power)
            </span>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              checked={adjustForInflation}
              onChange={(e) => setAdjustForInflation(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-citadel-gold peer-focus:ring-2 peer-focus:ring-citadel-gold transition-colors">
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
            </div>
          </div>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-citadel-gold hover:bg-citadel-gold-dark text-citadel-navy font-bold py-3.5 px-6 rounded-md shadow-elegant-gold hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-citadel-gold focus:ring-offset-2"
      >
        Calculate Returns
      </button>
    </form>
  );
}
