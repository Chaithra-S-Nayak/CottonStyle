import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";
import Loader from "../../Layout/Loader";

const BestSelling = () => {
  const [data, setData] = useState([]);
  const { allProducts, isLoading: productsLoading } = useSelector(
    (state) => state.products
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (productsLoading) {
      setIsLoading(true);
    } else {
      const allProductsData = allProducts ? [...allProducts] : [];
      const sortedData = allProductsData.sort(
        (a, b) => b.sold_out - a.sold_out
      );
      const firstFive = sortedData.slice(0, 5);
      setData(firstFive);
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
            <div className={`${styles.heading}`}>
              <div className="mt-5">Best Selling</div>
            </div>
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
              {data.length !== 0 &&
                data.map((i, index) => <ProductCard data={i} key={index} />)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BestSelling;
