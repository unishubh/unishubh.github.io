import React, { useState, useMemo } from 'react';
import { ShieldCheck, Umbrella, HeartPulse, RefreshCw, HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import LeadCaptureModal from '../LeadCaptureModal';
import LeadCtaBanner from '../LeadCtaBanner';

export default function InsuranceCalculator() {
  const [monthlyExpense, setMonthlyExpense] = useState(30000); // ₹30,000
  const [currentAge, setCurrentAge] = useState(28);            // 28 Yrs
  const [retirementAge, setRetirementAge] = useState(60);      // 60 Yrs
  const [inflationRate, setInflationRate] = useState(6);       // 6%
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

  const { nominalCover, inflatedCover, inflationBuffer, yearsRemaining } = useMemo(() => {
    const expense = Number(monthlyExpense) || 0;
    const cage = Number(currentAge) || 20;
    const rage = Math.max(cage + 1, Number(retirementAge) || 60);
    const inflation = Number(inflationRate) || 6;

    const years = rage - cage;
    const installments = years * 12;
    const actualRate = inflation / 12 / 100;

    const nominal = expense * installments;

    let inflated = 0;
    if (actualRate > 0 && installments > 0) {
      // Annuity future value formula: expense * ((1+i)^n - 1) / i * (1+i)
      inflated = expense * ((Math.pow(1 + actualRate, installments) - 1) / actualRate) * (1 + actualRate);
    } else {
      inflated = nominal;
    }

    const buffer = Math.max(0, inflated - nominal);

    return {
      nominalCover: Math.round(nominal),
      inflatedCover: Math.round(inflated),
      inflationBuffer: Math.round(buffer),
      yearsRemaining: years,
    };
  }, [monthlyExpense, currentAge, retirementAge, inflationRate]);

  const chartData = [
    { name: 'Base Living Expenses', value: nominalCover, color: '#334155' },
    { name: 'Inflation Protection Buffer', value: inflationBuffer, color: '#10b981' },
  ];

  const handleReset = () => {
    setMonthlyExpense(30000);
    setCurrentAge(28);
    setRetirementAge(60);
    setInflationRate(6);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const pct = inflatedCover > 0 ? ((data.value / inflatedCover) * 100).toFixed(1) : 0;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span>{data.name}</span>
          </div>
          <p className="text-base font-bold text-white tracking-tight">{formatINR(data.value)}</p>
          <p className="text-slate-400">{pct}% of recommended life cover</p>
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
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Human Life Value & Term Insurance</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Life Insurance Cover Calculator
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl">
          Calculate the exact Term Insurance cover your dependents need to sustain their lifestyle, factoring in inflation until your retirement.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="fintech-card p-6 sm:p-8 space-y-7 bg-white shadow-fintech border border-slate-200/90 rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Family Expenses & Age</h2>
                <p className="text-xs text-slate-500 mt-0.5">Customize monthly expense requirements and working tenure</p>
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

            {/* Monthly Expense */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Monthly Family Expenses (₹)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400 font-semibold text-sm">₹</span>
                  <input
                    type="number"
                    min={5000}
                    max={500000}
                    step={2000}
                    value={monthlyExpense}
                    onChange={(e) => setMonthlyExpense(Number(e.target.value) || 5000)}
                    className="w-40 pl-7 pr-3 py-1.5 text-right font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-base"
                  />
                </div>
              </div>
              <input
                type="range"
                min={5000}
                max={500000}
                step={2000}
                value={monthlyExpense}
                onChange={(e) => setMonthlyExpense(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #10b981 ${getProgress(monthlyExpense, 5000, 500000)}%, #e2e8f0 ${getProgress(monthlyExpense, 5000, 500000)}%)`,
                }}
                className="w-full h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>₹5,000</span>
                <span className="text-emerald-600 font-semibold">{formatINR(monthlyExpense)} / month</span>
                <span>₹5,00,000</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {[20000, 30000, 50000, 75000, 100000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMonthlyExpense(val)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      monthlyExpense === val ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {formatINR(val)}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Age */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Current Age</label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min={18}
                    max={65}
                    step={1}
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value) || 18)}
                    className="w-32 pr-8 pl-3 py-1.5 text-right font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-base"
                  />
                  <span className="absolute right-3 text-slate-400 font-medium text-xs">Yrs</span>
                </div>
              </div>
              <input
                type="range"
                min={18}
                max={65}
                step={1}
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #10b981 ${getProgress(currentAge, 18, 65)}%, #e2e8f0 ${getProgress(currentAge, 18, 65)}%)`,
                }}
                className="w-full h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>18 Years</span>
                <span className="text-emerald-600 font-semibold">{currentAge} Years Old</span>
                <span>65 Years</span>
              </div>
            </div>

            {/* Retirement Age */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Target Retirement Age</label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min={currentAge + 1}
                    max={75}
                    step={1}
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value) || 60)}
                    className="w-32 pr-8 pl-3 py-1.5 text-right font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-base"
                  />
                  <span className="absolute right-3 text-slate-400 font-medium text-xs">Yrs</span>
                </div>
              </div>
              <input
                type="range"
                min={currentAge + 1}
                max={75}
                step={1}
                value={retirementAge}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #10b981 ${getProgress(retirementAge, currentAge + 1, 75)}%, #e2e8f0 ${getProgress(retirementAge, currentAge + 1, 75)}%)`,
                }}
                className="w-full h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>{currentAge + 1} Years</span>
                <span className="text-emerald-600 font-semibold">{yearsRemaining} Earning Years Remaining</span>
                <span>75 Years</span>
              </div>
            </div>

            {/* Inflation Rate */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Assumed Inflation Rate (% p.a)</label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min={3}
                    max={12}
                    step={0.5}
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value) || 6)}
                    className="w-32 pr-8 pl-3 py-1.5 text-right font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-base"
                  />
                  <span className="absolute right-3 text-slate-400 font-medium text-xs">%</span>
                </div>
              </div>
              <input
                type="range"
                min={3}
                max={12}
                step={0.5}
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #10b981 ${getProgress(inflationRate, 3, 12)}%, #e2e8f0 ${getProgress(inflationRate, 3, 12)}%)`,
                }}
                className="w-full h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>3%</span>
                <span className="text-emerald-600 font-semibold">{inflationRate}% Annual Inflation</span>
                <span>12%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Results */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          {/* Prominent Recommended Cover Card */}
          <div className="fintech-card p-6 sm:p-7 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-2xl shadow-fintech border border-slate-800 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Umbrella className="w-3.5 h-3.5 text-emerald-400" />
                  Recommended Term Cover
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {yearsRemaining} Years Coverage
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  {formatINR(inflatedCover)}
                </div>
                <p className="text-xs text-slate-300">
                  Approx. {formatCompactINR(inflatedCover)} inflation-adjusted Human Life Value (HLV).
                </p>
              </div>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="fintech-card p-5 bg-white border border-slate-200/90 rounded-2xl shadow-fintech-card">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Nominal Living Cost
              </span>
              <div className="text-xl font-bold text-slate-900">{formatINR(nominalCover)}</div>
              <p className="text-xs text-slate-500 mt-1">Assuming 0% inflation</p>
            </div>

            <div className="fintech-card p-5 bg-white border border-emerald-200/90 rounded-2xl shadow-fintech-card">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block mb-1">
                Inflation Buffer
              </span>
              <div className="text-xl font-bold text-emerald-600">+{formatINR(inflationBuffer)}</div>
              <p className="text-xs text-emerald-700 mt-1">To preserve purchasing power</p>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="fintech-card p-6 bg-white border border-slate-200/90 rounded-2xl shadow-fintech">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-2">
              Life Cover Composition
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
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Total Cover</span>
                <span className="text-base font-extrabold text-slate-900">
                  {formatCompactINR(inflatedCover)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-3 h-3 rounded-full bg-slate-700 shrink-0" />
                <span className="font-semibold text-slate-700 truncate">Base Cost ({formatCompactINR(nominalCover)})</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                <span className="font-semibold text-emerald-800 truncate">Inflation ({formatCompactINR(inflationBuffer)})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* High-Converting Lead Capture Banner */}
      <LeadCtaBanner
        onOpenModal={() => setIsModalOpen(true)}
        title="Protect your family's future with a tailored Term Insurance quote"
        subtitle={`Get free comparative quotes from top insurers for your ${formatCompactINR(inflatedCover)} recommended life cover.`}
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
            <h3 className="text-base font-bold text-slate-900">What is Human Life Value (HLV)?</h3>
          </div>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq ? 'rotate-180 text-emerald-600' : ''}`} />
        </button>

        {openFaq && (
          <div className="pt-3 border-t border-slate-100 text-sm text-slate-600 space-y-3 leading-relaxed">
            <p>
              <strong>Human Life Value (HLV)</strong> is a scientific financial concept representing the monetary value of future earnings that a person contributes to their family. In the unfortunate event of the breadwinner's absence, an insurance claim equal to the HLV will generate sufficient interest and capital to replace their income and sustain their dependents' lifestyle with dignity.
            </p>
            <p>
              <strong>💡 Golden Rule:</strong> Always choose pure <strong>Term Life Insurance</strong> rather than traditional endowment or money-back policies. Pure term plans offer huge cover (e.g. ₹1 to 2 Crore) at very affordable premiums.
            </p>
          </div>
        )}
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        calculatorType="Term Insurance HLV"
        investmentOrLoanAmount={`Monthly Exp: ${formatINR(monthlyExpense)}/mo`}
        tenure={`${yearsRemaining} Earning Years (Age ${currentAge} to ${retirementAge})`}
        rate={`Inflation: ${inflationRate}%`}
        projectedResult={`Cover Needed: ${formatINR(inflatedCover)}`}
      />
    </div>
  );
}
