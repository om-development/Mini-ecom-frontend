import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { Link, useSearchParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import SearchIcon from "@mui/icons-material/Search";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline";
import PagePagination from "../components/PagePagination";

const MAX_VISIBLE_CATEGORIES = 3;

const Home = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [imgErrors, setImgErrors] = useState({});
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [cardMode, setCardMode] = useState(() => localStorage.getItem("cardMode") || "normal");

  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All Categories";

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, limit: 15 };
      if (search) params.search = search;
      if (category && category !== "All Categories") params.category = category;
      const res = await api.get("/products", { params });
      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
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

  const handleImgError = (id) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  useEffect(() => { loadCategories(); }, []);
  useEffect(() => { setPage(1); }, [search, category]);
  useEffect(() => { loadProducts(); }, [page, search, category]);

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

  const featuredProducts = products.slice(0, 2);
  const gridProducts = products.slice(2);

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, MAX_VISIBLE_CATEGORIES);
  const hasMoreCategories = categories.length > MAX_VISIBLE_CATEGORIES;

  const ImageFallback = () => (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Inventory2OutlinedIcon sx={{ fontSize: 48, color: "rgba(255,255,255,0.1)" }} />
    </Box>
  );

  // Hero card — overlay design (first 2 products)
  const HeroCard = ({ product }) => (
    <Link
      to={`/product/${product._id}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <Box
        sx={{
          position: "relative",
          borderRadius: "16px",
          overflow: "hidden",
          cursor: "pointer",
          height: { xs: 320, md: 400 },
          "&:hover .hero-img": { transform: "scale(1.02)" },
          "&:hover .hero-btn": { opacity: 1, transform: "translateY(0)" },
          transition: "all 150ms ease",
        }}
      >
        {imgErrors[product._id] ? (
          <ImageFallback />
        ) : (
          <Box
            className="hero-img"
            component="img"
            src={product.image}
            alt={product.title}
            onError={() => handleImgError(product._id)}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 150ms ease",
            }}
          />
        )}

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            p: { xs: 2.5, md: 3 },
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "#6e6e73",
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                mb: 0.5,
              }}
            >
              {product.category}
            </Typography>
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 500,
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                letterSpacing: "-0.01em",
                mb: 0.5,
                lineHeight: 1.3,
              }}
            >
              {product.title}
            </Typography>
            {product.description && (
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "0.8125rem",
                  lineHeight: 1.5,
                  mb: 1,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {product.description}
              </Typography>
            )}
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "1.25rem",
                }}
              >
                Rs {product.price.toFixed(2)}
              </Typography>
              <Box
                className="hero-btn"
                onClick={(e) => addToCart(e, product._id)}
                sx={{
                  opacity: 0,
                  transform: "translateY(8px)",
                  transition: "all 150ms ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  backgroundColor: "#0071e3",
                  color: "#fff",
                  borderRadius: 980,
                  px: 2,
                  py: 0.75,
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#0056b3" },
                }}
              >
                <AddShoppingCartIcon sx={{ fontSize: 16 }} />
                Add to Cart
              </Box>
            </Box>
            {product.stock === 0 && (
              <Typography sx={{ color: "#ef4444", fontSize: "0.75rem", fontWeight: 500, mt: 0.5 }}>
                Out of stock
              </Typography>
            )}
            {product.stock > 0 && product.stock < 5 && (
              <Typography sx={{ color: "#f59e0b", fontSize: "0.75rem", fontWeight: 500, mt: 0.5 }}>
                Only {product.stock} left
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Link>
  );

  // Grid card — standard card design (remaining products)
  const GridCard = ({ product }) => (
    <Link
      to={`/product/${product._id}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <Box
        sx={{
          backgroundColor: "#0a0a0a",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          overflow: "hidden",
          cursor: "pointer",
          transition: "all 150ms ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
            borderColor: "rgba(255,255,255,0.16)",
          },
        }}
      >
        {/* Square image */}
        <Box sx={{ position: "relative", aspectRatio: "1 / 1", overflow: "hidden" }}>
          {imgErrors[product._id] ? (
            <ImageFallback />
          ) : (
            <Box
              component="img"
              src={product.image}
              alt={product.title}
              onError={() => handleImgError(product._id)}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 0,
              }}
            />
          )}
          {product.stock === 0 && (
            <Box
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                px: 1.5,
                py: 0.25,
                borderRadius: 980,
                backgroundColor: "rgba(239,68,68,0.9)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Typography sx={{ color: "#fff", fontSize: "0.65rem", fontWeight: 500, textTransform: "uppercase" }}>
                Out of stock
              </Typography>
            </Box>
          )}
        </Box>

        {/* Content below image */}
        <Box sx={{ p: 2 }}>
          <Typography
            sx={{
              color: "#6e6e73",
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              mb: 0.5,
            }}
          >
            {product.category}
          </Typography>
          <Typography
            sx={{
              color: "#ededed",
              fontWeight: 500,
              fontSize: "1.5rem",
              letterSpacing: "-0.02em",
              lineHeight: 1.3,
              mb: 0.5,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.title}
          </Typography>
          {product.description && (
            <Typography
              sx={{
                color: "#6e6e73",
                fontSize: "0.8125rem",
                lineHeight: 1.5,
                mb: 1,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {product.description}
            </Typography>
          )}
          <Typography
            sx={{
              color: "#0071e3",
              fontWeight: 600,
              fontSize: "1.25rem",
              mb: 2,
            }}
          >
            Rs {product.price.toFixed(2)}
          </Typography>
          <Button
            fullWidth
            variant="contained"
            size="small"
            disabled={product.stock === 0}
            onClick={(e) => addToCart(e, product._id)}
            startIcon={<AddShoppingCartIcon sx={{ fontSize: 16 }} />}
            sx={{ py: 1 }}
          >
            Add to Cart
          </Button>
        </Box>
      </Box>
    </Link>
  );

  // Compact card — horizontal list-style: image left, text middle, price right
  const CompactCard = ({ product }) => (
    <Link
      to={`/product/${product._id}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          backgroundColor: "#0a0a0a",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "14px",
          p: 1.5,
          cursor: "pointer",
          transition: "all 150ms ease",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
            borderColor: "rgba(255,255,255,0.16)",
          },
        }}
      >
        {/* Image */}
        <Box
          sx={{
            position: "relative",
            width: 80,
            height: 80,
            borderRadius: "10px",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {imgErrors[product._id] ? (
            <ImageFallback />
          ) : (
            <Box
              component="img"
              src={product.image}
              alt={product.title}
              onError={() => handleImgError(product._id)}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
          {product.stock === 0 && (
            <Box
              sx={{
                position: "absolute",
                top: 4,
                right: 4,
                px: 0.75,
                py: 0.1,
                borderRadius: 980,
                backgroundColor: "rgba(239,68,68,0.9)",
              }}
            >
              <Typography sx={{ color: "#fff", fontSize: "0.5rem", fontWeight: 500, textTransform: "uppercase" }}>
                OOS
              </Typography>
            </Box>
          )}
        </Box>

        {/* Text */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              color: "#ededed",
              fontWeight: 500,
              fontSize: "0.9375rem",
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.title}
          </Typography>
          <Typography
            sx={{
              color: "#6e6e73",
              fontSize: "0.75rem",
              mt: 0.25,
            }}
          >
            {product.category}
          </Typography>
        </Box>

        {/* Price + Cart */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0 }}>
          <Typography
            sx={{ color: "#0071e3", fontWeight: 600, fontSize: "0.9375rem", whiteSpace: "nowrap" }}
          >
            Rs {product.price.toFixed(2)}
          </Typography>
          <IconButton
            size="small"
            disabled={product.stock === 0}
            onClick={(e) => addToCart(e, product._id)}
            sx={{
              color: "#0071e3",
              backgroundColor: "rgba(0,113,227,0.1)",
              width: 32,
              height: 32,
              "&:hover": { backgroundColor: "rgba(0,113,227,0.2)" },
              "&.Mui-disabled": { color: "#48484a", backgroundColor: "rgba(255,255,255,0.05)" },
            }}
          >
            <AddShoppingCartIcon sx={{ fontSize: 16 }} />
          </IconButton>
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
            Explore our Collection
          </Typography>
          <Typography
            sx={{
              color: "#6e6e73",
              fontSize: "1.125rem",
              maxWidth: 400,
              mb: 4,
            }}
          >
            Everything you need, curated for you.
          </Typography>

          {/* Search + Toggle — row 1 */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              mb: 2,
              alignItems: "center",
            }}
          >
            <TextField
              placeholder="Search..."
              value={search}
              onChange={handleSearch}
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#6e6e73", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ flex: 1 }}
            />
            <IconButton
              onClick={() => {
                const next = cardMode === "normal" ? "compact" : "normal";
                setCardMode(next);
                localStorage.setItem("cardMode", next);
              }}
              sx={{
                color: "#ededed",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "10px",
                width: 36,
                height: 36,
                flexShrink: 0,
                "&:hover": { borderColor: "rgba(255,255,255,0.4)", backgroundColor: "rgba(255,255,255,0.05)" },
              }}
              title={cardMode === "normal" ? "Compact view" : "Normal view"}
            >
              {cardMode === "normal" ? (
                <ViewHeadlineIcon sx={{ fontSize: 20 }} />
              ) : (
                <GridViewIcon sx={{ fontSize: 20 }} />
              )}
            </IconButton>
          </Box>

          {/* Categories — row 2 */}
          <Box
            sx={{
              display: "flex",
              gap: 0.75,
              mb: 4,
              flexWrap: { xs: "nowrap", md: "wrap" },
              overflowX: { xs: "auto", md: "visible" },
              pb: { xs: 0.5, md: 0 },
            }}
          >
              <Button
                onClick={() => handleCategory("All Categories")}
                variant={category === "All Categories" || !category ? "contained" : "outlined"}
                sx={{
                  borderRadius: 980,
                  textTransform: "none",
                  fontSize: "0.8125rem",
                  borderColor: category === "All Categories" || !category ? "transparent" : "rgba(255,255,255,0.2)",
                  color: category === "All Categories" || !category ? "#fff" : "#ededed",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    borderColor: "rgba(255,255,255,0.4)",
                    backgroundColor: (category === "All Categories" || !category) ? "#0056b3" : "transparent",
                  },
                }}
              >
                All
              </Button>
              {visibleCategories.map((cat) => (
                <Button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  variant={category === cat ? "contained" : "outlined"}
                  sx={{
                    borderRadius: 980,
                    textTransform: "none",
                    fontSize: "0.8125rem",
                    borderColor: category === cat ? "transparent" : "rgba(255,255,255,0.2)",
                    color: category === cat ? "#fff" : "#ededed",
                    whiteSpace: "nowrap",
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.4)",
                      backgroundColor: category === cat ? "#0056b3" : "transparent",
                    },
                  }}
                >
                  {cat}
                </Button>
              ))}
              {hasMoreCategories && (
                <Button
                  onClick={() => setShowAllCategories(true)}
                  sx={{
                    borderRadius: 980,
                    textTransform: "none",
                    fontSize: "0.8125rem",
                    borderColor: "rgba(255,255,255,0.2)",
                    color: "#ededed",
                    whiteSpace: "nowrap",
                    "&:hover": { borderColor: "rgba(255,255,255,0.4)" },
                  }}
                >
                  +More
                </Button>
              )}
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
          ) : products.length === 0 ? (
            <Box textAlign="center" py={14}>
              <Inventory2OutlinedIcon sx={{ fontSize: 80, color: "#48484a", mb: 3 }} />
              <Typography sx={{ color: "#6e6e73", fontSize: "1.125rem", mb: 1 }}>
                No products found
              </Typography>
              <Typography variant="body2" sx={{ color: "#48484a" }}>
                Try adjusting your search or filters
              </Typography>
            </Box>
          ) : (
            <>
              {cardMode === "compact" ? (
                /* Compact mode — flat list, no hero */
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {products.map((product) => (
                    <CompactCard key={product._id} product={product} />
                  ))}
                </Box>
              ) : (
                /* Normal mode — hero + grid */
                <>
                  {featuredProducts.length > 0 && (
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, mb: 6 }}>
                      {featuredProducts.map((product) => (
                        <HeroCard key={product._id} product={product} />
                      ))}
                    </Box>
                  )}
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
                        <GridCard key={product._id} product={product} />
                      ))}
                    </Box>
                  )}
                </>
              )}

              {totalPages > 1 && (
                <Box display="flex" justifyContent="center" sx={{ mt: 6 }}>
                  <PagePagination page={page} totalPages={totalPages} onChange={setPage} />
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>

      {/* Category Dialog — centered */}
      <Dialog
        open={showAllCategories}
        onClose={() => setShowAllCategories(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "#0a0a0a",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
            },
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 3, pt: 2.5 }}>
          <DialogTitle sx={{ p: 0, fontWeight: 600, fontSize: "1.125rem" }}>Categories</DialogTitle>
          <IconButton onClick={() => setShowAllCategories(false)} sx={{ color: "#6e6e73" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ px: 3, pb: 3, pt: 1 }}>
          <Stack spacing={0.75}>
            <Box
              onClick={() => { handleCategory("All Categories"); setShowAllCategories(false); }}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: "12px 16px",
                borderRadius: "12px",
                backgroundColor: (category === "All Categories" || !category) ? "rgba(0,113,227,0.1)" : "transparent",
                border: "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer",
                transition: "all 150ms ease",
                "&:hover": { backgroundColor: "rgba(0,113,227,0.05)", borderColor: "rgba(255,255,255,0.16)" },
              }}
            >
              <Typography sx={{ color: "#ededed" }}>All</Typography>
              {(category === "All Categories" || !category) && <CheckIcon sx={{ color: "#0071e3" }} />}
            </Box>
            {categories.map((cat) => (
              <Box
                key={cat}
                onClick={() => { handleCategory(cat); setShowAllCategories(false); }}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: "12px 16px",
                  borderRadius: "12px",
                  backgroundColor: category === cat ? "rgba(0,113,227,0.1)" : "transparent",
                  border: "1px solid rgba(255,255,255,0.08)",
                  cursor: "pointer",
                  transition: "all 150ms ease",
                  "&:hover": { backgroundColor: "rgba(0,113,227,0.05)", borderColor: "rgba(255,255,255,0.16)" },
                }}
              >
                <Typography sx={{ color: "#ededed" }}>{cat}</Typography>
                {category === cat && <CheckIcon sx={{ color: "#0071e3" }} />}
              </Box>
            ))}
          </Stack>
        </Box>
      </Dialog>

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
