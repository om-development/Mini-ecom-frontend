import { useState } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProductDetail from "./pages/ProductDetail";
import AddProduct from "./admin/AddProduct";
import ProductList from "./admin/ProductList";
import EditProduct from "./admin/EditProduct";
import Navbar from "./components/Navbar";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutAddress from "./pages/CheckoutAddress";
import OrderSucess from "./pages/OrderSucess";
import OrderHistory from "./pages/OrderHistory";

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/Login", element: <Login /> },
      { path: "/SignUp", element: <SignUp /> },
      { path: "/product/:id", element: <ProductDetail /> },
      { path: "/admin/product/add", element: <AddProduct /> },
      { path: "/admin/product/list", element: <ProductList /> },
      { path: "/admin/product/edit/:id", element: <EditProduct /> },
      { path: "/cart", element: <Cart /> },
      { path: "/checkout-address", element: <CheckoutAddress /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/order-success/:orderId", element: <OrderSucess /> },
      { path: "/orders", element: <OrderHistory /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
