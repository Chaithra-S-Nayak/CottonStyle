import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import ProductDetails from "../components/Products/ProductDetails";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import { useSelector } from "react-redux";

const ProductDetailsPage = () => {
  const { allProducts } = useSelector((state) => state.products);
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
      const product = allProducts && allProducts.find((i) => i._id === id);
      setData(product);
  }, [id, allProducts]);

  return (
    <div>
      <Header />
      {data ? (
        <ProductDetails data={data} />
      ) : (
        <div className="container mx-auto text-center mt-20 mb-20">
          <h1 className="text-2xl font-semibold">Product not found</h1>
          <p className="text-gray-600 mt-10 mb-20">
            The product you are looking for does not exist or may have been
            deleted.
          </p>
        </div>
      )}
      {data && <SuggestedProduct data={data} />}
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
