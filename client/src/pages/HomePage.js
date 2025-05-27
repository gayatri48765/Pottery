import React, { useState, useEffect, useCallback } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import { productService } from "../api/productService";
import ProductFilters from "../components/ProductFilters";
import ProductList from "../components/ProductList";
import "../styles/Homepage.css";

const HomePage = () => {
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  const fetchInitialData = useCallback(async () => {
    try {
      const [categoriesData, totalCount] = await Promise.all([
        productService.getAllCategories(),
        productService.getProductCount()
      ]);
      setCategories(categoriesData);
      setTotal(totalCount);
    } catch (error) {
      toast.error("Failed to load initial data");
    }
  }, []);

  const fetchProducts = useCallback(async (pageNum = 1, filters = { checked, radio }) => {
    try {
      setLoading(true);
      
      if (filters.checked.length > 0 || filters.radio.length > 0) {
        const filteredProducts = await productService.getFilteredProducts(filters);
        setProducts(filteredProducts || []); 
        setIsFiltered(true);
      } else {
        const productsData = await productService.getProducts(pageNum);
        setProducts(prev => 
          pageNum === 1 ? productsData : [...prev, ...(productsData || [])]
        );
        setIsFiltered(false);
      }
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load products");
      setProducts([]); 
    } finally {
      setLoading(false);
    }
  }, [checked, radio]);

  // Initial load
  useEffect(() => {
    fetchInitialData();
    fetchProducts();
  }, []);

  useEffect(() => {
    setPage(1);
    fetchProducts(1);
  }, [checked, radio, fetchProducts]);

  useEffect(() => {
    if (page === 1 || isFiltered) return;
    fetchProducts(page);
  }, [page, isFiltered, fetchProducts]);

  const handleCategoryChange = (value, id) => {
    setChecked(prev => value ? [...prev, id] : prev.filter(c => c !== id));
  };

  const handlePriceChange = (value) => {
    setRadio(value);
  };

  const handleResetFilters = () => {
    setChecked([]);
    setRadio([]);
    setPage(1);
    setIsFiltered(false);
  };

  const handleAddToCart = (product) => {
    const newCart = [...cart, product];
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    toast.success("Item Added to cart");
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <Layout title={"All Products - Best offers"}>
      <img
        src="/images/banner.webp"
        className="banner-img"
        alt="banner"
        width={"100%"}
        loading="lazy"
      />
      
      <div className="home-page">
        <ProductFilters
          categories={categories}
          checked={checked}
          radio={radio}
          onCategoryChange={handleCategoryChange}
          onPriceChange={handlePriceChange}
          onResetFilters={handleResetFilters}
        />
        
        <ProductList
          products={products}
          total={isFiltered ? products.length : total}
          page={page}
          loading={loading}
          onLoadMore={handleLoadMore}
          onAddToCart={handleAddToCart}
          isFiltered={isFiltered}
        />
      </div>
    </Layout>
  );
};

export default HomePage;