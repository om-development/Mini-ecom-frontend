import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { Link, useSearchParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Pagination from "@mui/material/Pagination";
import Snackbar from "@mui/material/Snackbar";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

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

  const addToCart = async (productId) => {
    if (!user) {
      setToast({ open: true, message: "Please login to add items to cart", severity: "warning" });
      return;
    }
    try {
      await api.post("/cart/add", { productId });
      window.dispatchEvent(new Event("cartUpdated"));
      setToast({ open: true, message: "Product added to cart!", severity: "success" });
    } catch {
      setToast({ open: true, message: "Failed to add product to cart", severity: "error" });
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Products
      </Typography>

      <TextField
        fullWidth
        placeholder="Search products..."
        value={search}
        onChange={handleSearch}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
        <Chip
          label="All Categories"
          clickable
          color={category === "All Categories" || !category ? "primary" : "default"}
          onClick={() => handleCategory("All Categories")}
        />
        {categories.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            clickable
            color={category === cat ? "primary" : "default"}
            onClick={() => handleCategory(cat)}
          />
        ))}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : paginatedProducts.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            No products found
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedProducts.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product._id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "translateY(-4px)" },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.title}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold" noWrap>
                      {product.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {product.category}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      ${product.price.toFixed(2)}
                    </Typography>
                    {product.stock < 5 && product.stock > 0 && (
                      <Alert severity="warning" sx={{ mt: 1, py: 0 }}>
                        Only {product.stock} left
                      </Alert>
                    )}
                    {product.stock === 0 && (
                      <Alert severity="error" sx={{ mt: 1, py: 0 }}>
                        Out of stock
                      </Alert>
                    )}
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      size="small"
                      component={Link}
                      to={`/product/${product._id}`}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      disabled={product.stock === 0}
                      onClick={() => addToCart(product._id)}
                    >
                      Add to Cart
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, val) => setPage(val)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

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
};

export default Home;
