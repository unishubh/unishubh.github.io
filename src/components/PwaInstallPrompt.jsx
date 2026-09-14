import React, { useState, useEffect } from 'react';
import { Download, Share, SquarePlus, X, WifiOff, CheckCircle2, Smartphone } from 'lucide-react';

export default function PwaInstallPrompt({ pwaState }) {
  const {
    isInstallable,
    isInstalled,
    isIOS,
    isOnline,
    bannerDismissed,
    showIOSModal,
    setShowIOSModal,
    promptInstall,
    dismissBanner,
  } = pwaState;

  const [justReconnected, setJustReconnected] = useState(false);

  // Briefly show "Back Online" notification when reconnecting
  useEffect(() => {
    if (isOnline) {
      setJustReconnected(true);
      const timer = setTimeout(() => setJustReconnected(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
    } else {
      await promptInstall();
    }
  };

  return (
    <>
      {/* 1. Offline / Online Toast Banner */}
      {!isOnline && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce transition-all duration-300">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/95 text-white shadow-xl border border-amber-500/40 backdrop-blur-md text-xs sm:text-sm font-medium">
            <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>You are offline. Calculators remain 100% functional!</span>
          </div>
        </div>
      )}

      {isOnline && justReconnected && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fadeIn transition-all duration-300">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-900/95 text-emerald-100 shadow-lg border border-emerald-500/30 backdrop-blur-md text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Back online</span>
          </div>
        </div>
      )}

      {/* 2. Floating Bottom Install Banner (shown if installable, not installed, and not dismissed) */}
      {!isInstalled && isInstallable && !bannerDismissed && (
        <aside 
          aria-label="App installation prompt"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-40 animate-slideUp"
        >
          <div className="relative bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl border border-slate-700/80 shadow-2xl flex flex-col gap-3.5">
            {/* Close button */}
            <button
              onClick={dismissBanner}
              className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              aria-label="Dismiss installation prompt"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header info */}
            <div className="flex items-start gap-3 pr-6">
              <img
                src="./icons/icon-192.png"
                alt="MF Calculators App Icon"
                className="w-12 h-12 rounded-xl shadow-md border border-slate-700 object-cover shrink-0"
              />
              <div>
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                  Install MF Calculators
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    App
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  Add to home screen for instant 1-tap launch and full offline financial planning.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleInstallClick}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
              >
                {isIOS ? <Smartphone className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                <span>{isIOS ? 'Add to Home Screen' : 'Install App'}</span>
              </button>
              <button
                onClick={dismissBanner}
                className="px-3 py-2.5 text-xs text-slate-400 hover:text-slate-200 font-medium rounded-xl hover:bg-slate-800/60 transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 3. iOS Safari "Add to Home Screen" Instructions Modal */}
      {showIOSModal && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ios-modal-title"
        >
          <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 relative animate-slideUp">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Close guide"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 mb-5">
              <img
                src="./icons/icon-192.png"
                alt="MutualFund Calculators"
                className="w-14 h-14 rounded-2xl shadow-md border border-slate-200 object-cover"
              />
              <div>
                <h2 id="ios-modal-title" className="font-bold text-lg text-slate-900">
                  Install on iPhone / iPad
                </h2>
                <p className="text-xs text-slate-500">
                  Follow these 2 quick steps in Safari:
                </p>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                  1
                </div>
                <div className="text-xs text-slate-700 leading-relaxed pt-0.5">
                  Tap the <strong className="text-slate-900 inline-flex items-center gap-1 mx-1 font-semibold">Share button <Share className="w-3.5 h-3.5 text-blue-600 inline" /></strong> at the bottom of your Safari screen.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
                  2
                </div>
                <div className="text-xs text-slate-700 leading-relaxed pt-0.5">
                  Scroll down the menu and tap <strong className="text-slate-900 inline-flex items-center gap-1 mx-1 font-semibold">Add to Home Screen <SquarePlus className="w-3.5 h-3.5 text-emerald-600 inline" /></strong>.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
                  3
                </div>
                <div className="text-xs text-slate-700 leading-relaxed pt-0.5">
                  Tap <strong className="text-slate-900 font-semibold">Add</strong> in the top-right corner. The app will appear right on your home screen!
                </div>
              </div>
            </div>

            {/* Done button */}
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-md active:scale-98"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
