/**
 * Header Component
 * Citadel Gold branded header with logo and navigation
 */

'use client';

import Image from 'next/image';

export function Header() {
  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: '#1D3557' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <a
              href="https://www.citadelgold.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/citadel-logo.png"
                alt="Citadel Gold"
                width={180}
                height={60}
                className="h-12 w-auto"
                priority
              />
            </a>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#calculator"
              className="text-sm font-medium text-white hover:text-citadel-gold transition-colors"
            >
              Calculator
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-white hover:text-citadel-gold transition-colors"
            >
              About
            </a>
            <a
              href="tel:8006055597"
              className="bg-citadel-gold hover:bg-citadel-gold-dark text-citadel-navy font-semibold px-6 py-2.5 rounded-md shadow-elegant-gold transition-all"
            >
              Call Now 800 605 5597
            </a>
          </nav>

          {/* Mobile CTA */}
          <a
            href="tel:8006055597"
            className="md:hidden bg-citadel-gold hover:bg-citadel-gold-dark text-citadel-navy font-semibold px-4 py-2 rounded-md text-sm"
          >
            Call Now
          </a>
        </div>
      </div>

      {/* Top banner for important info */}
      <div className="bg-citadel-gold/10 border-t border-citadel-gold/30 px-4 py-2">
        <p className="text-center text-xs text-citadel-gold-light">
          Protect Your Wealth with Citadel Gold • Expert Guidance • Secure Transactions • Premium Metals
        </p>
      </div>
    </header>
  );
}
