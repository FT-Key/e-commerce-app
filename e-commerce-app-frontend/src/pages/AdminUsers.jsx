import React, { useEffect, useState } from "react";
import { Container, Table, Button, Spinner } from "react-bootstrap";
import clientAxios from "../utils/clientAxios.js";
import { handleResponse, handleError } from "../utils/response.js";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <Container className="my-5">
      <h2>Administrar Usuarios</h2>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() =>
                      changeRole(user._id, user.role === "admin" ? "user" : "admin")
                    }
                  >
                    Cambiar Rol
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => deleteUser(user._id)}>
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

export default AdminUsers;
