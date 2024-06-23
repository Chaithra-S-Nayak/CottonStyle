import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import Filters from "../components/Layout/Filters";
import styles from "../styles/styles";

const ProductsPage = () => {
  const { allProducts, isLoading } = useSelector((state) => state.products);

  const [filters, setFilters] = useState({
    price: { min: "", max: "" },
    ratings: { min: "", max: "" },
    sizes: [],
    colors: [],
    fabrics: [],
    mostSold: false,
    inStock: false,
  });

  const [data, setData] = useState([]);

  useEffect(() => {
    if (!allProducts) return;

    let filteredProducts = [...allProducts];

    // console.log("All Products:", allProducts);
    // console.log("Current Filters:", filters);

    if (filters.price.min !== "") {
      const minPrice = parseFloat(filters.price.min);
      filteredProducts = filteredProducts.filter(
        (product) => product.discountPrice >= minPrice
      );
    }

    if (filters.price.max !== "") {
      const maxPrice = parseFloat(filters.price.max);
      filteredProducts = filteredProducts.filter(
        (product) => product.discountPrice <= maxPrice
      );
    }

    if (filters.ratings.min !== "") {
      const minRatings = parseFloat(filters.ratings.min);
      filteredProducts = filteredProducts.filter(
        (product) => product.ratings >= minRatings
      );
    }

    if (filters.ratings.max !== "") {
      const maxRatings = parseFloat(filters.ratings.max);
      filteredProducts = filteredProducts.filter(
        (product) => product.ratings <= maxRatings
      );
    }

    if (filters.sizes.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        product.availableSizes.some((size) => filters.sizes.includes(size))
      );
    }

    if (filters.colors.length > 0) {
      filteredProducts = filteredProducts.filter(
        (product) => product.color && filters.colors.includes(product.color)
      );
    }

    if (filters.fabrics.length > 0) {
      filteredProducts = filteredProducts.filter(
        (product) => product.fabric && filters.fabrics.includes(product.fabric)
      );
    }

    if (filters.mostSold) {
      filteredProducts = filteredProducts.sort(
        (a, b) => (b.sold_out || 0) - (a.sold_out || 0)
      );
    }

    if (filters.inStock) {
      filteredProducts = filteredProducts.filter(
        (product) => product.stock > 0
      );
    }

    // console.log("Filtered Products:", filteredProducts);
    setData(filteredProducts);
  }, [allProducts, filters]);

  const handleFilterChange = (newFilters) => {
    // console.log("New Filters Received:", newFilters);
    setFilters(newFilters);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={3} />
          <br />
          <br />
          <div className={`${styles.section}`}>
            <Filters onFilterChange={handleFilterChange} />
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
              {data && data.length > 0 ? (
                data.map((product, index) => (
                  <ProductCard key={index} data={product} />
                ))
              ) : (
                <h1 className="text-center w-full pb-[100px] text-[20px]">
                  No products Found!
                </h1>
              )}
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default ProductsPage;
