import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import {productService} from "../api/productService";
import "../styles/ProductDetailsStyles.css";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params?.slug) {
      fetchProductData();
    }
  }, [params?.slug]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const productData = await productService.getProduct(params.slug);
      setProduct(productData);
      
      if (productData) {
        const related = await productService.getRelatedProducts(
          productData._id,
          productData.category._id
        );
        setRelatedProducts(related);
      }
    } catch (error) {
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    const newCart = [...cart, product];
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    toast.success("Item Added to cart");
  };

  if (loading) {
    return (
      <Layout>
        <div className="container text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container text-center py-5">
          <h4>Product not found</h4>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container product-details">
        <div className="product-details-container">
          <div className="product-details-img">
            <img
              src={productService.getProductPhoto(product._id)}
              className="card-img-top"
              alt={product.name}
              loading="lazy"
            />
          </div>
          
          <div className="product-details-info">
            <h1 className="prod-name">{product.name}</h1>
            <p className="prod-desc">{product.description}</p>
            <div className="price-section">
              <span className="prod-price">
                {product.price?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
              <button 
                className="addtoCart" 
                onClick={handleAddToCart}
                aria-label={`Add ${product.name} to cart`}
              >
                ADD TO CART
              </button>
            </div>
          </div>
        </div>

        <hr className="divider" />

        <div className="similar-products">
          <h3>Similar Products</h3>
          
          {relatedProducts.length === 0 ? (
            <p className="no-products">No similar products found</p>
          ) : (
            <div className="product-grid">
              {relatedProducts.map((p) => (
                <div 
                  className="product-card"
                  key={p._id}
                  onClick={() => navigate(`/product/${p.slug}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/product/${p.slug}`)}
                  aria-label={`View ${p.name} details`}
                >
                  <img
                    src={productService.getProductPhoto(p._id)}
                    className="card-img"
                    alt={p.name}
                    loading="lazy"
                  />
                  <div className="card-body">
                    <div className="card-name-price">
                      <h5 className="card-title">{p.name}</h5>
                      <h5 className="card-price">
                        {p.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </h5>
                    </div>
                    <p className="card-text">
                      {p.description.substring(0, 60)}...
                    </p>
                    <div className="card-arrow">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;