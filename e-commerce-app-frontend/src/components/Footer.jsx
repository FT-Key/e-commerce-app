import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          <Col md={4}>
            <h5>E-Commerce App</h5>
            <p>Tu tienda online favorita.</p>
          </Col>
          <Col md={4}>
            <h5>Contacto</h5>
            <p>Email: soporte@ecommerce.com</p>
            <p>Teléfono: +54 9 123 456 789</p>
          </Col>
          <Col md={4}>
            <h5>Redes</h5>
            <p>
              <a href="#" className="text-light">Facebook</a> |{" "}
              <a href="#" className="text-light">Instagram</a> |{" "}
              <a href="#" className="text-light">Twitter</a>
            </p>
          </Col>
        </Row>
        <hr className="bg-light" />
        <p className="text-center mb-0">&copy; 2025 E-Commerce App. Todos los derechos reservados.</p>
      </Container>
    </footer>
  );
};

export default Footer;
