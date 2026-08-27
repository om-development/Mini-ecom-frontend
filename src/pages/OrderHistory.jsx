import { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../api/axios";

export default function OrderHistory() {
  const userId = localStorage.getItem("userId");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!userId) {
          setError("Please login to view order history");
          return;
        }

        const res = await api.get(`/order/user/${userId}`);
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Error loading orders:", err);
        setError("Failed to load order history");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [userId]);

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
          <h1 className="text-3xl font-bold mb-6">Order History</h1>
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

  return (
    <div className="min-h-screen bg-[#0f172a] px-6 py-8 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 mb-4"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">Order History</h1>
          <p className="text-gray-400">
            You have {orders.length} {orders.length === 1 ? "order" : "orders"}
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="rounded-lg border border-gray-700 bg-[#111827] p-12 text-center">
            <p className="text-gray-400 text-lg mb-6">No orders yet</p>
            <Link to="/">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link key={order._id} to={`/order-success/${order._id}`}>
                <div className="rounded-lg border border-gray-700 bg-[#111827] p-6 hover:border-indigo-500 hover:bg-[#111827]/50 transition cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Order ID</p>
                      <p className="font-mono text-indigo-400">{order._id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Date</p>
                      <p className="text-white">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Status</p>
                      <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-bold uppercase">
                        {order.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Items</p>
                      <p className="text-white font-bold">
                        {order.items.length}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-1">Total</p>
                      <p className="text-indigo-400 font-bold">
                        ${(order.totalAmount || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="border-t border-gray-700 pt-4">
                    <p className="text-xs text-gray-400 mb-2">Items:</p>
                    <div className="flex flex-wrap gap-2">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300"
                        >
                          {item.title} (×{item.quantity})
                        </span>
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{order.items.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-xs text-gray-400">
                      Payment:{" "}
                      <span className="text-gray-300 uppercase">
                        {order.paymentMethod}
                      </span>
                    </p>
                    <p className="text-indigo-400 hover:text-indigo-300 text-sm font-bold">
                      View Details →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
