import React, { useEffect, useState } from "react";
import ProductGallery from "../components/ProductGallery.jsx";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import { getProducts } from "../services/productService.js";
import { useStore } from "../store/useStore.js";
import ProductCard from "../components/ProductCard.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const addToCart = useStore((state) => state.addToCart);
  const addToFavorites = useStore((state) => state.addToFavorites);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getProducts({ limit: 12 });
        setProducts(res.products);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log("Suscripción:", email);
    // Aquí iría tu lógica de suscripción
    setEmail("");
  };

  return (
    <div className="home-page">
      {/* Hero / Portada */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content" data-aos="fade-up">
          <h1 className="hero-title">Bienvenido a Nuestra Tienda</h1>
          <p className="hero-subtitle">
            Descubre productos exclusivos y ofertas increíbles.
          </p>
          <Button className="hero-button" size="lg">
            Explorar Productos
          </Button>
        </div>
      </section>

      {/* Slider de productos */}
      <section className="products-slider-section">
        <Container>
          <h2 className="section-title" data-aos="fade-up">
            Nuestros Productos
          </h2>
          <div data-aos="fade-up" data-aos-delay="200">
            <ProductGallery limit={10} />
          </div>
        </Container>
      </section>

      {/* Sección de destacados / novedades */}
      <section className="featured-section">
        <Container>
          <h2 className="section-title" data-aos="fade-up">
            Productos Destacados
          </h2>
          <Row>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Col key={i} md={3} sm={6} className="mb-4">
                    <div data-aos="fade-up" data-aos-delay={i * 100}>
                      <SkeletonCard />
                    </div>
                  </Col>
                ))
              : products.slice(0, 8).map((product, i) => (
                  <Col key={product._id} md={3} sm={6} className="mb-4">
                    <div data-aos="fade-up" data-aos-delay={i * 100}>
                      <ProductCard
                        product={product}
                        onAddToCart={() => addToCart(product)}
                        onAddToFavorites={() => addToFavorites(product)}
                      />
                    </div>
                  </Col>
                ))}
          </Row>
        </Container>
      </section>

      {/* Sección de beneficios */}
      <section className="benefits-section">
        <Container>
          <h2 className="section-title" data-aos="fade-up">
            ¿Por qué elegirnos?
          </h2>
          <Row>
            <Col md={4} sm={12} className="mb-4">
              <div className="benefit-card" data-aos="zoom-in" data-aos-delay="0">
                <div className="benefit-icon">
                  <i className="bi bi-truck"></i>
                </div>
                <h5 className="benefit-title">Envío Rápido</h5>
                <p className="benefit-text">
                  Recibí tus productos en tiempo récord.
                </p>
              </div>
            </Col>
            <Col md={4} sm={12} className="mb-4">
              <div className="benefit-card" data-aos="zoom-in" data-aos-delay="150">
                <div className="benefit-icon">
                  <i className="bi bi-shield-check"></i>
                </div>
                <h5 className="benefit-title">Pago Seguro</h5>
                <p className="benefit-text">
                  Transacciones protegidas con los mejores sistemas.
                </p>
              </div>
            </Col>
            <Col md={4} sm={12} className="mb-4">
              <div className="benefit-card" data-aos="zoom-in" data-aos-delay="300">
                <div className="benefit-icon">
                  <i className="bi bi-star"></i>
                </div>
                <h5 className="benefit-title">Productos Exclusivos</h5>
                <p className="benefit-text">
                  Seleccionamos solo los mejores productos para vos.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Sección Newsletter / suscripción */}
      <section className="newsletter-section">
        <Container>
          <div className="newsletter-content" data-aos="fade-up">
            <h2 className="newsletter-title">Suscribite a nuestro Newsletter</h2>
            <p className="newsletter-subtitle">
              Recibí ofertas y novedades directamente en tu email.
            </p>
            <Form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <div className="newsletter-input-group">
                <Form.Control
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="newsletter-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="newsletter-button">
                  Suscribirse
                </Button>
              </div>
            </Form>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;