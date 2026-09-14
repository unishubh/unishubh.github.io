import React, { useState, useMemo } from 'react';
import { Calculator, CreditCard, PieChart as PieIcon, RefreshCw, HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import LeadCaptureModal from '../LeadCaptureModal';
import LeadCtaBanner from '../LeadCtaBanner';

export default function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState(1000000); // ₹10 Lakh
  const [loanTenure, setLoanTenure] = useState(5);        // 5 Years
  const [interestRate, setInterestRate] = useState(8.5);   // 8.5%
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

  const { monthlyEmi, totalInterest, totalPayment } = useMemo(() => {
    const P = Number(loanAmount) || 0;
    const years = Number(loanTenure) || 0;
    const rate = Number(interestRate) || 0;

    const n = years * 12;
    const r = rate / 12 / 100;

    let emi = 0;
    if (r > 0 && n > 0 && P > 0) {
      // EMI = P * r * (1+r)^n / ((1+r)^n - 1)
      const num = P * r * Math.pow(1 + r, n);
      const den = Math.pow(1 + r, n) - 1;
      emi = num / den;
    } else if (n > 0) {
      emi = P / n;
    }

    const payment = emi * n;
    const interest = Math.max(0, payment - P);

    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(interest),
      totalPayment: Math.round(payment),
    };
  }, [loanAmount, loanTenure, interestRate]);

  const principalPct = totalPayment > 0 ? Math.round((loanAmount / totalPayment) * 100) : 0;
  const interestPct = totalPayment > 0 ? 100 - principalPct : 0;

  const chartData = [
    { name: 'Principal Loan Amount', value: loanAmount, color: '#334155' },
    { name: 'Total Interest Payable', value: totalInterest, color: '#f59e0b' }, // amber-500
  ];

  const handleReset = () => {
    setLoanAmount(1000000);
    setLoanTenure(5);
    setInterestRate(8.5);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const pct = totalPayment > 0 ? ((data.value / totalPayment) * 100).toFixed(1) : 0;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span>{data.name}</span>
          </div>
          <p className="text-base font-bold text-white tracking-tight">{formatINR(data.value)}</p>
          <p className="text-slate-400">{pct}% of total payment</p>
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
          <Calculator className="w-3.5 h-3.5 text-emerald-600" />
          <span>Home, Car & Personal Loan Simulator</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Loan EMI Calculator
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl">
          Calculate your monthly installment, principal vs. interest breakdown, and total loan payment instantly.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="fintech-card p-6 sm:p-8 space-y-7 bg-white shadow-fintech border border-slate-200/90 rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Loan Parameters</h2>
                <p className="text-xs text-slate-500 mt-0.5">Customize your borrowing amount, tenure, and bank interest rate</p>
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

            {/* Loan Amount */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Loan Amount (₹)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400 font-semibold text-sm">₹</span>
                  <input
                    type="number"
                    min={10000}
                    max={20000000}
                    step={50000}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value) || 10000)}
                    className="w-40 pl-7 pr-3 py-1.5 text-right font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-base"
                  />
                </div>
              </div>
              <input
                type="range"
                min={10000}
                max={20000000}
                step={50000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #10b981 ${getProgress(loanAmount, 10000, 20000000)}%, #e2e8f0 ${getProgress(loanAmount, 10000, 20000000)}%)`,
                }}
                className="w-full h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>₹10,000</span>
                <span className="text-emerald-600 font-semibold">{formatCompactINR(loanAmount)} Loan</span>
                <span>₹2 Crore</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {[500000, 1000000, 2500000, 5000000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setLoanAmount(val)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      loanAmount === val ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {formatCompactINR(val)}
                  </button>
                ))}
              </div>
            </div>

            {/* Loan Tenure */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Tenure (Years)</label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min={1}
                    max={30}
                    step={1}
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(Number(e.target.value) || 1)}
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
                value={loanTenure}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #10b981 ${getProgress(loanTenure, 1, 30)}%, #e2e8f0 ${getProgress(loanTenure, 1, 30)}%)`,
                }}
                className="w-full h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>1 Year</span>
                <span className="text-emerald-600 font-semibold">{loanTenure} Years ({loanTenure * 12} EMIs)</span>
                <span>30 Years</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Interest Rate (% p.a)</label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min={1}
                    max={25}
                    step={0.1}
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value) || 1)}
                    className="w-36 pr-8 pl-3 py-1.5 text-right font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-base"
                  />
                  <span className="absolute right-3 text-slate-400 font-medium text-xs">%</span>
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={25}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #10b981 ${getProgress(interestRate, 1, 25)}%, #e2e8f0 ${getProgress(interestRate, 1, 25)}%)`,
                }}
                className="w-full h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>1%</span>
                <span className="text-emerald-600 font-semibold">{interestRate}% per annum</span>
                <span>25%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Results */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          {/* Prominent Monthly EMI Card */}
          <div className="fintech-card p-6 sm:p-7 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-2xl shadow-fintech border border-slate-800 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  Monthly Loan EMI
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {loanTenure * 12} Installments
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  {formatINR(monthlyEmi)} <span className="text-lg font-normal text-emerald-400">/ month</span>
                </div>
                <p className="text-xs text-slate-300">
                  Total payment: {formatCompactINR(totalPayment)} over {loanTenure} years.
                </p>
              </div>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="fintech-card p-5 bg-white border border-slate-200/90 rounded-2xl shadow-fintech-card">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Principal Amount
              </span>
              <div className="text-xl font-bold text-slate-900">{formatINR(loanAmount)}</div>
              <p className="text-xs text-slate-500 mt-1">{principalPct}% of total payment</p>
            </div>

            <div className="fintech-card p-5 bg-white border border-amber-200/90 rounded-2xl shadow-fintech-card">
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block mb-1">
                Total Interest
              </span>
              <div className="text-xl font-bold text-amber-600">{formatINR(totalInterest)}</div>
              <p className="text-xs text-amber-700 mt-1">{interestPct}% paid in interest</p>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="fintech-card p-6 bg-white border border-slate-200/90 rounded-2xl shadow-fintech">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-2">
              Payment Breakdown (Principal vs Interest)
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
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Total Outflow</span>
                <span className="text-base font-extrabold text-slate-900">
                  {formatCompactINR(totalPayment)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="w-3 h-3 rounded-full bg-slate-700 shrink-0" />
                <span className="font-semibold text-slate-700 truncate">Principal ({formatCompactINR(loanAmount)})</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-50 border border-amber-200">
                <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                <span className="font-semibold text-amber-800 truncate">Interest ({formatCompactINR(totalInterest)})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* High-Converting Lead Capture Banner */}
      <LeadCtaBanner
        onOpenModal={() => setIsModalOpen(true)}
        title="Reduce your loan interest burden — Get an EMI optimization plan"
        subtitle={`Discover smart prepayment and refinancing strategies for your ${formatCompactINR(loanAmount)} loan.`}
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
            <h3 className="text-base font-bold text-slate-900">How to save lakhs on loan interest?</h3>
          </div>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq ? 'rotate-180 text-emerald-600' : ''}`} />
        </button>

        {openFaq && (
          <div className="pt-3 border-t border-slate-100 text-sm text-slate-600 space-y-3 leading-relaxed">
            <p>
              In long-term loans (like home loans of 15 to 20 years), interest often exceeds the original borrowed principal!
            </p>
            <p>
              <strong>💡 Smart Prepayment Strategy:</strong> Paying just <strong>1 extra EMI each year</strong> or increasing your monthly EMI by 5% annually in line with salary increments can reduce a 20-year loan tenure down to 12-13 years and save massive interest amounts.
            </p>
          </div>
        )}
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        calculatorType="Loan EMI Calculator"
        investmentOrLoanAmount={`Loan: ${formatINR(loanAmount)}`}
        tenure={`${loanTenure} Years`}
        rate={`${interestRate}% p.a.`}
        projectedResult={`EMI: ${formatINR(monthlyEmi)}/mo (Total Int: ${formatCompactINR(totalInterest)})`}
      />
    </div>
  );
}
