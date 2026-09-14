import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  Sparkles, 
  RefreshCw, 
  HelpCircle, 
  ChevronDown, 
  CheckCircle2, 
  Calendar,
  Percent,
  IndianRupee,
  BarChart3,
  Table as TableIcon
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import LeadCaptureModal from '../LeadCaptureModal';
import LeadCtaBanner from '../LeadCtaBanner';

export default function StepUpCalculator() {
  const [initialInvestment, setInitialInvestment] = useState(10000); // ₹10,000 / month
  const [stepUpType, setStepUpType] = useState('percent'); // 'percent' | 'amount'
  const [stepUpPercent, setStepUpPercent] = useState(10); // 10% per year
  const [stepUpAmount, setStepUpAmount] = useState(1000); // ₹1,000 / year
  const [investmentPeriod, setInvestmentPeriod] = useState(10); // 10 Years
  const [expectedReturnRate, setExpectedReturnRate] = useState(12); // 12% p.a.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

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

  // Month-by-month calculations for accuracy
  const {
    totalInvested,
    maturityValue,
    estimatedReturns,
    regularMaturity,
    regularTotalInvested,
    wealthBonus,
    yearlyBreakdown,
  } = useMemo(() => {
    const P0 = Number(initialInvestment) || 0;
    const years = Number(investmentPeriod) || 0;
    const annualRate = Number(expectedReturnRate) || 0;
    const monthlyRate = annualRate / 12 / 100;

    let balance = 0;
    let regularBalance = 0;
    let totalInvestedAcc = 0;
    let regularInvestedAcc = 0;
    const yearly = [];

    for (let y = 1; y <= years; y++) {
      // Calculate monthly SIP for year y
      let monthlySip = P0;
      if (stepUpType === 'percent') {
        monthlySip = Math.round(P0 * Math.pow(1 + stepUpPercent / 100, y - 1));
      } else {
        monthlySip = P0 + (y - 1) * stepUpAmount;
      }

      let yearInvested = 0;
      for (let m = 1; m <= 12; m++) {
        // Step-up SIP deposit & compounding
        balance = (balance + monthlySip) * (1 + monthlyRate);
        yearInvested += monthlySip;
        totalInvestedAcc += monthlySip;

        // Flat regular SIP comparison
        regularBalance = (regularBalance + P0) * (1 + monthlyRate);
        regularInvestedAcc += P0;
      }

      yearly.push({
        year: y,
        monthlySip,
        yearlyInvested: yearInvested,
        cumulativeInvested: totalInvestedAcc,
        stepUpBalance: Math.round(balance),
        regularBalance: Math.round(regularBalance),
      });
    }

    const returns = Math.max(0, balance - totalInvestedAcc);
    const bonus = Math.max(0, balance - regularBalance);

    return {
      totalInvested: Math.round(totalInvestedAcc),
      maturityValue: Math.round(balance),
      estimatedReturns: Math.round(returns),
      regularMaturity: Math.round(regularBalance),
      regularTotalInvested: Math.round(regularInvestedAcc),
      wealthBonus: Math.round(bonus),
      yearlyBreakdown: yearly,
    };
  }, [initialInvestment, stepUpType, stepUpPercent, stepUpAmount, investmentPeriod, expectedReturnRate]);

  const investedPct = maturityValue > 0 ? Math.round((totalInvested / maturityValue) * 100) : 0;
  const returnsPct = maturityValue > 0 ? 100 - investedPct : 0;

  const chartData = [
    { name: 'Invested Capital', value: totalInvested, color: '#334155' },
    { name: 'Estimated Returns', value: estimatedReturns, color: '#10b981' },
  ];

  const handleReset = () => {
    setInitialInvestment(10000);
    setStepUpType('percent');
    setStepUpPercent(10);
    setStepUpAmount(1000);
    setInvestmentPeriod(10);
    setExpectedReturnRate(12);
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const pct = maturityValue > 0 ? ((data.value / maturityValue) * 100).toFixed(1) : 0;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span>{data.name}</span>
          </div>
          <p className="font-bold text-sm text-emerald-400">{formatINR(data.value)}</p>
          <p className="text-slate-400">{pct}% of total corpus</p>
        </div>
      );
    }
    return null;
  };

  const CustomAreaTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5">
          <p className="font-bold text-slate-300 border-b border-slate-800 pb-1">Year {label}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-emerald-400">Step-Up Corpus:</span>
              <span className="font-semibold">{formatINR(payload[0]?.value || 0)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sky-400">Regular SIP:</span>
              <span className="font-semibold">{formatINR(payload[1]?.value || 0)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Total Invested:</span>
              <span className="font-semibold">{formatINR(payload[2]?.value || 0)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const displayedRows = showFullSchedule ? yearlyBreakdown : yearlyBreakdown.slice(0, 5);

  const faqs = [
    {
      q: 'What is a Step-Up SIP (Top-Up SIP)?',
      a: 'A Step-Up SIP (or Top-Up SIP) is a feature that allows you to automatically increase your monthly SIP contribution at predetermined intervals (usually once a year). This aligns your investments with annual salary appraisals and bonuses, accelerating your wealth accumulation exponentially.'
    },
    {
      q: 'Why is Step-Up SIP significantly better than a flat regular SIP?',
      a: 'In a flat SIP, your investment amount remains constant even as your salary grows, meaning you save a smaller percentage of your income each year while inflation erodes purchasing power. A modest 10% annual step-up typically generates 50% to 100% larger final wealth over a 10-15 year horizon because more capital gets deployed as your earning capacity grows.'
    },
    {
      q: 'Should I choose Percentage Step-Up or Fixed Amount Step-Up?',
      a: 'Percentage Step-Up (e.g. 10% per year) naturally mirrors career percentage salary hikes and compounding. Fixed Amount Step-Up (e.g. +₹1,000 or +₹2,000 per year) is ideal if you want predictable, fixed rupee increments without rapid escalation in later years.'
    },
    {
      q: 'How is the Step-Up compounding calculated?',
      a: 'The calculation factors in monthly compounding. In Year 1, your initial monthly SIP is invested. In Year 2, the monthly installment steps up by the selected rate and compounds for the remaining tenure, repeating every year until maturity.'
    }
  ];

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Hero Header */}
      <div className="text-center sm:text-left space-y-2 border-b border-slate-200/70 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Annual Wealth Accelerator</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          SIP Step-Up Calculator
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl">
          Simulate how increasing your monthly SIP contribution annually alongside salary appraisals dramatically multiplies your final maturity wealth.
        </p>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Investment Parameters
              </h2>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
                title="Reset to default values"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Input 1: Starting Monthly SIP */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Initial Monthly Investment</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₹</span>
                  <input
                    type="number"
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(Math.max(500, Math.min(500000, Number(e.target.value) || 0)))}
                    className="w-36 pl-7 pr-3 py-1.5 text-right font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              </div>
              <input
                type="range"
                min="500"
                max="150000"
                step="500"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${getProgress(initialInvestment, 500, 150000)}%, #e2e8f0 ${getProgress(initialInvestment, 500, 150000)}%, #e2e8f0 100%)`
                }}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              {/* Presets */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-400 font-medium">Presets:</span>
                {[5000, 10000, 25000, 50000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setInitialInvestment(preset)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                      initialInvestment === preset
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    ₹{preset >= 1000 ? `${preset / 1000}k` : preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Input 2: Step-Up Mode & Value */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Annual Step-Up By</label>
                {/* Mode Toggle Button Group */}
                <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setStepUpType('percent')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all ${
                      stepUpType === 'percent'
                        ? 'bg-white text-emerald-700 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Percent className="w-3 h-3" />
                    <span>Percentage</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStepUpType('amount')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-all ${
                      stepUpType === 'amount'
                        ? 'bg-white text-emerald-700 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <IndianRupee className="w-3 h-3" />
                    <span>Fixed ₹</span>
                  </button>
                </div>
              </div>

              {stepUpType === 'percent' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Yearly increment in monthly SIP</span>
                    <div className="relative">
                      <input
                        type="number"
                        value={stepUpPercent}
                        onChange={(e) => setStepUpPercent(Math.max(1, Math.min(50, Number(e.target.value) || 0)))}
                        className="w-24 pr-7 pl-3 py-1.5 text-right font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={stepUpPercent}
                    onChange={(e) => setStepUpPercent(Number(e.target.value))}
                    style={{
                      background: `linear-gradient(to right, #10b981 0%, #10b981 ${getProgress(stepUpPercent, 1, 30)}%, #e2e8f0 ${getProgress(stepUpPercent, 1, 30)}%, #e2e8f0 100%)`
                    }}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-slate-400 font-medium">Presets:</span>
                    {[5, 10, 15, 20].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setStepUpPercent(preset)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                          stepUpPercent === preset
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        +{preset}%
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Yearly addition to monthly SIP</span>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₹</span>
                      <input
                        type="number"
                        value={stepUpAmount}
                        onChange={(e) => setStepUpAmount(Math.max(500, Math.min(50000, Number(e.target.value) || 0)))}
                        className="w-32 pl-7 pr-3 py-1.5 text-right font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="20000"
                    step="500"
                    value={stepUpAmount}
                    onChange={(e) => setStepUpAmount(Number(e.target.value))}
                    style={{
                      background: `linear-gradient(to right, #10b981 0%, #10b981 ${getProgress(stepUpAmount, 500, 20000)}%, #e2e8f0 ${getProgress(stepUpAmount, 500, 20000)}%, #e2e8f0 100%)`
                    }}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-slate-400 font-medium">Presets:</span>
                    {[500, 1000, 2000, 5000].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setStepUpAmount(preset)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                          stepUpAmount === preset
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        +₹{preset}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input 3: Expected Return Rate */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-slate-700">Expected Annual Return</label>
                  <span className="block text-[11px] text-slate-400">Historically 12% - 15% for Equity MFs</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={expectedReturnRate}
                    onChange={(e) => setExpectedReturnRate(Math.max(1, Math.min(35, Number(e.target.value) || 0)))}
                    className="w-24 pr-7 pl-3 py-1.5 text-right font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">%</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={expectedReturnRate}
                onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${getProgress(expectedReturnRate, 1, 30)}%, #e2e8f0 ${getProgress(expectedReturnRate, 1, 30)}%, #e2e8f0 100%)`
                }}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Input 4: Investment Horizon */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Time Horizon</label>
                <div className="relative">
                  <input
                    type="number"
                    value={investmentPeriod}
                    onChange={(e) => setInvestmentPeriod(Math.max(1, Math.min(40, Number(e.target.value) || 0)))}
                    className="w-24 pr-8 pl-3 py-1.5 text-right font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">Yr</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="35"
                step="1"
                value={investmentPeriod}
                onChange={(e) => setInvestmentPeriod(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${getProgress(investmentPeriod, 1, 35)}%, #e2e8f0 ${getProgress(investmentPeriod, 1, 35)}%, #e2e8f0 100%)`
                }}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-400 font-medium">Presets:</span>
                {[5, 10, 15, 20].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setInvestmentPeriod(preset)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                      investmentPeriod === preset
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {preset} Yrs
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Comparative Growth Trajectory Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  Growth Comparison Trajectory
                </h3>
                <p className="text-xs text-slate-500">Step-Up SIP vs Flat Regular SIP vs Total Invested</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Step-Up SIP
                </span>
                <span className="flex items-center gap-1.5 font-medium text-sky-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                  Regular SIP
                </span>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearlyBreakdown} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="stepUpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stop-color="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stop-color="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="regularGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stop-color="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stop-color="#0ea5e9" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(y) => `Y${y}`} />
                  <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => v >= 10000000 ? `₹${(v / 10000000).toFixed(1)}Cr` : v >= 100000 ? `₹${(v / 100000).toFixed(0)}L` : `₹${v}`} />
                  <RechartsTooltip content={<CustomAreaTooltip />} />
                  <Area type="monotone" dataKey="stepUpBalance" name="Step-Up SIP" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#stepUpGrad)" />
                  <Area type="monotone" dataKey="regularBalance" name="Regular SIP" stroke="#0ea5e9" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#regularGrad)" />
                  <Area type="monotone" dataKey="cumulativeInvested" name="Invested" stroke="#94a3b8" strokeWidth={1.5} fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Results & Pie Chart */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <h2 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
              Projected Maturity Wealth
            </h2>

            {/* Highlighted Big Total Display */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-md space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                Total Corpus with Step-Up
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {formatINR(maturityValue)}
              </div>
              <div className="text-xs text-slate-300 font-medium pt-1">
                Total wealth at {expectedReturnRate}% return over {investmentPeriod} years
              </div>
            </div>

            {/* Step-Up Extra Wealth Bonus Card */}
            <div className="bg-emerald-50/80 border border-emerald-200/80 p-4 rounded-xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                  Step-Up Wealth Advantage
                </span>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Stepping up generates <strong className="font-bold text-emerald-950">+{formatINR(wealthBonus)}</strong> more wealth than a static regular SIP!
                </p>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-700" />
                  <span className="text-slate-600 font-medium">Total Invested</span>
                </div>
                <span className="font-bold text-slate-900">{formatINR(totalInvested)}</span>
              </div>

              <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 font-medium">Estimated Wealth Gains</span>
                </div>
                <span className="font-bold text-emerald-600">+{formatINR(estimatedReturns)}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 py-1">
                <span>Static SIP Maturity (No Step-Up)</span>
                <span className="font-medium text-slate-700">{formatINR(regularMaturity)}</span>
              </div>
            </div>

            {/* Visual Donut Chart */}
            <div className="pt-2">
              <div className="h-48 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Returns</span>
                  <span className="text-lg font-extrabold text-emerald-600">{returnsPct}%</span>
                </div>
              </div>

              {/* Chart Legend */}
              <div className="flex justify-center gap-6 text-xs text-slate-600 pt-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                  <span>Invested ({investedPct}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Returns ({returnsPct}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Year-by-Year Schedule Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-emerald-600" />
              Year-by-Year SIP Contribution & Wealth Schedule
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Watch how your monthly SIP grows alongside your accumulated portfolio balance.
            </p>
          </div>
          {yearlyBreakdown.length > 5 && (
            <button
              onClick={() => setShowFullSchedule(!showFullSchedule)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors self-start sm:self-auto"
            >
              <span>{showFullSchedule ? 'Collapse View' : `View All ${yearlyBreakdown.length} Years`}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFullSchedule ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Year</th>
                <th className="py-3.5 px-4">Monthly SIP</th>
                <th className="py-3.5 px-4">Annual Deposit</th>
                <th className="py-3.5 px-4">Cumulative Invested</th>
                <th className="py-3.5 px-4 text-emerald-700">Step-Up Balance</th>
                <th className="py-3.5 px-4 text-slate-500">Static SIP Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {displayedRows.map((row) => (
                <tr key={row.year} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">Year {row.year}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">{formatINR(row.monthlySip)}</td>
                  <td className="py-3.5 px-4">{formatINR(row.yearlyInvested)}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{formatINR(row.cumulativeInvested)}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600 bg-emerald-50/40">
                    {formatINR(row.stepUpBalance)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{formatINR(row.regularBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!showFullSchedule && yearlyBreakdown.length > 5 && (
          <div className="p-3 text-center bg-slate-50/60 border-t border-slate-100">
            <button
              onClick={() => setShowFullSchedule(true)}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Showing first 5 years. Click to expand full schedule ({yearlyBreakdown.length} years)
            </button>
          </div>
        )}
      </div>

      {/* High-Converting Lead Capture Banner */}
      <LeadCtaBanner
        onOpenModal={() => setIsModalOpen(true)}
        title="Ready to build an automated Step-Up SIP roadmap?"
        subtitle={`Speak with an advisor to set up auto-top-up SIPs starting at ₹${initialInvestment.toLocaleString('en-IN')}/mo with ${stepUpType === 'percent' ? `${stepUpPercent}%` : `₹${stepUpAmount}`} annual step-up.`}
      />

      {/* Educational & FAQ Section */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            Everything You Need to Know About Step-Up SIP
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Learn why financial planners consider annual step-up the ultimate wealth multiplier.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Defeats Inflation
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Living expenses grow with inflation. Stepping up your investment keeps your savings rate ahead of inflation every year.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Matches Salary Hikes
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              As your career progresses and salary increases, your monthly investments automatically scale up painlessly.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Compounding on Fire
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Even a tiny 10% annual increment can double your final retirement corpus compared to a flat SIP over 15–20 years.
            </p>
          </div>
        </div>

        {/* Accordion FAQs */}
        <div className="space-y-3 pt-2">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="w-full p-4 text-left font-semibold text-slate-900 flex items-center justify-between hover:bg-slate-50 transition-colors text-sm"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="p-4 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lead Capture Modal with Autocaptured Data */}
      <LeadCaptureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        calculatorType="Step-Up SIP Calculator"
        investmentOrLoanAmount={`Initial ₹${initialInvestment.toLocaleString('en-IN')}/mo (Step-Up: ${stepUpType === 'percent' ? `${stepUpPercent}%/yr` : `₹${stepUpAmount}/yr`})`}
        tenure={`${investmentPeriod} Years`}
        rate={`${expectedReturnRate}% p.a.`}
        projectedResult={`Step-Up Corpus: ₹${Math.round(maturityValue).toLocaleString('en-IN')} (+₹${Math.round(wealthBonus).toLocaleString('en-IN')} bonus)`}
      />
    </div>
  );
}
