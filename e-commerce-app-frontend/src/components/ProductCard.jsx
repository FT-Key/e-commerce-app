import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore.js";
import { FaHeart, FaShoppingCart, FaEye, FaHeartBroken } from "react-icons/fa";
import "./ProductCard.css";

const ProductCard = ({ product, mode = "detail", viewMode = "grid", onAddToCart, onAddToFavorites }) => {
  const navigate = useNavigate();

  const addToCart = useStore((state) => state.addToCart);
  const addToFavorites = useStore((state) => state.addToFavorites);
  const removeFromFavorites = useStore((state) => state.removeFromFavorites);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart();
    } else {
      addToCart(product);
    }
  };

  const handleAddToFavorites = () => {
    if (onAddToFavorites) {
      onAddToFavorites();
    } else {
      addToFavorites(product);
    }
  };

  const handleRemoveFavorite = () => removeFromFavorites(product._id);
  const handleViewDetail = () => navigate(`/products/${product._id}`);

  const mainImage =
    product.images?.[0] || product.image || "https://via.placeholder.com/400x400?text=Sin+Imagen";

  return (
    <Card className={`product-card ${mode} ${viewMode}`}>
      {/* Badge de stock o descuento */}
      {product.stock && product.stock < 5 && (
        <Badge className="stock-badge" bg="warning">
          ¡Últimas unidades!
        </Badge>
      )}

      {/* Imagen del producto */}
      <div className="product-image-container">
        <Card.Img
          variant="top"
          src={mainImage}
          alt={product.name}
          className="product-image"
          onClick={handleViewDetail}
        />
        <div className="image-overlay">
          <Button className="quick-view-btn" onClick={handleViewDetail}>
            <FaEye className="me-2" />
            Vista Rápida
          </Button>
        </div>
      </div>

      <Card.Body className="product-body">
        <div className="product-info">
          <Card.Title className="product-title" onClick={handleViewDetail}>
            {product.name}
          </Card.Title>
          <Card.Text className="product-description">
            {product.description}
          </Card.Text>
          <div className="product-price-section">
            <span className="product-price">${product.price?.toFixed(2)}</span>
            {product.oldPrice && (
              <span className="product-old-price">${product.oldPrice?.toFixed(2)}</span>
            )}
          </div>
        </div>

        {/* Acciones según el modo */}
        <div className="product-actions">
          {mode === "detail" && (
            <Button className="view-detail-btn" onClick={handleViewDetail}>
              <FaEye className="me-2" />
              Ver Detalle
            </Button>
          )}

          {mode === "actions" && (
            <div className="actions-buttons">
              <Button className="cart-btn" onClick={handleAddToCart}>
                <FaShoppingCart className="me-2" />
                Agregar
              </Button>
              <Button className="favorite-btn" onClick={handleAddToFavorites}>
                <FaHeart />
              </Button>
            </div>
          )}

          {mode === "favorite" && (
            <div className="favorite-actions">
              <Button className="remove-favorite-btn" onClick={handleRemoveFavorite}>
                <FaHeartBroken className="me-2" />
                Quitar
              </Button>
              <Button className="cart-btn-small" onClick={handleAddToCart}>
                <FaShoppingCart />
              </Button>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;