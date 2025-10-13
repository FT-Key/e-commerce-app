import { useStore } from "../store/useStore.js";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = useStore((state) => state.user);

  if (!user) return <Navigate to="/" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
