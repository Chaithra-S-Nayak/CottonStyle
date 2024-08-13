import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";
import Loader from "../../Layout/Loader";

const FeaturedProduct = () => {
  const { allProducts, isLoading: productsLoading } = useSelector(
    (state) => state.products
  );
  const [isLoading, setIsLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    if (productsLoading) {
      setIsLoading(true);
    } else {
      const products = allProducts ? allProducts.slice(0, 15) : [];
      setFeaturedProducts(products);
      setIsLoading(false);
    }
  }, [allProducts, productsLoading]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div className={`${styles.section}`}>
            <div className={`${styles.heading} mt-5`}>Featured Products</div>
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
              {featuredProducts.length !== 0 &&
                featuredProducts.map((i, index) => (
                  <ProductCard data={i} key={index} />
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeaturedProduct;
