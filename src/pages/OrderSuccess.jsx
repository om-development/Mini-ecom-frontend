import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import api from "../api/axios";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
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
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
      {/* Success Header */}
      <Box textAlign="center" sx={{ mb: 8 }}>
        <CheckCircleIcon
          sx={{
            fontSize: 72,
            color: "success.main",
            mb: 3,
            animation: "scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            "@keyframes scaleIn": {
              "0%": { transform: "scale(0)", opacity: 0 },
              "100%": { transform: "scale(1)", opacity: 1 },
            },
          }}
        />
        <Typography
          variant="h2"
          sx={{
            fontWeight: 600,
            letterSpacing: "-0.03em",
            fontSize: { xs: "1.5rem", md: "2rem" },
            mb: 1,
          }}
        >
          Order Confirmed
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>
          #{order._id?.slice(-8).toUpperCase()}
        </Typography>
      </Box>

      {/* Order Details */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 3, mb: 4 }}>
          <Box>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>Status</Typography>
            <Typography sx={{ fontWeight: 500 }}>{order.status}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>Payment</Typography>
            <Typography sx={{ fontWeight: 500 }}>{order.paymentMethod?.toUpperCase()}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>Date</Typography>
            <Typography sx={{ fontWeight: 500 }}>{new Date(order.createdAt).toLocaleDateString()}</Typography>
          </Box>
        </Box>

        {/* Items */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ color: "text.secondary", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", mb: 2 }}>
            Items
          </Typography>
          {order.items?.map((item, i) => (
            <Box key={i} display="flex" justifyContent="space-between" sx={{ py: 1.25 }}>
              <Typography sx={{ color: "text.secondary" }}>
                {item.title || "Product"} x {item.quantity}
              </Typography>
              <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
            </Box>
          ))}
          <Box sx={{ height: 1, backgroundColor: "rgba(255,255,255,0.06)", my: 1 }} />
          <Box display="flex" justifyContent="space-between" sx={{ pt: 1.25 }}>
            <Typography sx={{ fontWeight: 500 }}>Total</Typography>
            <Typography sx={{ fontWeight: 600 }}>${order.totalAmount?.toFixed(2)}</Typography>
          </Box>
        </Box>

        {/* Address */}
        {order.address && (
          <Box>
            <Typography sx={{ color: "text.secondary", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", mb: 1.5 }}>
              Delivery Address
            </Typography>
            <Typography sx={{ fontWeight: 500 }}>{order.address.fullName}</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>{order.address.addressLine}</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {order.address.district}, {order.address.province} {order.address.pincode}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Actions */}
      <Box display="flex" gap={2} justifyContent="center">
        <Button variant="contained" component={Link} to="/">Continue Shopping</Button>
        <Button variant="outlined" component={Link} to="/orders">View Orders</Button>
      </Box>
    </Container>
  );
}
