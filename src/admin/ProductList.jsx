import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import api from "../api/axios";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import InputAdornment from "@mui/material/InputAdornment";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import PagePagination from "../components/PagePagination";

const MAX_VISIBLE_CATEGORIES = 3;

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showAllCategories, setShowAllCategories] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (category !== "All") params.category = category;
      const res = await api.get("/products/all", { params });
      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/products/categories");
      setCategories(res.data.categories || []);
    } catch {
      console.error("Failed to load categories");
    }
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { setPage(1); }, [search, category]);
  useEffect(() => { fetchProducts(); }, [page, search, category]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/delete/${id}`);
      setToast({ type: "success", msg: "Deleted" });
      fetchProducts();
    } catch {
      setToast({ type: "error", msg: "Failed to delete" });
    }
  };

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, MAX_VISIBLE_CATEGORIES);
  const hasMoreCategories = categories.length > MAX_VISIBLE_CATEGORIES;

  if (loading && products.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 600, letterSpacing: "-0.03em", fontSize: { xs: "1.5rem", md: "2rem" }, mb: 0.5 }}>
            Products
          </Typography>
          <Typography sx={{ color: "#6e6e73" }}>
            Manage your inventory
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/admin/product/add"
          size="small"
        >
          Add Product
        </Button>
      </Box>

      {/* Search + Category Filter */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "center" },
        }}
      >
        <TextField
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
          sx={{ width: { xs: "100%", md: 320 } }}
        />
        <Box
          sx={{
            display: "flex",
            gap: 0.75,
            flexWrap: { xs: "nowrap", md: "wrap" },
            overflowX: { xs: "auto", md: "visible" },
            pb: { xs: 0.5, md: 0 },
            flexShrink: 0,
          }}
        >
          <Button
            onClick={() => setCategory("All")}
            variant={category === "All" ? "contained" : "outlined"}
            sx={{
              borderRadius: 980,
              textTransform: "none",
              fontSize: "0.8125rem",
              borderColor: category === "All" ? "transparent" : "rgba(255,255,255,0.2)",
              color: category === "All" ? "#fff" : "#ededed",
              whiteSpace: "nowrap",
              "&:hover": {
                borderColor: "rgba(255,255,255,0.4)",
                backgroundColor: category === "All" ? "#0056b3" : "transparent",
              },
            }}
          >
            All
          </Button>
          {visibleCategories.map((cat) => (
            <Button
              key={cat}
              onClick={() => setCategory(cat)}
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
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box
        sx={{
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.08)",
          backgroundColor: "#0a0a0a",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Stock</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product._id}
                  hover
                  sx={{ "&:hover": { backgroundColor: "rgba(255,255,255,0.02)" } }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        component="img"
                        src={product.image}
                        alt={product.title}
                        sx={{ width: 40, height: 40, borderRadius: "12px", objectFit: "cover" }}
                      />
                      <Typography sx={{ fontWeight: 500 }}>{product.title}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: "#6e6e73" }}>{product.category}</TableCell>
                  <TableCell align="right">Rs {product.price?.toFixed(2)}</TableCell>
                  <TableCell align="right">{product.stock}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      component={Link}
                      to={`/admin/product/edit/${product._id}`}
                      sx={{ color: "#6e6e73", transition: "all 150ms ease", "&:hover": { color: "#0071e3" } }}
                    >
                      <EditOutlinedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(product._id)}
                      sx={{ color: "#6e6e73", transition: "all 150ms ease", "&:hover": { color: "#ef4444", backgroundColor: "rgba(239,68,68,0.1)" } }}
                    >
                      <DeleteOutlinedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Box textAlign="center" py={8}>
                      <Inventory2OutlinedIcon sx={{ fontSize: 48, color: "#48484a", mb: 2 }} />
                      <Typography sx={{ color: "#6e6e73" }}>No products found</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" sx={{ py: 3 }}>
            <PagePagination page={page} totalPages={totalPages} onChange={setPage} />
          </Box>
        )}
      </Box>

      {/* Category Dialog */}
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
              onClick={() => { setCategory("All"); setShowAllCategories(false); }}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: "12px 16px",
                borderRadius: "12px",
                backgroundColor: category === "All" ? "rgba(0,113,227,0.1)" : "transparent",
                border: "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer",
                transition: "all 150ms ease",
                "&:hover": { backgroundColor: "rgba(0,113,227,0.05)", borderColor: "rgba(255,255,255,0.16)" },
              }}
            >
              <Typography sx={{ color: "#ededed" }}>All</Typography>
              {category === "All" && <CheckIcon sx={{ color: "#0071e3" }} />}
            </Box>
            {categories.map((cat) => (
              <Box
                key={cat}
                onClick={() => { setCategory(cat); setShowAllCategories(false); }}
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

      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast(null)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={() => setToast(null)} severity={toast?.type} sx={{ width: "100%" }}>
          {toast?.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
