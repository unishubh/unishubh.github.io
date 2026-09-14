import React, { useState } from 'react';
import { Calendar, ChevronRight, BarChart3, TrendingUp } from 'lucide-react';

export default function GrowthMilestones({ monthlyInvestment, expectedReturnRate, currentYears }) {
  const [showTable, setShowTable] = useState(false);

  // Compute future value for a given number of years
  const computeSIP = (years) => {
    const monthlyRate = expectedReturnRate / 12 / 100;
    const months = years * 12;
    const invested = monthlyInvestment * months;
    const maturity = monthlyRate === 0
      ? invested
      : monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const returns = maturity - invested;
    return {
      years,
      invested: Math.round(invested),
      returns: Math.round(returns),
      maturity: Math.round(maturity)
    };
  };

  const milestoneYears = [1, 3, 5, 10, 15, 20, 25, 30].filter(
    (y, idx, arr) => y <= Math.max(currentYears, 10) || arr.indexOf(y) < 5
  );

  const formatCompactINR = (val) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} L`;
    }
    return `₹${(val / 1000).toFixed(0)}k`;
  };

  return (
    <div className="fintech-card p-6 bg-white border border-slate-200/90 rounded-2xl shadow-fintech space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">Wealth Journey Milestones</h3>
        </div>
        <button
          type="button"
          onClick={() => setShowTable(!showTable)}
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
        >
          {showTable ? 'Hide Schedule' : 'View Full Schedule'}
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showTable ? 'rotate-90' : ''}`} />
        </button>
      </div>

      <p className="text-xs text-slate-500">
        Projected compounding roadmap for ₹{monthlyInvestment.toLocaleString('en-IN')}/mo at {expectedReturnRate}% p.a.
      </p>

      {/* Quick milestone cards preview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[5, 10, 15, 20].map((y) => {
          const item = computeSIP(y);
          const isCurrent = y === currentYears;
          return (
            <div
              key={y}
              className={`p-3 rounded-xl border text-center transition-all ${
                isCurrent
                  ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                  : 'border-slate-200/70 bg-slate-50/50 hover:bg-slate-100/50'
              }`}
            >
              <span className={`text-[11px] font-semibold block ${isCurrent ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                {y} Years {isCurrent && '★'}
              </span>
              <span className="text-sm font-bold text-slate-900 mt-1 block">
                {formatCompactINR(item.maturity)}
              </span>
              <span className="text-[10px] text-emerald-600 font-medium">
                +{formatCompactINR(item.returns)} gain
              </span>
            </div>
          );
        })}
      </div>

      {/* Expanded Table */}
      {showTable && (
        <div className="overflow-x-auto pt-2 border-t border-slate-100">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-2 font-semibold">Tenure</th>
                <th className="pb-2 font-semibold">Invested</th>
                <th className="pb-2 font-semibold text-emerald-600">Est. Returns</th>
                <th className="pb-2 font-semibold text-right text-slate-900">Maturity Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {[1, 3, 5, 8, 10, 12, 15, 20, 25, 30].map((y) => {
                const data = computeSIP(y);
                const isSelected = y === currentYears;
                return (
                  <tr key={y} className={isSelected ? 'bg-emerald-50/70 font-semibold' : 'hover:bg-slate-50'}>
                    <td className="py-2.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{y} {y === 1 ? 'Year' : 'Years'}</span>
                      {isSelected && <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-semibold">Current</span>}
                    </td>
                    <td className="py-2.5">₹{data.invested.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 text-emerald-600 font-medium">+₹{data.returns.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 text-right font-bold text-slate-900">₹{data.maturity.toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
