import React from "react";
import { useState } from "react";
import api from "../api/axios";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    // e.preventDefault();
  };

  const handleSubmit = async (e) => {
    setMsg("");
    e.preventDefault();
    console.log("SUBMIT FIRED");
    try {
      const response = await api.post("/auth/signup", form);
      setMsg("User Registered Successfully");
      console.log("SUCCESS:", response.data);
    } catch (error) {
      setMsg(error.response?.data?.message || "Something is wrong");
    }
  };

  return (
    <>
      <div class="flex items-center min-h-screen bg-white dark:bg-gray-900">
        <div class="container mx-auto">
          <div class="max-w-md mx-auto my-10">
            <div class="text-center">
              <h1 class="my-3 text-3xl font-semibold text-gray-700 dark:text-gray-200">
                Sign up
              </h1>
              <p class="text-gray-500 dark:text-gray-400">
                Register your account
              </p>
            </div>
            {msg && (
              <div className="mb-4 text-center text-sm text-red-500 font-medium">
                {msg}
              </div>
            )}
            <div class="m-7">
              <form onSubmit={handleSubmit} action="">
                <div class="mb-6">
                  <label
                    for="email"
                    class="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    User Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    onChange={handleChange}
                    value={form.name}
                    placeholder="username"
                    class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                  />
                </div>
                <div class="mb-6">
                  <label
                    for="email"
                    class="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    onChange={handleChange}
                    value={form.email}
                    required
                    placeholder="you@company.com"
                    class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                  />
                </div>
                <div class="mb-6">
                  <div class="flex justify-between mb-2">
                    <label
                      for="password"
                      class="text-sm text-gray-600 dark:text-gray-400"
                    >
                      Password
                    </label>
                    <a
                      href="#!"
                      class="text-sm text-gray-400 focus:outline-none focus:text-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-300"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <input
                    type="password"
                    onChange={handleChange}
                    name="password"
                    value={form.password}
                    id="password"
                    placeholder="Your Password"
                    class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                  />
                </div>
                <div class="mb-6">
                  <button
                    type="submit"
                    class="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none"
                  >
                    Sign in
                  </button>
                </div>
                <p class="text-sm text-center text-gray-400">
                  Don&#x27;t have an account yet?{" "}
                  <a
                    href="#!"
                    class="text-indigo-400 focus:outline-none focus:underline focus:text-indigo-500 dark:focus:border-indigo-800"
                  >
                    Sign in
                  </a>
                  .
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
