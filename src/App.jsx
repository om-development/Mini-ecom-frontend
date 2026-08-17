import { useState } from "react";
import { createBrowserRouter, RouterProvider} from 'react-router'
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProductDetail from "./pages/ProductDetail";

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/Login', element: <Login /> },
  { path: '/SignUp', element: <SignUp /> },
  { path: '/product/:id', element: <ProductDetail /> },
  
])

export default function App() {
  return <RouterProvider router={router}/>
}