import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LeadCtaBanner({ onOpenModal, title, subtitle }) {
  return (
    <div className="fintech-card p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl shadow-fintech border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
      <div className="absolute right-0 top-0 w-48 h-full bg-emerald-500/10 rounded-l-full pointer-events-none blur-xl" />
      
      <div className="space-y-1 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>Complimentary Investor Initiative</span>
        </div>
        <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
          {title || "Want a personalized action plan for these numbers?"}
        </h4>
        <p className="text-xs text-slate-300 max-w-xl">
          {subtitle || "Get a custom year-by-year blueprint, fund selection guidelines, and unbiased portfolio review."}
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenModal}
        className="relative z-10 shrink-0 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-98 transition-all shadow-md shadow-emerald-950/40 flex items-center gap-1.5 cursor-pointer"
      >
        <span>Get Custom Plan</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
