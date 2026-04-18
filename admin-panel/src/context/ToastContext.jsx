import { useState, createContext, useContext } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`alert ${t.type === 'success' ? 'alert-success' : 'alert-danger'} fade show`}
            role="alert"
            style={{
              minWidth: '250px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              marginBottom: 0
            }}
          >
            <div className="d-flex align-items-center">
              <i className={`mdi ${t.type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'} me-2`} style={{ fontSize: '1.2rem' }}></i>
              {t.message}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
