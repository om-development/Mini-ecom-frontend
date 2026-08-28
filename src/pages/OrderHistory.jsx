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

const statusColors = {
  Placed: "#ff9f0a",
  Processing: "#5ac8fa",
  Shipped: "#0071e3",
  Delivered: "#34c759",
  Cancelled: "#ff3b30",
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
        <Box textAlign="center" py={12}>
          <ShoppingBagOutlinedIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
          <Typography sx={{ color: "text.secondary", fontSize: "1.125rem", mb: 3 }}>
            No orders yet
          </Typography>
          <Button variant="contained" component={Link} to="/">Start Shopping</Button>
        </Box>
      ) : (
        <Box>
          {orders.map((order, index) => (
            <Box key={order._id}>
              {index > 0 && (
                <Box sx={{ height: 1, backgroundColor: "rgba(255,255,255,0.06)", mx: 0 }} />
              )}
              <Box
                component={Link}
                to={`/order-success/${order._id}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  py: 2.5,
                  textDecoration: "none",
                  transition: "background-color 0.15s",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.02)" },
                  mx: -2,
                  px: 2,
                  borderRadius: "12px",
                }}
              >
                {/* Status Dot */}
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: statusColors[order.status] || "#666",
                    flexShrink: 0,
                  }}
                />

                {/* Order Info */}
                <Box flex={1} minWidth={0}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography sx={{ fontWeight: 500, fontSize: "0.9375rem" }}>
                      {order.items?.length} {order.items?.length === 1 ? "item" : "items"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      · {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.25 }}>
                    {order.paymentMethod?.toUpperCase()}
                  </Typography>
                </Box>

                {/* Right side */}
                <Box display="flex" alignItems="center" gap={2} flexShrink={0}>
                  {isAdmin ? (
                    <FormControl size="small" sx={{ minWidth: 130 }} onClick={(e) => e.preventDefault()}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={order.status}
                        label="Status"
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusChange(order._id, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        size="small"
                      >
                        {statuses.map((s) => (
                          <MenuItem key={s} value={s}>{s}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <Typography variant="body2" sx={{ color: statusColors[order.status] || "text.secondary" }}>
                      {order.status}
                    </Typography>
                  )}
                  <Typography sx={{ fontWeight: 600, fontSize: "0.9375rem" }}>
                    ${order.totalAmount?.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
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
