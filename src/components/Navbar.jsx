import React, { useState } from 'react';
import { TrendingUp, Menu, X, Calculator, ShieldCheck, DollarSign, Clock, Layers, Download, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, pwaState }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    isInstallable = false,
    isInstalled = false,
    isIOS = false,
    promptInstall,
    setShowIOSModal,
  } = pwaState || {};

  const handleInstallClick = () => {
    if (isIOS && setShowIOSModal) {
      setShowIOSModal(true);
    } else if (promptInstall) {
      promptInstall();
    }
  };

  const navItems = [
    { id: 'sip', name: 'SIP', href: 'index.html', icon: TrendingUp },
    { id: 'stepup', name: 'Step-Up', href: 'stepup.html', icon: Sparkles },
    { id: 'delay', name: 'SIP Delay', href: 'delay.html', icon: Clock },
    { id: 'wealth', name: 'Wealth', href: 'wealth.html', icon: DollarSign },
    { id: 'lumpsum', name: 'Lumpsum', href: 'lumpsum.html', icon: Layers },
    { id: 'emi', name: 'EMI', href: 'emi.html', icon: Calculator },
    { id: 'insurance', name: 'Insurance', href: 'hv.html', icon: ShieldCheck },
  ];

  const handleTabClick = (e, item) => {
    e.preventDefault();
    setActiveTab(item.id);
    if (window.history.pushState) {
      window.history.pushState(null, '', item.href);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <a
              href="index.html"
              onClick={(e) => handleTabClick(e, navItems[0])}
              className="flex items-center space-x-2.5 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-700 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-200">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                  MutualFund <span className="text-emerald-600 font-semibold">Calculators</span>
                </span>
                <span className="block text-[10px] uppercase tracking-wider font-semibold text-slate-600">
                  Smart Financial Planning
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleTabClick(e, item)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 flex items-center space-x-1.5 ${
                    isActive
                      ? 'text-emerald-700 bg-emerald-50/80 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-600 rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action / Info pill & PWA Install button */}
          <div className="hidden lg:flex items-center space-x-3">
            {!isInstalled && isInstallable && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-colors cursor-pointer"
                title="Install app to your home screen or desktop"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install App</span>
              </button>
            )}

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Financial Suite
            </span>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            {!isInstalled && isInstallable && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white shadow-xs"
                aria-label="Install App"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleTabClick(e, item)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{item.name}</span>
                {isActive && (
                  <span className="ml-auto text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                    Active
                  </span>
                )}
              </a>
            );
          })}

          {/* Mobile menu install CTA button */}
          {!isInstalled && isInstallable && (
            <div className="pt-2 border-t border-slate-100 mt-2">
              <button
                type="button"
                onClick={() => {
                  handleInstallClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Install App to Home Screen</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
