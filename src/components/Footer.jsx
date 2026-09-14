import React from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  const currentYear = new Date().getFullYear();

  const handleLink = (e, tabId, href) => {
    if (setActiveTab) {
      e.preventDefault();
      setActiveTab(tabId);
      if (window.history.pushState) {
        window.history.pushState(null, '', href);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="mt-16 bg-white border-t border-slate-200/80 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-bold text-base text-slate-900">
                MutualFund <span className="text-emerald-600">Calculators</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Empowering investors with real-time, transparent financial calculators to simulate SIPs, retirement wealth, lumpsum investments, and loan EMIs.
            </p>
          </div>

          {/* Quick Calculator Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Calculators</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="index.html"
                  onClick={(e) => handleLink(e, 'sip', 'index.html')}
                  className="hover:text-emerald-600 transition-colors"
                >
                  SIP Calculator
                </a>
              </li>
              <li>
                <a
                  href="delay.html"
                  onClick={(e) => handleLink(e, 'delay', 'delay.html')}
                  className="hover:text-emerald-600 transition-colors"
                >
                  SIP Delay Calculator
                </a>
              </li>
              <li>
                <a
                  href="wealth.html"
                  onClick={(e) => handleLink(e, 'wealth', 'wealth.html')}
                  className="hover:text-emerald-600 transition-colors"
                >
                  Wealth Goal Planner
                </a>
              </li>
              <li>
                <a
                  href="lumpsum.html"
                  onClick={(e) => handleLink(e, 'lumpsum', 'lumpsum.html')}
                  className="hover:text-emerald-600 transition-colors"
                >
                  Lump Sum Calculator
                </a>
              </li>
              <li>
                <a
                  href="emi.html"
                  onClick={(e) => handleLink(e, 'emi', 'emi.html')}
                  className="hover:text-emerald-600 transition-colors"
                >
                  Loan EMI Calculator
                </a>
              </li>
              <li>
                <a
                  href="hv.html"
                  onClick={(e) => handleLink(e, 'insurance', 'hv.html')}
                  className="hover:text-emerald-600 transition-colors"
                >
                  Human Life Insurance
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / Institutional */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">About & Info</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="aboutus.html" className="hover:text-slate-900 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="contactus.html" className="hover:text-slate-900 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="disclaimer-page.html" className="hover:text-slate-900 transition-colors">
                  Disclaimer
                </a>
              </li>
              <li>
                <a href="terms-and-conditions.html" className="hover:text-slate-900 transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="privacy-policy.html" className="hover:text-slate-900 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Financial Regulatory Disclaimer */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <div className="flex items-start gap-2 text-[11px] text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p>
              <strong>Disclaimer:</strong> Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing. These calculators are designed solely for illustrative and educational estimations and do not constitute personalized financial advice. Past performance does not guarantee future results.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 pt-2">
            <span>© {currentYear} MutualFund Calculators. All rights reserved.</span>
            <span className="text-[11px] mt-1 sm:mt-0">Crafted with modern React & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
