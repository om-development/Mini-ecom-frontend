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
import OrderSuccess from "./pages/OrderSuccess";
import OrderHistory from "./pages/OrderHistory";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/ProtectedRoute";

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
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/cart", element: <Cart /> },
          { path: "/checkout-address", element: <CheckoutAddress /> },
          { path: "/checkout", element: <Checkout /> },
          { path: "/order-success/:orderId", element: <OrderSuccess /> },
          { path: "/orders", element: <OrderHistory /> },
        ],
      },
      {
        element: <AdminRoute />,
        children: [
          { path: "/admin/product/add", element: <AddProduct /> },
          { path: "/admin/product/list", element: <ProductList /> },
          { path: "/admin/product/edit/:id", element: <EditProduct /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
