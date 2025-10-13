import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore.js";
import { FaHeart, FaShoppingCart } from "react-icons/fa";

const ProductCard = ({ product, mode = "detail" }) => {
  const navigate = useNavigate();

  const addToCart = useStore((state) => state.addToCart);
  const addToFavorites = useStore((state) => state.addToFavorites);
  const removeFromFavorites = useStore((state) => state.removeFromFavorites);

  const handleAddToCart = () => addToCart(product);
  const handleAddToFavorites = () => addToFavorites(product);
  const handleRemoveFavorite = () => removeFromFavorites(product._id);
  const handleViewDetail = () => navigate(`/products/${product._id}`);

  const mainImage =
    product.images?.[0] || product.image || "https://via.placeholder.com/400x400?text=Sin+Imagen";

  return (
    <Card className="h-100">
      <Card.Img
        variant="top"
        src={mainImage}
        alt={product.name}
        style={{ objectFit: "cover", height: "200px" }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.name}</Card.Title>
        <Card.Text className="text-truncate" style={{ maxHeight: "3rem" }}>
          {product.description}
        </Card.Text>
        <Card.Text>
          <strong>${product.price}</strong>
        </Card.Text>

        {mode === "detail" && (
          <Button variant="primary" onClick={handleViewDetail}>
            Ver detalle
          </Button>
        )}

        {mode === "actions" && (
          <div className="d-flex gap-2 mt-auto">
            <Button variant="success" onClick={handleAddToCart} className="flex-grow-1">
              <FaShoppingCart className="me-1" /> Carrito
            </Button>
            <Button variant="danger" onClick={handleAddToFavorites} className="flex-grow-1">
              <FaHeart className="me-1" /> Favoritos
            </Button>
          </div>
        )}

        {mode === "favorite" && (
          <div className="d-flex gap-2 mt-auto">
            <Button variant="danger" onClick={handleRemoveFavorite} className="flex-grow-1">
              Quitar
            </Button>
            <Button variant="primary" onClick={handleViewDetail} className="flex-grow-1">
              Ver detalle
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
