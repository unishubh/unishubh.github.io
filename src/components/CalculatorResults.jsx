import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Wallet, ArrowUpRight, Award, PieChart as PieIcon } from 'lucide-react';

export default function CalculatorResults({
  totalInvested,
  estimatedReturns,
  maturityValue
}) {
  // Format numbers to Indian currency string
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Math.round(val));
  };

  // Convert numbers to readable Lakhs / Crores
  const formatCompactINR = (val) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakh`;
    }
    return formatINR(val);
  };

  const investedPct = maturityValue > 0 ? Math.round((totalInvested / maturityValue) * 100) : 0;
  const returnsPct = maturityValue > 0 ? 100 - investedPct : 0;

  const chartData = [
    { name: 'Invested Amount', value: Math.round(totalInvested), color: '#334155' }, // slate-700
    { name: 'Est. Returns', value: Math.round(estimatedReturns), color: '#10b981' }   // emerald-500
  ];

  const wealthMultiplier = totalInvested > 0 ? (maturityValue / totalInvested).toFixed(2) : '1.00';

  // Custom Recharts Tooltip
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
          <p className="text-slate-400">{pct}% of total maturity value</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Prominent Maturity Value Card */}
      <div className="fintech-card relative overflow-hidden p-6 sm:p-7 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-2xl shadow-fintech border border-slate-800">
        {/* Decorative background glow */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-6 bottom-4 text-emerald-500/10 pointer-events-none">
          <TrendingUp className="w-32 h-32" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              Total Wealth / Maturity Value
            </span>
            <span className="text-xs font-medium text-slate-400">
              {wealthMultiplier}x Total Growth
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-baseline gap-2">
              <span>{formatINR(maturityValue)}</span>
            </div>
            <div className="text-sm font-medium text-emerald-400 flex items-center gap-1.5">
              <span>Approx. {formatCompactINR(maturityValue)}</span>
              <span className="text-slate-400 text-xs font-normal">at expected compounding rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Metric Cards: Invested vs Returns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Invested Amount Card */}
        <div className="fintech-card p-5 bg-white border border-slate-200/90 rounded-2xl shadow-fintech-card hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-slate-500" />
              Invested Amount
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
              {investedPct}%
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {formatINR(totalInvested)}
          </div>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            {formatCompactINR(totalInvested)} principal
          </p>
        </div>

        {/* Estimated Returns Card */}
        <div className="fintech-card p-5 bg-white border border-emerald-200/70 rounded-2xl shadow-fintech-card hover:border-emerald-300 transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              Est. Returns
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
              +{returnsPct}%
            </span>
          </div>
          <div className="text-2xl font-bold text-emerald-800 tracking-tight">
            {formatINR(estimatedReturns)}
          </div>
          <p className="text-xs text-emerald-700 mt-1 font-semibold">
            {formatCompactINR(estimatedReturns)} wealth created
          </p>
        </div>
      </div>

      {/* Interactive Donut Chart Container */}
      <div className="fintech-card p-6 bg-white border border-slate-200/90 rounded-2xl shadow-fintech">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
          <div className="flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-bold text-slate-900">Investment Breakdown</h3>
          </div>
          <span className="text-xs font-medium text-slate-600">Principal vs Capital Gains</span>
        </div>

        {/* Donut Chart with Center Label */}
        <div className="relative h-64 sm:h-72 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                animationDuration={600}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Summary Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Total Value</span>
            <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {formatCompactINR(maturityValue)}
            </span>
            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 border border-emerald-100">
              +{returnsPct}% Gain
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
            <span className="w-3 h-3 rounded-full bg-slate-700 shrink-0" />
            <div className="truncate">
              <span className="font-semibold text-slate-700 block truncate">Invested</span>
              <span className="text-slate-600 font-bold">{investedPct}% ({formatCompactINR(totalInvested)})</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-50/70 border border-emerald-100">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
            <div className="truncate">
              <span className="font-semibold text-emerald-800 block truncate">Est. Returns</span>
              <span className="text-emerald-800 font-bold">+{returnsPct}% ({formatCompactINR(estimatedReturns)})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
