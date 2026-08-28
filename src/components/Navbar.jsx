import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Function to load cart data
  const loadCartData = async () => {
    if (!user) {
      setCartCount(0);
      setCartTotal(0);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/cart`);

      // Your API returns { message, cart } where cart has items array
      const cart = res.data.cart;

      if (!cart || !cart.items) {
        setCartCount(0);
        setCartTotal(0);
        return;
      }

      const items = cart.items;

      // Calculate total quantity
      const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

      // Calculate total price
      const totalPrice = items.reduce(
        (sum, item) => sum + item.productId.price * item.quantity,
        0,
      );

      setCartCount(totalQuantity);
      setCartTotal(totalPrice);
    } catch (err) {
      console.error("Error loading cart:", err);
      setCartCount(0);
      setCartTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Load cart on component mount
  useEffect(() => {
    loadCartData();
  }, [user]);

  // Listen for cartUpdated event
  useEffect(() => {
    window.addEventListener("cartUpdated", loadCartData);
    return () => {
      window.removeEventListener("cartUpdated", loadCartData);
    };
  }, [user]);

  const logout = async () => {
    await authLogout();
    setCartCount(0);
    setCartTotal(0);
    navigate("/Login");
  };

  return (
    <nav className="bg-gradient-to-r from-[#0f172a] to-[#1a2847] border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="font-bold text-2xl text-indigo-400 hover:text-indigo-300 transition"
          >
            Mohit Store
          </Link>

          {/* Right Section */}
          <div className="flex gap-6 items-center">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative group flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition"
            >
              <span className="text-2xl">🛒</span>
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">Cart</span>
                <span className="text-sm font-bold text-indigo-400">
                  {cartCount} {cartCount === 1 ? "item" : "items"}
                </span>
              </div>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {cartCount}
                </span>
              )}

              {/* Hover Tooltip */}
              {cartCount > 0 && (
                <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm px-3 py-2 rounded border border-gray-600 whitespace-nowrap">
                  Total: ${cartTotal.toFixed(2)}
                </div>
              )}
            </Link>
            {/* {Order history} */}
            <Link
              to="/orders"
              className="text-indigo-400 hover:text-indigo-300"
            >
              My Orders
            </Link>
            {/* Admin Links */}
            {user?.role === "admin" && (
              <Link
                to="/admin/product/list"
                className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 hover:text-emerald-300 rounded-lg transition font-medium border border-emerald-600/30"
              >
                Admin Panel
              </Link>
            )}
            {/* Auth Links */}
            <div className="flex gap-3 items-center">
              {!user ? (
                <>
                  <Link
                    to="/Login"
                    className="px-4 py-2 text-white hover:text-indigo-400 transition font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/SignUp"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium"
                  >
                    Signup
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg transition font-medium border border-red-600/30"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
