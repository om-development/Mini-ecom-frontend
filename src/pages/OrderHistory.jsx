import { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import Snackbar from "@mui/material/Snackbar";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

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
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>My Orders</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {orders.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: "center" }}>
          <ShoppingBagIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No orders yet
          </Typography>
          <Button variant="contained" component={Link} to="/">
            Start Shopping
          </Button>
        </Paper>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {orders.map((order) => (
            <Card key={order._id} component={Link} to={`/order-success/${order._id}`} sx={{ textDecoration: "none" }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography fontWeight="medium" sx={{ mt: 0.5 }}>
                      {order.items?.length} {order.items?.length === 1 ? "item" : "items"}
                    </Typography>
                  </Box>
                  {isAdmin ? (
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={order.status}
                        label="Status"
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        {statuses.map((s) => (
                          <MenuItem key={s} value={s}>{s}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <Chip
                      label={order.status}
                      color={order.status === "Delivered" ? "success" : order.status === "Shipped" ? "info" : "warning"}
                      size="small"
                    />
                  )}
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {order.paymentMethod?.toUpperCase()}
                  </Typography>
                  <Typography fontWeight="bold" color="primary">
                    ${order.totalAmount?.toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Snackbar open={!!toast} autoHideDuration={3000} onClose={() => setToast(null)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={() => setToast(null)} severity={toast?.type} sx={{ width: "100%" }}>
          {toast?.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
