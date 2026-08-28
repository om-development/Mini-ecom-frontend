import { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/products/${id}`);
      console.log(res);
      setProduct(res.data.product);
    } catch (err) {
      console.error("Error loading product:", err);
      setError("Failed to load product details");
    } finally {
      setLoading(false);
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

  useEffect(() => {
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f172a] px-6 py-8 text-white">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-indigo-400 hover:text-indigo-300 flex items-center gap-2"
          >
            ← Back
          </button>
          <div className="rounded-md bg-red-500/10 px-4 py-3 text-red-400 border border-red-500/20">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0f172a] px-6 py-8 text-white">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-indigo-400 hover:text-indigo-300 flex items-center gap-2"
          >
            ← Back
          </button>
          <div className="text-center text-gray-400">
            <p className="text-lg">Product not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] px-6 py-8 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-indigo-400 hover:text-indigo-300 flex items-center gap-2 transition"
        >
          ← Back
        </button>

        {/* Product Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="flex flex-col gap-4">
            <div className="relative rounded-lg overflow-hidden bg-[#111827] border border-gray-700 h-96 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {/* Stock Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {product.stock < 5 && product.stock > 0 && (
                  <div className="bg-orange-500 text-white px-3 py-1 rounded-md text-sm font-medium">
                    SALE
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium">
                    OUT OF STOCK
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col gap-6">
            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-3">
                <span className="inline-block bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="border-t border-gray-700 pt-4">
              <p className="text-gray-400 text-sm mb-2">Price</p>
              <p className="text-4xl font-bold text-indigo-400">
                ${product.price.toFixed(2)}
              </p>
            </div>

            {/* Stock Status */}
            <div className="border-t border-gray-700 pt-4">
              <p className="text-gray-400 text-sm mb-2">Stock Status</p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    product.stock > 0 ? "bg-green-400" : "bg-red-400"
                  }`}
                ></div>
                <span
                  className={`text-lg font-medium ${
                    product.stock > 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-gray-700 pt-4">
              <p className="text-gray-400 text-sm mb-3">Description</p>
              <p className="text-gray-300 text-base leading-relaxed">
                {product.description || "No description available"}
              </p>
            </div>

            {/* Additional Details */}
            <div className="border-t border-b border-gray-700 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Product ID</p>
                  <p className="text-gray-200 font-mono text-sm">
                    {product._id}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Category</p>
                  <p className="text-gray-200">{product.category}</p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => addToCart(product._id)}
              disabled={product.stock === 0}
              className={`${
                product.stock > 0
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-600 cursor-not-allowed"
              } text-white font-bold py-3 px-6 rounded-lg transition text-lg`}
            >
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>

        {/* Related Products Section (Optional) */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <h2 className="text-2xl font-bold mb-6">Product Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#111827] border border-gray-700 rounded-lg p-6">
            <div>
              <p className="text-gray-400 text-sm mb-2">Created Date</p>
              <p className="text-gray-200 text-sm">
                {new Date(product.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Last Updated</p>
              <p className="text-gray-200 text-sm">
                {new Date(product.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Total Stock</p>
              <p className="text-gray-200 text-sm">{product.stock} units</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Status</p>
              <p
                className={`text-sm font-medium ${
                  product.stock > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {product.stock > 0 ? "Available" : "Unavailable"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
