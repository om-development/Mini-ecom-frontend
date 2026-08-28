import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";

export default function CheckoutAddress() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "", phone: "", addressLine: "", district: "", province: "", pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previousAddresses, setPreviousAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [usedExisting, setUsedExisting] = useState(false);

  useEffect(() => {
    const loadPreviousAddresses = async () => {
      try {
        const res = await api.get("/address");
        if (Array.isArray(res.data.address)) {
          setPreviousAddresses(res.data.address);
        }
      } catch {
        console.error("Error loading addresses");
      }
    };
    if (user) loadPreviousAddresses();
  }, [user]);

  const selectAddress = async (address) => {
    try {
      await api.post("/address/set-active", { addressId: address._id });
      setForm({
        fullName: address.fullName, phone: address.phone, addressLine: address.addressLine,
        district: address.district, province: address.province, pincode: address.pincode,
      });
      setUsedExisting(true);
      setShowModal(false);
    } catch {
      console.error("Error setting address");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (form.phone.length !== 10) { setError("Phone must be 10 digits"); return; }
    if (form.pincode.length !== 6) { setError("Pincode must be 6 digits"); return; }
    try {
      setLoading(true);
      if (usedExisting) {
        navigate("/checkout");
      } else {
        await api.post("/address/add", { ...form });
        navigate("/checkout");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography
        variant="h2"
        sx={{ fontWeight: 600, letterSpacing: "-0.03em", fontSize: { xs: "1.75rem", md: "2.25rem" }, mb: 0.5 }}
      >
        Delivery Address
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 4 }}>
        Where should we deliver?
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {previousAddresses.length > 0 && (
        <Button variant="outlined" onClick={() => setShowModal(true)} sx={{ mb: 3 }}>
          Use a previous address
        </Button>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: "16px",
          backgroundColor: "rgba(255,255,255,0.02)",
          border: "0.5px solid rgba(255,255,255,0.06)",
        }}
      >
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} required />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Phone" name="phone" value={form.phone} onChange={handleChange} required inputProps={{ maxLength: 10 }} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField fullWidth label="Address Line" name="addressLine" value={form.addressLine} onChange={handleChange} required />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth label="District" name="district" value={form.district} onChange={handleChange} required />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth label="Province" name="province" value={form.province} onChange={handleChange} required />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} required inputProps={{ maxLength: 6 }} />
          </Grid>
        </Grid>
        <Button
          fullWidth
          variant="contained"
          type="submit"
          size="large"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
          sx={{ mt: 4 }}
        >
          {loading ? "Saving..." : usedExisting ? "Continue" : "Save & Continue"}
        </Button>
      </Box>

      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Select a Previous Address</DialogTitle>
        <DialogContent>
          <RadioGroup value={selectedAddressId} onChange={(e) => setSelectedAddressId(e.target.value)}>
            {previousAddresses.map((addr) => (
              <Box
                key={addr._id}
                onClick={() => setSelectedAddressId(addr._id)}
                sx={{
                  p: 2,
                  mb: 1,
                  borderRadius: "12px",
                  cursor: "pointer",
                  border: selectedAddressId === addr._id ? "1px solid rgba(0,113,227,0.4)" : "0.5px solid rgba(255,255,255,0.06)",
                  backgroundColor: selectedAddressId === addr._id ? "rgba(0,113,227,0.06)" : "transparent",
                  transition: "all 0.15s",
                }}
              >
                <FormControlLabel
                  value={addr._id}
                  control={<Radio size="small" />}
                  label={
                    <Box>
                      <Typography sx={{ fontWeight: 500, fontSize: "0.875rem" }}>{addr.fullName}</Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>{addr.addressLine}</Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>{addr.district}, {addr.province} {addr.pincode}</Typography>
                    </Box>
                  }
                />
              </Box>
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)} sx={{ color: "text.secondary" }}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!selectedAddressId}
            onClick={() => {
              const addr = previousAddresses.find((a) => a._id === selectedAddressId);
              if (addr) selectAddress(addr);
            }}
          >
            Use Address
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
