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
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    if (!allProducts) return;

    let filteredProducts = [...allProducts];

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

    // Only update data state if the filtered result is different
    if (JSON.stringify(filteredProducts) !== JSON.stringify(data)) {
      setData(filteredProducts);
      setCurrentPage(1); // Reset to first page when filters change
    }
  }, [allProducts, filters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = data.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(data.length / productsPerPage);

  const handleFilterChange = (newFilters) => {
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
          <div className={`${styles.section} flex flex-col md:flex-row`}>
            <div className="w-full md:w-1/4 p-4 md:border-r border-r-0">
              <Filters onFilterChange={handleFilterChange} />
            </div>
            <div className="w-full md:w-3/4 p-4">
              <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-2 sm:gap-[15px] md:grid-cols-3 md:gap-[20px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-4 xl:gap-[30px] mb-12">
                {currentProducts && currentProducts.length > 0 ? (
                  currentProducts.map((product, index) => (
                    <ProductCard key={index} data={product} />
                  ))
                ) : (
                  <h1 className="text-center w-full pb-[100px] text-[20px]">
                    No products Found!
                  </h1>
                )}
              </div>
              <div className="flex justify-center m-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 mx-1 bg-gray-300 rounded"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 mx-1 ${
                      currentPage === index + 1
                        ? "bg-[#243450] text-white"
                        : "bg-gray-300"
                    } rounded`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 mx-1 bg-gray-300 rounded"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default ProductsPage;
