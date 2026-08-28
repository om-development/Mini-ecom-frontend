import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    title: "", description: "", price: "", category: "", image: "", stock: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      const p = res.data.product;
      setForm({
        title: p.title || "",
        description: p.description || "",
        price: p.price || "",
        category: p.category || "",
        image: p.image || "",
        stock: p.stock || "",
      });
    } catch {
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProduct(); }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.put(`/products/update/${id}`, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      navigate("/admin/product/list");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product");
    } finally {
      setSubmitting(false);
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
      <Typography variant="h2" sx={{ fontWeight: 600, letterSpacing: "-0.03em", fontSize: { xs: "1.5rem", md: "2rem" }, mb: 0.5 }}>
        Edit Product
      </Typography>
      <Typography sx={{ color: "#6e6e73", mb: 4 }}>
        Update product details
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
              <TextField fullWidth label="Category" name="category" value={form.category} onChange={handleChange} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Image URL" name="image" value={form.image} onChange={handleChange} required />
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
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EditProduct;
