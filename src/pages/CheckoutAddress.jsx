import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router";

export default function CheckoutAddress() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    district: "",
    province: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previousAddresses, setPreviousAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Load previous addresses on mount
  useEffect(() => {
    const loadPreviousAddresses = async () => {
      try {
        const res = await api.get(`/address/${userId}`);
        console.log("Address Response:", res.data); // DEBUG
        if (Array.isArray(res.data.address)) {
          setPreviousAddresses(res.data.address);
        } else if (Array.isArray(res.data)) {
          setPreviousAddresses(res.data);
        }
      } catch (err) {
        console.error("Error loading addresses:", err);
      }
    };

    if (userId) {
      loadPreviousAddresses();
    }
  }, [userId]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    };

    if (showModal) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showModal]);

  // Fill form with selected address
  const selectAddress = async (address) => {
    try {
      // Set this address as active in backend
      await api.post(`/address/set-active`, {
        userId,
        addressId: address._id,
      });

      // Fill the form
      setForm({
        fullName: address.fullName || "",
        phone: address.phone || "",
        addressLine: address.addressLine || "",
        district: address.district || "",
        province: address.province || "",
        pincode: address.pincode || "",
      });
      setShowModal(false);
    } catch (err) {
      console.error("Error setting address active:", err);
      // Still fill form even if backend call fails
      setForm({
        fullName: address.fullName || "",
        phone: address.phone || "",
        addressLine: address.addressLine || "",
        district: address.district || "",
        province: address.province || "",
        pincode: address.pincode || "",
      });
      setShowModal(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveAddress = async (e) => {
    e.preventDefault();

    // Validate form
    if (
      !form.fullName ||
      !form.phone ||
      !form.addressLine ||
      !form.district ||
      !form.province ||
      !form.pincode
    ) {
      setError("All fields are required");
      return;
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(form.phone)) {
      setError("Phone number must be 10 digits");
      return;
    }

    // Validate pincode (6 digits)
    if (!/^\d{6}$/.test(form.pincode)) {
      setError("Pincode must be 6 digits");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await api.post(`/address/add`, {
        ...form,
        userId,
      });

      // Always navigate to checkout (whether new address or already exists)
      navigate("/checkout");
    } catch (err) {
      console.error("Error saving address:", err);
      // Navigate to checkout anyway
      navigate("/checkout");
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-[#0f172a] px-6 py-8 text-white">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Checkout Address</h1>
          <div className="rounded-md bg-red-500/10 px-4 py-3 text-red-400 border border-red-500/20 mb-4">
            Please login to continue checkout
          </div>
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
            ← Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] px-6 py-8 text-white">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 mb-4"
          >
            ← Back to Cart
          </Link>
          <h1 className="text-4xl font-bold mb-2">Delivery Address</h1>
          <p className="text-gray-400">Please enter your delivery address</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-md bg-red-500/10 px-4 py-3 text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        {/* Previous Addresses Button */}
        {previousAddresses.length > 0 && (
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              📋 Use Previous Address ({previousAddresses.length})
            </button>
          </div>
        )}

        {/* Form Container */}
        <form
          onSubmit={saveAddress}
          className="rounded-lg border border-gray-700 bg-[#111827] p-8"
        >
          {/* Full Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full rounded-md border border-gray-600 bg-[#1e293b] px-4 py-2.5 text-white outline-none placeholder:text-gray-500 focus:border-indigo-500 transition"
            />
          </div>

          {/* Phone Number */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter 10-digit phone number"
              className="w-full rounded-md border border-gray-600 bg-[#1e293b] px-4 py-2.5 text-white outline-none placeholder:text-gray-500 focus:border-indigo-500 transition"
            />
            <p className="text-xs text-gray-500 mt-1">10 digits required</p>
          </div>

          {/* Address Line */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Address <span className="text-red-400">*</span>
            </label>
            <textarea
              name="addressLine"
              value={form.addressLine}
              onChange={handleChange}
              placeholder="Enter your complete address (street, building, etc.)"
              rows="3"
              className="w-full rounded-md border border-gray-600 bg-[#1e293b] px-4 py-2.5 text-white outline-none placeholder:text-gray-500 focus:border-indigo-500 transition resize-none"
            ></textarea>
          </div>

          {/* District */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              District <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="district"
              value={form.district}
              onChange={handleChange}
              placeholder="Enter district"
              className="w-full rounded-md border border-gray-600 bg-[#1e293b] px-4 py-2.5 text-white outline-none placeholder:text-gray-500 focus:border-indigo-500 transition"
            />
          </div>

          {/* Province */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Province <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="province"
              value={form.province}
              onChange={handleChange}
              placeholder="Enter province"
              className="w-full rounded-md border border-gray-600 bg-[#1e293b] px-4 py-2.5 text-white outline-none placeholder:text-gray-500 focus:border-indigo-500 transition"
            />
          </div>

          {/* Pincode */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Pincode <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              placeholder="Enter 6-digit pincode"
              className="w-full rounded-md border border-gray-600 bg-[#1e293b] px-4 py-2.5 text-white outline-none placeholder:text-gray-500 focus:border-indigo-500 transition"
            />
            <p className="text-xs text-gray-500 mt-1">6 digits required</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition"
            >
              {loading ? "Saving..." : "Continue to Payment"}
            </button>
            <Link to="/cart" className="flex-1">
              <button
                type="button"
                className="w-full border border-gray-600 hover:border-indigo-500 text-gray-300 hover:text-indigo-400 font-bold py-3 rounded-lg transition"
              >
                Back to Cart
              </button>
            </Link>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 rounded-lg border border-gray-700 bg-[#111827] p-6">
          <h3 className="text-lg font-bold text-indigo-400 mb-3">
            Delivery Info
          </h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>✓ Deliver to your address within 3-5 business days</li>
            <li>✓ Free shipping on all orders</li>
            <li>✓ You'll receive an SMS with tracking details</li>
            <li>✓ Make sure your phone number is correct</li>
          </ul>
        </div>
      </div>

      {/* Modal for Previous Addresses */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-6">
          <div className="bg-[#111827] border border-gray-700 rounded-lg max-w-md w-full max-h-96 relative flex flex-col">
            {/* Fixed Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl z-10"
            >
              ✕
            </button>

            {/* Header with padding for close button */}
            <div className="p-6 pb-4">
              <h2 className="text-xl font-bold text-white">
                Select Previous Address
              </h2>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 px-6">
              <div className="space-y-3">
                {previousAddresses.map((address, index) => (
                  <button
                    key={index}
                    onClick={() => selectAddress(address)}
                    className="w-full border border-gray-600 hover:border-indigo-500 hover:bg-gray-700/30 rounded-lg p-4 text-left transition"
                  >
                    <p className="font-medium text-gray-100">
                      {address.fullName}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {address.addressLine}
                    </p>
                    <p className="text-sm text-gray-400">
                      {address.district}, {address.province} {address.pincode}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      📞 {address.phone}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
