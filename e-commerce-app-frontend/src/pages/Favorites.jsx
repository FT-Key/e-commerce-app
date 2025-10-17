import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useStore } from "../store/useStore.js";
import ProductCard from "../components/ProductCard.jsx";
import { useNavigate, Link } from "react-router-dom";
import { FaHeart, FaHeartBroken, FaArrowLeft, FaShoppingBag } from "react-icons/fa";
import "./Favorites.css";

const Favorites = () => {
  const favorites = useStore((state) => state.favorites);
  const removeFromFavorites = useStore((state) => state.removeFromFavorites);
  const addToCart = useStore((state) => state.addToCart);
  const user = useStore((state) => state.user);
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart(product);
  };

  return (
    <div className="favorites-page">
      <Container className="favorites-container">
        {/* Header */}
        <div className="favorites-header" data-aos="fade-down">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <FaHeart className="favorites-icon" />
              <div>
                <h2 className="favorites-title">Mis Favoritos</h2>
                <p className="favorites-subtitle">
                  {favorites.length} {favorites.length === 1 ? 'producto guardado' : 'productos guardados'}
                </p>
              </div>
            </div>
            <Button
              as={Link}
              to="/products"
              className="back-button"
              variant="outline-primary"
            >
              <FaArrowLeft className="me-2" />
              Ver Productos
            </Button>
          </div>
        </div>

        {/* Empty State o Lista de Favoritos */}
        {favorites.length === 0 ? (
          <div className="empty-favorites" data-aos="fade-up">
            <div className="empty-favorites-icon">
              <FaHeartBroken />
            </div>
            <h3 className="empty-favorites-title">No tienes favoritos aún</h3>
            <p className="empty-favorites-text">
              Guarda tus productos favoritos para encontrarlos fácilmente más tarde
            </p>
            <Button
              as={Link}
              to="/products"
              className="discover-button"
              size="lg"
            >
              <FaShoppingBag className="me-2" />
              Descubrir Productos
            </Button>
          </div>
        ) : (
          <Row className="g-4">
            {favorites.map((product, index) => (
              <Col 
                md={4} 
                lg={3} 
                sm={6} 
                xs={12} 
                key={product._id}
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                <ProductCard 
                  product={product} 
                  mode="favorite"
                  onAddToCart={() => handleAddToCart(product)}
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Favorites;