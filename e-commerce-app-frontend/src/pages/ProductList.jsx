import React, { useEffect, useState } from "react";
import { getProducts } from "../services/productService.js";
import { useStore } from "../store/useStore.js";
import ProductCard from "../components/ProductCard.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import Pagination from "../components/Pagination.jsx";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const filters = { page, limit, search };
      const res = await getProducts(filters);
      setProducts(res.products);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  return (
    <Container className="my-5">
      <h2>Productos</h2>

      {/* Buscador */}
      <Form className="d-flex mb-4" onSubmit={handleSearch}>
        <Form.Control
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="submit" className="ms-2">Buscar</Button>
      </Form>

      <Row>
        {loading
          ? Array.from({ length: limit }).map((_, i) => (
              <Col key={i} md={3} className="mb-4">
                <SkeletonCard />
              </Col>
            ))
          : products.map((product) => (
              <Col key={product._id} md={3} className="mb-4">
                <ProductCard product={product} />
              </Col>
            ))}
      </Row>

      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </Container>
  );
};

export default ProductList;
