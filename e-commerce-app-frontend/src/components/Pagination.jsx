import React from "react";
import { Pagination as BSPagination } from "react-bootstrap";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const items = [];
  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <BSPagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => onPageChange(number)}
      >
        {number}
      </BSPagination.Item>
    );
  }
  return <BSPagination>{items}</BSPagination>;
};

export default Pagination;
