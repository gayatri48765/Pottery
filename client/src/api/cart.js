import axios from "axios";

const API_BASE = "/api/v1/product/braintree";

export const paymentService = {
  getClientToken: async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/token`);
      return data?.clientToken || "";
    } catch (error) {
      console.error("Error fetching client token:", error);
      throw error;
    }
  },

  processPayment: async (paymentData) => {
    try {
      const { data } = await axios.post(`${API_BASE}/payment`, paymentData);
      return data;
    } catch (error) {
      console.error("Payment processing failed:", error);
      throw error;
    }
  },

  getProductPhoto: (productId) => `/api/v1/product/product-photo/${productId}`,
};