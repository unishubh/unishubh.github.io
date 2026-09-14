import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PwaInstallPrompt from './components/PwaInstallPrompt';
import SipCalculator from './components/calculators/SipCalculator';
import SipDelayCalculator from './components/calculators/SipDelayCalculator';
import WealthCalculator from './components/calculators/WealthCalculator';
import LumpsumCalculator from './components/calculators/LumpsumCalculator';
import EmiCalculator from './components/calculators/EmiCalculator';
import InsuranceCalculator from './components/calculators/InsuranceCalculator';
import { usePwa } from './hooks/usePwa';

const getInitialTab = () => {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();

  if (path.includes('delay.html') || hash.includes('delay') || search.includes('tab=delay')) return 'delay';
  if (path.includes('wealth.html') || hash.includes('wealth') || search.includes('tab=wealth')) return 'wealth';
  if (path.includes('lumpsum.html') || hash.includes('lumpsum') || search.includes('tab=lumpsum')) return 'lumpsum';
  if (path.includes('emi.html') || hash.includes('emi') || search.includes('tab=emi')) return 'emi';
  if (path.includes('hv.html') || hash.includes('insurance') || search.includes('tab=insurance')) return 'insurance';
  return 'sip';
};

export default function App() {
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const pwaState = usePwa();

  // Sync with browser back/forward history navigation
  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getInitialTab());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} pwaState={pwaState} />

      {/* Dynamic Calculator Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'sip' && <SipCalculator />}
        {activeTab === 'delay' && <SipDelayCalculator />}
        {activeTab === 'wealth' && <WealthCalculator />}
        {activeTab === 'lumpsum' && <LumpsumCalculator />}
        {activeTab === 'emi' && <EmiCalculator />}
        {activeTab === 'insurance' && <InsuranceCalculator />}
      </main>

      {/* Floating PWA install prompt & offline indicators */}
      <PwaInstallPrompt pwaState={pwaState} />

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
