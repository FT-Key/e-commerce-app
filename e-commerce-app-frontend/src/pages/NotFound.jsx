import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Container className="text-center my-5">
      <h1 style={{ fontSize: "6rem", fontWeight: "bold" }}>404</h1>
      <h3>Oops! Página no encontrada</h3>
      <p>La página que estás buscando no existe o ha sido movida.</p>
      <Link to="/">
        <Button variant="primary">Volver al Inicio</Button>
      </Link>
      <div className="mt-4">
        <img
          src="https://cdn-icons-png.flaticon.com/512/179/179386.png"
          alt="Not Found"
          style={{ width: "150px", opacity: 0.6 }}
        />
      </div>
    </Container>
  );
};

export default NotFound;
