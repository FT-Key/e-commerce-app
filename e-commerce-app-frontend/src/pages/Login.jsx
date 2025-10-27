import React, { useState } from "react";
import { login } from "../services/authService.js";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus, FaGoogle } from "react-icons/fa";
import clientAxios from "../utils/clientAxios.js";
import { auth, googleProvider } from "../config/firebase.js";
import { signInWithPopup } from "firebase/auth";
import { useStore } from "../store/useStore.js";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(credentials); // backend debe devolver { token, user }
      const { token, user } = response.data;

      await useStore.getState().setUser(user, token);
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const firebaseToken = await user.getIdToken();

      const response = await clientAxios.post("/auth/google", { token: firebaseToken });
      const { token: backendToken, user: backendUser } = response.data;

      await useStore.getState().setUser(backendUser, backendToken);
      navigate("/");
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
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

                <Button
                  className="auth-submit-btn mb-3"
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

                <Button
                  className="auth-submit-btn auth-google-btn"
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <FaGoogle className="me-2" />
                  Continuar con Google
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
