import { useState, useEffect } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCart = async () => {
    if (!user) { setError("Please login to view cart"); return; }
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/cart");
      setCart(res.data.cart);
    } catch {
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCart(); }, [user]);

  const removeItem = async (productId) => {
    try {
      await api.post("/cart/remove", { productId });
      loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch {
      alert("Failed to remove item");
    }
  };

  const updateQty = async (productId, quantity) => {
    if (quantity === 0) { await removeItem(productId); return; }
    try {
      await api.post("/cart/update", { productId, quantity });
      loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch {
      alert("Failed to update quantity");
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
        <Button component={Link} to="/">Back to Home</Button>
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Box textAlign="center" py={14}>
          <ShoppingBagOutlinedIcon sx={{ fontSize: 80, color: "#48484a", mb: 3 }} />
          <Typography sx={{ color: "#6e6e73", fontSize: "1.125rem", mb: 1 }}>
            Your cart is empty
          </Typography>
          <Typography variant="body2" sx={{ color: "#48484a", mb: 3 }}>
            Add some items to get started
          </Typography>
          <Button variant="contained" component={Link} to="/">
            Start Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  const total = cart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
  const tax = total * 0.1;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography
        variant="h2"
        sx={{ fontWeight: 600, letterSpacing: "-0.03em", fontSize: { xs: "1.75rem", md: "2rem" }, mb: 0.5 }}
      >
        Cart
      </Typography>
      <Typography sx={{ color: "#6e6e73", mb: 4 }}>
        {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 380px" }, gap: 3, alignItems: "start" }}>
        {/* Items */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {cart.items.map((item) => (
            <Box
              key={item.productId._id}
              sx={{
                display: "flex",
                gap: 2,
                p: 2,
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.08)",
                backgroundColor: "#0a0a0a",
                transition: "all 150ms ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                  borderColor: "rgba(255,255,255,0.16)",
                },
              }}
            >
              <Box
                component="img"
                src={item.productId.image}
                alt={item.productId.title}
                sx={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: "12px",
                  flexShrink: 0,
                }}
              />
              <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between" minWidth={0}>
                <Box>
                  <Typography sx={{ fontWeight: 500, fontSize: "1rem" }} noWrap>
                    {item.productId.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6e6e73", mt: 0.25 }}>
                    Rs {item.productId.price.toFixed(2)} each
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  {/* Pill Stepper */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: 980,
                      overflow: "hidden",
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => updateQty(item.productId._id, item.quantity - 1)}
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 0,
                        color: "#6e6e73",
                        transition: "all 150ms ease",
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.06)", color: "#ededed" },
                        "&:active": { transform: "scale(0.92)" },
                      }}
                    >
                      <RemoveIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        minWidth: 32,
                        textAlign: "center",
                        userSelect: "none",
                      }}
                    >
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => updateQty(item.productId._id, item.quantity + 1)}
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 0,
                        color: "#6e6e73",
                        transition: "all 150ms ease",
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.06)", color: "#ededed" },
                        "&:active": { transform: "scale(0.92)" },
                      }}
                    >
                      <AddIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>

                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography sx={{ fontWeight: 600, fontSize: "1rem" }}>
                      Rs {(item.productId.price * item.quantity).toFixed(2)}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => removeItem(item.productId._id)}
                      sx={{
                        color: "#48484a",
                        transition: "all 150ms ease",
                        "&:hover": {
                          color: "#ef4444",
                          backgroundColor: "rgba(239,68,68,0.1)",
                        },
                        "&:active": { transform: "scale(0.92)" },
                      }}
                    >
                      <DeleteOutlinedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Summary */}
        <Box
          sx={{
            p: 3,
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.08)",
            backgroundColor: "#0a0a0a",
            position: "sticky",
            top: 100,
          }}
        >
          <Typography sx={{ fontWeight: 500, fontSize: "1.5rem", mb: 2.5 }}>Summary</Typography>
          <Box display="flex" justifyContent="space-between" sx={{ mb: 1.5 }}>
            <Typography sx={{ color: "#6e6e73", fontSize: "0.875rem" }}>Subtotal</Typography>
            <Typography sx={{ fontSize: "0.875rem" }}>Rs {total.toFixed(2)}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" sx={{ mb: 1.5 }}>
            <Typography sx={{ color: "#6e6e73", fontSize: "0.875rem" }}>Tax (10%)</Typography>
            <Typography sx={{ fontSize: "0.875rem" }}>Rs {tax.toFixed(2)}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" sx={{ mb: 1.5 }}>
            <Typography sx={{ color: "#6e6e73", fontSize: "0.875rem" }}>Shipping</Typography>
            <Typography sx={{ color: "#10b981", fontWeight: 500, fontSize: "0.875rem" }}>Free</Typography>
          </Box>
          <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.08)" }} />
          <Box display="flex" justifyContent="space-between" sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 500, fontSize: "1.5rem" }}>Total</Typography>
            <Typography sx={{ fontWeight: 600, fontSize: "1.5rem" }}>
              Rs {(total + tax).toFixed(2)}
            </Typography>
          </Box>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => navigate("/checkout-address")}
            sx={{ py: 1.5 }}
          >
            Continue
          </Button>
          <Button
            fullWidth
            component={Link}
            to="/"
            sx={{ mt: 1, color: "#6e6e73" }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
