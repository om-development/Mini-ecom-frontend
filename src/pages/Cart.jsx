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
import DeleteIcon from "@mui/icons-material/Delete";

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
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button component={Link} to="/">Back to Home</Button>
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>Shopping Cart</Typography>
        <Paper sx={{ p: 6, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Your cart is empty
          </Typography>
          <Button variant="contained" component={Link} to="/">
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  const total = cart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
  const tax = total * 0.1;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Shopping Cart</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {cart.items.length} {cart.items.length === 1 ? "item" : "items"} in cart
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper>
            {cart.items.map((item) => (
              <Box key={item.productId._id}>
                <Box display="flex" gap={2} p={2}>
                  <Box
                    component="img"
                    src={item.productId.image}
                    alt={item.productId.title}
                    sx={{ width: 100, height: 100, objectFit: "cover", borderRadius: 1 }}
                  />
                  <Box flex={1}>
                    <Typography fontWeight="medium">{item.productId.title}</Typography>
                    <Typography color="primary" fontWeight="bold">
                      ${item.productId.price.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Subtotal: ${(item.productId.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                  <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <IconButton size="small" onClick={() => updateQty(item.productId._id, item.quantity - 1)}>
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography fontWeight="medium">{item.quantity}</Typography>
                      <IconButton size="small" onClick={() => updateQty(item.productId._id, item.quantity + 1)}>
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <IconButton size="small" color="error" onClick={() => removeItem(item.productId._id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                <Divider />
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography>${total.toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography color="text.secondary">Tax (10%)</Typography>
              <Typography>${tax.toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography color="text.secondary">Shipping</Typography>
              <Typography color="success.main">FREE</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" sx={{ mb: 3 }}>
              <Typography variant="h6" color="primary">Total</Typography>
              <Typography variant="h6" color="primary">${(total + tax).toFixed(2)}</Typography>
            </Box>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => navigate("/checkout-address")}
            >
              Proceed to Checkout
            </Button>
            <Button fullWidth component={Link} to="/" sx={{ mt: 1 }}>
              Continue Shopping
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
