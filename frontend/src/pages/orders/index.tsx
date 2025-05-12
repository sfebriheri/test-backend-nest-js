import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  restaurantName: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    restaurantName: 'The Gourmet Kitchen',
    customerName: 'John Doe',
    items: [
      { id: '1', name: 'Spring Rolls', quantity: 2, price: 6.99 },
      { id: '2', name: 'Pad Thai', quantity: 1, price: 12.99 },
    ],
    total: 26.97,
    status: 'pending',
    createdAt: '2024-03-15T10:30:00Z',
  },
  {
    id: '2',
    restaurantName: 'Sushi Master',
    customerName: 'Jane Smith',
    items: [
      { id: '3', name: 'California Roll', quantity: 1, price: 8.99 },
      { id: '4', name: 'Miso Soup', quantity: 1, price: 4.99 },
    ],
    total: 13.98,
    status: 'preparing',
    createdAt: '2024-03-15T11:15:00Z',
  },
];

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'preparing':
      return 'info';
    case 'ready':
      return 'success';
    case 'delivered':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseDialog = () => {
    setSelectedOrder(null);
  };

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    handleCloseDialog();
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Orders
      </Typography>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} key={order.id}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6" component="div">
                      Order #{order.id}
                    </Typography>
                    <Typography color="text.secondary">
                      {order.restaurantName}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip
                      label={order.status.toUpperCase()}
                      color={getStatusColor(order.status)}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleViewOrder(order)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body2">
                  Customer: {order.customerName}
                </Typography>
                <Typography variant="body2">
                  Total: ${order.total.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(order.createdAt).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={!!selectedOrder}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              Order #{selectedOrder.id} - {selectedOrder.restaurantName}
            </DialogTitle>
            <DialogContent>
              <Typography variant="subtitle1" gutterBottom>
                Customer: {selectedOrder.customerName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Status: {selectedOrder.status.toUpperCase()}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Items:
              </Typography>
              <List>
                {selectedOrder.items.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemText
                      primary={item.name}
                      secondary={`Quantity: ${item.quantity}`}
                    />
                    <Typography>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">
                  ${selectedOrder.total.toFixed(2)}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              {selectedOrder.status === 'pending' && (
                <>
                  <Button
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'preparing')}
                    color="primary"
                  >
                    Start Preparing
                  </Button>
                  <Button
                    startIcon={<CancelIcon />}
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                    color="error"
                  >
                    Cancel Order
                  </Button>
                </>
              )}
              {selectedOrder.status === 'preparing' && (
                <Button
                  startIcon={<CheckCircleIcon />}
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'ready')}
                  color="success"
                >
                  Mark as Ready
                </Button>
              )}
              {selectedOrder.status === 'ready' && (
                <Button
                  startIcon={<CheckCircleIcon />}
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                  color="success"
                >
                  Mark as Delivered
                </Button>
              )}
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
} 