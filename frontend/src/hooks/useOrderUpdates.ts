import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useStore } from '../store';

let socket: Socket | null = null;

export const useOrderUpdates = () => {
  const { orders, setOrders, updateOrderStatus } = useStore();

  useEffect(() => {
    // Initialize socket connection
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000', {
        transports: ['websocket'],
      });
    }

    // Listen for new orders
    socket.on('newOrder', (order) => {
      setOrders([...orders, order]);
    });

    // Listen for order status updates
    socket.on('orderStatusUpdate', ({ orderId, status }) => {
      updateOrderStatus(orderId, status);
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.off('newOrder');
        socket.off('orderStatusUpdate');
        socket.disconnect();
        socket = null;
      }
    };
  }, [orders, setOrders, updateOrderStatus]);

  return {
    orders,
  };
}; 