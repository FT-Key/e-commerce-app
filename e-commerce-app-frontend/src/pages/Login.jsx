import React, { useState } from "react";
import { login } from "../services/authService.js";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(credentials);
      navigate("/"); // redirige al home
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="mt-3" style={{ maxWidth: "400px" }}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Contraseña</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Ingresar"}
        </button>
        <p className="mt-3">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
