import React, { useState, useEffect } from "react";
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
import { FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import { useStore } from "../store/useStore.js";
import "./Navbar.css";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const user = useStore((state) => state.user);
  const cart = useStore((state) => state.cart || []);
  const favorites = useStore((state) => state.favorites || []);
  const logout = useStore((state) => state.logout);

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const renderCartPopover = (
    <Popover id="popover-cart" className="custom-popover">
      <Popover.Header as="h6" className="popover-header-custom">
        <FaShoppingCart className="me-2" />
        Carrito de Compras
      </Popover.Header>
      <Popover.Body className="popover-body-custom">
        {cart.length === 0 ? (
          <div className="empty-message">Tu carrito está vacío</div>
        ) : (
          <ListGroup variant="flush">
            {cart.slice(0, 5).map((item) => (
              <ListGroup.Item key={item._id} className="cart-item">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="item-name">{item.name}</span>
                  <Badge bg="primary" className="item-quantity">
                    x{item.quantity || 1}
                  </Badge>
                </div>
              </ListGroup.Item>
            ))}
            {cart.length > 5 && (
              <ListGroup.Item className="text-center text-muted">
                +{cart.length - 5} más...
              </ListGroup.Item>
            )}
          </ListGroup>
        )}
      </Popover.Body>
    </Popover>
  );

  const renderFavoritesPopover = (
    <Popover id="popover-favorites" className="custom-popover">
      <Popover.Header as="h6" className="popover-header-custom">
        <FaHeart className="me-2" />
        Mis Favoritos
      </Popover.Header>
      <Popover.Body className="popover-body-custom">
        {favorites.length === 0 ? (
          <div className="empty-message">No tienes favoritos</div>
        ) : (
          <ListGroup variant="flush">
            {favorites.slice(0, 5).map((item) => (
              <ListGroup.Item key={item._id} className="favorite-item">
                {item.name}
              </ListGroup.Item>
            ))}
            {favorites.length > 5 && (
              <ListGroup.Item className="text-center text-muted">
                +{favorites.length - 5} más...
              </ListGroup.Item>
            )}
          </ListGroup>
        )}
      </Popover.Body>
    </Popover>
  );

  return (
    <BSNavbar
      expand="lg"
      sticky="top"
      className={`custom-navbar ${scrolled ? "navbar-scrolled" : ""}`}
    >
      <Container>
        <BSNavbar.Brand as={Link} to="/" className="navbar-brand-custom">
          <span className="brand-text">Ecommerce</span>
          <span className="brand-accent">App</span>
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler" />

        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-2">
            <Nav.Link as={Link} to="/" className="nav-link-custom">
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/products" className="nav-link-custom">
              Productos
            </Nav.Link>

            {user && (
              <div className="d-flex align-items-center gap-2 icon-group">
                {/* Favoritos */}
                <OverlayTrigger
                  trigger={["hover", "focus"]}
                  placement="bottom"
                  overlay={renderFavoritesPopover}
                >
                  <Nav.Link as={Link} to="/favorites" className="icon-link">
                    <div className="icon-wrapper">
                      <FaHeart size={18} />
                      {favorites.length > 0 && (
                        <Badge bg="danger" pill className="icon-badge">
                          {favorites.length}
                        </Badge>
                      )}
                    </div>
                  </Nav.Link>
                </OverlayTrigger>

                {/* Carrito */}
                <OverlayTrigger
                  trigger={["hover", "focus"]}
                  placement="bottom"
                  overlay={renderCartPopover}
                >
                  <Nav.Link as={Link} to="/cart" className="icon-link">
                    <div className="icon-wrapper">
                      <FaShoppingCart size={18} />
                      {cart.length > 0 && (
                        <Badge bg="danger" pill className="icon-badge">
                          {cart.length}
                        </Badge>
                      )}
                    </div>
                  </Nav.Link>
                </OverlayTrigger>
              </div>
            )}

            {user ? (
              <>
                {/* Admin Dropdown */}
                {user.role === "admin" && (
                  <NavDropdown
                    title="Admin"
                    id="admin-dropdown"
                    className="custom-dropdown"
                  >
                    <NavDropdown.Item as={Link} to="/admin/users" className="dropdown-item-custom">
                      Usuarios
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/products" className="dropdown-item-custom">
                      Productos
                    </NavDropdown.Item>
                  </NavDropdown>
                )}

                {/* User Dropdown */}
                <NavDropdown
                  title={
                    <span className="user-dropdown-title">
                      <FaUser className="me-2" />
                      {user.name}
                    </span>
                  }
                  id="user-dropdown"
                  className="custom-dropdown d-flex"
                >
                  <NavDropdown.Item onClick={logout} className="dropdown-item-custom logout-item">
                    Cerrar sesión
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <Link to="/login" className="login-button">
                Iniciar sesión
              </Link>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;