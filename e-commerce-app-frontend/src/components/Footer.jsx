import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaInstagram, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeart } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="custom-footer">
      {/* Wave separator */}
      <div className="footer-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      <Container className="footer-content">
        {/* Main Footer Content */}
        <Row className="footer-main">
          <Col md={4} sm={12} className="footer-column" data-aos="fade-up" data-aos-delay="0">
            <div className="footer-brand">
              <h3 className="brand-title">
                <span className="brand-text">E-Commerce</span>
                <span className="brand-accent">App</span>
              </h3>
              <p className="brand-description">
                Tu tienda online favorita. Encuentra productos exclusivos y ofertas increíbles.
              </p>
              <div className="footer-social-icons">
                <a href="#" className="social-icon facebook" aria-label="Facebook">
                  <FaFacebookF />
                </a>
                <a href="#" className="social-icon instagram" aria-label="Instagram">
                  <FaInstagram />
                </a>
                <a href="#" className="social-icon twitter" aria-label="Twitter">
                  <FaTwitter />
                </a>
              </div>
            </div>
          </Col>

          <Col md={4} sm={12} className="footer-column" data-aos="fade-up" data-aos-delay="150">
            <h5 className="footer-title">Contacto</h5>
            <ul className="footer-contact-list">
              <li className="contact-item">
                <FaEnvelope className="contact-icon" />
                <a href="mailto:soporte@ecommerce.com">soporte@ecommerce.com</a>
              </li>
              <li className="contact-item">
                <FaPhone className="contact-icon" />
                <a href="tel:+5491234567890">+54 9 123 456 789</a>
              </li>
              <li className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>Buenos Aires, Argentina</span>
              </li>
            </ul>
          </Col>

          <Col md={4} sm={12} className="footer-column" data-aos="fade-up" data-aos-delay="300">
            <h5 className="footer-title">Enlaces Rápidos</h5>
            <ul className="footer-links-list">
              <li><a href="/">Inicio</a></li>
              <li><a href="/products">Productos</a></li>
              <li><a href="/about">Acerca de</a></li>
              <li><a href="/contact">Contacto</a></li>
              <li><a href="/terms">Términos y Condiciones</a></li>
              <li><a href="/privacy">Política de Privacidad</a></li>
            </ul>
          </Col>
        </Row>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Footer Bottom */}
        <Row className="footer-bottom">
          <Col md={12} className="text-center">
            <p className="copyright-text">
              &copy; {currentYear} E-Commerce App. Todos los derechos reservados.
              <br />
              <span className="made-with">
                Hecho con <FaHeart className="heart-icon" /> en Argentina
              </span>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;