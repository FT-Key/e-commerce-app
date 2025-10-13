import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useStore } from "../store/useStore.js";
import ProductCard from "../components/ProductCard.jsx";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
  const favorites = useStore((state) => state.favorites);
  const removeFromFavorites = useStore((state) => state.removeFromFavorites);
  const user = useStore((state) => state.user);
  const navigate = useNavigate();
  
  const handleRemove = (productId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    removeFromFavorites(productId);
  };

  return (
    <Container className="mt-4">
      <h2>Favoritos</h2>
      {favorites.length === 0 ? (
        <p>No tienes productos favoritos aún.</p>
      ) : (
        <Row className="g-3">
          {favorites.map((product) => (
            <Col md={4} lg={3} sm={6} xs={12} key={product._id}>
              <ProductCard product={product} mode="favorite" />
              <button
                className="btn btn-danger mt-2 w-100"
                onClick={() => handleRemove(product._id)}
              >
                Quitar de favoritos
              </button>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Favorites;