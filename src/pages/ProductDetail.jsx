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
import Divider from "@mui/material/Divider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [imgError, setImgError] = useState(false);

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

  const stockStatus =
    product.stock === 0
      ? { color: "#ef4444", text: "Out of stock" }
      : product.stock < 5
        ? { color: "#f59e0b", text: `Only ${product.stock} left in stock` }
        : null;

  return (
    <Box>
      {/* Back button */}
      <Box sx={{ px: { xs: 3, md: 6 }, pt: { xs: 2, md: 3 } }}>
        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
          onClick={() => navigate(-1)}
          sx={{
            color: "text.secondary",
            "&:hover": { color: "text.primary", backgroundColor: "rgba(255,255,255,0.05)" },
          }}
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
        {imgError ? (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: { xs: "16px", md: "24px" },
              background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Inventory2OutlinedIcon sx={{ fontSize: 64, color: "rgba(255,255,255,0.08)" }} />
          </Box>
        ) : (
          <Box
            component="img"
            src={product.image}
            alt={product.title}
            onError={() => setImgError(true)}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: { xs: "16px", md: "24px" },
              boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
            }}
          />
        )}
      </Box>

      {/* Content below image */}
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ maxWidth: 560 }}>
          {/* Category pill */}
          <Box
            sx={{
              display: "inline-block",
              backgroundColor: "rgba(255,255,255,0.06)",
              borderRadius: 980,
              px: 1.5,
              py: 0.5,
              mb: 2,
            }}
          >
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: "0.7rem",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {product.category}
            </Typography>
          </Box>

          {/* Title */}
          <Typography
            variant="h2"
            sx={{
              fontWeight: 600,
              letterSpacing: "-0.03em",
              fontSize: { xs: "1.5rem", md: "2rem" },
              mb: 1.5,
              lineHeight: 1.2,
            }}
          >
            {product.title}
          </Typography>

          {/* Price — Apple blue */}
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1.5rem", md: "1.75rem" },
              color: "#0071e3",
              mb: 2,
              letterSpacing: "-0.01em",
            }}
          >
            ${product.price.toFixed(2)}
          </Typography>

          {/* Stock status */}
          {stockStatus && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 2 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: stockStatus.color,
                  flexShrink: 0,
                }}
              />
              <Typography sx={{ color: stockStatus.color, fontSize: "0.8125rem", fontWeight: 500 }}>
                {stockStatus.text}
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.06)" }} />

          {/* Description */}
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

          {/* Add to Cart */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            disabled={product.stock === 0}
            onClick={addToCart}
            startIcon={<AddShoppingCartIcon />}
            sx={{
              py: 1.75,
              maxWidth: 360,
              fontSize: "1rem",
              fontWeight: 500,
              boxShadow: "0 4px 16px rgba(0,113,227,0.25)",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(0,113,227,0.35)",
              },
            }}
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
