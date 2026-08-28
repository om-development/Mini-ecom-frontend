import { useState, useEffect } from "react";
import api from "../api/axios";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // Load cart
  const loadCart = async () => {
    if (!user) {
      setError("Please login to view cart");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/cart`);
      setCart(res.data.cart);
    } catch (err) {
      console.error("Error loading cart:", err);
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [user]);

  // Remove item from cart
  const removeItem = async (productId) => {
    try {
      await api.post(`/cart/remove`, { productId });
      loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Error removing item:", err);
      alert("Failed to remove item");
    }
  };

  // Update quantity
  const updateQty = async (productId, quantity) => {
    if (quantity === 0) {
      await removeItem(productId);
      return;
    }
    try {
      await api.post(`/cart/update`, { productId, quantity });
      loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert("Failed to update quantity");
    }
  };

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
          <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
          <div className="rounded-md bg-red-500/10 px-4 py-3 text-red-400 border border-red-500/20">
            {error}
          </div>
          <Link
            to="/"
            className="text-indigo-400 hover:text-indigo-300 mt-4 inline-block"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="min-h-screen bg-[#0f172a] px-6 py-8 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
          <div className="text-center text-gray-400">
            <p className="text-lg">Cart not found</p>
            <Link
              to="/"
              className="text-indigo-400 hover:text-indigo-300 mt-4 inline-block"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-[#0f172a] px-6 py-8 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 mb-4"
          >
            ← Back to Shopping
          </Link>
          <h1 className="text-4xl font-bold">Shopping Cart</h1>
          <p className="text-gray-400 mt-2">
            {cart.items.length} {cart.items.length === 1 ? "item" : "items"} in
            cart
          </p>
        </div>

        {/* Empty Cart */}
        {cart.items.length === 0 ? (
          <div className="rounded-lg border border-gray-700 bg-[#111827] p-12 text-center">
            <p className="text-2xl text-gray-400 mb-6">Your cart is empty</p>
            <Link
              to="/"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="rounded-lg border border-gray-700 bg-[#111827] overflow-hidden">
                {cart.items.map((item) => (
                  <div
                    key={item.productId._id}
                    className="border-b border-gray-700 last:border-0 p-4 flex gap-4"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0 rounded bg-gray-800 overflow-hidden">
                      <img
                        src={item.productId.image}
                        alt={item.productId.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-100">
                        {item.productId.title}
                      </h3>
                      <p className="text-indigo-400 text-lg font-bold mt-2">
                        ${item.productId.price.toFixed(2)}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        Subtotal: $
                        {(item.productId.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity and Actions */}
                    <div className="flex flex-col items-end gap-3">
                      {/* Quantity Control */}
                      <div className="flex items-center gap-2 bg-gray-700 rounded">
                        <button
                          onClick={() =>
                            updateQty(item.productId._id, item.quantity - 1)
                          }
                          className="px-3 py-1 hover:bg-gray-600 transition"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQty(item.productId._id, item.quantity + 1)
                          }
                          className="px-3 py-1 hover:bg-gray-600 transition"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.productId._id)}
                        className="text-red-400 hover:text-red-300 text-sm transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="rounded-lg border border-gray-700 bg-[#111827] p-6 h-fit">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax</span>
                  <span>${(total * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-indigo-400">
                  <span>Total</span>
                  <span>${(total + total * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout-address")}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition mb-3"
              >
                Proceed to Checkout
              </button>

              <Link to="/">
                <button className="w-full border border-gray-600 hover:border-indigo-500 text-gray-300 hover:text-indigo-400 font-bold py-3 rounded-lg transition">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
