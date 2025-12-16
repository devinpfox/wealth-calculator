/**
 * How It Works Component
 * Explains the methodology and assumptions
 */

'use client';

import { useState } from 'react';

export function HowItWorks() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass rounded-lg shadow-elegant overflow-hidden border border-citadel-gold/20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-citadel-gold/5 transition-colors"
      >
        <h3 className="text-lg font-bold text-citadel-navy">
          How This Tool Works
        </h3>
        <svg
          className={`w-5 h-5 text-citadel-gold transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 space-y-6 text-sm text-citadel-navy-light">
          {/* Data Window */}
          <section>
            <h4 className="font-bold text-citadel-navy mb-2">
              📊 Data Window
            </h4>
            <p>
              We use historical data from <strong>1970 to 2024</strong>,
              covering over 50 years of market history. This time period
              captures multiple economic cycles including recessions, high
              inflation (1980s), tech boom/bust, 2008 financial crisis, and
              COVID-19.
            </p>
          </section>

          {/* Historical Calculations */}
          <section>
            <h4 className="font-bold text-citadel-navy mb-2">
              🧮 Historical Calculations
            </h4>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Total Return:</strong> ((Final Value - Initial
                Investment) / Initial Investment) × 100
              </li>
              <li>
                <strong>CAGR:</strong> (Final Value / Initial Investment)^(1 /
                years) - 1
              </li>
              <li>
                <strong>Volatility:</strong> Annualized standard deviation of
                monthly returns
              </li>
              <li>
                <strong>S&P 500:</strong> Uses Total Return Index (includes
                reinvested dividends)
              </li>
            </ul>
          </section>

          {/* Gold vs Stocks */}
          <section>
            <h4 className="font-bold text-citadel-navy mb-2">
              ⚖️ Gold Behavior vs Stocks
            </h4>
            <div className="space-y-2">
              <p>
                <strong className="text-citadel-gold">Gold:</strong> Historically ~7-8% annual growth, lower
                correlation with stocks, acts as hedge against
                inflation/uncertainty, no income/dividends
              </p>
              <p>
                <strong>Stocks:</strong> Historically ~10-11% annual growth with
                dividends, higher short-term volatility, long-term wealth
                creation through economic growth
              </p>
              <p className="text-citadel-navy glass-gold p-3 rounded border border-citadel-gold/30">
                <strong className="text-citadel-gold">💡 Key Insight:</strong> Gold often performs well when stocks decline (e.g., 2008, 2020),
                making it a potential diversification tool.
              </p>
            </div>
          </section>

          {/* Projection Methodology */}
          <section>
            <h4 className="font-bold text-citadel-navy mb-2">
              🔮 Projection Methodology
            </h4>
            <p className="mb-3">
              Our 5-year projections are based <strong>strictly on historical
              patterns</strong> and use the following approach:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Conservative Scenario:</strong> Current Value × (1 +
                CAGR - Volatility)^5
              </li>
              <li>
                <strong>Average Scenario:</strong> Current Value × (1 + CAGR)^5
              </li>
              <li>
                <strong>Optimistic Scenario:</strong> Current Value × (1 + CAGR
                + Volatility)^5
              </li>
            </ul>
            <p className="mt-3 text-citadel-navy glass-gold p-3 rounded border border-citadel-gold/30">
              <strong className="text-citadel-gold">Important:</strong> This range captures ~68% of historical
              outcomes (1 standard deviation). Actual results may fall outside
              this range.
            </p>
          </section>

          {/* Volatility Handling */}
          <section>
            <h4 className="font-bold text-citadel-navy mb-2">
              📈 Volatility Handling
            </h4>
            <p>
              Volatility measures how much an asset's price fluctuates.
              Higher volatility means larger price swings. We calculate
              annualized volatility from monthly returns and use it to create
              realistic projection ranges.
            </p>
            <div className="mt-2 space-y-1 text-xs">
              <p>
                <strong>Gold:</strong> ~15% volatility (moderate price swings)
              </p>
              <p>
                <strong>Stocks:</strong> ~18% volatility (higher price swings)
              </p>
              <p>
                <strong>Silver:</strong> ~22% volatility (most volatile)
              </p>
            </div>
          </section>

          {/* Inflation Adjustment */}
          <section>
            <h4 className="font-bold text-citadel-navy mb-2">
              💵 Inflation Adjustment
            </h4>
            <p>
              When "Adjust for Inflation" is enabled, we show{' '}
              <strong>real returns</strong> (purchasing power) instead of
              nominal returns. This uses the Consumer Price Index (CPI) to
              adjust all values:
            </p>
            <p className="mt-2 font-mono text-xs bg-white/80 p-3 rounded border border-citadel-gold/20">
              Real Value = Nominal Value × (CPI_start / CPI_current)
            </p>
            <p className="mt-2">
              This helps you understand what your investment would actually be
              worth in today's dollars, accounting for the erosion of purchasing
              power over time.
            </p>
          </section>

          {/* Limitations */}
          <section>
            <h4 className="font-bold text-citadel-navy mb-2">
              ⚠️ Limitations & Important Notes
            </h4>
            <ul className="list-disc list-inside space-y-2 ml-2 text-citadel-navy-light">
              <li>
                Does not account for black swan events or unprecedented economic
                changes
              </li>
              <li>
                Future economic conditions may differ significantly from the
                past
              </li>
              <li>
                Interest rates, geopolitics, and policy changes affect outcomes
              </li>
              <li>Does not include transaction costs, taxes, or fees</li>
              <li>
                Assumes continuous investment (no withdrawals or contributions)
              </li>
              <li>
                Past performance is not indicative of future results
              </li>
            </ul>
          </section>

          {/* Data Sources */}
          <section className="pt-4 border-t border-citadel-gold/20">
            <h4 className="font-bold text-citadel-navy mb-2">
              📚 Data Sources
            </h4>
            <ul className="text-xs space-y-1 text-citadel-navy-light">
              <li>• Federal Reserve Economic Data (FRED) - CPI & Economic Data</li>
              <li>• World Gold Council - Historical Gold Prices</li>
              <li>• Yahoo Finance - S&P 500 Total Return Index</li>
              <li>• Bureau of Labor Statistics - Consumer Price Index</li>
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
