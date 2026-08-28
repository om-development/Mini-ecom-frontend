import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", price: "", category: "", image: "", stock: "",
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post("/products/add", {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      navigate("/admin/product/list");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography variant="h2" sx={{ fontWeight: 600, letterSpacing: "-0.03em", fontSize: { xs: "1.5rem", md: "2rem" }, mb: 0.5 }}>
        Add Product
      </Typography>
      <Typography sx={{ color: "#6e6e73", mb: 4 }}>
        Add a new item to your store
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.08)",
          backgroundColor: "#0a0a0a",
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Product Title" name="title" value={form.title} onChange={handleChange} required />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth multiline rows={4} label="Description" name="description" value={form.description} onChange={handleChange} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth type="number" label="Price" name="price" value={form.price} onChange={handleChange} required inputProps={{ min: 0, step: 0.01 }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth type="number" label="Stock" name="stock" value={form.stock} onChange={handleChange} required inputProps={{ min: 0 }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Category" name="category" value={form.category} onChange={handleChange} required placeholder="e.g. Electronics" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Image URL" name="image" value={form.image} onChange={handleChange} required placeholder="https://..." />
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            type="submit"
            size="large"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
            sx={{ mt: 4, py: 1.5 }}
          >
            {submitting ? "Adding..." : "Add Product"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
