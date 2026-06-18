import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Notification Container */}
      <div style={{
        position: 'fixed',
        top: '90px', // Below the navbar
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '380px',
        width: '100%',
        pointerEvents: 'none' // Don't block clicks underneath container
      }}>
        {toasts.map((toast) => {
          // Color & icon configurations based on type
          let borderColor = 'var(--border-glass)';
          let glowColor = 'rgba(0, 0, 0, 0.4)';
          let icon = <Info size={18} color="#4cc9f0" />;
          
          if (toast.type === 'success') {
            borderColor = 'rgba(255, 107, 53, 0.3)';
            glowColor = 'rgba(255, 107, 53, 0.15)';
            icon = <CheckCircle size={20} color="var(--primary)" />;
          } else if (toast.type === 'error') {
            borderColor = 'rgba(247, 37, 133, 0.3)';
            glowColor = 'rgba(247, 37, 133, 0.15)';
            icon = <AlertTriangle size={20} color="var(--warning)" />;
          }

          return (
            <div
              key={toast.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 20px',
                background: 'rgba(20, 22, 30, 0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${borderColor}`,
                borderRadius: '12px',
                color: '#fff',
                boxShadow: `0 8px 32px rgba(0, 0, 0, 0.5), 0 0 15px ${glowColor}`,
                pointerEvents: 'auto', // Enable pointer events for card and close button
                animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative'
              }}
            >
              <div style={{ flexShrink: 0 }}>{icon}</div>
              <div style={{ flexGrow: 1, fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.4 }}>
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                  borderRadius: '4px',
                  transition: '0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
