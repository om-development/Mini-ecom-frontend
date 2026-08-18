import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProductDetail from "./pages/ProductDetail";
import AddProduct from "./admin/AddProduct";
import ProductList from "./admin/ProductList";
import EditProduct from "./admin/EditProduct";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/Login", element: <Login /> },
  { path: "/SignUp", element: <SignUp /> },
  { path: "/product/:id", element: <ProductDetail /> },
  { path: "/admin/product/add", element: <AddProduct /> },
  { path: "/admin/product/list", element: <ProductList /> },
  { path: "/admin/product/edit/:id", element: <EditProduct /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
