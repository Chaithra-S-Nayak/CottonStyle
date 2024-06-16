import React, { useState, useEffect } from "react";

const Filters = ({ onFilterChange }) => {
  const [price, setPrice] = useState({ min: "", max: "" });
  const [ratings, setRatings] = useState({ min: "", max: "" });
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [mostSold, setMostSold] = useState(false);
  const [inStock, setInStock] = useState(false);

  const [visibleSizeCount, setVisibleSizeCount] = useState(4);
  const [visibleColorCount, setVisibleColorCount] = useState(4);
  const [visibleFabricCount, setVisibleFabricCount] = useState(4);

  useEffect(() => {
    handleFiltersChange();
  }, [price, ratings, sizes, colors, fabrics, mostSold, inStock]);

  const handleFiltersChange = () => {
    onFilterChange({
      price: price || { min: "", max: "" },
      ratings: ratings || { min: "", max: "" },
      sizes,
      colors,
      fabrics,
      mostSold,
      inStock,
    });
  };

  const handleCheckboxChange = (setter, value) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleShowMoreSizes = () => {
    setVisibleSizeCount((prev) => prev + 4);
  };

  const handleShowMoreColors = () => {
    setVisibleColorCount((prev) => prev + 4);
  };

  const handleShowMoreFabrics = () => {
    setVisibleFabricCount((prev) => prev + 4);
  };

  const sizeOptions = ["XS", "S", "M", "L", "XL"];
  const colorOptions = ["Red", "Blue", "Green", "Black", "White"];
  const fabricOptions = ["Cotton", "Polyester", "Silk"];

  return (
    <div className="flex flex-wrap justify-around items-start py-4">
      <div className="flex flex-col m-2">
        <label className="font-semibold mb-1">Price</label>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={price.min}
            onChange={(e) => setPrice({ ...price, min: e.target.value })}
            className="border rounded p-2"
          />
          <input
            type="number"
            placeholder="Max"
            value={price.max}
            onChange={(e) => setPrice({ ...price, max: e.target.value })}
            className="border rounded p-2"
          />
        </div>
      </div>
      <div className="flex flex-col m-2">
        <label className="font-semibold mb-1">Ratings</label>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={ratings.min}
            onChange={(e) => setRatings({ ...ratings, min: e.target.value })}
            className="border rounded p-2"
          />
          <input
            type="number"
            placeholder="Max"
            value={ratings.max}
            onChange={(e) => setRatings({ ...ratings, max: e.target.value })}
            className="border rounded p-2"
          />
        </div>
      </div>
      <div className="flex flex-col m-2">
        <label className="font-semibold mb-1">Size</label>
        <div className="overflow-hidden">
          {sizeOptions.slice(0, visibleSizeCount).map((size, index) => (
            <div key={index} className="flex items-center">
              <input
                type="checkbox"
                checked={sizes.includes(size)}
                onChange={() => handleCheckboxChange(setSizes, size)}
                className="mr-2"
              />
              <label>{size}</label>
            </div>
          ))}
          {sizeOptions.length > visibleSizeCount && (
            <button onClick={handleShowMoreSizes} className="text-blue-600">
              Show more
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col m-2">
        <label className="font-semibold mb-1">Color</label>
        <div className="overflow-hidden">
          {colorOptions.slice(0, visibleColorCount).map((color, index) => (
            <div key={index} className="flex items-center">
              <input
                type="checkbox"
                checked={colors.includes(color)}
                onChange={() => handleCheckboxChange(setColors, color)}
                className="mr-2"
              />
              <label>{color}</label>
            </div>
          ))}
          {colorOptions.length > visibleColorCount && (
            <button onClick={handleShowMoreColors} className="text-blue-600">
              Show more
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col m-2">
        <label className="font-semibold mb-1">Fabric</label>
        <div className="overflow-hidden">
          {fabricOptions.slice(0, visibleFabricCount).map((fabric, index) => (
            <div key={index} className="flex items-center">
              <input
                type="checkbox"
                checked={fabrics.includes(fabric)}
                onChange={() => handleCheckboxChange(setFabrics, fabric)}
                className="mr-2"
              />
              <label>{fabric}</label>
            </div>
          ))}
          {fabricOptions.length > visibleFabricCount && (
            <button onClick={handleShowMoreFabrics} className="text-blue-600">
              Show more
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center m-2">
        <label className="font-semibold mr-2">Most Sold</label>
        <input
          type="checkbox"
          checked={mostSold}
          onChange={(e) => setMostSold(e.target.checked)}
          className="h-5 w-5 text-blue-600"
        />
      </div>
      <div className="flex items-center m-2">
        <label className="font-semibold mr-2">In Stock</label>
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => setInStock(e.target.checked)}
          className="h-5 w-5 text-blue-600"
        />
      </div>
      <div className="border-t-2 pt-4 mt-4 w-full"></div>
    </div>
  );
};

export default Filters;
