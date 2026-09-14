import React, { useState, useMemo } from 'react';
import CalculatorInputs from '../CalculatorInputs';
import CalculatorResults from '../CalculatorResults';
import GrowthMilestones from '../GrowthMilestones';
import EducationalSection from '../EducationalSection';
import LeadCaptureModal from '../LeadCaptureModal';
import LeadCtaBanner from '../LeadCtaBanner';
import { Zap } from 'lucide-react';

export default function SipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(2000);
  const [investmentPeriod, setInvestmentPeriod] = useState(5);
  const [expectedReturnRate, setExpectedReturnRate] = useState(12);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { totalInvested, maturityValue, estimatedReturns } = useMemo(() => {
    const P = Number(monthlyInvestment) || 0;
    const years = Number(investmentPeriod) || 0;
    const annualRate = Number(expectedReturnRate) || 0;

    const n = years * 12;
    const i = annualRate / 12 / 100;

    const invested = P * n;

    let maturity = 0;
    if (i > 0 && n > 0 && P > 0) {
      maturity = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    } else {
      maturity = invested;
    }

    const returns = Math.max(0, maturity - invested);

    return {
      totalInvested: invested,
      maturityValue: maturity,
      estimatedReturns: returns,
    };
  }, [monthlyInvestment, investmentPeriod, expectedReturnRate]);

  const handleReset = () => {
    setMonthlyInvestment(2000);
    setInvestmentPeriod(5);
    setExpectedReturnRate(12);
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Hero Header */}
      <div className="text-center sm:text-left space-y-2 border-b border-slate-200/70 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 mb-1">
          <Zap className="w-3.5 h-3.5 text-emerald-600" />
          <span>Instant SIP Compounding Simulator</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Mutual Fund SIP Calculator
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl">
          Simulate your systematic investment returns dynamically. Adjust your monthly contribution, target horizon, and expected returns to calculate wealth growth in real time.
        </p>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <CalculatorInputs
            monthlyInvestment={monthlyInvestment}
            setMonthlyInvestment={setMonthlyInvestment}
            investmentPeriod={investmentPeriod}
            setInvestmentPeriod={setInvestmentPeriod}
            expectedReturnRate={expectedReturnRate}
            setExpectedReturnRate={setExpectedReturnRate}
            onReset={handleReset}
          />
          <GrowthMilestones
            monthlyInvestment={monthlyInvestment}
            expectedReturnRate={expectedReturnRate}
            currentYears={investmentPeriod}
          />
        </div>

        <div className="lg:col-span-5 sticky top-24">
          <CalculatorResults
            totalInvested={totalInvested}
            estimatedReturns={estimatedReturns}
            maturityValue={maturityValue}
          />
        </div>
      </div>

      {/* High-Converting Lead Capture Banner */}
      <LeadCtaBanner
        onOpenModal={() => setIsModalOpen(true)}
        title="Want a personalized mutual fund portfolio blueprint?"
        subtitle={`Receive a custom plan based on your ₹${monthlyInvestment.toLocaleString('en-IN')}/mo contribution and ${investmentPeriod}-year horizon.`}
      />

      <EducationalSection />

      {/* Lead Capture Modal with Autocaptured Data */}
      <LeadCaptureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        calculatorType="SIP Calculator"
        investmentOrLoanAmount={`₹${monthlyInvestment.toLocaleString('en-IN')}/mo`}
        tenure={`${investmentPeriod} Years`}
        rate={`${expectedReturnRate}% p.a.`}
        projectedResult={`Maturity: ₹${Math.round(maturityValue).toLocaleString('en-IN')}`}
      />
    </div>
  );
}
