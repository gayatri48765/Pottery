import axios from "axios";

const API_BASE = "/api/v1";

export const productService = {
  getAllCategories: async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/category/get-category`);
      return data?.category || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  getProducts: async (page = 1) => {
    try {
      const { data } = await axios.get(`${API_BASE}/product/product-list/${page}`);
      return data?.products || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  getProductCount: async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/product/product-count`);
      return data?.total || 0;
    } catch (error) {
      console.error("Error fetching product count:", error);
      throw error;
    }
  },

  getFilteredProducts: async (filters) => {
    try {
      const { data } = await axios.post(`${API_BASE}/product/product-filters`, filters);
      return data?.products || [];
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      throw error;
    }
  },

  getProductPhoto: (productId) => `${API_BASE}/product/product-photo/${productId}`,

  getProductsByCategory: async (slug) => {
    try {
      const { data } = await axios.get(`${API_BASE}/product/product-category/${slug}`);
      return {
        products: data?.products || [],
        category: data?.category || null
      };
    } catch (error) {
      console.error("Error fetching products by category:", error);
      throw error;
    }
  },
  getProduct: async (slug) => {
    try {
      const { data } = await axios.get(`${API_BASE}/product/get-product/${slug}`);
      return data?.product || null;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  getRelatedProducts: async (productId, categoryId) => {
    try {
      const { data } = await axios.get(
        `${API_BASE}/product/related-product/${productId}/${categoryId}`
      );
      return data?.products || [];
    } catch (error) {
      console.error("Error fetching related products:", error);
      throw error;
    }
  },

};