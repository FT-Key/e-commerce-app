import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/productService.js";
import { useStore } from "../store/useStore.js";
import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import { FaShoppingCart, FaHeart, FaArrowLeft, FaStar, FaCheck, FaTruck } from "react-icons/fa";
import SkeletonCard from "../components/SkeletonCard.jsx";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const addToCart = useStore((state) => state.addToCart);
  const addToFavorites = useStore((state) => state.addToFavorites);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await getProductById(id);
        const fetchedProduct = res?.product || res;

        if (!fetchedProduct.images) {
          fetchedProduct.images = fetchedProduct.image ? [fetchedProduct.image] : [];
        }

        setProduct(fetchedProduct);
      } catch (error) {
        console.error(error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleQuantityChange = (value) => {
    const newQty = Math.max(1, Math.min(product.stock || 99, quantity + value));
    setQuantity(newQty);
  };

  if (loading) return <SkeletonCard />;

  if (!product) {
    return (
      <Container className="my-5 text-center">
        <div className="product-not-found">
          <h2>😕 Producto no encontrado</h2>
          <Button className="back-btn mt-4" onClick={() => navigate("/products")}>
            <FaArrowLeft className="me-2" />
            Volver a productos
          </Button>
        </div>
      </Container>
    );
  }

  const mainImage = product.images[selectedImage] || product.images[0] || "https://via.placeholder.com/600x600?text=Sin+Imagen";
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPercent = hasDiscount ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  return (
    <Container className="product-detail-container my-5">
      {/* Botón volver */}
      <Button className="back-btn mb-4" onClick={() => navigate(-1)}>
        <FaArrowLeft className="me-2" />
        Volver
      </Button>

      <Row className="product-detail-row">
        {/* Columna de Imágenes */}
        <Col lg={6} className="product-images-section">
          {/* Imagen principal */}
          <div className="main-image-container">
            {hasDiscount && (
              <Badge className="discount-badge">-{discountPercent}%</Badge>
            )}
            {product.stock && product.stock < 5 && (
              <Badge className="stock-badge-detail">¡Solo {product.stock} disponibles!</Badge>
            )}
            <img
              src={mainImage}
              alt={product.name}
              className="main-product-image"
            />
          </div>

          {/* Miniaturas */}
          {product.images && product.images.length > 1 && (
            <div className="thumbnails-container">
              {product.images.map((img, index) => (
                <div
                  key={index}
                  className={`thumbnail ${selectedImage === index ? "active" : ""}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={img} alt={`${product.name} ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </Col>

        {/* Columna de Información */}
        <Col lg={6} className="product-info-section">
          <div className="product-detail-content">
            {/* Título */}
            <h1 className="product-detail-title">{product.name}</h1>

            {/* Rating (simulado) */}
            <div className="product-rating">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="star-icon" />
              ))}
              <span className="rating-text">(4.8) • 256 reseñas</span>
            </div>

            {/* Precio */}
            <div className="product-price-container">
              <span className="current-price">${product.price?.toFixed(2)}</span>
              {hasDiscount && (
                <span className="old-price">${product.oldPrice?.toFixed(2)}</span>
              )}
            </div>

            {/* Descripción */}
            <p className="product-detail-description">{product.description}</p>

            {/* Features destacadas */}
            <div className="product-features">
              <div className="feature-item">
                <FaCheck className="feature-icon" />
                <span>Envío gratis en compras mayores a $50</span>
              </div>
              <div className="feature-item">
                <FaTruck className="feature-icon" />
                <span>Entrega en 2-5 días hábiles</span>
              </div>
              <div className="feature-item">
                <FaCheck className="feature-icon" />
                <span>Garantía de satisfacción</span>
              </div>
            </div>

            {/* Selector de cantidad */}
            <div className="quantity-section">
              <label className="quantity-label">Cantidad:</label>
              <div className="quantity-controls">
                <button
                  className="qty-btn"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="qty-display">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= (product.stock || 99)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="product-actions-detail">
              <Button className="add-to-cart-btn" onClick={handleAddToCart}>
                <FaShoppingCart className="me-2" />
                Agregar al carrito
              </Button>
              <Button className="add-to-favorites-btn" onClick={() => addToFavorites(product)}>
                <FaHeart />
              </Button>
            </div>

            {/* Info adicional */}
            <div className="additional-info">
              <div className="info-row">
                <span className="info-label">Categoría:</span>
                <span className="info-value">{product.category || "General"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">SKU:</span>
                <span className="info-value">{product._id?.slice(-8).toUpperCase() || "N/A"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Disponibilidad:</span>
                <span className={`info-value ${product.stock > 0 ? "in-stock" : "out-stock"}`}>
                  {product.stock > 0 ? "En stock" : "Agotado"}
                </span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;