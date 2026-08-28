import { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../api/axios";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/products/all?page=${page}`);
      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [page]);

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
                  <TableCell align="right">${product.price?.toFixed(2)}</TableCell>
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
            <Pagination count={totalPages} page={page} onChange={(_, val) => setPage(val)} color="primary" size="small" />
          </Box>
        )}
      </Box>

      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast(null)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={() => setToast(null)} severity={toast?.type} sx={{ width: "100%" }}>
          {toast?.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
