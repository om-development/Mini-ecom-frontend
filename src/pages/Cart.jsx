import { useState, useEffect } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
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
    if (!user) {
      setError("Please login to view cart");
      return;
    }
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
    if (quantity === 0) {
      await removeItem(productId);
      return;
    }
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
        <Typography variant="h3" sx={{ mb: 4 }}>Cart</Typography>
        <Paper sx={{ p: { xs: 4, md: 8 }, textAlign: "center" }}>
          <ShoppingBagOutlinedIcon sx={{ fontSize: 56, color: "text.disabled", mb: 2 }} />
          <Typography variant="h5" sx={{ color: "text.secondary", mb: 3, fontWeight: 400 }}>
            Your cart is empty
          </Typography>
          <Button variant="contained" component={Link} to="/">
            Start Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  const total = cart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
  const tax = total * 0.1;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography variant="h3" sx={{ mb: 1 }}>Cart</Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 4 }}>
        {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ overflow: "hidden" }}>
            {cart.items.map((item, index) => (
              <Box key={item.productId._id}>
                {index > 0 && <Divider />}
                <Box display="flex" gap={2.5} p={2.5}>
                  <Box
                    component="img"
                    src={item.productId.image}
                    alt={item.productId.title}
                    sx={{
                      width: 90,
                      height: 90,
                      objectFit: "cover",
                      borderRadius: 2,
                      flexShrink: 0,
                    }}
                  />
                  <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between">
                    <Box>
                      <Typography sx={{ fontWeight: 500, fontSize: "0.9375rem" }}>
                        {item.productId.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.25 }}>
                        ${item.productId.price.toFixed(2)} each
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <IconButton
                          size="small"
                          onClick={() => updateQty(item.productId._id, item.quantity - 1)}
                          sx={{
                            border: "0.5px solid rgba(255,255,255,0.1)",
                            borderRadius: 2,
                            width: 32,
                            height: 32,
                          }}
                        >
                          <RemoveIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <Typography sx={{ fontWeight: 500, minWidth: 36, textAlign: "center", fontSize: "0.875rem" }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => updateQty(item.productId._id, item.quantity + 1)}
                          sx={{
                            border: "0.5px solid rgba(255,255,255,0.1)",
                            borderRadius: 2,
                            width: 32,
                            height: 32,
                          }}
                        >
                          <AddIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Typography sx={{ fontWeight: 500 }}>
                          ${(item.productId.price * item.quantity).toFixed(2)}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => removeItem(item.productId._id)}
                          sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
                        >
                          <DeleteOutlinedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2.5 }}>Summary</Typography>
            <Box display="flex" justifyContent="space-between" sx={{ mb: 1.5 }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>Subtotal</Typography>
              <Typography variant="body2">${total.toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" sx={{ mb: 1.5 }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>Tax (10%)</Typography>
              <Typography variant="body2">${tax.toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" sx={{ mb: 1.5 }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>Shipping</Typography>
              <Typography variant="body2" sx={{ color: "success.main" }}>Free</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 500 }}>Total</Typography>
              <Typography sx={{ fontWeight: 600, fontSize: "1.125rem" }}>
                ${(total + tax).toFixed(2)}
              </Typography>
            </Box>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => navigate("/checkout-address")}
            >
              Continue
            </Button>
            <Button
              fullWidth
              component={Link}
              to="/"
              sx={{ mt: 1, color: "text.secondary" }}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
