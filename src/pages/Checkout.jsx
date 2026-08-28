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
        if (!user) {
          setError("Please login to checkout");
          return;
        }
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
      if (!address) {
        setError("Please add a delivery address");
        return;
      }
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
        <CircularProgress />
      </Box>
    );
  }

  if (error && !cart) {
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
        <Alert severity="warning">Your cart is empty</Alert>
        <Button component={Link} to="/" sx={{ mt: 2 }}>Continue Shopping</Button>
      </Container>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.quantity * item.productId.price, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button component={Link} to="/cart" sx={{ mb: 2 }}>&larr; Back to Cart</Button>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Checkout</Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6">Delivery Address</Typography>
              <Button size="small" onClick={() => navigate("/checkout-address")}>Change</Button>
            </Box>
            {address ? (
              <Box>
                <Typography fontWeight="medium">{address.fullName}</Typography>
                <Typography variant="body2" color="text.secondary">{address.addressLine}</Typography>
                <Typography variant="body2" color="text.secondary">{address.district}, {address.province} {address.pincode}</Typography>
                <Typography variant="body2" color="text.secondary">Phone: {address.phone}</Typography>
              </Box>
            ) : (
              <Button variant="contained" onClick={() => navigate("/checkout-address")}>
                Add Address
              </Button>
            )}
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Order Items</Typography>
            {cart.items.map((item) => (
              <Box key={item.productId._id} display="flex" gap={2} sx={{ py: 1 }}>
                <Box component="img" src={item.productId.image} alt={item.productId.title} sx={{ width: 60, height: 60, objectFit: "cover", borderRadius: 1 }} />
                <Box flex={1}>
                  <Typography variant="body2" fontWeight="medium">{item.productId.title}</Typography>
                  <Typography variant="body2" color="text.secondary">Qty: {item.quantity} x ${item.productId.price.toFixed(2)}</Typography>
                </Box>
                <Typography fontWeight="medium">${(item.quantity * item.productId.price).toFixed(2)}</Typography>
              </Box>
            ))}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Payment Method</Typography>
            <FormControl component="fieldset">
              <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <FormControlLabel value="card" control={<Radio />} label="Credit/Debit Card" />
                <FormControlLabel value="upi" control={<Radio />} label="UPI" />
                <FormControlLabel value="netbanking" control={<Radio />} label="Net Banking" />
                <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
              </RadioGroup>
            </FormControl>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, position: "sticky", top: 80 }}>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography>${subtotal.toFixed(2)}</Typography>
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
              <Typography variant="h6" color="primary">${total.toFixed(2)}</Typography>
            </Box>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handlePlaceOrder}
              disabled={loading || !address}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Processing..." : "Place Order"}
            </Button>
            <Button fullWidth component={Link} to="/cart" sx={{ mt: 1 }}>
              Continue Shopping
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
