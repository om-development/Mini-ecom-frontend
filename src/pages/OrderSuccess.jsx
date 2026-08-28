import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

const statusConfig = {
  Placed: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  Processing: { color: "#5ac8fa", bg: "rgba(90,200,250,0.1)" },
  Shipped: { color: "#0071e3", bg: "rgba(0,113,227,0.1)" },
  Delivered: { color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  Cancelled: { color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
};

const statuses = ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function OrderSuccess() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/order/${orderId}`);
      setOrder(res.data.order);
    } catch {
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrder(); }, [orderId]);

  const handleStatusChange = async (newStatus) => {
    try {
      await api.patch(`/order/${orderId}/status`, { status: newStatus });
      setOrder((prev) => ({ ...prev, status: newStatus }));
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

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} component={Link} to={isAdmin ? "/orders" : "/"}>Back</Button>
      </Container>
    );
  }

  if (!order) return null;

  const status = statusConfig[order.status] || { color: "#666", bg: "rgba(255,255,255,0.05)" };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      {isAdmin && (
        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
          component={Link}
          to="/orders"
          sx={{ mb: 3, color: "#6e6e73" }}
        >
          Back to Orders
        </Button>
      )}

      {/* Header */}
      <Box
        textAlign="center"
        sx={{
          mb: isAdmin ? 4 : 8,
          animation: "fadeInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        {isAdmin ? (
          <>
            <Typography
              variant="h2"
              sx={{ fontWeight: 600, letterSpacing: "-0.03em", fontSize: { xs: "1.5rem", md: "2rem" }, mb: 0.5 }}
            >
              Order Details
            </Typography>
            <Typography sx={{ color: "#6e6e73" }}>
              #{order._id?.slice(-8).toUpperCase()}
            </Typography>
          </>
        ) : (
          <>
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
              sx={{ fontWeight: 600, letterSpacing: "-0.03em", fontSize: { xs: "1.75rem", md: "2.5rem" }, mb: 1 }}
            >
              Order Confirmed
            </Typography>
            <Typography sx={{ color: "#6e6e73" }}>
              #{order._id?.slice(-8).toUpperCase()}
            </Typography>
          </>
        )}
      </Box>

      {/* Order Details */}
      <Box sx={{ mb: 6 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: isAdmin ? "repeat(4, 1fr)" : "repeat(3, 1fr)",
            gap: 3,
            mb: 4,
            p: 3,
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.08)",
            backgroundColor: "#0a0a0a",
          }}
        >
          <Box>
            <Typography sx={{ color: "#6e6e73", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.5 }}>Status</Typography>
            {isAdmin ? (
              <FormControl size="small" fullWidth sx={{ mt: 0.5 }}>
                <Select
                  value={order.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  sx={{
                    borderRadius: 980,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.2)" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" },
                  }}
                >
                  {statuses.map((s) => (
                    <MenuItem key={s} value={s} sx={{ fontSize: "0.875rem" }}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: status.color, boxShadow: `0 0 8px ${status.color}40` }} />
                <Box sx={{ px: 1.25, py: 0.25, borderRadius: 980, backgroundColor: status.bg }}>
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 500, color: status.color, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                    {order.status}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
          <Box>
            <Typography sx={{ color: "#6e6e73", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.5 }}>Payment</Typography>
            <Typography sx={{ fontWeight: 500 }}>{order.paymentMethod?.toUpperCase()}</Typography>
          </Box>
          <Box>
            <Typography sx={{ color: "#6e6e73", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.5 }}>Date</Typography>
            <Typography sx={{ fontWeight: 500 }}>{new Date(order.createdAt).toLocaleDateString()}</Typography>
          </Box>
          <Box>
            <Typography sx={{ color: "#6e6e73", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.5 }}>Total</Typography>
            <Typography sx={{ fontWeight: 600, color: "#0071e3" }}>Rs {order.totalAmount?.toFixed(2)}</Typography>
          </Box>
        </Box>

        {/* Items */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ color: "#6e6e73", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", mb: 2, fontWeight: 500 }}>
            Items
          </Typography>
          <Box sx={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", overflow: "hidden" }}>
            {order.items?.map((item, i) => (
              <Box key={i}>
                {i > 0 && <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />}
                <Box display="flex" alignItems="center" gap={2} sx={{ px: 2.5, py: 1.75 }}>
                  {/* Product Image */}
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "10px",
                      overflow: "hidden",
                      flexShrink: 0,
                      backgroundColor: "#0a0a0a",
                      border: "1px solid rgba(255,255,255,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.image ? (
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.title}
                        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <Inventory2OutlinedIcon sx={{ fontSize: 24, color: "rgba(255,255,255,0.08)" }} />
                    )}
                  </Box>

                  {/* Title + Quantity */}
                  <Box flex={1} minWidth={0}>
                    <Typography sx={{ fontWeight: 500, fontSize: "0.9375rem", lineHeight: 1.3 }}>
                      {item.title || "Product"}
                    </Typography>
                    <Typography sx={{ color: "#6e6e73", fontSize: "0.8125rem", mt: 0.25 }}>
                      Qty: {item.quantity}
                    </Typography>
                  </Box>

                  {/* Price */}
                  <Typography sx={{ fontWeight: 500, fontSize: "0.9375rem", flexShrink: 0 }}>
                    Rs {(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            ))}
            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ px: 2.5, py: 1.75 }}>
              <Typography sx={{ fontWeight: 500 }}>Total</Typography>
              <Typography sx={{ fontWeight: 600, fontSize: "1.125rem", color: "#0071e3" }}>Rs {order.totalAmount?.toFixed(2)}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Address */}
        {order.address && (
          <Box>
            <Typography sx={{ color: "#6e6e73", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", mb: 1.5, fontWeight: 500 }}>
              Delivery Address
            </Typography>
            <Box sx={{ p: 2.5, borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "#0a0a0a", borderLeft: "3px solid #0071e3" }}>
              <Typography sx={{ fontWeight: 500 }}>{order.address.fullName}</Typography>
              <Typography sx={{ color: "#6e6e73", fontSize: "0.875rem" }}>{order.address.addressLine}</Typography>
              <Typography sx={{ color: "#6e6e73", fontSize: "0.875rem" }}>
                {order.address.district}, {order.address.province} {order.address.pincode}
              </Typography>
              {order.address.phone && (
                <Typography sx={{ color: "#6e6e73", fontSize: "0.875rem" }}>Phone: {order.address.phone}</Typography>
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* Actions */}
      <Box display="flex" gap={2} justifyContent="center" sx={{ animation: "fadeInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s both" }}>
        {isAdmin ? (
          <>
            <Button variant="contained" component={Link} to="/orders">Back to Orders</Button>
            <Button variant="outlined" component={Link} to="/admin/product/list">Manage Products</Button>
          </>
        ) : (
          <>
            <Button variant="contained" component={Link} to="/">Continue Shopping</Button>
            <Button variant="outlined" component={Link} to="/orders">View Orders</Button>
          </>
        )}
      </Box>

      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast(null)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={() => setToast(null)} severity={toast?.type} sx={{ width: "100%" }}>
          {toast?.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
