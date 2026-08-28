import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import api from "../api/axios";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const statusColors = {
  Placed: "#f59e0b",
  Processing: "#5ac8fa",
  Shipped: "#0071e3",
  Delivered: "#10b981",
  Cancelled: "#ef4444",
};

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
      <Box textAlign="center" sx={{ mb: 8, animation: "fadeInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}>
        <CheckCircleIcon
          sx={{
            fontSize: 80,
            color: "#10b981",
            mb: 3,
            filter: "drop-shadow(0 0 24px rgba(16, 185, 129, 0.3))",
            animation: "scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
        <Typography
          variant="h1"
          sx={{
            fontWeight: 600,
            letterSpacing: "-0.03em",
            fontSize: { xs: "1.75rem", md: "2.5rem" },
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
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 3,
            mb: 4,
            p: 3,
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.08)",
            backgroundColor: "#0a0a0a",
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: statusColors[order.status] || "#666",
                  flexShrink: 0,
                }}
              />
              <Typography sx={{ fontWeight: 500 }}>{order.status}</Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Payment</Typography>
            <Typography sx={{ fontWeight: 500 }}>{order.paymentMethod?.toUpperCase()}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Date</Typography>
            <Typography sx={{ fontWeight: 500 }}>{new Date(order.createdAt).toLocaleDateString()}</Typography>
          </Box>
        </Box>

        {/* Items */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ color: "text.secondary", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", mb: 2, fontWeight: 500 }}>
            Items
          </Typography>
          <Box
            sx={{
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {order.items?.map((item, i) => (
              <Box key={i}>
                {i > 0 && <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />}
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ px: 2.5, py: 1.75 }}>
                  <Typography sx={{ color: "text.secondary" }}>
                    {item.title || "Product"} x {item.quantity}
                  </Typography>
                  <Typography sx={{ fontWeight: 500 }}>${(item.price * item.quantity).toFixed(2)}</Typography>
                </Box>
              </Box>
            ))}
            <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ px: 2.5, py: 1.75 }}>
              <Typography sx={{ fontWeight: 500 }}>Total</Typography>
              <Typography sx={{ fontWeight: 600, fontSize: "1.125rem", color: "#0071e3" }}>${order.totalAmount?.toFixed(2)}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Address */}
        {order.address && (
          <Box>
            <Typography sx={{ color: "text.secondary", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", mb: 1.5, fontWeight: 500 }}>
              Delivery Address
            </Typography>
            <Box
              sx={{
                p: 2.5,
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.08)",
                backgroundColor: "#0a0a0a",
                borderLeft: "3px solid #0071e3",
              }}
            >
              <Typography sx={{ fontWeight: 500 }}>{order.address.fullName}</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>{order.address.addressLine}</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {order.address.district}, {order.address.province} {order.address.pincode}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Actions */}
      <Box display="flex" gap={2} justifyContent="center" sx={{ animation: "fadeInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s both" }}>
        <Button
          variant="contained"
          component={Link}
          to="/"
          sx={{
            boxShadow: "0 4px 16px rgba(0,113,227,0.25)",
            "&:hover": {
              boxShadow: "0 8px 24px rgba(0,113,227,0.35)",
            },
          }}
        >
          Continue Shopping
        </Button>
        <Button variant="outlined" component={Link} to="/orders">View Orders</Button>
      </Box>
    </Container>
  );
}
