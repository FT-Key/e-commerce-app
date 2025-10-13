import React from "react";
import {
  Navbar as BSNavbar,
  Nav,
  Container,
  NavDropdown,
  Badge,
  OverlayTrigger,
  Popover,
  ListGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useStore } from "../store/useStore.js";

const Navbar = () => {
  const user = useStore((state) => state.user);
  const cart = useStore((state) => state.cart || []); // array de productos en carrito
  const favorites = useStore((state) => state.favorites || []); // array de productos favoritos
  const logout = useStore((state) => state.logout); // función para cerrar sesión

  const renderCartPopover = (
    <Popover id="popover-cart">
      <Popover.Header as="h6">Carrito</Popover.Header>
      <Popover.Body>
        {cart.length === 0 ? (
          <div>Tu carrito está vacío</div>
        ) : (
          <ListGroup variant="flush">
            {cart.map((item) => (
              <ListGroup.Item key={item._id}>
                {item.name} x {item.quantity || 1}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Popover.Body>
    </Popover>
  );

  const renderFavoritesPopover = (
    <Popover id="popover-favorites">
      <Popover.Header as="h6">Favoritos</Popover.Header>
      <Popover.Body>
        {favorites.length === 0 ? (
          <div>No hay favoritos</div>
        ) : (
          <ListGroup variant="flush">
            {favorites.map((item) => (
              <ListGroup.Item key={item._id}>{item.name}</ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Popover.Body>
    </Popover>
  );

  return (
    <BSNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BSNavbar.Brand as={Link} to="/">Ecommerce App</BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">

            {/* Favoritos */}
            <OverlayTrigger trigger={["hover", "focus"]} placement="bottom" overlay={renderFavoritesPopover}>
              <Nav.Link as={Link} to="/favorites" className="position-relative">
                <FaHeart size={20} />
                {favorites.length > 0 && (
                  <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                    {favorites.length}
                  </Badge>
                )}
              </Nav.Link>
            </OverlayTrigger>

            {/* Carrito */}
            <OverlayTrigger trigger={["hover", "focus"]} placement="bottom" overlay={renderCartPopover}>
              <Nav.Link as={Link} to="/cart" className="position-relative">
                <FaShoppingCart size={20} />
                {cart.length > 0 && (
                  <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                    {cart.length}
                  </Badge>
                )}
              </Nav.Link>
            </OverlayTrigger>

            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/products">Productos</Nav.Link>

            {user ? (
              <>
                {/* Admin */}
                {user.role === "admin" && (
                  <NavDropdown title="Admin" id="admin-dropdown">
                    <NavDropdown.Item as={Link} to="/admin/users">Usuarios</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/products">Productos</NavDropdown.Item>
                  </NavDropdown>
                )}

                {/* Usuario */}
                <NavDropdown title={user.name} id="user-dropdown">
                  <NavDropdown.Item onClick={logout}>Cerrar sesión</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <Nav.Link as={Link} to="/login">Iniciar sesión</Nav.Link>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
