import { useState, useEffect } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!user) { setError("Please login to checkout"); return; }
        const [cartRes, addressRes] = await Promise.all([
          api.get("/cart"),
          api.get("/address"),
        ]);
        setCart(cartRes.data.cart);
        if (Array.isArray(addressRes.data.address)) {
          const activeAddr = addressRes.data.address.find((a) => a.active);
          setAddress(activeAddr || addressRes.data.address[0]);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load checkout data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!address) { setError("Please add a delivery address"); return; }
      const res = await api.post("/order/place", { address, paymentMethod });
      if (res.data?.orderId) {
        window.dispatchEvent(new Event("cartUpdated"));
        navigate(`/order-success/${res.data.orderId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !cart) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error && !cart) {
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
        <Alert severity="info">Your cart is empty</Alert>
        <Button component={Link} to="/" sx={{ mt: 2 }}>Continue Shopping</Button>
      </Container>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.quantity * item.productId.price, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Button
        component={Link}
        to="/cart"
        sx={{ mb: 3, color: "text.secondary" }}
        size="small"
      >
        &larr; Back to Cart
      </Button>
      <Typography variant="h3" sx={{ mb: 4 }}>Checkout</Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: { xs: 3, md: 4 }, mb: 2.5 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6">Delivery Address</Typography>
              <Button size="small" onClick={() => navigate("/checkout-address")} sx={{ color: "#0071e3" }}>
                {address ? "Change" : "Add"}
              </Button>
            </Box>
            {address ? (
              <Box>
                <Typography sx={{ fontWeight: 500, mb: 0.25 }}>{address.fullName}</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>{address.addressLine}</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>{address.district}, {address.province} {address.pincode}</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>Phone: {address.phone}</Typography>
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                No address saved yet
              </Typography>
            )}
          </Paper>

          <Paper sx={{ p: { xs: 3, md: 4 }, mb: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Items</Typography>
            {cart.items.map((item) => (
              <Box key={item.productId._id} display="flex" gap={2} sx={{ py: 1.5 }}>
                <Box
                  component="img"
                  src={item.productId.image}
                  alt={item.productId.title}
                  sx={{ width: 52, height: 52, objectFit: "cover", borderRadius: 1.5, flexShrink: 0 }}
                />
                <Box flex={1}>
                  <Typography sx={{ fontWeight: 500, fontSize: "0.875rem" }}>{item.productId.title}</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {item.quantity} x ${item.productId.price.toFixed(2)}
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 500, fontSize: "0.875rem" }}>
                  ${(item.quantity * item.productId.price).toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Paper>

          <Paper sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Payment</Typography>
            <FormControl component="fieldset">
              <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <FormControlLabel value="card" control={<Radio size="small" />} label="Credit / Debit Card" />
                <FormControlLabel value="upi" control={<Radio size="small" />} label="UPI" />
                <FormControlLabel value="netbanking" control={<Radio size="small" />} label="Net Banking" />
                <FormControlLabel value="cod" control={<Radio size="small" />} label="Cash on Delivery" />
              </RadioGroup>
            </FormControl>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: { xs: 3, md: 4 }, position: "sticky", top: 72 }}>
            <Typography variant="h6" sx={{ mb: 2.5 }}>Summary</Typography>
            <Box display="flex" justifyContent="space-between" sx={{ mb: 1.5 }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>Subtotal</Typography>
              <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
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
              <Typography sx={{ fontWeight: 600, fontSize: "1.125rem" }}>${total.toFixed(2)}</Typography>
            </Box>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handlePlaceOrder}
              disabled={loading || !address}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {loading ? "Placing order..." : "Place Order"}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
