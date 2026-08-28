import { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

const statusConfig = {
  Placed: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  Processing: { color: "#5ac8fa", bg: "rgba(90,200,250,0.1)" },
  Shipped: { color: "#0071e3", bg: "rgba(0,113,227,0.1)" },
  Delivered: { color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  Cancelled: { color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
};

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const isAdmin = user?.role === "admin";
  const statuses = ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"];

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = isAdmin ? "/order/all" : "/order/user/me";
      const res = await api.get(url);
      setOrders(res.data.orders || []);
    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, [isAdmin]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/order/${orderId}/status`, { status: newStatus });
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: newStatus } : o));
      setToast({ type: "success", msg: "Status updated" });
    } catch {
      setToast({ type: "error", msg: "Failed to update status" });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography
        variant="h2"
        sx={{ fontWeight: 600, letterSpacing: "-0.03em", fontSize: { xs: "1.75rem", md: "2.25rem" }, mb: 4 }}
      >
        {isAdmin ? "All Orders" : "Orders"}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {orders.length === 0 ? (
        <Box textAlign="center" py={14}>
          <ShoppingBagOutlinedIcon sx={{ fontSize: 80, color: "text.disabled", mb: 3 }} />
          <Typography sx={{ color: "text.secondary", fontSize: "1.125rem", mb: 1 }}>
            No orders yet
          </Typography>
          <Typography variant="body2" sx={{ color: "text.disabled", mb: 3 }}>
            Your order history will appear here
          </Typography>
          <Button variant="contained" component={Link} to="/">Start Shopping</Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {orders.map((order) => {
            const status = statusConfig[order.status] || { color: "#666", bg: "rgba(255,255,255,0.05)" };
            return (
              <Box
                key={order._id}
                component={Link}
                to={`/order-success/${order._id}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2.5,
                  p: 2.5,
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backgroundColor: "#0a0a0a",
                  textDecoration: "none",
                  transition: "all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  "&:hover": {
                    borderColor: "rgba(255,255,255,0.15)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {/* Status Dot + Label */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    minWidth: 120,
                    flexShrink: 0,
                  }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: status.color,
                      boxShadow: `0 0 8px ${status.color}40`,
                      flexShrink: 0,
                    }}
                  />
                  <Box
                    sx={{
                      px: 1.25,
                      py: 0.25,
                      borderRadius: 980,
                      backgroundColor: status.bg,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: 500,
                        color: status.color,
                        textTransform: "uppercase",
                        letterSpacing: "0.03em",
                      }}
                    >
                      {order.status}
                    </Typography>
                  </Box>
                </Box>

                {/* Order Info */}
                <Box flex={1} minWidth={0}>
                  <Typography sx={{ fontWeight: 500, fontSize: "0.9375rem" }}>
                    {order.items?.length} {order.items?.length === 1 ? "item" : "items"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.25 }}>
                    {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </Typography>
                </Box>

                {/* Admin: Status Dropdown */}
                {isAdmin && (
                  <FormControl size="small" sx={{ minWidth: 140 }} onClick={(e) => e.preventDefault()}>
                    <InputLabel sx={{ fontSize: "0.8125rem" }}>Status</InputLabel>
                    <Select
                      value={order.status}
                      label="Status"
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStatusChange(order._id, e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      size="small"
                      sx={{ fontSize: "0.8125rem", borderRadius: 980 }}
                    >
                      {statuses.map((s) => (
                        <MenuItem key={s} value={s} sx={{ fontSize: "0.875rem" }}>{s}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {/* Total + View */}
                <Box display="flex" alignItems="center" gap={2} flexShrink={0}>
                  <Typography sx={{ fontWeight: 600, fontSize: "1.125rem", color: "#0071e3" }}>
                    ${order.totalAmount?.toFixed(2)}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      fontSize: "0.75rem",
                      py: 0.5,
                      px: 1.5,
                      minWidth: "auto",
                    }}
                    onClick={(e) => e.preventDefault()}
                  >
                    View
                  </Button>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast(null)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={() => setToast(null)} severity={toast?.type} sx={{ width: "100%" }}>
          {toast?.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
