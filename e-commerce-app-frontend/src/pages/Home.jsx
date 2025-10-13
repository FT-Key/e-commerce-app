import React, { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import { Container, Row, Col, Button } from "react-bootstrap";
import { getProducts } from "../services/productService.js";
import { useStore } from "../store/useStore.js";
import ProductCard from "../components/ProductCard.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useStore((state) => state.addToCart);
  const addToFavorites = useStore((state) => state.addToFavorites);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getProducts({ limit: 8 });
        setProducts(res.products);

        // Para el slider, tomamos los primeros 5
        const slides = res.products.slice(0, 5).map((p) => ({
          original: p.image,
          thumbnail: p.image,
          description: p.name,
        }));
        setFeatured(slides);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Slider de destacados */}
     {/*  <ImageGallery
        items={featured}
        showPlayButton={false}
        autoPlay
        slideInterval={5000}
      /> */}

      <Container className="my-5">
        <h2 className="mb-4">Productos Destacados</h2>
        <Row>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Col key={i} md={3} className="mb-4">
                  <SkeletonCard />
                </Col>
              ))
            : products.map((product) => (
                <Col key={product._id} md={3} className="mb-4">
                  <ProductCard
                    product={product}
                    onAddToCart={() => addToCart(product)}
                    onAddToFavorites={() => addToFavorites(product)}
                  />
                </Col>
              ))}
        </Row>
      </Container>

      {/* Sección de categorías rápida (ejemplo) */}
      <Container className="my-5">
        <h2>Categorías</h2>
        <Row className="mt-3">
          {["Mascarillas", "Guantes", "Ropa Médica", "Otros"].map((cat, i) => (
            <Col key={i} md={3}>
              <Button variant="outline-primary" className="w-100 mb-3">
                {cat}
              </Button>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Home;
