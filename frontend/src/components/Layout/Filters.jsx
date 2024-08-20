import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminOptions } from "../../redux/actions/adminOptions";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";

const Filters = ({ onFilterChange }) => {
  const dispatch = useDispatch();
  const { adminOptions } = useSelector((state) => state.adminOptions);
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
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const handleFiltersChange = useCallback(() => {
    onFilterChange({
      price: price || { min: "", max: "" },
      ratings: ratings || { min: "", max: "" },
      sizes,
      colors,
      fabrics,
      mostSold,
      inStock,
    });
  }, [
    onFilterChange,
    price,
    ratings,
    sizes,
    colors,
    fabrics,
    mostSold,
    inStock,
  ]);

  useEffect(() => {
    dispatch(fetchAdminOptions());
  }, [dispatch]);

  useEffect(() => {
    handleFiltersChange();
  }, [handleFiltersChange]);

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

  return (
    <div className="w-full">
      <button
        className={`${styles.simpleButton} md:hidden`}
        onClick={() => setIsFilterModalVisible(!isFilterModalVisible)}
        variant="outlined"
      >
        Filters
      </button>
      {/* Filters Modal for Mobile */}
      {isFilterModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 md:hidden">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-md mx-auto max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Filters</h2>
              <RxCross1
                onClick={() => setIsFilterModalVisible(false)}
              ></RxCross1>
            </div>
            <div className="flex flex-col space-y-4">
              {/* Price Filter */}
              <div className="flex flex-col">
                <label className={`${styles.formLabel}`}>Price</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={price.min}
                    onChange={(e) =>
                      setPrice({ ...price, min: e.target.value })
                    }
                    className={`${styles.formInput}`}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={price.max}
                    onChange={(e) =>
                      setPrice({ ...price, max: e.target.value })
                    }
                    className={`${styles.formInput}`}
                  />
                </div>
              </div>
              {/* Ratings Filter */}
              <div className="flex flex-col">
                <label className={`${styles.formLabel}`}>Ratings</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={ratings.min}
                    onChange={(e) =>
                      setRatings({ ...ratings, min: e.target.value })
                    }
                    className={`${styles.formInput}`}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={ratings.max}
                    onChange={(e) =>
                      setRatings({ ...ratings, max: e.target.value })
                    }
                    className={`${styles.formInput}`}
                  />
                </div>
              </div>
              {/* Size Filter */}
              <div className="flex flex-col">
                <label className={`${styles.formLabel}`}>Size</label>
                <div className="overflow-hidden">
                  {adminOptions.sizeChart
                    ?.slice(0, visibleSizeCount)
                    .map((sizeObj) => (
                      <div
                        key={sizeObj.size}
                        className={`${styles.noramlFlex}`}
                      >
                        <input
                          type="checkbox"
                          checked={sizes.includes(sizeObj.size)}
                          onChange={() =>
                            handleCheckboxChange(setSizes, sizeObj.size)
                          }
                          className="mr-2"
                        />
                        <label>{sizeObj.size}</label>
                      </div>
                    ))}
                  {adminOptions.sizeChart?.length > visibleSizeCount && (
                    <button
                      onClick={handleShowMoreSizes}
                      className="text-blue-600"
                    >
                      Show more
                    </button>
                  )}
                </div>
              </div>
              {/* Color Filter */}
              <div className="flex flex-col">
                <label className={`${styles.formLabel}`}>Color</label>
                <div className="overflow-hidden">
                  {adminOptions.color
                    ?.slice(0, visibleColorCount)
                    .map((color, index) => (
                      <div key={index} className={`${styles.noramlFlex}`}>
                        <input
                          type="checkbox"
                          checked={colors.includes(color)}
                          onChange={() =>
                            handleCheckboxChange(setColors, color)
                          }
                          className="mr-2"
                        />
                        <label>{color}</label>
                      </div>
                    ))}
                  {adminOptions.color?.length > visibleColorCount && (
                    <button
                      onClick={handleShowMoreColors}
                      className="text-blue-600"
                    >
                      Show more
                    </button>
                  )}
                </div>
              </div>
              {/* Fabric Filter */}
              <div className="flex flex-col">
                <label className={`${styles.formLabel}`}>Fabric</label>
                <div className="overflow-hidden">
                  {adminOptions.fabric
                    ?.slice(0, visibleFabricCount)
                    .map((fabric, index) => (
                      <div key={index} className={`${styles.noramlFlex}`}>
                        <input
                          type="checkbox"
                          checked={fabrics.includes(fabric)}
                          onChange={() =>
                            handleCheckboxChange(setFabrics, fabric)
                          }
                          className="mr-2"
                        />
                        <label>{fabric}</label>
                      </div>
                    ))}
                  {adminOptions.fabric?.length > visibleFabricCount && (
                    <button
                      onClick={handleShowMoreFabrics}
                      className="text-blue-600"
                    >
                      Show more
                    </button>
                  )}
                </div>
              </div>
              {/* Most Sold Filter */}
              <div className={`${styles.noramlFlex}`}>
                <label className="font-semibold mr-2">Most Sold</label>
                <input
                  type="checkbox"
                  checked={mostSold}
                  onChange={(e) => setMostSold(e.target.checked)}
                  className="h-5 w-5 text-blue-600"
                />
              </div>
              {/* In Stock Filter */}
              <div className={`${styles.noramlFlex}`}>
                <label className="font-semibold mr-2">In Stock</label>
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="h-5 w-5 text-blue-600"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Version of Filters */}
      <div className="hidden md:flex flex-wrap justify-around items-start">
        <div className="flex flex-col m-2">
          <label className={`${styles.formLabel}`}>Price</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={price.min}
              onChange={(e) => setPrice({ ...price, min: e.target.value })}
              className={`${styles.formInput}`}
            />
            <input
              type="number"
              placeholder="Max"
              value={price.max}
              onChange={(e) => setPrice({ ...price, max: e.target.value })}
              className={`${styles.formInput}`}
            />
          </div>
        </div>
        <div className="flex flex-col m-2">
          <label className={`${styles.formLabel}`}>Ratings</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={ratings.min}
              onChange={(e) => setRatings({ ...ratings, min: e.target.value })}
              className={`${styles.formInput}`}
            />
            <input
              type="number"
              placeholder="Max"
              value={ratings.max}
              onChange={(e) => setRatings({ ...ratings, max: e.target.value })}
              className={`${styles.formInput}`}
            />
          </div>
        </div>
        <div className="flex flex-col m-2">
          <label className={`${styles.formLabel}`}>Size</label>
          <div className="overflow-hidden">
            {adminOptions.sizeChart
              ?.slice(0, visibleSizeCount)
              .map((sizeObj) => (
                <div key={sizeObj.size} className={`${styles.noramlFlex}`}>
                  <input
                    type="checkbox"
                    checked={sizes.includes(sizeObj.size)}
                    onChange={() =>
                      handleCheckboxChange(setSizes, sizeObj.size)
                    }
                    className="mr-2"
                  />
                  <label>{sizeObj.size}</label>
                </div>
              ))}
            {adminOptions.sizeChart?.length > visibleSizeCount && (
              <button onClick={handleShowMoreSizes} className="text-blue-600">
                Show more
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col m-2">
          <label className={`${styles.formLabel}`}>Color</label>
          <div className="overflow-hidden">
            {adminOptions.color
              ?.slice(0, visibleColorCount)
              .map((color, index) => (
                <div key={index} className={`${styles.noramlFlex}`}>
                  <input
                    type="checkbox"
                    checked={colors.includes(color)}
                    onChange={() => handleCheckboxChange(setColors, color)}
                    className="mr-2"
                  />
                  <label>{color}</label>
                </div>
              ))}
            {adminOptions.color?.length > visibleColorCount && (
              <button onClick={handleShowMoreColors} className="text-blue-600">
                Show more
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col m-2">
          <label className={`${styles.formLabel}`}>Fabric</label>
          <div className="overflow-hidden">
            {adminOptions.fabric
              ?.slice(0, visibleFabricCount)
              .map((fabric, index) => (
                <div key={index} className={`${styles.noramlFlex}`}>
                  <input
                    type="checkbox"
                    checked={fabrics.includes(fabric)}
                    onChange={() => handleCheckboxChange(setFabrics, fabric)}
                    className="mr-2"
                  />
                  <label>{fabric}</label>
                </div>
              ))}
            {adminOptions.fabric?.length > visibleFabricCount && (
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
      </div>
    </div>
  );
};

export default Filters;
