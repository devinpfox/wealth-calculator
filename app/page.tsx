/**
 * Main Dashboard Page
 * Investment Comparison Tool
 */

'use client';

import { useState } from 'react';
import { InputForm } from '@/components/input-form';
import { PerformanceCard } from '@/components/performance-card';
import { InvestmentChart } from '@/components/investment-chart';
import { InvestmentImpact } from '@/components/investment-impact';
import { Disclaimer, TopBanner } from '@/components/disclaimer';
import { Header } from '@/components/header';
import { LoginPage } from '@/components/login-page';
import { compareInvestments } from '@/lib/comparison-engine';
import type { UserInput, ComparisonResult } from '@/lib/types';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleLogin = (name: string) => {
    // Capitalize first letter of name
    const capitalizedName = name.trim().charAt(0).toUpperCase() + name.trim().slice(1);
    setUsername(capitalizedName);
    setIsLoggedIn(true);
  };

  const handleCalculate = async (input: UserInput) => {
    setIsCalculating(true);

    try {
      const comparisonResult = await compareInvestments(input);
      setResult(comparisonResult);
    } catch (error) {
      console.error('Calculation error:', error);
      alert('An error occurred while calculating. Please try different parameters.');
    } finally {
      setIsCalculating(false);
    }
  };

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-citadel-cream">
      {/* <Header /> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[800px] md:min-h-0">
        {/* Hero Section */}
        <section className="text-center mb-12" id="calculator">
          <h1 className="text-5xl font-bold text-citadel-navy mb-4">
            Hi {username}, Let's Protect Your Wealth with{' '}
            <span className="text-gradient-gold">Gold</span>
          </h1>
          <p className="text-xl text-citadel-navy-light max-w-3xl mx-auto">
            Compare historical performance of precious metals vs stocks. See how gold and silver
            have protected wealth over time with our investment comparison tool.
          </p>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar: Input Form */}
          <div className="lg:col-span-1">
            <InputForm onCalculate={handleCalculate} defaultName={username} />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {isCalculating && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-citadel-gold mb-4"></div>
                  <p className="text-citadel-navy-light font-medium">Calculating returns...</p>
                </div>
              </div>
            )}

            {!isCalculating && result && (
              <>
                {/* Performance Summary Cards */}
                <section>
                  <h2 className="text-3xl font-bold text-citadel-navy mb-4">
                    Performance Summary
                  </h2>
                  <p className="text-sm text-citadel-navy-light mb-6">
                    Investment period: {new Date(result.metadata.startDate).getFullYear()} - {new Date(result.metadata.endDate).getFullYear()} ({result.metadata.yearsInvested} years)
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {result.performance.map((perf) => (
                      <PerformanceCard key={perf.asset} performance={perf} />
                    ))}
                  </div>
                </section>

                {/* Investment Impact Message */}
                {result.userInput.name && (
                  <section>
                    <InvestmentImpact
                      name={result.userInput.name}
                      initialInvestment={result.userInput.investmentAmount}
                      asset={result.userInput.selectedAssets.includes('gold') ? 'gold' : result.userInput.selectedAssets[0]}
                      yearsAgo={result.metadata.yearsInvested}
                      currentValue={
                        result.performance.find(
                          (p) =>
                            p.asset ===
                            (result.userInput.selectedAssets.includes('gold')
                              ? 'gold'
                              : result.userInput.selectedAssets[0])
                        )?.endValue || 0
                      }
                      percentIncrease={
                        result.performance.find(
                          (p) =>
                            p.asset ===
                            (result.userInput.selectedAssets.includes('gold')
                              ? 'gold'
                              : result.userInput.selectedAssets[0])
                        )?.totalReturn || 0
                      }
                    />
                  </section>
                )}

                {/* Wealth Comparison Summary */}
                <section>
                  <h2 className="text-3xl font-bold text-citadel-navy mb-2">
                    The Bottom Line
                  </h2>
                  <p className="text-sm text-citadel-navy-light mb-6">
                    How much more wealth you would have accumulated by choosing precious metals
                    over stocks from the same starting investment.
                  </p>
                  <InvestmentChart
                    data={result.chartData}
                    selectedAssets={result.userInput.selectedAssets}
                    performance={result.performance}
                    showProjections={false}
                  />
                </section>

                {/* Projections Summary */}
                <section className="glass rounded-lg shadow-elegant p-6">
                  <h3 className="text-2xl font-bold text-citadel-navy mb-4">
                    5-Year Projections (Based on Historical Patterns)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {result.projections.map((proj) => {
                      const formatCurrency = (value: number) => {
                        return new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(value);
                      };

                      const assetName =
                        proj.asset === 'stocks'
                          ? 'S&P 500'
                          : proj.asset === 'gold'
                          ? 'Gold'
                          : 'Silver';

                      return (
                        <div
                          key={proj.asset}
                          className="border-2 border-citadel-gold/30 rounded-lg p-4 bg-white/60"
                        >
                          <h4 className="font-bold text-citadel-navy mb-3">
                            {assetName}
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-citadel-navy-light">Current:</span>
                              <span className="font-semibold text-citadel-navy">
                                {formatCurrency(proj.currentValue)}
                              </span>
                            </div>
                            <div className="flex justify-between text-green-600">
                              <span>Optimistic:</span>
                              <span className="font-bold">
                                {formatCurrency(proj.fiveYear.optimistic)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-citadel-navy-light">Average:</span>
                              <span className="font-bold text-citadel-navy">
                                {formatCurrency(proj.fiveYear.average)}
                              </span>
                            </div>
                            <div className="flex justify-between text-red-600">
                              <span>Conservative:</span>
                              <span className="font-bold">
                                {formatCurrency(proj.fiveYear.conservative)}
                              </span>
                            </div>
                            <div className="pt-2 border-t border-citadel-gold/30 text-xs text-citadel-navy-light">
                              Historical CAGR:{' '}
                              <span className="font-semibold text-citadel-gold">
                                {proj.historicalCAGR.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 p-3 glass-gold rounded-md border border-citadel-gold/30">
                    <p className="text-xs text-citadel-navy">
                      <strong className="text-citadel-gold">⚠️ Important:</strong> These projections are based
                      on 50-year historical patterns and are NOT guarantees.
                      Actual future performance may differ significantly.
                    </p>
                  </div>
                </section>

                {/* Disclaimer */}
                <Disclaimer />
              </>
            )}

            {!isCalculating && !result && (
              <div className="text-center py-20">
                <svg
                  className="mx-auto h-16 w-16 text-citadel-gold mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <h3 className="text-2xl font-bold text-citadel-navy mb-2">
                  Ready to Compare?
                </h3>
                <p className="text-citadel-navy-light">
                  Fill in the form on the left and click "Calculate Returns" to
                  see your investment comparison.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
