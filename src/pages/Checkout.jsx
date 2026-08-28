import { useState, useEffect } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
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
      <Typography
        variant="h2"
        sx={{ fontWeight: 600, letterSpacing: "-0.03em", fontSize: { xs: "1.75rem", md: "2.25rem" }, mb: 4 }}
      >
        Checkout
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 380px" }, gap: 3, alignItems: "start" }}>
        <Box>
          {/* Address Section */}
          <Box sx={{ mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography sx={{ color: "text.secondary", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Delivery Address
              </Typography>
              <Button size="small" onClick={() => navigate("/checkout-address")} sx={{ color: "#0071e3", fontSize: "0.8125rem" }}>
                {address ? "Change" : "Add"}
              </Button>
            </Box>
            {address ? (
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: "12px",
                  backgroundColor: "rgba(255,255,255,0.02)",
                  border: "0.5px solid rgba(255,255,255,0.06)",
                }}
              >
                <Typography sx={{ fontWeight: 500, mb: 0.25 }}>{address.fullName}</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>{address.addressLine}</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {address.district}, {address.province} {address.pincode}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>Phone: {address.phone}</Typography>
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>No address saved yet</Typography>
            )}
          </Box>

          {/* Items Section */}
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ color: "text.secondary", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", mb: 2 }}>
              Items
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {cart.items.map((item) => (
                <Box
                  key={item.productId._id}
                  sx={{
                    display: "flex",
                    gap: 2,
                    p: 2,
                    borderRadius: "12px",
                    backgroundColor: "rgba(255,255,255,0.02)",
                    border: "0.5px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <Box
                    component="img"
                    src={item.productId.image}
                    alt={item.productId.title}
                    sx={{ width: 56, height: 56, objectFit: "cover", borderRadius: "10px", flexShrink: 0 }}
                  />
                  <Box flex={1} display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography sx={{ fontWeight: 500, fontSize: "0.875rem" }}>{item.productId.title}</Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {item.quantity} x ${item.productId.price.toFixed(2)}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 500, fontSize: "0.875rem" }}>
                      ${(item.quantity * item.productId.price).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Payment Section */}
          <Box>
            <Typography sx={{ color: "text.secondary", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", mb: 2 }}>
              Payment Method
            </Typography>
            <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                {[
                  { value: "card", label: "Credit / Debit Card" },
                  { value: "upi", label: "UPI" },
                  { value: "netbanking", label: "Net Banking" },
                  { value: "cod", label: "Cash on Delivery" },
                ].map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio size="small" />}
                    label={option.label}
                    sx={{
                      m: 0,
                      py: 1,
                      px: 2,
                      borderRadius: "10px",
                      border: paymentMethod === option.value ? "1px solid rgba(0,113,227,0.4)" : "0.5px solid rgba(255,255,255,0.06)",
                      backgroundColor: paymentMethod === option.value ? "rgba(0,113,227,0.06)" : "transparent",
                      transition: "all 0.15s",
                    }}
                  />
                ))}
              </Box>
            </RadioGroup>
          </Box>
        </Box>

        {/* Summary */}
        <Box
          sx={{
            p: 3,
            borderRadius: "16px",
            backgroundColor: "rgba(255,255,255,0.02)",
            border: "0.5px solid rgba(255,255,255,0.06)",
            position: "sticky",
            top: 72,
          }}
        >
          <Typography sx={{ fontWeight: 500, fontSize: "1.0625rem", mb: 2.5 }}>Summary</Typography>
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
          <Box sx={{ my: 2, height: 1, backgroundColor: "rgba(255,255,255,0.06)" }} />
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
        </Box>
      </Box>
    </Container>
  );
}
