import { useState, useEffect } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user) {
          setError("Please login to checkout");
          return;
        }

        const [cartRes, addressRes] = await Promise.all([
          api.get(`/cart/${user.id}`),
          api.get(`/address/${user.id}`),
        ]);

        setCart(cartRes.data.cart);
        
        // Get active address from array
        if (Array.isArray(addressRes.data.address)) {
          const activeAddr = addressRes.data.address.find(addr => addr.active === true);
          setAddress(activeAddr || addressRes.data.address[0]);
        } else if (addressRes.data.address) {
          setAddress(addressRes.data.address);
        }
      } catch (err) {
        console.error("Error loading checkout data:", err);
        setError(err.response?.data?.message || "Failed to load checkout data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!address) {
        setError("Please add a delivery address");
        return;
      }

      // Call order placement API
      const res = await api.post(`/order/place`, {
        userId: user.id,
        address,
        paymentMethod,
      });

      if (res.data && res.data.orderId) {
        // Clear cart event
        window.dispatchEvent(new Event("cartUpdated"));
        
        // Navigate to success page with orderId
        navigate(`/order-success/${res.data.orderId}`);
      }
    } catch (err) {
      console.error("Error placing order:", err);
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !cart) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error && !cart) {
    return (
      <div className="min-h-screen bg-[#0f172a] px-6 py-8 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>
          <div className="rounded-md bg-red-500/10 px-4 py-3 text-red-400 border border-red-500/20 mb-4">
            {error}
          </div>
          <Link to="/" className="text-indigo-400 hover:text-indigo-300">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f172a] px-6 py-8 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>
          <div className="rounded-md bg-yellow-500/10 px-4 py-3 text-yellow-400 border border-yellow-500/20 mb-4">
            Your cart is empty
          </div>
          <Link to="/" className="text-indigo-400 hover:text-indigo-300">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => {
    return sum + item.quantity * item.productId.price;
  }, 0);

  const tax = subtotal * 0.1;
  const shipping = 0;
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-[#0f172a] px-6 py-8 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/cart" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 mb-4">
            ← Back to Cart
          </Link>
          <h1 className="text-4xl font-bold">Order Checkout</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-md bg-red-500/10 px-4 py-3 text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Delivery & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="rounded-lg border border-gray-700 bg-[#111827] p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Delivery Address</h2>
                <Link to="/checkout-address" className="text-indigo-400 hover:text-indigo-300 text-sm">
                  Change
                </Link>
              </div>

              {address ? (
                <div className="space-y-2 text-gray-300">
                  <p className="font-medium text-white">{address.fullName}</p>
                  <p>{address.addressLine}</p>
                  <p>
                    {address.district}, {address.province} {address.pincode}
                  </p>
                  <p>Phone: {address.phone}</p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400 mb-4">No address added</p>
                  <Link to="/checkout-address">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition">
                      Add Address
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="rounded-lg border border-gray-700 bg-[#111827] p-6">
              <h2 className="text-xl font-bold mb-4">Order Items</h2>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.productId._id}
                    className="flex gap-4 border-b border-gray-700 pb-4 last:border-0"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 flex-shrink-0 rounded bg-gray-800 overflow-hidden">
                      <img
                        src={item.productId.image}
                        alt={item.productId.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-100">
                        {item.productId.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Qty: {item.quantity} × ${item.productId.price.toFixed(2)}
                      </p>
                      <p className="text-indigo-400 font-bold mt-2">
                        ${(item.quantity * item.productId.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-lg border border-gray-700 bg-[#111827] p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700/30 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">Credit/Debit Card</p>
                    <p className="text-sm text-gray-400">Visa, Mastercard, Amex</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700/30 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">UPI</p>
                    <p className="text-sm text-gray-400">Google Pay, PhonePe, Paytm</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700/30 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="netbanking"
                    checked={paymentMethod === "netbanking"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">Net Banking</p>
                    <p className="text-sm text-gray-400">All major banks</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700/30 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-gray-400">Pay when you receive your order</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-700 bg-[#111827] p-6 h-fit sticky top-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span className="text-green-400">FREE</span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-indigo-400">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || !address}
                className={`w-full ${
                  loading || !address
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white font-bold py-3 rounded-lg transition mb-3`}
              >
                {loading ? "Processing..." : "Place Order"}
              </button>

              <Link to="/cart">
                <button className="w-full border border-gray-600 hover:border-indigo-500 text-gray-300 hover:text-indigo-400 font-bold py-3 rounded-lg transition">
                  Continue Shopping
                </button>
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-700 text-sm text-gray-400 space-y-2">
                <p>✓ 100% Secure Checkout</p>
                <p>✓ Easy Returns</p>
                <p>✓ Cash on Delivery Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}