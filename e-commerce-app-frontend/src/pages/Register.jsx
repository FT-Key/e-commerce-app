import React, { useState } from "react";
import { register } from "../services/authService.js";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(userData);
      navigate("/"); // redirige al home
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit} className="mt-3" style={{ maxWidth: "400px" }}>
        <div className="mb-3">
          <label>Nombre</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={userData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={userData.email}
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
            value={userData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Registrarse"}
        </button>
        <p className="mt-3">
          ¿Ya tienes cuenta? <Link to="/login">Iniciar Sesión</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
