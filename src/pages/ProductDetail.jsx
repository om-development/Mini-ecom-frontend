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
import Chip from "@mui/material/Chip";
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
      setError("Failed to load product details");
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
      setToast({ open: true, message: "Product added to cart!", severity: "success" });
    } catch {
      setToast({ open: true, message: "Failed to add product to cart", severity: "error" });
    }
  };

  useEffect(() => { loadProduct(); }, [id]);

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
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Container>
    );
  }

  if (!product) return null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Paper sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src={product.image}
              alt={product.title}
              sx={{
                width: "100%",
                height: 400,
                objectFit: "cover",
                borderRadius: 1,
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {product.title}
            </Typography>
            <Chip label={product.category} size="small" sx={{ mb: 2 }} />
            <Typography variant="h4" color="primary" gutterBottom>
              ${product.price.toFixed(2)}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Stock: {product.stock}
            </Typography>
            {product.stock < 5 && product.stock > 0 && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Only {product.stock} left in stock!
              </Alert>
            )}
            {product.stock === 0 && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Out of stock
              </Alert>
            )}
            <Typography variant="body1" sx={{ mb: 3, whiteSpace: "pre-line" }}>
              {product.description}
            </Typography>
            <Button
              variant="contained"
              size="large"
              fullWidth
              disabled={product.stock === 0}
              onClick={addToCart}
            >
              Add to Cart
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
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
