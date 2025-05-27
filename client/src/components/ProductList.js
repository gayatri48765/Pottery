import React from "react";
import { AiOutlineReload } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import { productService } from "../api/productService";

const ProductList = ({
  products,
  total,
  page,
  loading,
  onLoadMore,
  onAddToCart,
  isFiltered
}) => {
  const navigate = useNavigate();
  const [cart] = useCart();

  return (
    <div className="product-list">
      <h1 className="text-center">All Products</h1>
      
      <div className="product-content">
        {products.length === 0 && !loading ? (
          <div className="no-products">
            {isFiltered ? (
              <p>No products match your filters. Try adjusting your criteria.</p>
            ) : (
              <p>No products available at the moment.</p>
            )}
          </div>
        ) : (
          products.map(p => (
            <div 
              key={p._id} 
              className="card"
              onClick={() => navigate(`/product/${p.slug}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/product/${p.slug}`)}
            >
              <img
                src={productService.getProductPhoto(p._id)}
                className="card-img-top"
                alt={p.name}
                loading="lazy"
              />
              <div className="card-body">
                <div className="card-name-price">
                  <h6 className="card-title">{p.name}</h6>
                  <h6 className="card-title card-price">
                    {p.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </h6>
                  <h6 className="card-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12px" viewBox="0 0 448 512">
                      <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
                    </svg>
                  </h6>
                </div>
                <p className="card-text">
                  {p.description.substring(0, 60)}...
                </p>
                <button
                  className="addtoCart home"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(p);
                  }}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {products.length > 0 && products.length < total && !isFiltered && (
        <button
          className="btn loadmore"
          onClick={onLoadMore}
          disabled={loading}
        >
          {loading ? "Loading..." : (
            <>
              Load more <AiOutlineReload />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default ProductList;