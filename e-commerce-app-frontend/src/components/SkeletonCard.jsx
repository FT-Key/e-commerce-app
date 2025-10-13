import React from "react";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import { Card } from "react-bootstrap";

const SkeletonCard = () => {
  return (
    <Card className="h-100">
      <Card.Body>
        <Skeleton height={20} width={`80%`} />
        <Skeleton count={2} />
        <Skeleton height={30} width={`50%`} />
      </Card.Body>
    </Card>
  );
};

export default SkeletonCard;
