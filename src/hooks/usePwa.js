import { useState, useEffect, useCallback } from 'react';

const DISMISS_STORAGE_KEY = 'mf_pwa_prompt_dismissed_time';
const DISMISS_DURATION_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

export function usePwa() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(true);

  // Check if previously dismissed within threshold
  useEffect(() => {
    try {
      const dismissedTime = localStorage.getItem(DISMISS_STORAGE_KEY);
      if (!dismissedTime || Date.now() - Number(dismissedTime) > DISMISS_DURATION_MS) {
        setBannerDismissed(false);
      }
    } catch {
      setBannerDismissed(false);
    }
  }, []);

  // Detect standalone mode and platform
  useEffect(() => {
    const checkStandalone = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://');
      setIsInstalled(isStandalone);
    };

    checkStandalone();

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e) => setIsInstalled(e.matches);
    mediaQuery.addEventListener?.('change', handleDisplayModeChange);

    // Detect iOS devices (iPhone, iPad, iPod)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIosDevice);

    return () => {
      mediaQuery.removeEventListener?.('change', handleDisplayModeChange);
    };
  }, []);

  // Capture beforeinstallprompt (Android / Chrome / Edge)
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('[PWA] Application successfully installed.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Online / Offline state tracking
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Trigger prompt or guide
  const promptInstall = useCallback(async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
      return choiceResult.outcome;
    } else if (isIOS && !isInstalled) {
      setShowIOSModal(true);
      return 'ios-guide';
    }
    return null;
  }, [deferredPrompt, isIOS, isInstalled]);

  // Dismiss floating banner
  const dismissBanner = useCallback(() => {
    setBannerDismissed(true);
    try {
      localStorage.setItem(DISMISS_STORAGE_KEY, Date.now().toString());
    } catch (e) {
      console.warn('[PWA] Unable to persist dismissal', e);
    }
  }, []);

  return {
    isInstallable: isInstallable || (isIOS && !isInstalled),
    hasNativePrompt: Boolean(deferredPrompt),
    isInstalled,
    isIOS,
    isOnline,
    bannerDismissed,
    showIOSModal,
    setShowIOSModal,
    promptInstall,
    dismissBanner,
  };
}
