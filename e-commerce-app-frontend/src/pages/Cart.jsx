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

  const totalPrice = cart.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  const handleCheckout = async () => {
    try {
      setLoadingPayment(true);

      const response = await clientAxios.post(
        "/payment/create_preference",
        {
          items: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity || 1,
          })),
          user: { email: "test_user@example.com" },
        }
      );
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
        <div className="cart-header">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <FaShoppingBag className="cart-icon" />
              <div>
                <h2 className="cart-title">Tu Carrito</h2>
                <p className="cart-subtitle">
                  {cart.length} {cart.length === 1 ? "producto" : "productos"}
                </p>
              </div>
            </div>

            <Button
              as={Link}
              to="/products"
              variant="outline-primary"
            >
              <FaArrowLeft className="me-2" />
              Seguir Comprando
            </Button>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <FaShoppingBag />
            <h3>Tu carrito está vacío</h3>
            <Button as={Link} to="/products">
              Explorar Productos
            </Button>
          </div>
        ) : (
          <Row className="g-4">
            {/* Productos */}
            <Col lg={8}>
              {cart.map((item, index) => {
                const quantity = item.quantity || 1;
                const price = item.price || 0;
                const subtotal = price * quantity;

                return (
                  <Card key={item.productId} className="cart-item-card">
                    <Card.Body>
                      <Row className="align-items-center g-3">
                        <Col md={2} xs={12} className="text-center">
                          <div className="product-image-wrapper">
                            <Image
                              src={item.images?.[0] || "https://via.placeholder.com/150"}
                              className="product-image-cart"
                            />
                          </div>
                        </Col>

                        <Col md={4}>
                          <h5>{item.name || "Producto sin nombre"}</h5>
                        </Col>

                        <Col md={2} className="text-center d-none d-md-block">
                          ${price.toFixed(2)}
                        </Col>

                        <Col md={2}>
                          <Form.Control
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) =>
                              updateCartQuantity(
                                item.productId,
                                Number(e.target.value)
                              )
                            }
                          />
                        </Col>

                        <Col md={2}>
                          <strong>${subtotal.toFixed(2)}</strong>
                        </Col>
                      </Row>

                      <div className="d-flex justify-content-end gap-2 mt-3">
                        <Button
                          as={Link}
                          to={`/products/${item.productId}`}
                          size="sm"
                        >
                          <FaEye /> Ver
                        </Button>

                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <FaTrash /> Eliminar
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                );
              })}
            </Col>

            {/* Resumen */}
            <Col lg={4}>
              <Card>
                <Card.Body>
                  <h4>Resumen del Pedido</h4>

                  <div className="d-flex justify-content-between">
                    <span>Productos ({cart.length})</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>

                  <div className="d-flex justify-content-between">
                    <span>Envío</span>
                    <span className="text-success">Gratis</span>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>

                  <div className="mt-4">
                    {!preferenceId ? (
                      <Button
                        className="w-100"
                        size="lg"
                        onClick={handleCheckout}
                        disabled={loadingPayment}
                      >
                        Proceder al Pago
                      </Button>
                    ) : (
                      <Wallet initialization={{ preferenceId }} />
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Cart;
