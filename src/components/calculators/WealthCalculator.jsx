import React, { useState, useMemo } from 'react';
import { Target, DollarSign, ArrowUpRight, Wallet, RefreshCw, HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import LeadCaptureModal from '../LeadCaptureModal';
import LeadCtaBanner from '../LeadCtaBanner';

export default function WealthCalculator() {
  const [targetWealth, setTargetWealth] = useState(1000000); // ₹10 Lakh
  const [tenureYears, setTenureYears] = useState(5);         // 5 Years
  const [expectedRate, setExpectedRate] = useState(12);       // 12%
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const { requiredSip, totalInvested, compoundingGains } = useMemo(() => {
    const M = Number(targetWealth) || 0;
    const years = Number(tenureYears) || 0;
    const annualRate = Number(expectedRate) || 0;

    const n = years * 12;
    const i = annualRate / 12 / 100;

    let sip = 0;
    if (i > 0 && n > 0 && M > 0) {
      // P = M * i / [ ((1 + i)^n - 1) * (1 + i) ]
      sip = (M * i) / ((Math.pow(1 + i, n) - 1) * (1 + i));
    } else if (n > 0) {
      sip = M / n;
    }

    const invested = sip * n;
    const gains = Math.max(0, M - invested);

    return {
      requiredSip: Math.round(sip),
      totalInvested: Math.round(invested),
      compoundingGains: Math.round(gains),
    };
  }, [targetWealth, tenureYears, expectedRate]);

  const chartData = [
    { name: 'Your Investment', value: totalInvested, color: '#334155' },
    { name: 'Market Gains', value: compoundingGains, color: '#10b981' },
  ];

  const handleReset = () => {
    setTargetWealth(1000000);
    setTenureYears(5);
    setExpectedRate(12);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const pct = targetWealth > 0 ? ((data.value / targetWealth) * 100).toFixed(1) : 0;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span>{data.name}</span>
          </div>
          <p className="text-base font-bold text-white tracking-tight">{formatINR(data.value)}</p>
          <p className="text-slate-400">{pct}% of target corpus</p>
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
          <Target className="w-3.5 h-3.5 text-emerald-600" />
          <span>Goal-Based Wealth Planner</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Wealth Goal Calculator
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl">
          Set your financial target—buying a home, higher education, or retirement—and instantly calculate the required monthly SIP contribution.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="fintech-card p-6 sm:p-8 space-y-7 bg-white shadow-fintech border border-slate-200/90 rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Target Goals & Parameters</h2>
                <p className="text-xs text-slate-500 mt-0.5">Enter your target corpus, years to target, and expected returns</p>
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

            {/* Target Wealth */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Target Wealth / Corpus (₹)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400 font-semibold text-sm">₹</span>
                  <input
                    type="number"
                    min={100000}
                    max={50000000}
                    step={100000}
                    value={targetWealth}
                    onChange={(e) => setTargetWealth(Number(e.target.value) || 100000)}
                    className="w-40 pl-7 pr-3 py-1.5 text-right font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-base"
                  />
                </div>
              </div>
              <input
                type="range"
                min={100000}
                max={50000000}
                step={100000}
                value={targetWealth}
                onChange={(e) => setTargetWealth(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #10b981 ${getProgress(targetWealth, 100000, 50000000)}%, #e2e8f0 ${getProgress(targetWealth, 100000, 50000000)}%)`,
                }}
                className="w-full h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>₹1 Lakh</span>
                <span className="text-emerald-600 font-semibold">{formatCompactINR(targetWealth)} Target</span>
                <span>₹5 Crore</span>
              </div>
              {/* Presets */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[500000, 1000000, 2500000, 5000000, 10000000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTargetWealth(val)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      targetWealth === val ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {formatCompactINR(val)}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Horizon */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Time Horizon (Years)</label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min={1}
                    max={30}
                    step={1}
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value) || 1)}
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
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #10b981 ${getProgress(tenureYears, 1, 30)}%, #e2e8f0 ${getProgress(tenureYears, 1, 30)}%)`,
                }}
                className="w-full h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>1 Year</span>
                <span className="text-emerald-600 font-semibold">{tenureYears} Years ({tenureYears * 12} Installments)</span>
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
                    value={expectedRate}
                    onChange={(e) => setExpectedRate(Number(e.target.value) || 1)}
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
                value={expectedRate}
                onChange={(e) => setExpectedRate(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #10b981 ${getProgress(expectedRate, 1, 30)}%, #e2e8f0 ${getProgress(expectedRate, 1, 30)}%)`,
                }}
                className="w-full h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>1%</span>
                <span className="text-emerald-600 font-semibold">{expectedRate}% per annum</span>
                <span>30%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Results */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          {/* Prominent Required SIP Card */}
          <div className="fintech-card p-6 sm:p-7 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-2xl shadow-fintech border border-slate-800 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  Required Monthly SIP
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {tenureYears} Years Goal
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  {formatINR(requiredSip)} <span className="text-lg font-normal text-emerald-400">/ month</span>
                </div>
                <p className="text-xs text-slate-300">
                  Invest {formatINR(requiredSip)} every month to reach {formatCompactINR(targetWealth)}.
                </p>
              </div>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="fintech-card p-5 bg-white border border-slate-200/90 rounded-2xl shadow-fintech-card">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Your Total Investment
              </span>
              <div className="text-xl font-bold text-slate-900">{formatINR(totalInvested)}</div>
              <p className="text-xs text-slate-500 mt-1">{((totalInvested / targetWealth) * 100).toFixed(0)}% of target</p>
            </div>

            <div className="fintech-card p-5 bg-white border border-emerald-200/90 rounded-2xl shadow-fintech-card">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block mb-1">
                Compounding Growth
              </span>
              <div className="text-xl font-bold text-emerald-600">{formatINR(compoundingGains)}</div>
              <p className="text-xs text-emerald-700 mt-1">+{((compoundingGains / targetWealth) * 100).toFixed(0)}% wealth created</p>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="fintech-card p-6 bg-white border border-slate-200/90 rounded-2xl shadow-fintech">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-2">
              Target Corpus Composition
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
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Target Corpus</span>
                <span className="text-base font-extrabold text-slate-900">
                  {formatCompactINR(targetWealth)}
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
                <span className="font-semibold text-emerald-800 truncate">Gains ({formatCompactINR(compoundingGains)})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* High-Converting Lead Capture Banner */}
      <LeadCtaBanner
        onOpenModal={() => setIsModalOpen(true)}
        title="Reach your target goal with an expert portfolio blueprint"
        subtitle={`Get a personalized plan to achieve ₹${formatCompactINR(targetWealth)} in ${tenureYears} years with ${formatINR(requiredSip)}/month.`}
      />

      {/* Educational Accordion */}
      <div className="fintech-card p-6 bg-white border border-slate-200/90 rounded-2xl shadow-fintech space-y-4">
        <button
          type="button"
          onClick={() => setOpenFaq(!openFaq)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">How Goal-Based SIP Planning Works</h3>
          </div>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq ? 'rotate-180 text-emerald-600' : ''}`} />
        </button>

        {openFaq && (
          <div className="pt-3 border-t border-slate-100 text-sm text-slate-600 space-y-3 leading-relaxed">
            <p>
              Goal-based financial planning inverses the traditional question. Instead of asking "What will I get if I save X?", it asks <strong>"How much must I save to achieve my financial dream on schedule?"</strong>
            </p>
            <p>
              By breaking a large corpus (e.g. ₹{formatCompactINR(targetWealth)}) into an accessible monthly figure of {formatINR(requiredSip)}, goal planning makes ambition actionable and stress-free.
            </p>
          </div>
        )}
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        calculatorType="Wealth Goal Planner"
        investmentOrLoanAmount={`Target: ${formatCompactINR(targetWealth)}`}
        tenure={`${tenureYears} Years`}
        rate={`${expectedRate}% p.a.`}
        projectedResult={`Req. SIP: ${formatINR(requiredSip)}/mo`}
      />
    </div>
  );
}
