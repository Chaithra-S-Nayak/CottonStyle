import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";

const SuggestedProduct = ({ data }) => {
  const { allProducts } = useSelector((state) => state.products);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    if (allProducts && data) {
      const filteredProducts = allProducts.filter(
        (product) => product.fabric === data.fabric && product._id !== data._id
      );
      setProductData(filteredProducts);
    }
  }, [allProducts, data]);

  return (
    <div>
      {data && (
        <div className={`p-4 ${styles.section}`}>
          <h2 className={`${styles.heading} border-b mb-5`}>
            Related Products
          </h2>
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
            {productData.map((product) => (
              <ProductCard data={product} key={product._id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestedProduct;
