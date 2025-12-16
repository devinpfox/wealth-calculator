/**
 * Disclaimer Component
 * Legal and compliance disclaimers
 */

export function Disclaimer() {
  return (
    <div className="glass-gold border-l-4 border-citadel-gold p-6 rounded-r-lg shadow-elegant">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-citadel-gold"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-semibold text-citadel-navy">
            Important Disclaimer
          </h3>
          <div className="mt-2 text-sm text-citadel-navy-light space-y-2">
            <p>
              <strong>This tool is for educational purposes only</strong> and
              does not constitute financial, investment, or legal advice.
              Historical performance does not guarantee future results.
              Projections are based on historical patterns and should not be
              interpreted as predictions or guarantees.
            </p>
            <p>
              All investments carry risk, including potential loss of principal.
              Consult with a licensed financial advisor before making investment
              decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TopBanner() {
  return (
    <div className="bg-citadel-navy text-white px-4 py-2 text-center">
      <p className="text-sm font-medium">
        <span className="text-citadel-gold">Protect Your Wealth with Citadel Gold</span>
      </p>
    </div>
  );
}

export function Footer() {
  const metadata = {
    lastUpdated: new Date().toLocaleDateString(),
    sources: [
      'Federal Reserve Economic Data (FRED)',
      'World Gold Council',
      'Yahoo Finance',
    ],
  };

  return (
    <footer className="mt-16 bg-citadel-navy-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h4 className="text-lg font-bold text-citadel-gold mb-4">ABOUT US</h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              At Citadel Gold, we empower you to protect your future with secure
              investments in gold and silver. With our trusted expertise, we offer
              stable, valuable assets to safeguard your wealth with confidence.
            </p>
          </div>

          {/* Helpful Links */}
          <div>
            <h4 className="text-lg font-bold text-citadel-gold mb-4">HELPFUL LINKS</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#calculator" className="hover:text-citadel-gold transition-colors">Investment Calculator</a></li>
              <li><a href="#gold" className="hover:text-citadel-gold transition-colors">Buy Gold</a></li>
              <li><a href="#silver" className="hover:text-citadel-gold transition-colors">Buy Silver</a></li>
              <li><a href="#ira" className="hover:text-citadel-gold transition-colors">Gold IRA</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-citadel-gold mb-4">CONTACT US</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>Speak with a Precious Metals Specialist</p>
              <p className="text-2xl font-bold text-citadel-gold">800 605 5597</p>
              <p className="text-xs mt-4">12100 Wilshire Blvd 8th Floor</p>
              <p className="text-xs">Los Angeles CA 90025</p>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="pt-8 border-t border-citadel-navy-light">
          <div className="text-center space-y-4">
            <div>
              <h5 className="text-xs font-semibold text-citadel-gold mb-2">
                DATA SOURCES
              </h5>
              <p className="text-xs text-gray-400">
                {metadata.sources.join(' • ')}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {metadata.lastUpdated}
              </p>
            </div>

            {/* Disclaimer */}
            <div className="pt-4">
              <p className="text-xs text-gray-400 max-w-4xl mx-auto leading-relaxed">
                The statements made on this website are opinions and past performance is no indication of future performance or returns.
                Precious metals, like all investments, carry risk. Gold, silver and platinum coins and bars may appreciate, depreciate
                or stay the same depending on a variety of factors. Citadel Gold cannot guarantee, and makes no representation that any
                metals purchased will appreciate at all or appreciate sufficiently to make customers a profit. The decision to purchase
                or sell precious metals, and which precious metals to purchase or sell are the customer's decision alone, and purchases
                and sales should be made subject to the customer's own research, prudence and judgement.
              </p>
            </div>

            {/* Copyright */}
            <div className="pt-6 border-t border-citadel-navy-light">
              <p className="text-xs text-gray-500">
                Copyright © {new Date().getFullYear()} | All Right Reserved | Citadel Gold
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
