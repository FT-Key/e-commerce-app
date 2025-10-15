import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { Container, Row, Col, Button, Form, Image, Card } from "react-bootstrap";
import { useStore } from "../store/useStore.js";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import clientAxios from "../utils/clientAxios.js";

const Cart = () => {
  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateCartQuantity = useStore((state) => state.updateCartQuantity);
  const [preferenceId, setPreferenceId] = useState(null);

  useEffect(() => {
    initMercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY);
  }, []);

  // Normalizar los productos para un formato uniforme
  const normalizedCart = cart.map((item) => {
    // Verifica si productId es un objeto poblado
    const isPopulated = typeof item.productId === "object" && item.productId !== null;

    return {
      _id: item._id,
      productId: isPopulated ? item.productId._id : item.productId,
      name: isPopulated ? item.productId.name : item.name || "Producto sin nombre",
      price: isPopulated ? item.productId.price : item.price || 0,
      images: isPopulated ? item.productId.images : item.images || [],
      quantity: item.quantity || 1,
      subtotal:
        (isPopulated ? item.productId.price : item.price || 0) *
        (item.quantity || 1),
    };
  });

  const totalPrice = normalizedCart.reduce((acc, i) => acc + i.subtotal, 0);

  const handleCheckout = async () => {
    try {
      const response = await clientAxios.post("/payment/create_preference", {
        items: normalizedCart.map(item => ({
          title: item.name,
          cantidad: item.quantity,
          precio: item.price,
        })),
        user: { email: "test_user@example.com" }, // opcional
        returnUrl: `${import.meta.env.VITE_FRONTEND_URL}/payments`
      });

      const data = response.data;
      setPreferenceId(data.id);
    } catch (error) {
      console.error("Error creando preferencia:", error);
      alert("Ocurrió un error al generar el pago. Intenta nuevamente.");
    }
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4">Tu Carrito</h2>

      {normalizedCart.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          {normalizedCart.map((item) => (
            <Card className="mb-3" key={item._id}>
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={2} xs={4} className="text-center mb-2 mb-md-0">
                    <Image
                      src={item.images[0] || "https://via.placeholder.com/100"}
                      alt={item.name}
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                      rounded
                    />
                  </Col>

                  <Col md={3} xs={8} className="mb-2 mb-md-0">
                    <h6 className="mb-0">{item.name}</h6>
                  </Col>

                  <Col md={1} xs={4} className="text-center mb-2 mb-md-0">
                    ${item.price.toFixed(2)}
                  </Col>

                  <Col md={1} xs={4} className="text-center mb-2 mb-md-0">
                    <Form.Control
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateCartQuantity(item.productId, Number(e.target.value))
                      }
                      style={{ width: "70px", margin: "0 auto" }}
                    />

                  </Col>

                  <Col md={2} xs={4} className="text-center mb-2 mb-md-0">
                    <strong>${item.subtotal.toFixed(2)}</strong>
                  </Col>

                  <Col
                    md={3}
                    xs={12}
                    className="d-flex gap-2 justify-content-center mt-2 mt-md-0"
                  >
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeFromCart(item.productId)} // <-- productoId
                    >
                      Eliminar
                    </Button>
                    <Button
                      as={Link}
                      to={`/products/${item.productId}`}
                      variant="secondary"
                      size="sm"
                    >
                      Ver
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}

          <Row className="mt-3 justify-content-end">
            <Col md={4} xs={12} className="text-end">
              <h4>Total: ${totalPrice.toFixed(2)}</h4>

              {preferenceId ? (
                <Wallet initialization={{ preferenceId }} />
              ) : (
                <Button variant="success" onClick={handleCheckout}>
                  Ir a pagar
                </Button>
              )}
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Cart;
