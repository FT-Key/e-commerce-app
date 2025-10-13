import React, { useEffect, useState } from "react";
import { Container, Table, Button, Spinner } from "react-bootstrap";
import {
  getProducts,
  deleteProduct,
} from "../services/productService.js";
import { handleResponse, handleError } from "../utils/response.js";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts({ limit: 100 });
      setProducts(res.products);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
      const res = await deleteProduct(id);
      handleResponse(res);
      fetchProducts();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Container className="my-5">
      <h2>Administrar Productos</h2>
      <Button variant="success" className="mb-3">
        Crear Producto
      </Button>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>${p.price}</td>
                <td>{p.stock}</td>
                <td>
                  <Button variant="info" size="sm" className="me-2">
                    Editar
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(p._id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminProducts;
