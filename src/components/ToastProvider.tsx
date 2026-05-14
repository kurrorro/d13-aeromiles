'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ModalConfig {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'primary' | 'danger' | 'success';
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  showConfirm: (config: Omit<ModalConfig, 'onConfirm' | 'onCancel'>) => Promise<boolean>;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [modal, setModal] = useState<ModalConfig | null>(null);
  const [modalPromise, setModalPromise] = useState<{ resolve: (v: boolean) => void } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const showConfirm = useCallback((config: Omit<ModalConfig, 'onConfirm' | 'onCancel'>) => {
    return new Promise<boolean>((resolve) => {
      setModal({
        ...config,
        onConfirm: () => {
          setModal(null);
          resolve(true);
        },
        onCancel: () => {
          setModal(null);
          resolve(false);
        }
      });
    });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, showConfirm }}>
      {children}

      {/* TOASTS */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto min-w-[320px] max-w-md p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border flex items-center gap-4 animate-slide-in-right transition-all duration-500 backdrop-blur-md ${
              toast.type === 'success' ? 'bg-white/90 border-[var(--color-success-light)] text-[var(--color-title)]' :
              toast.type === 'error' ? 'bg-white/90 border-[var(--color-danger-light)] text-[var(--color-title)]' :
              toast.type === 'warning' ? 'bg-white/90 border-[var(--color-warning-light)] text-[var(--color-title)]' :
              'bg-white/90 border-[var(--color-border-light)] text-[var(--color-title)]'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              toast.type === 'success' ? 'bg-[var(--color-primary)] text-white' :
              toast.type === 'error' ? 'bg-[var(--color-danger)] text-white' :
              toast.type === 'warning' ? 'bg-[var(--color-warning)] text-white' :
              'bg-[var(--color-primary)] text-white'
            }`}>
              {toast.type === 'success' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
              {toast.type === 'error' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>}
              {toast.type === 'info' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            </div>
            <p className="text-sm font-bold leading-tight">{toast.message}</p>
            <button 
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="ml-auto p-1 rounded-lg hover:bg-black/5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
      </div>

      {/* CONFIRM MODAL */}
      {modal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={modal.onCancel} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-border-light animate-scale-up">
            <div className="p-8">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                modal.type === 'danger' ? 'bg-[var(--color-danger-light)] text-[var(--color-danger)]' : 
                modal.type === 'success' ? 'bg-[var(--color-success-light)] text-[var(--color-success)]' : 
                'bg-[var(--color-bg-subtle)] text-[var(--color-primary)]'
              }`}>
                {modal.type === 'danger' ? (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                ) : (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                )}
              </div>
              <h3 className="text-xl font-bold text-title mb-2">{modal.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{modal.message}</p>
            </div>
            <div className="bg-bg-subtle p-6 flex gap-3 justify-end border-t border-border-light">
              <button 
                onClick={modal.onCancel}
                className="px-6 py-2.5 text-sm font-bold text-text-muted hover:text-title transition-colors"
              >
                {modal.cancelText || 'Batal'}
              </button>
              <button 
                onClick={modal.onConfirm}
                className={`px-8 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 ${
                  modal.type === 'danger' ? 'bg-[var(--color-danger)] shadow-danger/20' : 
                  modal.type === 'success' ? 'bg-[var(--color-success)] shadow-success/20' : 
                  'bg-[var(--color-primary)] shadow-primary/20'
                }`}
              >
                {modal.confirmText || 'Ya, Lanjutkan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};
