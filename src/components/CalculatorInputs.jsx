import React from 'react';
import { IndianRupee, Calendar, Percent, Sparkles, RefreshCw } from 'lucide-react';

export default function CalculatorInputs({
  monthlyInvestment,
  setMonthlyInvestment,
  investmentPeriod,
  setInvestmentPeriod,
  expectedReturnRate,
  setExpectedReturnRate,
  onReset
}) {
  // Helper to compute progress percentage for range slider fill
  const getProgress = (value, min, max) => {
    return ((value - min) / (max - min)) * 100;
  };

  const investmentPresets = [1000, 2000, 5000, 10000, 25000];
  const periodPresets = [3, 5, 10, 15, 20];
  const returnPresets = [
    { label: '8% (Low)', value: 8 },
    { label: '12% (Balanced)', value: 12 },
    { label: '15% (Growth)', value: 15 },
  ];

  const formatCurrencyWords = (val) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakh`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="fintech-card p-6 sm:p-8 space-y-8 bg-white shadow-fintech border border-slate-200/90 rounded-2xl">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            SIP Parameters
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Customize your monthly SIP contribution and target horizon</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg transition-colors"
          title="Reset to default values"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Input 1: Monthly Investment */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="monthly-investment" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">₹</span>
            Monthly Investment
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-slate-400 font-semibold text-sm">₹</span>
            <input
              id="monthly-investment"
              type="number"
              min={500}
              max={100000}
              step={500}
              value={monthlyInvestment}
              onChange={(e) => {
                const val = Number(e.target.value);
                setMonthlyInvestment(isNaN(val) ? 500 : val);
              }}
              className="w-36 pl-7 pr-3 py-1.5 text-right font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-base transition-all"
            />
          </div>
        </div>

        {/* Range slider */}
        <div className="relative pt-1">
          <input
            type="range"
            min={500}
            max={100000}
            step={500}
            value={monthlyInvestment}
            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #10b981 ${getProgress(monthlyInvestment, 500, 100000)}%, #e2e8f0 ${getProgress(monthlyInvestment, 500, 100000)}%)`
            }}
            className="w-full h-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-600 mt-1 font-medium">
            <span>₹500</span>
            <span className="text-emerald-800 font-semibold">{formatCurrencyWords(monthlyInvestment)} / mo</span>
            <span>₹1,00,000</span>
          </div>
        </div>

        {/* Quick Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {investmentPresets.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setMonthlyInvestment(val)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                monthlyInvestment === val
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              ₹{val >= 1000 ? `${val / 1000}k` : val}
            </button>
          ))}
        </div>
      </div>

      {/* Input 2: Investment Period */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="investment-period" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
              <Calendar className="w-3.5 h-3.5" />
            </span>
            Investment Period
          </label>
          <div className="relative flex items-center">
            <input
              id="investment-period"
              type="number"
              min={1}
              max={30}
              step={1}
              value={investmentPeriod}
              onChange={(e) => {
                const val = Number(e.target.value);
                setInvestmentPeriod(isNaN(val) ? 1 : val);
              }}
              className="w-36 pr-8 pl-3 py-1.5 text-right font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-base transition-all"
            />
            <span className="absolute right-3 text-slate-400 font-medium text-xs">Yrs</span>
          </div>
        </div>

        {/* Range slider */}
        <div className="relative pt-1">
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={investmentPeriod}
            onChange={(e) => setInvestmentPeriod(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #10b981 ${getProgress(investmentPeriod, 1, 30)}%, #e2e8f0 ${getProgress(investmentPeriod, 1, 30)}%)`
            }}
            className="w-full h-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-600 mt-1 font-medium">
            <span>1 Year</span>
            <span className="text-emerald-800 font-semibold">{investmentPeriod} Years ({investmentPeriod * 12} Installments)</span>
            <span>30 Years</span>
          </div>
        </div>

        {/* Quick Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {periodPresets.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setInvestmentPeriod(val)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                investmentPeriod === val
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              {val} Years
            </button>
          ))}
        </div>
      </div>

      {/* Input 3: Expected Return Rate */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="return-rate" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
              <Percent className="w-3.5 h-3.5" />
            </span>
            Expected Return Rate (p.a)
          </label>
          <div className="relative flex items-center">
            <input
              id="return-rate"
              type="number"
              min={1}
              max={30}
              step={0.5}
              value={expectedReturnRate}
              onChange={(e) => {
                const val = Number(e.target.value);
                setExpectedReturnRate(isNaN(val) ? 1 : val);
              }}
              className="w-36 pr-8 pl-3 py-1.5 text-right font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-base transition-all"
            />
            <span className="absolute right-3 text-slate-400 font-medium text-xs">%</span>
          </div>
        </div>

        {/* Range slider */}
        <div className="relative pt-1">
          <input
            type="range"
            min={1}
            max={30}
            step={0.5}
            value={expectedReturnRate}
            onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #10b981 ${getProgress(expectedReturnRate, 1, 30)}%, #e2e8f0 ${getProgress(expectedReturnRate, 1, 30)}%)`
            }}
            className="w-full h-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-600 mt-1 font-medium">
            <span>1%</span>
            <span className="text-emerald-800 font-semibold">{expectedReturnRate}% per annum</span>
            <span>30%</span>
          </div>
        </div>

        {/* Quick Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {returnPresets.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => setExpectedReturnRate(preset.value)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                expectedReturnRate === preset.value
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pro-tip banner */}
      <div className="bg-gradient-to-r from-emerald-50/60 to-slate-50 p-3.5 rounded-xl border border-emerald-100/80 flex items-start gap-2.5 text-xs text-slate-600">
        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800">Pro Tip: </span>
          Historical Indian equity mutual fund categories (Large, Flexi, Mid Cap) have delivered 12% - 15% CAGR over 10+ year horizons.
        </div>
      </div>
    </div>
  );
}
