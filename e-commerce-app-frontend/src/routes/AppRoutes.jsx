import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../layouts/ProtectedRoute.jsx";
import Home from "../pages/Home.jsx";
import ProductList from "../pages/ProductList.jsx";
import AdminUsers from "../pages/AdminUsers.jsx";
import AdminProducts from "../pages/AdminProducts.jsx";
import NotFound from "../pages/NotFound.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import ProductDetail from "../pages/ProductDetail.jsx";
import Cart from "../pages/Cart.jsx";
import Favorites from "../pages/Favorites.jsx";
import PaymentSuccess from "../pages/payments/PaymentSuccess.jsx";
import PaymentFailure from "../pages/payments/PaymentFailure.jsx";
import PaymentPending from "../pages/payments/PaymentPending.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/payments/success" element={<PaymentSuccess />} />
      <Route path="/payments/failure" element={<PaymentFailure />} />
      <Route path="/payments/pending" element={<PaymentPending />} />

      {/* Rutas usuario protegidas */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />

      {/* Rutas admin protegidas */}
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminProducts />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
