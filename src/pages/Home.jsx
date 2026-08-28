import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link, useSearchParams } from "react-router";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
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

  // Add to cart function
  const addToCart = async (productId) => {
    try {
      if (!user) {
        alert("Please login to add items to cart");
        return;
      }

      const res = await api.post(`/cart/add`, { productId });

      // Dispatch event to trigger navbar update
      window.dispatchEvent(new Event("cartUpdated"));
      alert("Product added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add product to cart");
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
  const handleCategoryChange = (newCategory) => {
    if (newCategory === "All Categories") {
      setSearchParams(search ? { search } : {});
    } else {
      setSearchParams({ category: newCategory, ...(search && { search }) });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] px-6 py-8 text-white">
      {/* Filter Section */}
      <div className="mb-10">
        {/* Search and Category Container */}
        <div className="mb-8">
          {/* Search Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Search Products
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={handleSearchChange}
                className="w-full rounded-md border border-gray-600 bg-[#1e293b] px-4 py-2.5 pr-10 text-sm text-white outline-none placeholder:text-gray-500 focus:border-indigo-500"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full rounded-md border border-gray-600 bg-[#1e293b] px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-md bg-red-500/10 px-4 py-3 text-red-400 border border-red-500/20">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* Products Grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="max-w-md rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-[#111827] border border-gray-700 hover:border-indigo-500"
            >
              {/* Image Container */}
              <div className="relative">
                <img
                  className="w-full h-48 object-cover bg-gray-800"
                  src={product.image}
                  alt={product.title}
                />
                {/* Sale Badge - Show if stock is low */}
                {product.stock < 5 && product.stock > 0 && (
                  <div className="absolute top-0 right-0 bg-orange-500 text-white px-2 py-1 m-2 rounded-md text-sm font-medium">
                    SALE
                  </div>
                )}
                {/* Out of Stock Badge */}
                {product.stock === 0 && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 m-2 rounded-md text-sm font-medium">
                    OUT OF STOCK
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-4">
                {/* Product Title */}
                <h3 className="text-lg font-medium mb-2 text-gray-100 truncate">
                  {product.title}
                </h3>

                {/* Category Badge */}
                <div className="mb-3">
                  <span className="inline-block bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs font-medium">
                    {product.category}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {product.description || "High quality product"}
                </p>

                {/* Stock Status */}
                <div className="mb-4">
                  <span
                    className={`text-sm font-medium ${
                      product.stock > 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </span>
                </div>

                {/* Price and Buttons */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-indigo-400">
                    ${product.price.toFixed(2)}
                  </span>

                  <div className="flex gap-2 ml-auto">
                    {/* Add to Cart Button */}
                    <button
                      onClick={() => addToCart(product._id)}
                      disabled={product.stock === 0}
                      className={`${
                        product.stock > 0
                          ? "bg-indigo-500 hover:bg-indigo-600"
                          : "bg-gray-600 cursor-not-allowed"
                      } text-white font-bold py-2 px-3 rounded transition text-sm`}
                    >
                      {product.stock > 0 ? "Add" : "Out"}
                    </button>

                    {/* View Details Link */}
                    <Link to={`/product/${product._id}`}>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded transition text-sm">
                        View
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && !error && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">
            {search || category !== "All Categories"
              ? "No products found matching your filters."
              : "No products available."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
