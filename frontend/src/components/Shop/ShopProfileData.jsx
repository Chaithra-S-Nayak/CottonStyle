import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getAllProductsShop } from "../../redux/actions/product";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";
import { server } from "../../server";

const ShopProfileData = () => {
  const { products = [] } = useSelector((state) => state.products);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [active, setActive] = useState(1);
  const [coupons, setCoupons] = useState([]);
  const [currentPageProducts, setCurrentPageProducts] = useState(1);
  const [currentPageCoupons, setCurrentPageCoupons] = useState(1);
  const productsPerPage = 8;
  const couponsPerPage = 5;

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get(`${server}/coupon/get-coupon/${id}`);
        setCoupons(response.data.couponCodes || []);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };
    dispatch(getAllProductsShop(id));
    fetchCoupons();
  }, [dispatch, id]);

  // Pagination logic for products
  const indexOfLastProduct = currentPageProducts * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPagesProducts = Math.ceil(products.length / productsPerPage);

  // Pagination logic for coupons
  const indexOfLastCoupon = currentPageCoupons * couponsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;
  const currentCoupons = coupons.slice(indexOfFirstCoupon, indexOfLastCoupon);
  const totalPagesCoupons = Math.ceil(coupons.length / couponsPerPage);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <div className="w-full flex">
          <div className={`${styles.normalFlex}`} onClick={() => setActive(1)}>
            <h5
              className={`font-[500] text-[18px] ${
                active === 1 ? "text-green-500" : "text-[#333]"
              } cursor-pointer pr-[20px]`}
            >
              Shop Products
            </h5>
          </div>
          <div className={`${styles.normalFlex}`} onClick={() => setActive(2)}>
            <h5
              className={`font-[500] text-[18px] ${
                active === 2 ? "text-green-500" : "text-[#333]"
              } cursor-pointer pr-[20px]`}
            >
              Coupon Codes
            </h5>
          </div>
        </div>
      </div>
      <br />
      {active === 1 && (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
          {currentProducts.length > 0 ? (
            currentProducts.map((product, index) => (
              <ProductCard data={product} key={index} isShop={true} />
            ))
          ) : (
            <h5 className="w-full text-center py-5 text-lg">
              No products found!
            </h5>
          )}
        </div>
      )}
      {active === 1 && totalPagesProducts > 1 && (
        <div className="flex justify-center m-4">
          <button
            onClick={() => setCurrentPageProducts(currentPageProducts - 1)}
            disabled={currentPageProducts === 1}
            className="px-4 py-2 mx-1 bg-gray-300 rounded"
          >
            Previous
          </button>
          {Array.from({ length: totalPagesProducts }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPageProducts(index + 1)}
              className={`px-4 py-2 mx-1 ${
                currentPageProducts === index + 1
                  ? "bg-[#243450] text-white"
                  : "bg-gray-300"
              } rounded`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPageProducts(currentPageProducts + 1)}
            disabled={currentPageProducts === totalPagesProducts}
            className="px-4 py-2 mx-1 bg-gray-300 rounded"
          >
            Next
          </button>
        </div>
      )}
      {active === 2 && (
        <div>
          {currentCoupons.length > 0 ? (
            <>
              <p className="mb-4">
                If your cart has products from this shop, apply any one coupon
                code to get a discount.
              </p>
              {currentCoupons.map((coupon) => (
                <div
                  key={coupon._id}
                  className="bg-white border p-4 mb-4 rounded"
                >
                  <h1 className="font-semibold">{coupon.name}</h1>
                  <p className="text-gray-700">{coupon.value}% off</p>
                  <p className="text-gray-700">
                    Minimum Amount: ₹{coupon.minAmount}
                  </p>
                  <p className="text-gray-700">
                    Maximum Amount: ₹{coupon.maxAmount}
                  </p>
                </div>
              ))}
            </>
          ) : (
            <p className="m-4 text-center">
              Oops! No coupons are available for this shop right now.
            </p>
          )}
        </div>
      )}
      {active === 2 && totalPagesCoupons > 1 && (
        <div className="flex justify-center m-4">
          <button
            onClick={() => setCurrentPageCoupons(currentPageCoupons - 1)}
            disabled={currentPageCoupons === 1}
            className="px-4 py-2 mx-1 bg-gray-300 rounded"
          >
            Previous
          </button>
          {Array.from({ length: totalPagesCoupons }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPageCoupons(index + 1)}
              className={`px-4 py-2 mx-1 ${
                currentPageCoupons === index + 1
                  ? "bg-[#243450] text-white"
                  : "bg-gray-300"
              } rounded`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPageCoupons(currentPageCoupons + 1)}
            disabled={currentPageCoupons === totalPagesCoupons}
            className="px-4 py-2 mx-1 bg-gray-300 rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopProfileData;
