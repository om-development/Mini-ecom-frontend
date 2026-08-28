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
import Snackbar from "@mui/material/Snackbar";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

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
      <Typography variant="h3" sx={{ mb: 4 }}>
        {isAdmin ? "All Orders" : "Orders"}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {orders.length === 0 ? (
        <Paper sx={{ p: { xs: 4, md: 8 }, textAlign: "center" }}>
          <ShoppingBagOutlinedIcon sx={{ fontSize: 56, color: "text.disabled", mb: 2 }} />
          <Typography variant="h5" sx={{ color: "text.secondary", mb: 3, fontWeight: 400 }}>
            No orders yet
          </Typography>
          <Button variant="contained" component={Link} to="/">
            Start Shopping
          </Button>
        </Paper>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {orders.map((order) => (
            <Card
              key={order._id}
              component={Link}
              to={`/order-success/${order._id}`}
              sx={{ textDecoration: "none", "&:hover": { opacity: 0.85 } }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 }, "&:last-child": { pb: { xs: 2.5, md: 3 } } }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.25 }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography sx={{ fontWeight: 500 }}>
                      {order.items?.length} {order.items?.length === 1 ? "item" : "items"}
                    </Typography>
                  </Box>
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
                    <Chip
                      label={order.status}
                      size="small"
                      color={
                        order.status === "Delivered" ? "success" :
                        order.status === "Shipped" ? "info" :
                        order.status === "Cancelled" ? "error" : "warning"
                      }
                    />
                  )}
                </Box>
                <Divider sx={{ my: 1.5 }} />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {order.paymentMethod?.toUpperCase()}
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    ${order.totalAmount?.toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
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
