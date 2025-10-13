import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService.js";
import { useStore } from "../store/useStore.js";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import SkeletonCard from "../components/SkeletonCard.jsx";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const addToCart = useStore((state) => state.addToCart);
  const addToFavorites = useStore((state) => state.addToFavorites);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await getProductById(id);
        const fetchedProduct = res?.product || res;

        // Asegurarse que product.images sea array
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

  if (loading) return <SkeletonCard />;

  if (!product) return <p className="text-center my-5">Producto no encontrado</p>;

  return (
    <Container className="my-5">
      <Row>
        <Col md={6}>
          <Image
            src={product.images[0] || "https://via.placeholder.com/600x600?text=Sin+Imagen"}
            alt={product.name}
            fluid
          />
        </Col>
        <Col md={6}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <h4>${product.price}</h4>
          <div className="d-flex gap-2">
            <Button variant="success" onClick={() => addToCart(product)}>
              Agregar al carrito
            </Button>
            <Button variant="danger" onClick={() => addToFavorites(product)}>
              Agregar a favoritos
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
