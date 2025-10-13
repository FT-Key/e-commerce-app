import React from "react";
import { Form } from "react-bootstrap";

const Filter = ({ onChange }) => {
  return (
    <Form className="mb-3">
      <Form.Control type="text" placeholder="Buscar..." onChange={onChange} />
    </Form>
  );
};

export default Filter;
