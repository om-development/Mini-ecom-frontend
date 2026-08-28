import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router";

import React from "react";

const EditProduct = () => {
  const navigate = useNavigate();
  // const [product, setProduct] = useState({});
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
  });

  const allowedFields = [
    "title",
    "description",
    "price",
    "category",
    "image",
    "stock",
  ];

  const loadProduct = async () => {
    const res = await api.get("/products");
    console.log(res.data);
    const product = res.data.products.find((p) => p._id == id);
    setForm(product);
    console.log(product);
    // setProduct(product)
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/products/update/${id}`, form);
      console.log(`Updated successfully`);
      navigate("/admin/product/list");
    } catch (err) {
      console.log("Error while submiting", err);
    }
  };

  useEffect(() => {
    loadProduct();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-100">
              Edit Product
            </h1>

            <p className="mt-2 text-gray-400">
              Update product details
            </p>
          </div>

          <div className="bg-[#111827] border border-gray-700 rounded-lg p-7 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block mb-2 text-sm text-gray-300"
                >
                  Product Title
                </label>

                <input
                  type="text"
                  name="title"
                  id="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter product title"
                  className="w-full px-4 py-3 bg-[#374151] border border-gray-600 rounded-md
                       text-gray-100 placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-indigo-500
                       focus:border-indigo-500"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm text-gray-300"
                >
                  Description
                </label>

                <textarea
                  name="description"
                  id="description"
                  onChange={handleChange}
                  value={form.description}
                  rows="4"
                  placeholder="Describe your product..."
                  className="w-full px-4 py-3 bg-[#374151] border border-gray-600 rounded-md
                       text-gray-100 placeholder-gray-500 resize-none
                       focus:outline-none focus:ring-2 focus:ring-indigo-500
                       focus:border-indigo-500"
                />
              </div>

              {/* Price + Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="price"
                    className="block mb-2 text-sm text-gray-300"
                  >
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    id="price"
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full px-4 py-3 bg-[#374151] border border-gray-600 rounded-md
                         text-gray-100 placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-indigo-500
                         focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="stock"
                    className="block mb-2 text-sm text-gray-300"
                  >
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    id="stock"
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-[#374151] border border-gray-600 rounded-md
                         text-gray-100 placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-indigo-500
                         focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block mb-2 text-sm text-gray-300"
                >
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  id="category"
                  placeholder="e.g. Electronics"
                  className="w-full px-4 py-3 bg-[#374151] border border-gray-600 rounded-md
                       text-gray-100 placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-indigo-500
                       focus:border-indigo-500"
                />
              </div>

              {/* Image */}
              <div>
                <label
                  htmlFor="image"
                  className="block mb-2 text-sm text-gray-300"
                >
                  Image URL
                </label>

                <input
                  type="text"
                  value={form.image}
                  name="image"
                  onChange={handleChange}
                  id="image"
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-[#374151] border border-gray-600 rounded-md
                       text-gray-100 placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-indigo-500
                       focus:border-indigo-500"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 mt-2 text-white font-medium
                     bg-indigo-500 rounded-md
                     hover:bg-indigo-600
                     focus:outline-none focus:ring-2 focus:ring-indigo-400
                     transition"
              >
                Update Product
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProduct;
