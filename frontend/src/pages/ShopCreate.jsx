import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ShopCreate from "../components/Shop/ShopCreate";

const ShopCreatePage = () => {
  const navigate = useNavigate();
  const { isSeller, seller, error } = useSelector((state) => state.seller);

  useEffect(() => {
    if (
      error === "Token has expired. Please log in again to get a new token."
    ) {
      navigate("/shop-login");
    } else if (isSeller && seller) {
      navigate(`/shop/${seller._id}`);
    }
  }, [isSeller, navigate, seller, error]);

  return (
    <div>
      <ShopCreate />
    </div>
  );
};

export default ShopCreatePage;
