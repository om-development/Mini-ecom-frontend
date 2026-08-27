import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import api from "../api/axios";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/order/${orderId}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error("Error loading order:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

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
        <div className="max-w-2xl mx-auto">
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

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0f172a] px-6 py-8 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-400">Order not found</p>
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

  return (
    <div className="min-h-screen bg-[#0f172a] px-6 py-8 text-white">
      <div className="max-w-2xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-4xl font-bold mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-400">Thank you for your purchase</p>
        </div>

        {/* Order Details */}
        <div className="rounded-lg border border-gray-700 bg-[#111827] p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Order Details</h2>

          <div className="space-y-3 text-gray-300">
            <div className="flex justify-between">
              <span>Order ID:</span>
              <span className="font-mono text-indigo-400">{order._id}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="uppercase text-yellow-400 font-bold">
                {order.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="uppercase">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Order Date:</span>
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="rounded-lg border border-gray-700 bg-[#111827] p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Items Ordered</h2>

          <div className="space-y-3">
            {order.items &&
              Array.isArray(order.items) &&
              order.items.map((item, index) => (
                <div
                  key={index}
                  className="border-b border-gray-700 pb-3 last:border-0 flex justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-100">
                      {item?.title || "Unknown Item"}
                    </p>
                    <p className="text-sm text-gray-400">
                      Qty: {item?.quantity || 0} × $
                      {(item?.price || 0).toFixed(2)}
                    </p>
                  </div>
                  <p className="font-bold text-indigo-400">
                    ${((item?.quantity || 0) * (item?.price || 0)).toFixed(2)}
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* Delivery Address */}
        {order.address && (
          <div className="rounded-lg border border-gray-700 bg-[#111827] p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Delivery Address</h2>

            <div className="space-y-2 text-gray-300">
              <p className="font-medium text-gray-100">
                {order.address.fullName}
              </p>
              <p>{order.address.addressLine}</p>
              <p>
                {order.address.district}, {order.address.province}{" "}
                {order.address.pincode}
              </p>
              <p>📞 {order.address.phone}</p>
            </div>
          </div>
        )}

        {/* Price Summary */}
        <div className="rounded-lg border border-gray-700 bg-[#111827] p-6 mb-6">
          <div className="space-y-3">
            <div className="flex justify-between text-gray-300">
              <span>Subtotal</span>
              <span>${(order.subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Tax (10%)</span>
              <span>${(order.tax || 0).toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-700 pt-3 flex justify-between text-lg font-bold text-indigo-400">
              <span>Total</span>
              <span>${(order.totalAmount || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link to="/" className="flex-1">
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition">
              Continue Shopping
            </button>
          </Link>
          <Link to="/" className="flex-1">
            <button className="w-full border border-gray-600 hover:border-indigo-500 text-gray-300 hover:text-indigo-400 font-bold py-3 rounded-lg transition">
              Back to Home
            </button>
          </Link>
        </div>

        {/* Info */}
        <div className="mt-8 rounded-lg border border-gray-700 bg-[#111827] p-6 text-center text-gray-400">
          <p>📦 Your order will be delivered within 3-5 business days</p>
          <p className="mt-2">
            📧 A confirmation email has been sent to your registered email
          </p>
        </div>
      </div>
    </div>
  );
}
