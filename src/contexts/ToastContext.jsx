import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const show = useCallback((msg, kind = 'info') => {
    setToast({ msg, kind, key: Date.now() });
    setTimeout(() => setToast(null), 3200);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && (
        <div
          key={toast.key}
          style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 50,
            padding: '12px 20px',
            borderRadius: 10,
            background: toast.kind === 'error' ? '#dc2626' : toast.kind === 'success' ? 'var(--brand-600)' : 'var(--ink)',
            color: 'white',
            fontSize: 14, fontWeight: 500,
            boxShadow: 'var(--shadow-lg)',
            animation: 'slideUp 240ms cubic-bezier(0.22,1,0.36,1)',
            maxWidth: 360,
          }}
        >
          {toast.msg}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() { return useContext(ToastContext); }
