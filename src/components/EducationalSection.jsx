import React, { useState } from 'react';
import { ChevronDown, HelpCircle, CheckCircle2, TrendingUp, ShieldAlert, ArrowRight, BookOpen } from 'lucide-react';

export default function EducationalSection() {
  const [openItems, setOpenItems] = useState({
    whatIsSip: true, // open by default
    howCompoundingWorks: false,
    rupeeCostAveraging: false,
    sipVsLumpsum: false,
  });

  const toggleItem = (key) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section className="mt-12 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Mutual Fund Education & Insights
          </h2>
        </div>
        <span className="text-xs font-semibold text-slate-600">Investor Guide</span>
      </div>

      {/* Main Accordion Card 1: What is SIP */}
      <div className="fintech-card overflow-hidden bg-white border border-slate-200/90 rounded-2xl shadow-fintech transition-all">
        <button
          type="button"
          onClick={() => toggleItem('whatIsSip')}
          className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                What is a Systematic Investment Plan (SIP)?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                The smart, disciplined vehicle for building long-term generational wealth
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
              openItems.whatIsSip ? 'transform rotate-180 text-emerald-600' : ''
            }`}
          />
        </button>

        {openItems.whatIsSip && (
          <div className="px-6 pb-6 pt-2 border-t border-slate-100 text-slate-600 text-sm leading-relaxed space-y-4">
            <p>
              A <strong>Systematic Investment Plan (SIP)</strong> is an investment strategy where you invest a fixed sum of money at regular intervals (typically monthly) into a chosen mutual fund scheme. Instead of trying to time the equity markets, SIP allows you to accumulate wealth gradually with complete peace of mind.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
              <p className="font-semibold text-slate-900 mb-1">
                💡 The Simplest Analogy: "Buying Wealth on EMI"
              </p>
              <p className="text-xs text-slate-600">
                Just as we buy gadgets, cars, or homes by paying monthly EMIs, an SIP functions like a <strong>wealth-accumulation EMI</strong>. Instead of paying interest to a bank, your money earns compounding interest and capital appreciation for your own future.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Key Features & Pillars of an SIP:</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Small Starting Capital:</strong> Begin investing with as little as ₹500/month.</span>
                </li>
                <li className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Rupee Cost Averaging:</strong> Automatically purchase more fund units when prices drop and fewer units when prices rise.</span>
                </li>
                <li className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Compounding Returns:</strong> Reinvested earnings generate their own gains, creating an exponential growth curve.</span>
                </li>
                <li className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Complete Flexibility:</strong> Increase, pause, modify, or stop your SIP anytime without penalties.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Accordion Card 2: Rupee Cost Averaging */}
      <div className="fintech-card overflow-hidden bg-white border border-slate-200/90 rounded-2xl shadow-fintech transition-all">
        <button
          type="button"
          onClick={() => toggleItem('rupeeCostAveraging')}
          className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                How Rupee Cost Averaging Protects You
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Why market volatility becomes your best friend in an SIP
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
              openItems.rupeeCostAveraging ? 'transform rotate-180 text-emerald-600' : ''
            }`}
          />
        </button>

        {openItems.rupeeCostAveraging && (
          <div className="px-6 pb-6 pt-2 border-t border-slate-100 text-slate-600 text-sm leading-relaxed space-y-3">
            <p>
              Timing the stock market is nearly impossible, even for seasoned professionals. With Rupee Cost Averaging, when markets undergo a correction or dip, your fixed monthly allocation buys <strong>more fund units at lower NAVs (Net Asset Values)</strong>. When markets recover and reach all-time highs, the large quantity of accumulated units surges in value, bringing down your average acquisition cost per unit significantly.
            </p>
            <p className="text-xs text-slate-500 italic">
              *Hence, SIP investors welcome temporary market volatility rather than fearing it.
            </p>
          </div>
        )}
      </div>

      {/* Accordion Card 3: SIP vs Lumpsum */}
      <div className="fintech-card overflow-hidden bg-white border border-slate-200/90 rounded-2xl shadow-fintech transition-all">
        <button
          type="button"
          onClick={() => toggleItem('sipVsLumpsum')}
          className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                SIP vs Lumpsum Investment: When to Choose What?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparing recurring monthly contributions against one-time bulk investments
              </p>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
              openItems.sipVsLumpsum ? 'transform rotate-180 text-emerald-600' : ''
            }`}
          />
        </button>

        {openItems.sipVsLumpsum && (
          <div className="px-6 pb-6 pt-2 border-t border-slate-100 text-slate-600 text-sm leading-relaxed space-y-3">
            <p>
              An <strong>SIP</strong> is ideal for salaried individuals and monthly income earners who want to build a regular investing habit without worrying about market entry timing.
            </p>
            <p>
              A <strong>Lumpsum</strong> investment is suitable when you have idle surplus cash (such as a bonus, inheritance, or sale of assets) and are comfortable entering the market either when valuations are attractive or via a Systematic Transfer Plan (STP).
            </p>
            <div className="pt-2">
              <a
                href="lumpsum.html"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 underline"
              >
                Try our dedicated Lumpsum Calculator <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Explore Other Calculators Banner */}
      <div className="fintech-card p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl shadow-fintech border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">Explore All Financial Calculators</h3>
          <p className="text-xs text-slate-300 mt-1">
            Calculate the exact cost of delaying your SIP, plan retirement corpus, or calculate loan EMIs.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="delay.html"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            SIP Delay Cost
          </a>
          <a
            href="wealth.html"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Wealth Planner
          </a>
          <a
            href="lumpsum.html"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Lumpsum
          </a>
          <a
            href="emi.html"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Loan EMI
          </a>
          <a
            href="hv.html"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Life Insurance
          </a>
        </div>
      </div>
    </section>
  );
}
