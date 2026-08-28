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
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

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
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!order) return null;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Box textAlign="center" sx={{ mb: 6 }}>
        <CheckCircleOutlinedIcon sx={{ fontSize: 56, color: "success.main", mb: 2 }} />
        <Typography variant="h3" sx={{ mb: 1 }}>
          Order Confirmed
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Order #{order._id?.slice(-8).toUpperCase()}
        </Typography>
      </Box>

      <Paper sx={{ p: { xs: 3, md: 4 }, mb: 2.5 }}>
        <Box display="flex" justifyContent="space-between" sx={{ mb: 1.5 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>Status</Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>{order.status}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" sx={{ mb: 1.5 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>Payment</Typography>
          <Typography variant="body2">{order.paymentMethod?.toUpperCase()}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" sx={{ mb: 1.5 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>Date</Typography>
          <Typography variant="body2">{new Date(order.createdAt).toLocaleDateString()}</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        {order.items?.map((item, i) => (
          <Box key={i} display="flex" justifyContent="space-between" sx={{ py: 0.75 }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {item.title || "Product"} x {item.quantity}
            </Typography>
            <Typography variant="body2">${(item.price * item.quantity).toFixed(2)}</Typography>
          </Box>
        ))}
        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="space-between">
          <Typography sx={{ fontWeight: 500 }}>Total</Typography>
          <Typography sx={{ fontWeight: 600 }}>${order.totalAmount?.toFixed(2)}</Typography>
        </Box>
      </Paper>

      {order.address && (
        <Paper sx={{ p: { xs: 3, md: 4 }, mb: 2.5 }}>
          <Typography variant="h6" sx={{ mb: 1.5 }}>Delivery Address</Typography>
          <Typography sx={{ fontWeight: 500 }}>{order.address.fullName}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>{order.address.addressLine}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>{order.address.district}, {order.address.province} {order.address.pincode}</Typography>
        </Paper>
      )}

      <Box display="flex" gap={2} justifyContent="center">
        <Button variant="contained" component={Link} to="/">Continue Shopping</Button>
        <Button variant="outlined" component={Link} to="/orders">View Orders</Button>
      </Box>
    </Container>
  );
}
