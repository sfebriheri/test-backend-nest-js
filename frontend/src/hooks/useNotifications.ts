import { useState, useCallback } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (type: Notification['type'], message: string) => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, type, message }]);

      // Auto remove notification after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 5000);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const success = useCallback(
    (message: string) => addNotification('success', message),
    [addNotification]
  );

  const error = useCallback(
    (message: string) => addNotification('error', message),
    [addNotification]
  );

  const info = useCallback(
    (message: string) => addNotification('info', message),
    [addNotification]
  );

  const warning = useCallback(
    (message: string) => addNotification('warning', message),
    [addNotification]
  );

  return {
    notifications,
    success,
    error,
    info,
    warning,
    removeNotification,
  };
}; 