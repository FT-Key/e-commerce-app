import React, { useState } from "react";
import { register } from "../services/authService.js";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaSignInAlt } from "react-icons/fa";
import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(userData);
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
              <h3>¡Únete a nosotros!</h3>
              <p>Crea tu cuenta y descubre un mundo de productos increíbles</p>
              <div className="auth-features">
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Registro rápido y seguro</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Ofertas personalizadas</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Envíos a todo el país</span>
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
                <h1 className="auth-title">Crear Cuenta</h1>
                <p className="auth-subtitle">Completa tus datos para registrarte</p>
              </div>

              <Form onSubmit={handleSubmit} className="auth-form">
                <Form.Group className="mb-4">
                  <Form.Label className="auth-label">
                    <FaUser className="me-2" />
                    Nombre Completo
                  </Form.Label>
                  <div className="auth-input-wrapper">
                    <FaUser className="input-icon" />
                    <Form.Control
                      type="text"
                      className="auth-input"
                      name="name"
                      value={userData.name}
                      onChange={handleChange}
                      placeholder="Juan Pérez"
                      required
                    />
                  </div>
                </Form.Group>

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
                      value={userData.email}
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
                      value={userData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                  <small className="auth-help-text">
                    Mínimo 6 caracteres
                  </small>
                </Form.Group>

                <div className="auth-terms mb-4">
                  <Form.Check
                    type="checkbox"
                    label={
                      <span>
                        Acepto los{" "}
                        <Link to="/terms" className="auth-link-small">
                          términos y condiciones
                        </Link>
                      </span>
                    }
                    className="auth-checkbox"
                    required
                  />
                </div>

                <Button
                  className="auth-submit-btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      <FaUserPlus className="me-2" />
                      Crear Cuenta
                    </>
                  )}
                </Button>

                <div className="auth-divider">
                  <span>o</span>
                </div>

                <div className="auth-register-link">
                  <p>¿Ya tienes cuenta?</p>
                  <Link to="/login" className="auth-link-primary">
                    <FaSignInAlt className="me-2" />
                    Inicia sesión aquí
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

export default Register;