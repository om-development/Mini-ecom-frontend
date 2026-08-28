import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import api from "../api/axios";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/order/${orderId}`);
        setOrder(res.data.order);
      } catch {
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!order) return null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box textAlign="center" sx={{ mb: 4 }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 64 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Order Placed Successfully!
        </Typography>
        <Typography color="text.secondary">
          Order ID: {order._id}
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Order Details</Typography>
        <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography color="text.secondary">Status</Typography>
          <Alert severity={order.status === "Delivered" ? "success" : order.status === "Shipped" ? "info" : "warning"} sx={{ py: 0 }}>
            {order.status}
          </Alert>
        </Box>
        <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography color="text.secondary">Payment</Typography>
          <Typography>{order.paymentMethod?.toUpperCase()}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography color="text.secondary">Date</Typography>
          <Typography>{new Date(order.createdAt).toLocaleDateString()}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>Items</Typography>
        {order.items?.map((item, i) => (
          <Box key={i} display="flex" justifyContent="space-between" sx={{ py: 0.5 }}>
            <Typography variant="body2">
              {item.title || "Product"} x {item.quantity}
            </Typography>
            <Typography variant="body2">${(item.price * item.quantity).toFixed(2)}</Typography>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6" color="primary">Total</Typography>
          <Typography variant="h6" color="primary">${order.totalAmount?.toFixed(2)}</Typography>
        </Box>
      </Paper>

      {order.address && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Delivery Address</Typography>
          <Typography>{order.address.fullName}</Typography>
          <Typography variant="body2" color="text.secondary">{order.address.addressLine}</Typography>
          <Typography variant="body2" color="text.secondary">{order.address.district}, {order.address.province} {order.address.pincode}</Typography>
          <Typography variant="body2" color="text.secondary">Phone: {order.address.phone}</Typography>
        </Paper>
      )}

      <Box display="flex" gap={2} justifyContent="center">
        <Button variant="contained" component={Link} to="/">Continue Shopping</Button>
        <Button variant="outlined" component={Link} to="/orders">View Orders</Button>
      </Box>
    </Container>
  );
}
