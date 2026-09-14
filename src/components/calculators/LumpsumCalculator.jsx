import React, { useState, useMemo } from 'react';
import { Layers, ArrowUpRight, Wallet, Award, RefreshCw, HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function LumpsumCalculator() {
  const [totalInvestment, setTotalInvestment] = useState(25000); // ₹25,000
  const [investmentPeriod, setInvestmentPeriod] = useState(5);   // 5 Years
  const [expectedReturnRate, setExpectedReturnRate] = useState(12); // 12%

  const [openFaq, setOpenFaq] = useState(true);

  const getProgress = (value, min, max) => ((value - min) / (max - min)) * 100;

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.round(val));
  };

  const formatCompactINR = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    return formatINR(val);
  };

  const { totalInvested, estimatedReturns, maturityValue } = useMemo(() => {
    const P = Number(totalInvestment) || 0;
    const t = Number(investmentPeriod) || 0;
    const r = Number(expectedReturnRate) || 0;

    // Compound Interest: M = P * (1 + r/100)^t
    const maturity = P * Math.pow(1 + r / 100, t);
    const gains = Math.max(0, maturity - P);

    return {
      totalInvested: P,
      estimatedReturns: Math.round(gains),
      maturityValue: Math.round(maturity),
    };
  }, [totalInvestment, investmentPeriod, expectedReturnRate]);

  const investedPct = maturityValue > 0 ? Math.round((totalInvested / maturityValue) * 100) : 0;
  const returnsPct = maturityValue > 0 ? 100 - investedPct : 0;

  const chartData = [
    { name: 'Invested Capital', value: totalInvested, color: '#334155' },
    { name: 'Capital Gains', value: estimatedReturns, color: '#10b981' },
  ];

  const handleReset = () => {
    setTotalInvestment(25000);
    setInvestmentPeriod(5);
    setExpectedReturnRate(12);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const pct = maturityValue > 0 ? ((data.value / maturityValue) * 100).toFixed(1) : 0;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span>{data.name}</span>
          </div>
          <p className="text-base font-bold text-white tracking-tight">{formatINR(data.value)}</p>
          <p className="text-slate-400">{pct}% of maturity value</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Hero Header */}
      <div className="text-center sm:text-left space-y-2 border-b border-slate-200/70 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 mb-1">
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          <span>One-Time Investment Compounding</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Lump Sum Investment Calculator
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl">
          Simulate the compound growth of your one-time mutual fund investment over your chosen investment horizon.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="fintech-card p-6 sm:p-8 space-y-7 bg-white shadow-fintech border border-slate-200/90 rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Investment Parameters</h2>
                <p className="text-xs text-slate-500 mt-0.5">Customize your one-time principal and investment duration</p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Total Investment */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Total Investment Amount (₹)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400 font-semibold text-sm">₹</span>
                  <input
                    type="number"
                    min={1000}
                    max={10000000}
                    step={5000}
                    value={totalInvestment}
                    onChange={(e) => setTotalInvestment(Number(e.target.value) || 1000)}
                    className="w-40 pl-7 pr-3 py-1.5 text-right font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-base"
                  />
                </div>
              </div>
              <input
                type="range"
                min={1000}
                max={10000000}
                step={5000}
                value={totalInvestment}
                onChange={(e) => setTotalInvestment(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #10b981 ${getProgress(totalInvestment, 1000, 10000000)}%, #e2e8f0 ${getProgress(totalInvestment, 1000, 10000000)}%)`,
                }}
                className="w-full h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>₹1,000</span>
                <span className="text-emerald-600 font-semibold">{formatCompactINR(totalInvestment)} Principal</span>
                <span>₹1 Crore</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {[10000, 25000, 50000, 100000, 500000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTotalInvestment(val)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      totalInvestment === val ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {formatCompactINR(val)}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Period */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Investment Horizon (Years)</label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min={1}
                    max={30}
                    step={1}
                    value={investmentPeriod}
                    onChange={(e) => setInvestmentPeriod(Number(e.target.value) || 1)}
                    className="w-36 pr-8 pl-3 py-1.5 text-right font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-base"
                  />
                  <span className="absolute right-3 text-slate-400 font-medium text-xs">Yrs</span>
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={investmentPeriod}
                onChange={(e) => setInvestmentPeriod(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #10b981 ${getProgress(investmentPeriod, 1, 30)}%, #e2e8f0 ${getProgress(investmentPeriod, 1, 30)}%)`,
                }}
                className="w-full h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>1 Year</span>
                <span className="text-emerald-600 font-semibold">{investmentPeriod} Years</span>
                <span>30 Years</span>
              </div>
            </div>

            {/* Expected Returns */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Expected Annual Returns (% p.a)</label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min={1}
                    max={30}
                    step={0.5}
                    value={expectedReturnRate}
                    onChange={(e) => setExpectedReturnRate(Number(e.target.value) || 1)}
                    className="w-36 pr-8 pl-3 py-1.5 text-right font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-base"
                  />
                  <span className="absolute right-3 text-slate-400 font-medium text-xs">%</span>
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={0.5}
                value={expectedReturnRate}
                onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #10b981 ${getProgress(expectedReturnRate, 1, 30)}%, #e2e8f0 ${getProgress(expectedReturnRate, 1, 30)}%)`,
                }}
                className="w-full h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>1%</span>
                <span className="text-emerald-600 font-semibold">{expectedReturnRate}% per annum</span>
                <span>30%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Results */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          {/* Prominent Maturity Card */}
          <div className="fintech-card p-6 sm:p-7 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-2xl shadow-fintech border border-slate-800 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  Maturity Value
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {(maturityValue / totalInvestment).toFixed(2)}x Growth
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  {formatINR(maturityValue)}
                </div>
                <p className="text-xs text-slate-300">
                  Approx. {formatCompactINR(maturityValue)} after {investmentPeriod} years.
                </p>
              </div>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="fintech-card p-5 bg-white border border-slate-200/90 rounded-2xl shadow-fintech-card">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Principal Invested
              </span>
              <div className="text-xl font-bold text-slate-900">{formatINR(totalInvested)}</div>
              <p className="text-xs text-slate-500 mt-1">{investedPct}% of total</p>
            </div>

            <div className="fintech-card p-5 bg-white border border-emerald-200/90 rounded-2xl shadow-fintech-card">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block mb-1">
                Est. Capital Gains
              </span>
              <div className="text-xl font-bold text-emerald-600">{formatINR(estimatedReturns)}</div>
              <p className="text-xs text-emerald-700 mt-1">+{returnsPct}% wealth generated</p>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="fintech-card p-6 bg-white border border-slate-200/90 rounded-2xl shadow-fintech">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-2">
              Lumpsum Value Breakdown
            </h3>
            <div className="relative h-60 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Maturity</span>
                <span className="text-base font-extrabold text-slate-900">
                  {formatCompactINR(maturityValue)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-3 h-3 rounded-full bg-slate-700 shrink-0" />
                <span className="font-semibold text-slate-700 truncate">Invested ({formatCompactINR(totalInvested)})</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                <span className="font-semibold text-emerald-800 truncate">Gains ({formatCompactINR(estimatedReturns)})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Accordion */}
      <div className="fintech-card p-6 bg-white border border-slate-200/90 rounded-2xl shadow-fintech space-y-4">
        <button
          type="button"
          onClick={() => setOpenFaq(!openFaq)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">When should you consider a Lump Sum investment?</h3>
          </div>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq ? 'rotate-180 text-emerald-600' : ''}`} />
        </button>

        {openFaq && (
          <div className="pt-3 border-t border-slate-100 text-sm text-slate-600 space-y-3 leading-relaxed">
            <p>
              A lump sum investment is ideal when you receive a windfall—such as an annual performance bonus, maturity of an endowment policy, or property sale proceeds.
            </p>
            <p>
              <strong>💡 Pro Tip - Systematic Transfer Plan (STP):</strong> If equity valuations are elevated and you hesitate to invest a large lump sum all at once, you can park the capital in a safe Liquid / Ultra-Short Term Debt fund and set up a weekly or monthly STP into an Equity Fund to average your entry.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
