import { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/products/${id}`);
      setProduct(res.data.product);
    } catch {
      setError("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!user) {
      setToast({ open: true, message: "Please login to add items to cart", severity: "warning" });
      return;
    }
    try {
      await api.post("/cart/add", { productId: id });
      window.dispatchEvent(new Event("cartUpdated"));
      setToast({ open: true, message: "Added to cart", severity: "success" });
    } catch {
      setToast({ open: true, message: "Failed to add to cart", severity: "error" });
    }
  };

  useEffect(() => { loadProduct(); }, [id]);

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
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Container>
    );
  }

  if (!product) return null;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Button
        startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
        onClick={() => navigate(-1)}
        sx={{ mb: 4, color: "text.secondary" }}
      >
        Back
      </Button>

      <Paper sx={{ overflow: "hidden" }}>
        <Grid container>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src={product.image}
              alt={product.title}
              sx={{
                width: "100%",
                height: { xs: 300, md: 420 },
                objectFit: "cover",
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ p: { xs: 3, md: 5 } }}>
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 1, textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.75rem" }}>
                {product.category}
              </Typography>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 500 }}>
                {product.title}
              </Typography>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>
                ${product.price.toFixed(2)}
              </Typography>

              {product.stock < 5 && product.stock > 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>Only {product.stock} left in stock</Alert>
              )}
              {product.stock === 0 && (
                <Alert severity="error" sx={{ mb: 2 }}>Out of stock</Alert>
              )}

              <Typography variant="body1" sx={{ color: "text.secondary", mb: 4, lineHeight: 1.7 }}>
                {product.description}
              </Typography>

              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={product.stock === 0}
                onClick={addToCart}
                sx={{ py: 1.5 }}
              >
                Add to Cart
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
