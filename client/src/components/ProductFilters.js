import React from "react";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";

const ProductFilters = ({
  categories,
  checked,
  radio,
  onCategoryChange,
  onPriceChange,
  onResetFilters
}) => {
  return (
    <div className="filters">
      <h6>Filter By Category</h6>
      <div className="filter-content">
        {categories.map(c => (
          <Checkbox
            key={c._id}
            onChange={(e) => onCategoryChange(e.target.checked, c._id)}
            checked={checked.includes(c._id)}
          >
            {c.name}
          </Checkbox>
        ))}
      </div>
      
      <h6 className="mt-4">Filter By Price</h6>
      <div className="filter-content">
        <Radio.Group 
          onChange={(e) => onPriceChange(e.target.value)}
          value={radio}
        >
          {Prices.map(p => (
            <Radio key={p._id} value={p.array}>
              {p.name}
            </Radio>
          ))}
        </Radio.Group>
      </div>
      
      <div className="filter-content">
        <button onClick={onResetFilters} className="reset-btn">
          RESET FILTERS
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;