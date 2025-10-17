import React, { useEffect, useState } from "react";
import { getProducts } from "../services/productService.js";
import { useStore } from "../store/useStore.js";
import ProductCard from "../components/ProductCard.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import Pagination from "../components/Pagination.jsx";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { FaSearch, FaFilter, FaTh, FaList, FaBox } from "react-icons/fa";
import "./ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState("grid"); // "grid" o "list"
  const [sortBy, setSortBy] = useState("newest");

  const addToCart = useStore((state) => state.addToCart);
  const addToFavorites = useStore((state) => state.addToFavorites);

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
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleClearSearch = () => {
    setSearch("");
    setPage(1);
    fetchProducts();
  };

  return (
    <div className="product-list-page">
      <Container className="product-list-container">
        {/* Header */}
        <div className="products-header" data-aos="fade-down">
          <div className="header-content">
            <div className="header-text">
              <FaBox className="header-icon" />
              <div>
                <h2 className="products-title">Nuestros Productos</h2>
                <p className="products-subtitle">
                  Descubre {products.length > 0 ? `${products.length} productos` : 'nuestra colección'}
                </p>
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="view-mode-toggle">
              <button
                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Vista de cuadrícula"
              >
                <FaTh />
              </button>
              <button
                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                title="Vista de lista"
              >
                <FaList />
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="filters-section" data-aos="fade-up">
          <Form onSubmit={handleSearch} className="search-form">
            <InputGroup className="search-input-group">
              <InputGroup.Text className="search-icon">
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Buscar productos por nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              {search && (
                <Button 
                  variant="link" 
                  className="clear-search-btn"
                  onClick={handleClearSearch}
                >
                  ✕
                </Button>
              )}
              <Button type="submit" className="search-button">
                Buscar
              </Button>
            </InputGroup>
          </Form>

          {/* Sort Dropdown */}
          <div className="sort-section">
            <FaFilter className="filter-icon" />
            <Form.Select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguos</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="name-asc">Nombre: A-Z</option>
              <option value="name-desc">Nombre: Z-A</option>
            </Form.Select>
          </div>
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <Row className={`products-row ${viewMode}`}>
            {Array.from({ length: limit }).map((_, i) => (
              <Col 
                key={i} 
                lg={viewMode === "grid" ? 3 : 12}
                md={viewMode === "grid" ? 4 : 12}
                sm={viewMode === "grid" ? 6 : 12}
                xs={12}
                className="mb-4"
                data-aos="fade-up"
                data-aos-delay={i * 50}
              >
                <SkeletonCard />
              </Col>
            ))}
          </Row>
        ) : products.length === 0 ? (
          <div className="no-products" data-aos="fade-up">
            <div className="no-products-icon">
              <FaBox />
            </div>
            <h3 className="no-products-title">No se encontraron productos</h3>
            <p className="no-products-text">
              {search 
                ? `No hay resultados para "${search}". Intenta con otra búsqueda.`
                : "No hay productos disponibles en este momento."
              }
            </p>
            {search && (
              <Button 
                className="clear-filters-btn"
                onClick={handleClearSearch}
              >
                Limpiar búsqueda
              </Button>
            )}
          </div>
        ) : (
          <>
            <Row className={`products-row ${viewMode}`}>
              {products.map((product, index) => (
                <Col
                  key={product._id}
                  lg={viewMode === "grid" ? 3 : 12}
                  md={viewMode === "grid" ? 4 : 12}
                  sm={viewMode === "grid" ? 6 : 12}
                  xs={12}
                  className="mb-4"
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                  <ProductCard 
                    product={product}
                    onAddToCart={() => addToCart(product)}
                    onAddToFavorites={() => addToFavorites(product)}
                    viewMode={viewMode}
                  />
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            <div className="pagination-wrapper" data-aos="fade-up">
              <Pagination page={page} setPage={setPage} totalPages={totalPages} />
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export default ProductList;