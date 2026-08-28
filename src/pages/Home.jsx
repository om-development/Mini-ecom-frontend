import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { Link, useSearchParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Pagination from "@mui/material/Pagination";
import Snackbar from "@mui/material/Snackbar";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const ITEMS_PER_PAGE = 8;

const Home = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All Categories";

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (search) params.search = search;
      if (category && category !== "All Categories") params.category = category;
      const res = await api.get("/products", { params });
      setProducts(res.data.products || []);
    } catch {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await api.get("/products/categories");
      setCategories(res.data.categories || []);
    } catch {
      console.error("Failed to load categories");
    }
  };

  const addToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setToast({ open: true, message: "Please login to add items to cart", severity: "warning" });
      return;
    }
    try {
      await api.post("/cart/add", { productId });
      window.dispatchEvent(new Event("cartUpdated"));
      setToast({ open: true, message: "Added to cart", severity: "success" });
    } catch {
      setToast({ open: true, message: "Failed to add to cart", severity: "error" });
    }
  };

  useEffect(() => { loadCategories(); }, []);
  useEffect(() => { loadProducts(); setPage(1); }, [search, category]);

  const handleSearch = useCallback(
    (e) => {
      const val = e.target.value;
      setSearchParams((prev) => {
        if (val) prev.set("search", val);
        else prev.delete("search");
        return prev;
      });
    },
    [setSearchParams]
  );

  const handleCategory = (cat) => {
    setSearchParams((prev) => {
      if (cat && cat !== "All Categories") prev.set("category", cat);
      else prev.delete("category");
      return prev;
    });
  };

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginatedProducts = products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const featuredProducts = paginatedProducts.slice(0, 2);
  const gridProducts = paginatedProducts.slice(2);

  const ProductCardOverlay = ({ product, large = false }) => (
    <Link
      to={`/product/${product._id}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <Box
        sx={{
          position: "relative",
          borderRadius: "20px",
          overflow: "hidden",
          cursor: "pointer",
          height: large ? { xs: 320, md: 420 } : { xs: 280, md: 320 },
          group: "card",
          "&:hover .card-overlay": { opacity: 1 },
          "&:hover .card-img": { transform: "scale(1.05)" },
          "&:hover .card-add-btn": { opacity: 1, transform: "translateY(0)" },
        }}
      >
        <Box
          className="card-img"
          component="img"
          src={product.image}
          alt={product.title}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        />

        <Box
          className="card-overlay"
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, transparent 60%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            p: large ? { xs: 3, md: 4 } : { xs: 2.5, md: 3 },
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                mb: 0.5,
              }}
            >
              {product.category}
            </Typography>
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 500,
                fontSize: large ? { xs: "1.25rem", md: "1.5rem" } : "1rem",
                letterSpacing: "-0.01em",
                mb: 0.5,
                lineHeight: 1.3,
              }}
            >
              {product.title}
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: large ? "1.25rem" : "1rem",
                }}
              >
                ${product.price.toFixed(2)}
              </Typography>
              <Box
                className="card-add-btn"
                onClick={(e) => addToCart(e, product._id)}
                sx={{
                  opacity: 0,
                  transform: "translateY(8px)",
                  transition: "all 0.25s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  backgroundColor: "#fff",
                  color: "#000",
                  borderRadius: 980,
                  px: 2,
                  py: 0.75,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
              >
                <AddShoppingCartIcon sx={{ fontSize: 16 }} />
                Add
              </Box>
            </Box>
            {product.stock === 0 && (
              <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", mt: 0.5 }}>
                Out of stock
              </Typography>
            )}
            {product.stock > 0 && product.stock < 5 && (
              <Typography sx={{ color: "rgba(255,200,0,0.8)", fontSize: "0.75rem", mt: 0.5 }}>
                Only {product.stock} left
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Link>
  );

  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box sx={{ px: { xs: 3, md: 6 }, pt: { xs: 4, md: 6 }, pb: 2 }}>
        <Container maxWidth="lg" disableGutters>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 600,
              letterSpacing: "-0.03em",
              fontSize: { xs: "2rem", md: "2.75rem" },
              mb: 1,
            }}
          >
            Store
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: { xs: "0.9375rem", md: "1.0625rem" },
              maxWidth: 400,
              mb: 4,
            }}
          >
            Everything you need, curated for you.
          </Typography>

          {/* Search + Filters */}
          <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap", alignItems: "center" }}>
            <TextField
              placeholder="Search..."
              value={search}
              onChange={handleSearch}
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ flex: 1, maxWidth: 320 }}
            />
            <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
              <Chip
                label="All"
                clickable
                size="small"
                color={category === "All Categories" || !category ? "primary" : "default"}
                onClick={() => handleCategory("All Categories")}
                variant={category === "All Categories" || !category ? "filled" : "outlined"}
              />
              {categories.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  clickable
                  size="small"
                  color={category === cat ? "primary" : "default"}
                  onClick={() => handleCategory(cat)}
                  variant={category === cat ? "filled" : "outlined"}
                />
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Content */}
      <Box sx={{ px: { xs: 3, md: 6 }, pb: 8 }}>
        <Container maxWidth="lg" disableGutters>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          {loading ? (
            <Box display="flex" justifyContent="center" py={12}>
              <CircularProgress size={24} />
            </Box>
          ) : paginatedProducts.length === 0 ? (
            <Box textAlign="center" py={12}>
              <Typography sx={{ color: "text.secondary", fontSize: "1.125rem" }}>
                No products found
              </Typography>
            </Box>
          ) : (
            <>
              {/* Featured: First 2 products as large hero cards */}
              {featuredProducts.length > 0 && (
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, mb: 2 }}>
                  {featuredProducts.map((product) => (
                    <ProductCardOverlay key={product._id} product={product} large />
                  ))}
                </Box>
              )}

              {/* Grid: Remaining products */}
              {gridProducts.length > 0 && (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "repeat(2, 1fr)",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                    },
                    gap: 2,
                  }}
                >
                  {gridProducts.map((product) => (
                    <ProductCardOverlay key={product._id} product={product} />
                  ))}
                </Box>
              )}

              {totalPages > 1 && (
                <Box display="flex" justifyContent="center" sx={{ mt: 6 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, val) => setPage(val)}
                    color="primary"
                    size="small"
                  />
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>

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
};

export default Home;
