import { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

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
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/")}>Back to Home</Button>
      </Container>
    );
  }

  if (!product) return null;

  return (
    <Box>
      {/* Back button */}
      <Box sx={{ px: { xs: 3, md: 6 }, pt: { xs: 2, md: 3 } }}>
        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
          onClick={() => navigate(-1)}
          sx={{ color: "text.secondary" }}
        >
          Back
        </Button>
      </Box>

      {/* Full-bleed image */}
      <Box
        sx={{
          width: "100%",
          height: { xs: 350, sm: 450, md: 520 },
          mt: 1,
          px: { xs: 3, md: 6 },
        }}
      >
        <Box
          component="img"
          src={product.image}
          alt={product.title}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: { xs: "16px", md: "24px" },
          }}
        />
      </Box>

      {/* Content below image */}
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ maxWidth: 520 }}>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              mb: 1,
            }}
          >
            {product.category}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 500,
              letterSpacing: "-0.02em",
              fontSize: { xs: "1.5rem", md: "2rem" },
              mb: 1.5,
            }}
          >
            {product.title}
          </Typography>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "1.5rem",
              mb: 3,
            }}
          >
            ${product.price.toFixed(2)}
          </Typography>

          {product.stock < 5 && product.stock > 0 && (
            <Typography sx={{ color: "warning.main", fontSize: "0.8125rem", mb: 2 }}>
              Only {product.stock} left in stock
            </Typography>
          )}
          {product.stock === 0 && (
            <Typography sx={{ color: "error.main", fontSize: "0.8125rem", mb: 2 }}>
              Out of stock
            </Typography>
          )}

          <Typography
            sx={{
              color: "text.secondary",
              lineHeight: 1.8,
              mb: 4,
              fontSize: "0.9375rem",
            }}
          >
            {product.description}
          </Typography>

          <Button
            variant="contained"
            size="large"
            fullWidth
            disabled={product.stock === 0}
            onClick={addToCart}
            startIcon={<AddShoppingCartIcon />}
            sx={{ py: 1.5, maxWidth: 320 }}
          >
            Add to Cart
          </Button>
        </Box>
      </Container>

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
    </Box>
  );
}
