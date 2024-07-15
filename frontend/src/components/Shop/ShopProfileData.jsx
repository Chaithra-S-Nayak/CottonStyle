import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { getAllProductsShop } from "../../redux/actions/product";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";
import { server } from "../../server";

const ShopProfileData = ({ isOwner }) => {
  const { products } = useSelector((state) => state.products);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [active, setActive] = useState(1);
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get(`${server}/coupon/get-coupon/${id}`);
        setCoupons(response.data.couponCodes);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    dispatch(getAllProductsShop(id));
    fetchCoupons();
  }, [dispatch, id]);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <div className="w-full flex">
          <div className="flex items-center" onClick={() => setActive(1)}>
            <h5
              className={`font-[500] text-[18px] ${
                active === 1 ? "text-green-500" : "text-[#333]"
              } cursor-pointer pr-[20px]`}
            >
              Shop Products
            </h5>
          </div>
          <div className="flex items-center" onClick={() => setActive(2)}>
            <h5
              className={`font-[500] text-[18px] ${
                active === 2 ? "text-green-500" : "text-[#333]"
              } cursor-pointer pr-[20px]`}
            >
              Coupon Codes
            </h5>
          </div>
        </div>
        <div>
          {isOwner && (
            <div>
              <Link to="/dashboard">
                <div className={`${styles.button} !rounded-[4px] h-[42px]`}>
                  <span className="text-[#fff]">Go Dashboard</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      <br />
      {active === 1 && (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
          {products &&
            products.map((i, index) => (
              <ProductCard data={i} key={index} isShop={true} />
            ))}
        </div>
      )}

      {active === 2 && (
        <div>
          {coupons.length > 0 ? (
            <>
              <p className="mb-4">
                If your cart has products from this shop, apply any one coupon
                code to get a discount.
              </p>
              {coupons.map((coupon) => (
                <div key={coupon._id} className="border p-4 mb-4 rounded">
                  <h1 className="font-semibold">{coupon.name}</h1>
                  <p className="text-gray-700">{coupon.value}% off</p>
                </div>
              ))}
            </>
          ) : (
            <h5 className="w-full text-center py-5 text-lg">
              No Coupons available for this shop!
            </h5>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopProfileData;
