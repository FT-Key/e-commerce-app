import React, { useState } from "react";
import { login } from "../services/authService.js";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import "./Auth.css";

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
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Container>
        <div className="auth-container">
          {/* Columna izquierda - Decorativa */}
          <div className="auth-side">
            <div className="auth-side-content">
              <div className="auth-logo">
                <div className="logo-icon">🛒</div>
                <h2>Mi Tienda</h2>
              </div>
              <h3>¡Bienvenido de vuelta!</h3>
              <p>Inicia sesión para acceder a tu cuenta y continuar comprando</p>
              <div className="auth-features">
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Acceso a ofertas exclusivas</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Historial de compras</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Lista de favoritos</span>
                </div>
              </div>
            </div>
            <div className="auth-decoration">
              <div className="decoration-circle circle-1"></div>
              <div className="decoration-circle circle-2"></div>
              <div className="decoration-circle circle-3"></div>
            </div>
          </div>

          {/* Columna derecha - Formulario */}
          <div className="auth-form-section">
            <div className="auth-form-container">
              <div className="auth-header">
                <h1 className="auth-title">Iniciar Sesión</h1>
                <p className="auth-subtitle">Ingresa tus credenciales para continuar</p>
              </div>

              <Form onSubmit={handleSubmit} className="auth-form">
                <Form.Group className="mb-4">
                  <Form.Label className="auth-label">
                    <FaEnvelope className="me-2" />
                    Correo Electrónico
                  </Form.Label>
                  <div className="auth-input-wrapper">
                    <FaEnvelope className="input-icon" />
                    <Form.Control
                      type="email"
                      className="auth-input"
                      name="email"
                      value={credentials.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="auth-label">
                    <FaLock className="me-2" />
                    Contraseña
                  </Form.Label>
                  <div className="auth-input-wrapper">
                    <FaLock className="input-icon" />
                    <Form.Control
                      type="password"
                      className="auth-input"
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </Form.Group>

                <div className="auth-options mb-4">
                  <Form.Check
                    type="checkbox"
                    label="Recordarme"
                    className="auth-checkbox"
                  />
                  <Link to="/forgot-password" className="auth-link-small">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <Button
                  className="auth-submit-btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <FaSignInAlt className="me-2" />
                      Iniciar Sesión
                    </>
                  )}
                </Button>

                <div className="auth-divider">
                  <span>o</span>
                </div>

                <div className="auth-register-link">
                  <p>¿No tienes cuenta?</p>
                  <Link to="/register" className="auth-link-primary">
                    <FaUserPlus className="me-2" />
                    Regístrate aquí
                  </Link>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login;