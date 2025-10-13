import React from "react";
import { Container, Row, Col, Button, Form, Image } from "react-bootstrap";
import { useStore } from "../store/useStore.js";
import { Link } from "react-router-dom";

const Cart = () => {
  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateCartQuantity = useStore((state) => state.updateCartQuantity);

  // 🧩 Normalizamos cada item
  const normalizedCart = cart.map((item) => {
    const product = item.productId || item;
    return {
      _id: product._id || item._id,
      name: product.name || "Producto sin nombre",
      price: product.price || item.price || 0,
      images: product.images || item.images || [],
      quantity: item.quantity || 1,
      subtotal: item.subtotal || (product.price || 0) * (item.quantity || 1),
    };
  });

  const totalPrice = normalizedCart.reduce((acc, i) => acc + i.subtotal, 0);

  return (
    <Container className="my-4">
      <h2>Carrito</h2>
      {normalizedCart.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          {/* Header */}
          <Row className="fw-bold border-bottom py-2">
            <Col md={2} className="text-center">Imagen</Col>
            <Col md={3} className="text-center">Nombre</Col>
            <Col md={1} className="text-center">Precio</Col>
            <Col md={1} className="text-center">Cantidad</Col>
            <Col md={2} className="text-center">Total</Col>
            <Col md={3} className="text-center">Acciones</Col>
          </Row>

          {/* Items */}
          {normalizedCart.map((item) => (
            <Row
              key={item._id}
              className="align-items-center border-bottom py-2"
            >
              <Col md={2}>
                <Image
                  src={
                    item.images?.[0] ||
                    item.image ||
                    "https://via.placeholder.com/80"
                  }
                  alt={item.name}
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  rounded
                />
              </Col>
              <Col md={3}>{item.name}</Col>
              <Col md={1}>${item.price.toFixed(2)}</Col>
              <Col md={1}>
                <Form.Control
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateCartQuantity(item._id, Number(e.target.value))
                  }
                />
              </Col>
              <Col md={2}>${item.subtotal.toFixed(2)}</Col>
              <Col
                md={3}
                className="d-flex align-items-center justify-content-center gap-1"
              >
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeFromCart(item._id)}
                >
                  Eliminar
                </Button>
                <Button
                  as={Link}
                  to={`/products/${item._id}`}
                  variant="secondary"
                  size="sm"
                >
                  Ver
                </Button>
              </Col>
            </Row>
          ))}

          {/* Total */}
          <Row className="mt-3">
            <Col className="text-end">
              <h4>Total: ${totalPrice.toFixed(2)}</h4>
              <Button variant="success">Ir a pagar</Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Cart;
