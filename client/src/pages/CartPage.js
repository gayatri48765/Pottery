import React, { useState, useEffect, useCallback } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import { AiFillWarning } from "react-icons/ai";
import toast from "react-hot-toast";
import { paymentService } from "../api/cart";
import "../styles/CartStyles.css";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  // const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const totalPrice = useCallback(() => {
    if (!Array.isArray(cart)) return "$0.00";
    return cart.reduce((total, item) => total + (item?.price || 0), 0).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }, [cart]);

  const removeCartItem = (pid) => {
    try {
      if (!Array.isArray(cart)) {
        setCart([]);
        return;
      }
      const newCart = cart.filter(item => item?._id !== pid);
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error("Failed to remove item");
      console.error(err);
    }
  };

  // const getToken = useCallback(async () => {
  //   if (!auth?.token) return;
    
  //   try {
  //     const token = await paymentService.getClientToken();
  //     setClientToken(token);
  //     setError(null);
  //   } catch (error) {
  //     setError("Failed to load payment gateway");
  //     toast.error("Failed to load payment gateway");
  //   }
  // }, [auth?.token]);

  // const handlePayment = async () => {
  //   if (!instance || !auth?.user?.address) return;

  //   try {
  //     setLoading(true);
  //     const { nonce } = await instance.requestPaymentMethod();
  //     await paymentService.processPayment({ nonce, cart });
      
  //     localStorage.removeItem("cart");
  //     setCart([]);
  //     navigate("/dashboard/user/orders");
  //     toast.success("Payment Completed Successfully");
  //   } catch (error) {
  //     setError("Payment failed. Please try again.");
  //     toast.error("Payment failed. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   getToken();
  // }, [getToken]);

  // Debugging logs
  useEffect(() => {
    console.log("Current cart state:", cart);
    console.log("Auth state:", auth);
    // console.log("Client token:", clientToken);
  }, [cart, auth]);

  return (
    <Layout>
      <div className="cart-page">
        <div className="cart-heading">Shopping Cart</div>
        
        {error && (
          <div className="error-message">
            <AiFillWarning /> {error}
          </div>
        )}

        <div className="container">
          <div className="cart-info">
            {!cart || cart.length === 0 ? (
              <div className="empty-cart">
                <h3>Your cart is empty</h3>
                <button 
                  className="continue-shopping"
                  onClick={() => navigate("/")}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="cart-prod">
                  {cart.map((p) => (
                    <div className="cart-prod-info" key={p._id}>
                      <div className="img">
                        <img
                          src={p.image || paymentService.getProductPhoto(p._id)}
                          alt={p.name || "Product image"}
                          width="40%"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = "/default-product-image.png";
                          }}
                        />
                      </div>
                      <div className="desc">
                        <p>{p.name || "Unnamed Product"}</p>
                        <p style={{ fontWeight: 'bold' }}>
                          ${(p.price || 0).toFixed(2)}
                        </p>
                      </div>
                      <div className="remove">
                        <button
                          className="remove-btn"
                          onClick={() => removeCartItem(p._id)}
                          aria-label={`Remove ${p.name} from cart`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <h2>Cart Summary</h2>
                  <p>Total | Checkout | Payment</p>
                  <hr />
                  <h4>Total: {totalPrice()}</h4>

                  {!auth?.token ? (
                    <div className="auth-required">
                      <AiFillWarning className="warning-icon" />
                      <button
                        className="login-btn"
                        onClick={() => navigate("/login", { state: "/cart" })}
                      >
                        Please Login to checkout
                      </button>
                    </div>
                  ) : !auth?.user?.address ? (
                    <div className="address-required">
                      <button
                        className="update-address-btn"
                        onClick={() => navigate("/dashboard/user/profile")}
                      >
                        Add Shipping Address
                      </button>
                    </div>
                  ) : (
                    <div className="current-address">
                      <h4>Current Address</h4>
                      <p>{auth.user.address || "No address provided"}</p>
                      <button
                        className="update-address-btn"
                        onClick={() => navigate("/dashboard/user/profile")}
                      >
                        Update Address
                      </button>
                    </div>
                  )}

                  {/* {clientToken && auth?.token && Array.isArray(cart) && cart.length > 0 && (
                    <div className="payment-section"> Failed to load payment gateway
                      <DropIn
                        options={{
                          authorization: clientToken,
                          paypal: { flow: "vault" },
                        }}
                        onInstance={(instance) => setInstance(instance)}
                      />

                      <button
                        className="payment-btn"
                        onClick={handlePayment}
                        disabled={loading || !instance || !auth?.user?.address}
                        aria-busy={loading}
                      >
                        {loading ? "Processing..." : "Make Payment"}
                      </button>
                    </div>
                  )} */}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;