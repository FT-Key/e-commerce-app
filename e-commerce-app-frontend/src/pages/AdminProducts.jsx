import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Spinner,
  Modal,
  Form,
  InputGroup,
  Badge,
} from "react-bootstrap";
import {
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
} from "../services/productService.js";
import { handleResponse, handleError } from "../utils/response.js";
import { FaPlus, FaEdit, FaTrash, FaImage, FaCheck, FaTimes } from "react-icons/fa";
import "./AdminPanel.css";

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
    <Container className="admin-container my-5">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-title-section">
          <h1 className="admin-title">Administrar Productos</h1>
          <p className="admin-subtitle">Gestiona el catálogo de productos de tu tienda</p>
        </div>
        <Button className="admin-create-btn" onClick={() => handleShowModal()}>
          <FaPlus className="me-2" />
          Crear Producto
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="admin-loading">
          <Spinner animation="border" className="admin-spinner" />
          <p>Cargando productos...</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <Table className="admin-table" responsive hover>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="product-cell">
                      {p.images?.length ? (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="product-thumb"
                        />
                      ) : (
                        <div className="product-thumb-placeholder">
                          <FaImage />
                        </div>
                      )}
                      <div className="product-info-cell">
                        <span className="product-name">{p.name}</span>
                        <span className="product-id">ID: {p._id.slice(-8)}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="product-price">${p.price.toFixed(2)}</span>
                  </td>
                  <td>
                    <Badge 
                      bg={p.stock < 5 ? "danger" : p.stock < 20 ? "warning" : "success"}
                      className="stock-badge-admin"
                    >
                      {p.stock} unidades
                    </Badge>
                  </td>
                  <td>
                    <span className="category-tag">{p.category || "Sin categoría"}</span>
                  </td>
                  <td>
                    <Badge bg={p.isActive ? "success" : "secondary"} className="status-badge">
                      {p.isActive ? <><FaCheck className="me-1" /> Activo</> : <><FaTimes className="me-1" /> Inactivo</>}
                    </Badge>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Button
                        className="admin-btn-edit"
                        size="sm"
                        onClick={() => handleShowModal(p)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        className="admin-btn-delete"
                        size="sm"
                        onClick={() => handleDelete(p._id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {products.length === 0 && (
            <div className="admin-empty-state">
              <FaImage className="empty-icon" />
              <h3>No hay productos</h3>
              <p>Comienza creando tu primer producto</p>
              <Button className="admin-create-btn" onClick={() => handleShowModal()}>
                <FaPlus className="me-2" />
                Crear Producto
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Modal crear/editar */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" className="admin-modal">
        <Modal.Header closeButton className="admin-modal-header">
          <Modal.Title>
            {editingProduct ? "✏️ Editar Producto" : "➕ Crear Producto"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="admin-modal-body">
          <Form onSubmit={handleSubmit} className="admin-form">
            <Form.Group className="mb-3">
              <Form.Label className="admin-label">Nombre del Producto</Form.Label>
              <Form.Control
                className="admin-input"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Laptop Gaming Pro"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="admin-label">Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                className="admin-textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe las características del producto..."
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="admin-label">Precio ($)</Form.Label>
                  <Form.Control
                    type="number"
                    className="admin-input"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min={0}
                    step="0.01"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="admin-label">Stock</Form.Label>
                  <Form.Control
                    type="number"
                    className="admin-input"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min={0}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label className="admin-label">Categoría</Form.Label>
              <Form.Control
                className="admin-input"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Ej: Electrónica, Ropa, Hogar..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="admin-label">
                <FaImage className="me-2" />
                Imágenes (URLs)
              </Form.Label>
              {formData.images.map((img, index) => (
                <InputGroup className="mb-2 admin-image-input" key={index}>
                  <Form.Control
                    type="url"
                    className="admin-input"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    value={img}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                  />
                  <Button
                    className="admin-remove-img-btn"
                    onClick={() => removeImageField(index)}
                    disabled={formData.images.length === 1}
                  >
                    <FaTimes />
                  </Button>
                </InputGroup>
              ))}
              <Button className="admin-add-img-btn" size="sm" onClick={addImageField}>
                <FaPlus className="me-2" />
                Agregar imagen
              </Button>
            </Form.Group>

            <Form.Group className="mb-4" controlId="isActive">
              <Form.Check
                type="switch"
                className="admin-switch"
                label="Producto activo (visible en la tienda)"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="admin-modal-actions">
              <Button className="admin-btn-cancel" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button type="submit" className="admin-btn-submit">
                {editingProduct ? "💾 Guardar Cambios" : "✨ Crear Producto"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminProducts;