import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { productService } from "../api/productService";
import "../styles/CategoryProductStyles.css";
import { FaArrowLeft, FaSearch, FaSpinner } from "react-icons/fa";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params?.slug) {
      fetchProductsByCategory();
    }
  }, [params?.slug]);

  const fetchProductsByCategory = async () => {
    try {
      setLoading(true);
      const { products, category } = await productService.getProductsByCategory(params.slug);
      setProducts(products);
      setCategory(category);
    } catch (error) {
      console.error("Failed to load category products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="category-loading">
          <FaSpinner className="spinner-icon" />
          <p>Loading pottery collection...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="category-container">
        <button onClick={() => navigate(-1)} className="back-button">
          <FaArrowLeft /> Back to Categories
        </button>

        {category ? (
          <div className="category-header">
            <h1>{category.name}</h1>
            <p className="product-count">{products.length} handcrafted {products.length !== 1 ? 'pieces' : 'piece'} available</p>
          </div>
        ) : (
          <h4 className="text-center">Loading Category...</h4>
        )}

        {products.length === 0 && !loading ? (
          <div className="empty-category">
            <FaSearch className="search-icon" />
            <h3>No pottery found in this category</h3>
            <p>Our artisans haven't created pieces for this category yet.</p>
            <button 
              className="browse-button"
              onClick={() => navigate('/categories')}
            >
              Explore Other Categories
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((p) => (
              <div className="product-card" key={p._id}>
                <div className="product-image-container">
                  <img
                    src={productService.getProductPhoto(p._id)}
                    className="product-image"
                    alt={p.name}
                    loading="lazy"
                  />
                  <div className="product-overlay">
                    <button
                      className="view-details-button"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{p.name}</h3>
                  <p className="product-description">
                    {p.description.substring(0, 60)}...
                  </p>
                  <div className="product-footer">
                    <span className="product-price">
                      {p.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                    <button
                      className="quick-view-button"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      Quick View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryProduct;