import { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
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
  const [quantity, setQuantity] = useState(1);

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
      for (let i = 0; i < quantity; i++) {
        await api.post("/cart/add", { productId: id });
      }
      window.dispatchEvent(new Event("cartUpdated"));
      setToast({ open: true, message: `${quantity} item${quantity > 1 ? "s" : ""} added to cart`, severity: "success" });
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
        : { color: "#10b981", text: `${product.stock} in stock` };

  return (
    <Box sx={{ backgroundColor: "#000000", minHeight: "100vh" }}>
      {/* Back button */}
      <Box sx={{ px: { xs: 3, md: 6 }, pt: { xs: 2, md: 3 } }}>
        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
          onClick={() => navigate(-1)}
          sx={{ color: "#6e6e73", "&:hover": { color: "#ededed" } }}
        >
          Back
        </Button>
      </Box>

      {/* Product — side-by-side layout */}
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 4, md: 8 },
            alignItems: "start",
          }}
        >
          {/* Image — contained, not full-bleed */}
          <Box
            sx={{
              position: "relative",
              borderRadius: "16px",
              overflow: "hidden",
              backgroundColor: "#0a0a0a",
              border: "1px solid rgba(255,255,255,0.08)",
              aspectRatio: "1 / 1",
              maxHeight: 500,
            }}
          >
            {imgError ? (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)",
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
                }}
              />
            )}

            {/* Category badge on image */}
            <Box
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                px: 1.5,
                py: 0.5,
                borderRadius: 980,
                backgroundColor: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(12px)",
              }}
            >
              <Typography sx={{ color: "#fff", fontSize: "0.7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {product.category}
              </Typography>
            </Box>
          </Box>

          {/* Details — right side */}
          <Box sx={{ pt: { xs: 0, md: 2 } }}>
            {/* Category (mobile visible, desktop hidden since badge is on image) */}
            <Typography
              sx={{
                display: { xs: "block", md: "none" },
                color: "#6e6e73",
                fontSize: "0.75rem",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                mb: 1,
              }}
            >
              {product.category}
            </Typography>

            {/* Title */}
            <Typography
              variant="h2"
              sx={{
                fontWeight: 600,
                letterSpacing: "-0.03em",
                fontSize: { xs: "1.5rem", md: "2.25rem" },
                mb: 1.5,
                lineHeight: 1.2,
              }}
            >
              {product.title}
            </Typography>

            {/* Price */}
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: { xs: "1.5rem", md: "1.75rem" },
                color: "#0071e3",
                mb: 2,
              }}
            >
              ${product.price.toFixed(2)}
            </Typography>

            {/* Stock */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 3 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: stockStatus.color }} />
              <Typography sx={{ color: stockStatus.color, fontSize: "0.875rem", fontWeight: 500 }}>
                {stockStatus.text}
              </Typography>
            </Box>

            {/* Description */}
            <Typography
              sx={{
                color: "#6e6e73",
                lineHeight: 1.7,
                mb: 4,
                fontSize: "0.9375rem",
              }}
            >
              {product.description}
            </Typography>

            {/* Divider */}
            <Box sx={{ height: 1, backgroundColor: "rgba(255,255,255,0.08)", mb: 3 }} />

            {/* Quantity + Add to Cart — horizontal */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
              {/* Pill Stepper */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 980,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 0,
                    color: "#6e6e73",
                    transition: "all 150ms ease",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.06)", color: "#ededed" },
                    "&:active": { transform: "scale(0.92)" },
                  }}
                >
                  <RemoveIcon sx={{ fontSize: 16 }} />
                </IconButton>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "1rem",
                    minWidth: 40,
                    textAlign: "center",
                    userSelect: "none",
                  }}
                >
                  {quantity}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 0,
                    color: "#6e6e73",
                    transition: "all 150ms ease",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.06)", color: "#ededed" },
                    "&:active": { transform: "scale(0.92)" },
                  }}
                >
                  <AddIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>

              {/* Add to Cart */}
              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={product.stock === 0}
                onClick={addToCart}
                startIcon={<AddShoppingCartIcon />}
                sx={{ py: 1.5 }}
              >
                Add to Cart
              </Button>
            </Box>

            {/* Trust signals */}
            <Box sx={{ display: "flex", gap: 3 }}>
              {[
                { label: "Free Shipping", sub: "On orders over $50" },
                { label: "Easy Returns", sub: "30 day return policy" },
                { label: "Secure Checkout", sub: "SSL encrypted" },
              ].map((item) => (
                <Box key={item.label} sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 500, fontSize: "0.8125rem", mb: 0.25 }}>
                    {item.label}
                  </Typography>
                  <Typography sx={{ color: "#6e6e73", fontSize: "0.75rem" }}>
                    {item.sub}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
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
