import React, { useState, useMemo } from 'react';
import { Clock, AlertTriangle, TrendingDown, ArrowRight, RefreshCw, HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function SipDelayCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(2000);
  const [investmentPeriod, setInvestmentPeriod] = useState(5);
  const [expectedReturnRate, setExpectedReturnRate] = useState(12);
  const [delayMonths, setDelayMonths] = useState(6);

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

  const {
    valueWithoutDelay,
    valueWithDelay,
    costOfDelay,
    investedWithoutDelay,
    investedWithDelay,
  } = useMemo(() => {
    const P = Number(monthlyInvestment) || 0;
    const years = Number(investmentPeriod) || 0;
    const annualRate = Number(expectedReturnRate) || 0;
    const d = Math.min(Number(delayMonths) || 0, years * 12 - 1);

    const n1 = years * 12;
    const n2 = Math.max(1, n1 - d);
    const i = annualRate / 12 / 100;

    let v1 = 0;
    let v2 = 0;

    if (i > 0 && P > 0) {
      v1 = P * ((Math.pow(1 + i, n1) - 1) / i) * (1 + i);
      v2 = P * ((Math.pow(1 + i, n2) - 1) / i) * (1 + i);
    } else {
      v1 = P * n1;
      v2 = P * n2;
    }

    const loss = Math.max(0, v1 - v2);

    return {
      valueWithoutDelay: v1,
      valueWithDelay: v2,
      costOfDelay: loss,
      investedWithoutDelay: P * n1,
      investedWithDelay: P * n2,
    };
  }, [monthlyInvestment, investmentPeriod, expectedReturnRate, delayMonths]);

  const chartData = [
    { name: 'Retained Wealth', value: Math.round(valueWithDelay), color: '#10b981' },
    { name: 'Wealth Lost to Delay', value: Math.round(costOfDelay), color: '#ef4444' },
  ];

  const handleReset = () => {
    setMonthlyInvestment(2000);
    setInvestmentPeriod(5);
    setExpectedReturnRate(12);
    setDelayMonths(6);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const pct = valueWithoutDelay > 0 ? ((data.value / valueWithoutDelay) * 100).toFixed(1) : 0;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span>{data.name}</span>
          </div>
          <p className="text-base font-bold text-white tracking-tight">{formatINR(data.value)}</p>
          <p className="text-slate-400">{pct}% of potential wealth</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Hero Header */}
      <div className="text-center sm:text-left space-y-2 border-b border-slate-200/70 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/70 mb-1">
          <Clock className="w-3.5 h-3.5 text-rose-600" />
          <span>The Cost of Procrastination</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          SIP Delay Calculator
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl">
          See the dramatic cost of waiting to start your investment. Postponing your SIP by even a few months can cost you lakhs in lost compound growth.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="fintech-card p-6 sm:p-8 space-y-7 bg-white shadow-fintech border border-slate-200/90 rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Investment & Delay Parameters</h2>
                <p className="text-xs text-slate-500 mt-0.5">Adjust monthly amount, tenure, expected rate, and delay period</p>
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

            {/* Monthly Investment */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Monthly Investment (₹)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400 font-semibold text-sm">₹</span>
                  <input
                    type="number"
                    min={500}
                    max={100000}
                    step={500}
                    value={monthlyInvestment}
                    onChange={(e) => setMonthlyInvestment(Number(e.target.value) || 500)}
                    className="w-36 pl-7 pr-3 py-1.5 text-right font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-base"
                  />
                </div>
              </div>
              <input
                type="range"
                min={500}
                max={100000}
                step={500}
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #10b981 ${getProgress(monthlyInvestment, 500, 100000)}%, #e2e8f0 ${getProgress(monthlyInvestment, 500, 100000)}%)`,
                }}
                className="w-full h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>₹500</span>
                <span className="text-emerald-600 font-semibold">{formatCompactINR(monthlyInvestment)} / mo</span>
                <span>₹1,00,000</span>
              </div>
            </div>

            {/* Investment Period */}
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

            {/* Expected Return Rate */}
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

            {/* Delay in Starting SIP */}
            <div className="space-y-3 p-4 rounded-xl bg-rose-50/50 border border-rose-100">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-rose-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-600" />
                  Delay in Starting SIP (Months)
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min={1}
                    max={Math.min(60, investmentPeriod * 12 - 1)}
                    step={1}
                    value={delayMonths}
                    onChange={(e) => setDelayMonths(Number(e.target.value) || 1)}
                    className="w-28 pr-10 pl-3 py-1.5 text-right font-bold text-rose-950 bg-white border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-base"
                  />
                  <span className="absolute right-3 text-rose-400 font-medium text-xs">Mo</span>
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={Math.min(60, investmentPeriod * 12 - 1)}
                step={1}
                value={delayMonths}
                onChange={(e) => setDelayMonths(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #ef4444 ${getProgress(delayMonths, 1, Math.min(60, investmentPeriod * 12 - 1))}%, #fecdd3 ${getProgress(delayMonths, 1, Math.min(60, investmentPeriod * 12 - 1))}%)`,
                }}
                className="w-full h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-rose-700 font-medium">
                <span>1 Month</span>
                <span className="font-bold">{delayMonths} Months Delay</span>
                <span>{Math.min(60, investmentPeriod * 12 - 1)} Months</span>
              </div>
              {/* Quick delay presets */}
              <div className="flex gap-2 pt-1">
                {[3, 6, 12, 24].filter(m => m < investmentPeriod * 12).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDelayMonths(m)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      delayMonths === m ? 'bg-rose-600 text-white' : 'bg-white text-rose-800 border border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    {m} Months
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Results */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          {/* Prominent Loss Card */}
          <div className="fintech-card p-6 sm:p-7 bg-gradient-to-br from-rose-900 via-rose-950 to-slate-950 text-white rounded-2xl shadow-fintech border border-rose-800 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-rose-500/15 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                  Total Wealth Lost to Delay
                </span>
                <span className="text-xs font-medium text-rose-300">
                  {delayMonths} Months Delay
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  {formatINR(costOfDelay)}
                </div>
                <p className="text-xs text-rose-300">
                  Approx. {formatCompactINR(costOfDelay)} surrendered due to postponed compounding.
                </p>
              </div>
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="fintech-card p-5 bg-white border border-emerald-200/90 rounded-2xl shadow-fintech-card">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block mb-1">
                Starting Today
              </span>
              <div className="text-xl font-bold text-slate-900">{formatINR(valueWithoutDelay)}</div>
              <p className="text-xs text-slate-500 mt-1">{formatCompactINR(valueWithoutDelay)} total</p>
            </div>

            <div className="fintech-card p-5 bg-white border border-slate-200/90 rounded-2xl shadow-fintech-card">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                With {delayMonths}mo Delay
              </span>
              <div className="text-xl font-bold text-slate-700">{formatINR(valueWithDelay)}</div>
              <p className="text-xs text-slate-400 mt-1">{formatCompactINR(valueWithDelay)} total</p>
            </div>
          </div>

          {/* Donut Chart: Retained vs Lost */}
          <div className="fintech-card p-6 bg-white border border-slate-200/90 rounded-2xl shadow-fintech">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-2">
              Wealth Realization vs Opportunity Cost
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
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Opportunity Cost</span>
                <span className="text-base font-extrabold text-rose-600">
                  -{((costOfDelay / valueWithoutDelay) * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                <span className="font-semibold text-emerald-800 truncate">Retained ({formatCompactINR(valueWithDelay)})</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-rose-50/70 border border-rose-100">
                <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
                <span className="font-semibold text-rose-800 truncate">Lost ({formatCompactINR(costOfDelay)})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Section */}
      <div className="fintech-card p-6 bg-white border border-slate-200/90 rounded-2xl shadow-fintech space-y-4">
        <button
          type="button"
          onClick={() => setOpenFaq(!openFaq)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Why does delaying an SIP hurt so much?</h3>
          </div>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq ? 'rotate-180 text-emerald-600' : ''}`} />
        </button>

        {openFaq && (
          <div className="pt-3 border-t border-slate-100 text-sm text-slate-600 space-y-3 leading-relaxed">
            <p>
              Many investors wait for the "perfect time" or wait until they have more surplus cash. However, compound interest behaves exponentially. The returns generated in the final years of an investment depend entirely on the foundation laid in year one.
            </p>
            <p>
              When you delay by {delayMonths} months, you don't merely miss out on investing ₹{(monthlyInvestment * delayMonths).toLocaleString('en-IN')}; you miss out on decades of compounded growth on those early installments.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
