import React from "react";
import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";
import { FaPaintRoller, FaFire } from "react-icons/fa";
import "../styles/Categories.css";
import { GiClayBrick } from "react-icons/gi";


const Categories = () => {
  const categories = useCategory();
  
  const categoryIcons = {
    "Pottery Wheels": <GiClayBrick />,
    "Glazes": <FaPaintRoller />,
    "Kilns": <FaFire />,
  };

  return (
    <Layout title={"Our Pottery Categories"}>
      <div className="categories-container">
        <div className="categories-header">
          <h1>Explore Our Pottery Collection</h1>
          <p>Discover handcrafted ceramics for every style and purpose</p>
        </div>
        
        <div className="categories-grid">
          {categories.map((c) => (
            <div className="category-card" key={c._id}>
              <Link to={`/category/${c.slug}`} className="category-link">
                <div className="category-icon">
                  {categoryIcons[c.name] || <GiClayBrick />}
                </div>
                <h3>{c.name}</h3>
                <div className="category-hover-effect"></div>
              </Link>
            </div>
          ))}
        </div>
        
        {localStorage.getItem("auth") && (
          <div className="admin-actions">
            <Link to="/admin/add-category" className="add-category-btn">
              + Add New Category
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Categories;