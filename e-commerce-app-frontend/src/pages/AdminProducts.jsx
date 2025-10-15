import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Spinner,
  Modal,
  Form,
  InputGroup,
} from "react-bootstrap";
import {
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
} from "../services/productService.js";
import { handleResponse, handleError } from "../utils/response.js";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    images: [""],
    isActive: true,
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts({ limit: 100 });
      setProducts(res.products || res || []);
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
      await deleteProduct(id);
      handleResponse({ message: "Producto eliminado correctamente" });
      fetchProducts();
    } catch (error) {
      handleError(error);
    }
  };

  const handleShowModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        category: product.category || "",
        stock: product.stock || 0,
        images: product.images?.length ? product.images : [""],
        isActive: product.isActive ?? true,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: 0,
        category: "",
        stock: 0,
        images: [""],
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newForm = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };

    // ⚡ Generar imagen por defecto cuando se ingresa el nombre
    if (name === "name" && value.trim()) {
      const encoded = encodeURIComponent(value.trim());
      const defaultImage = `https://picsum.photos/seed/${encoded}/600/600`;
      if (!formData.images?.[0] || formData.images[0].trim() === "") {
        newForm.images = [defaultImage];
      }
    }

    setFormData(newForm);
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        images: formData.images.filter((url) => url.trim() !== ""),
      };

      if (editingProduct) {
        await updateProduct(editingProduct._id, payload);
        handleResponse({ message: "Producto actualizado correctamente" });
      } else {
        await createProduct(payload);
        handleResponse({ message: "Producto creado correctamente" });
      }

      fetchProducts();
      handleCloseModal();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Container className="my-5">
      <h2>Administrar Productos</h2>
      <Button variant="success" className="mb-3" onClick={() => handleShowModal()}>
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
              <th>Categoría</th>
              <th>Imágenes</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>${p.price}</td>
                <td>{p.stock}</td>
                <td>{p.category}</td>
                <td>
                  {p.images?.length ? (
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td>{p.isActive ? "Sí" : "No"}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleShowModal(p)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(p._id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal crear / editar producto */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? "Editar Producto" : "Crear Producto"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min={0}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min={0}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Imágenes (URLs)</Form.Label>
              {formData.images.map((img, index) => (
                <InputGroup className="mb-2" key={index}>
                  <Form.Control
                    type="url"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    value={img}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                  />
                  <Button
                    variant="danger"
                    onClick={() => removeImageField(index)}
                    disabled={formData.images.length === 1}
                  >
                    ✕
                  </Button>
                </InputGroup>
              ))}
              <Button variant="secondary" size="sm" onClick={addImageField}>
                + Agregar imagen
              </Button>
            </Form.Group>

            <Form.Group className="mb-3" controlId="isActive">
              <Form.Check
                type="checkbox"
                label="Producto activo"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
            </Form.Group>

            <Button type="submit" variant="primary">
              {editingProduct ? "Guardar Cambios" : "Crear Producto"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminProducts;
