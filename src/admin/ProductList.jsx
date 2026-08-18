import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link, useSearchParams } from "react-router";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get query parameters from URL
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All Categories";

  // Fetch products based on search and category from backend
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Send search and category to backend
      const response = await api.get("/products", {
        params: {
          search: search || undefined,
          category: category === "All Categories" ? undefined : category,
        },
      });

      setProducts(response.data.products || []);
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Load categories on mount
  const loadCategories = async () => {
    try {
      const response = await api.get("/products/categories");
      const fetchedCategories = response.data.categories || [];
      setCategories(["All Categories", ...fetchedCategories]);
    } catch (err) {
      console.error("Error loading categories:", err);
      setError("Failed to load categories");
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/delete/${id}`);
      // Reload products after deletion
      loadProducts();
    } catch (err) {
      console.error("Error while deleting product:", err);
      setError("Failed to delete product");
    }
  };

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load products when URL parameters change
  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [search, category]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const newSearch = e.target.value;
    if (newSearch) {
      setSearchParams({ search: newSearch, category });
    } else {
      // Clear search parameter if input is empty
      setSearchParams({ category });
    }
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    if (newCategory === "All Categories") {
      setSearchParams(search ? { search } : {});
    } else {
      setSearchParams({ category: newCategory, ...(search && { search }) });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] px-6 py-8 text-white">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Products</h1>
          <p className="mt-1 text-gray-400">
            You have total{" "}
            <span className="text-indigo-400">{products.length}</span>{" "}
            {products.length === 1 ? "product" : "products"}.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={handleSearchChange}
              className="w-full rounded-md border border-gray-600 bg-[#1e293b] px-4 py-2.5 pr-10 text-sm text-white outline-none placeholder:text-gray-500 focus:border-indigo-500 sm:w-64"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
          </div>

          {/* Category Filter */}
          <select
            value={category}
            onChange={handleCategoryChange}
            className="rounded-md border border-gray-600 bg-[#1e293b] px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Add Product Button */}
          <Link to="/admin/product/add">
            <button className="rounded-md bg-indigo-500 px-5 py-2.5 font-medium transition hover:bg-indigo-600">
              + Add Product
            </button>
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 rounded-md bg-red-500/10 px-4 py-3 text-red-400 border border-red-500/20">
          {error}
        </div>
      )}

      {/* Product Table */}
      <div className="overflow-hidden rounded-lg border border-gray-700 bg-[#111827]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 text-left text-sm text-gray-400">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-gray-700 last:border-0 hover:bg-[#172033]"
                >
                  {/* Product */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-md bg-gray-800">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <span className="font-medium text-gray-100">
                        {product.title}
                      </span>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-5 font-medium text-gray-200">
                    ${product.price.toFixed(2)}
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-5">
                    <span
                      className={
                        product.stock === 0
                          ? "text-red-400"
                          : product.stock < 10
                            ? "text-yellow-400"
                            : "text-gray-300"
                      }
                    >
                      {product.stock}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-5">
                    <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm text-indigo-400">
                      {product.category}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5 text-right">
                    <Link to={`/admin/product/edit/${product._id}`}>
                      <button className="mr-2 rounded-md px-3 py-2 text-sm text-indigo-400 hover:bg-indigo-500/10">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="rounded-md px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="px-6 py-12 text-center text-gray-400">
            Loading products...
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-400">
            {search || category !== "All Categories"
              ? "No products found matching your filters."
              : "No products available."}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
