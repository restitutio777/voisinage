import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export function PWAUpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleUpdate = (reg: ServiceWorkerRegistration) => {
      setRegistration(reg);
      setShowUpdate(true);
    };

    navigator.serviceWorker.ready.then((reg) => {
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            handleUpdate(reg);
          }
        });
      });
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  }, []);

  const handleUpdate = () => {
    if (!registration?.waiting) return;
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    setShowUpdate(false);
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-stone-900 text-white rounded-xl shadow-lg p-4 z-50 animate-slide-down">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
          <RefreshCw className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm">
            Mise a jour disponible
          </h3>
          <p className="text-xs text-stone-300 mt-0.5">
            Une nouvelle version est prete
          </p>
        </div>

        <button
          onClick={handleUpdate}
          className="flex-shrink-0 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          Actualiser
        </button>
      </div>
    </div>
  );
}
