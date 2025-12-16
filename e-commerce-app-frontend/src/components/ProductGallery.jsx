import React, { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import { getProducts } from "../services/productService.js";
import "react-image-gallery/styles/css/image-gallery.css";

const ProductGallery = ({ limit = 6, autoPlay = true, interval = 5000 }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getProducts({ limit });
        const slides = res.products.map((p, i) => ({
          original: p.images[0] || `https://dummyimage.com/200x120/ccc/000&text=NoImage`,
          thumbnail: p.images[0] || `https://dummyimage.com/200x120/ccc/000&text=NoImage`,
          description: (
            <div>
              <strong>{p.name}</strong>
              <br />
              <span>${p.price?.toFixed(2) || "Sin precio"}</span>
            </div>
          ),
        }));
        setItems(slides);
      } catch (err) {
        console.error("Error al cargar productos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [limit]);

  if (loading) return <p className="text-center my-4">Cargando galería...</p>;

  return (
    <div className="my-4">
      <ImageGallery
        items={items}
        showPlayButton={true}
        showFullscreenButton={true}
        autoPlay={autoPlay}
        slideInterval={interval}
        showBullets={true}
        showThumbnails={true}
        showNav={true}
        isRTL={true}
        slideOnThumbnailOver={true}
        useBrowserFullscreen={true}
        infinite={true}
        thumbnailPosition="left"
        additionalClass="image-gallery-vertical"
      />
    </div>
  );
};

export default ProductGallery;
