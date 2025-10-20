import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { Container, Row, Col, Button, Form, Image, Card } from "react-bootstrap";
import { useStore } from "../store/useStore.js";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import clientAxios from "../utils/clientAxios.js";
import { FaTrash, FaEye, FaShoppingBag, FaArrowLeft } from "react-icons/fa";
import "./Cart.css";

const Cart = () => {
  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateCartQuantity = useStore((state) => state.updateCartQuantity);
  const [preferenceId, setPreferenceId] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);

  useEffect(() => {
    initMercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY);
  }, []);

  // Normalizamos el carrito para manejarlo más fácil en UI
  const normalizedCart = cart.map((item) => ({
    productId: item.productId,
    name: item.name || "Producto sin nombre",
    price: item.price || 0,
    images: item.images || [],
    quantity: item.quantity || 1,
    subtotal: (item.price || 0) * (item.quantity || 1),
  }));

  const totalPrice = normalizedCart.reduce((acc, i) => acc + i.subtotal, 0);

  const handleCheckout = async () => {
    try {
      setLoadingPayment(true);
      const response = await clientAxios.post("/payment/create_preference", {
        items: normalizedCart.map(item => ({
          title: item.name,
          cantidad: item.quantity,
          precio: item.price,
        })),
        user: { email: "test_user@example.com" },
        returnUrl: `${import.meta.env.VITE_FRONTEND_URL}/payments`
      });

      setPreferenceId(response.data.id);
    } catch (error) {
      console.error("Error creando preferencia:", error);
      alert("Ocurrió un error al generar el pago. Intenta nuevamente.");
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <div className="cart-page">
      <Container className="cart-container">
        {/* Header */}
        <div className="cart-header" data-aos="fade-down">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <FaShoppingBag className="cart-icon" />
              <div>
                <h2 className="cart-title">Tu Carrito</h2>
                <p className="cart-subtitle">
                  {normalizedCart.length} {normalizedCart.length === 1 ? 'producto' : 'productos'}
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
              Seguir Comprando
            </Button>
          </div>
        </div>

        {normalizedCart.length === 0 ? (
          <div className="empty-cart" data-aos="fade-up">
            <div className="empty-cart-icon">
              <FaShoppingBag />
            </div>
            <h3 className="empty-cart-title">Tu carrito está vacío</h3>
            <p className="empty-cart-text">
              ¡Descubre productos increíbles y comienza a comprar!
            </p>
            <Button
              as={Link}
              to="/products"
              className="shop-now-button"
              size="lg"
            >
              Explorar Productos
            </Button>
          </div>
        ) : (
          <Row className="g-4">
            {/* Lista de productos */}
            <Col lg={8}>
              <div className="cart-items-section">
                {normalizedCart.map((item, index) => (
                  <Card
                    className="cart-item-card"
                    key={item.productId}
                    data-aos="fade-up"
                    data-aos-delay={index * 50}
                  >
                    <Card.Body>
                      <Row className="align-items-center g-3">
                        {/* Imagen */}
                        <Col md={2} xs={12} className="text-center">
                          <div className="product-image-wrapper">
                            <Image
                              src={item.images[0] || "https://via.placeholder.com/150"}
                              alt={item.name}
                              className="product-image"
                            />
                          </div>
                        </Col>

                        {/* Nombre */}
                        <Col md={4} xs={12}>
                          <h5 className="product-name">{item.name}</h5>
                          <p className="product-price-mobile d-md-none">
                            ${item.price.toFixed(2)}
                          </p>
                        </Col>

                        {/* Precio unitario */}
                        <Col md={2} xs={4} className="text-center d-none d-md-block">
                          <div className="product-price">
                            ${item.price.toFixed(2)}
                          </div>
                        </Col>

                        {/* Cantidad */}
                        <Col md={2} xs={12} sm={6}>
                          <div className="quantity-wrapper">
                            <label className="quantity-label">Cantidad:</label>
                            <Form.Control
                              type="number"
                              min="1"
                              max="99"
                              value={item.quantity}
                              onChange={(e) =>
                                updateCartQuantity(item.productId, Number(e.target.value))
                              }
                              className="quantity-input"
                            />
                          </div>
                        </Col>

                        {/* Subtotal */}
                        <Col md={2} xs={12} sm={6}>
                          <div className="product-subtotal">
                            <span className="subtotal-label d-md-none">Subtotal: </span>
                            <strong className="subtotal-amount">
                              ${item.subtotal.toFixed(2)}
                            </strong>
                          </div>
                        </Col>
                      </Row>

                      {/* Acciones */}
                      <Row className="mt-3">
                        <Col xs={12} className="d-flex gap-2 justify-content-end">
                          <Button
                            as={Link}
                            to={`/products/${item.productId}`}
                            className="action-button view-button"
                            size="sm"
                          >
                            <FaEye className="me-1" />
                            Ver
                          </Button>
                          <Button
                            className="action-button remove-button"
                            size="sm"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            <FaTrash className="me-1" />
                            Eliminar
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Col>

            {/* Resumen del pedido */}
            <Col lg={4}>
              <div className="order-summary" data-aos="fade-left">
                <Card className="summary-card">
                  <Card.Body>
                    <h4 className="summary-title">Resumen del Pedido</h4>

                    <div className="summary-divider"></div>

                    <div className="summary-row">
                      <span className="summary-label">Productos ({normalizedCart.length})</span>
                      <span className="summary-value">${totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="summary-row">
                      <span className="summary-label">Envío</span>
                      <span className="summary-value text-success">Gratis</span>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-row summary-total">
                      <span className="summary-label">Total</span>
                      <span className="summary-value">${totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="mt-4 payment-section">
                      {!preferenceId ? (
                        loadingPayment ? (
                          <div className="wallet-placeholder">
                            <div className="wallet-skeleton"></div>
                          </div>
                        ) : (
                          <Button
                            className="checkout-button w-100 h-100"
                            size="lg"
                            onClick={handleCheckout}
                          >
                            Proceder al Pago
                          </Button>
                        )
                      ) : (
                        <div className="wallet-wrapper">
                          <Wallet initialization={{ preferenceId }} />
                        </div>
                      )}
                    </div>

                    <div className="security-badges">
                      <div className="badge-item">
                        <i className="bi bi-shield-check"></i>
                        <span>Pago Seguro</span>
                      </div>
                      <div className="badge-item">
                        <i className="bi bi-truck"></i>
                        <span>Envío Gratis</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Cart;
