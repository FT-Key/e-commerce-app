import React, { useEffect, useState } from "react";
import { Container, Table, Button, Spinner, Badge } from "react-bootstrap";
import clientAxios from "../utils/clientAxios.js";
import { handleResponse, handleError } from "../utils/response.js";
import { useStore } from "../store/useStore.js";
import { FaUserShield, FaUser, FaExchangeAlt, FaTrash, FaCrown, FaCheck } from "react-icons/fa";
import "./AdminPanel.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useStore((state) => state.user);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await clientAxios.get("/users");
      handleResponse(res);
      setUsers(res.data.users || res.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (userId, newRole) => {
    try {
      const res = await clientAxios.put(`/users/${userId}/role`, { role: newRole });
      handleResponse(res);
      fetchUsers();
    } catch (error) {
      handleError(error);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;
    try {
      const res = await clientAxios.delete(`/users/${userId}`);
      handleResponse(res);
      fetchUsers();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Container className="admin-container my-5">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-title-section">
          <h1 className="admin-title">Administrar Usuarios</h1>
          <p className="admin-subtitle">Gestiona roles y permisos de los usuarios</p>
        </div>
        <Badge className="users-count-badge">
          {users.length} {users.length === 1 ? "usuario" : "usuarios"}
        </Badge>
      </div>

      {/* Content */}
      {loading ? (
        <div className="admin-loading">
          <Spinner animation="border" className="admin-spinner" />
          <p>Cargando usuarios...</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <Table className="admin-table" responsive hover>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isCurrentUser = currentUser && user._id === currentUser._id;

                return (
                  <tr key={user._id} className={isCurrentUser ? "current-user-row" : ""}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          {user.role === "admin" ? <FaUserShield /> : <FaUser />}
                        </div>
                        <div className="user-info-cell">
                          <span className="user-name">
                            {user.name}
                            {isCurrentUser && <span className="you-badge">Tú</span>}
                          </span>
                          <span className="user-id">ID: {user._id.slice(-8)}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="user-email">{user.email}</span>
                    </td>
                    <td>
                      <Badge
                        bg={user.role === "admin" ? "primary" : "secondary"}
                        className="role-badge"
                      >
                        {user.role === "admin" ? (
                          <>
                            <FaCrown className="me-1" /> Admin
                          </>
                        ) : (
                          <>
                            <FaUser className="me-1" /> Usuario
                          </>
                        )}
                      </Badge>
                    </td>
                    <td>
                      {isCurrentUser ? (
                        <Badge bg="info" className="status-badge">
                          Tu cuenta
                        </Badge>
                      ) : (
                        <Badge bg="success" className="status-badge">
                          Activo
                        </Badge>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        {!isCurrentUser ? (
                          <>
                            <Button
                              className="admin-btn-role"
                              size="sm"
                              onClick={() =>
                                changeRole(user._id, user.role === "admin" ? "user" : "admin")
                              }
                              title="Cambiar rol"
                            >
                              <FaExchangeAlt />
                            </Button>
                            <Button
                              className="admin-btn-delete"
                              size="sm"
                              onClick={() => deleteUser(user._id)}
                              title="Eliminar usuario"
                            >
                              <FaTrash />
                            </Button>
                          </>
                        ) : (
                          <span className="current-user-text">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          {users.length === 0 && (
            <div className="admin-empty-state">
              <FaUser className="empty-icon" />
              <h3>No hay usuarios registrados</h3>
              <p>Los usuarios aparecerán aquí cuando se registren</p>
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

export default AdminUsers;