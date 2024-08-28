import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../server";
import { RxCross1 } from "react-icons/rx";
import styles from "../styles/styles";
import { AiOutlinePlusCircle, AiOutlineCloseCircle } from "react-icons/ai";

const ReturnRequestModal = ({ open, setOpen, selectedItem }) => {
  const [returnDetails, setReturnDetails] = useState([]);

  useEffect(() => {
    if (selectedItem && selectedItem.products) {
      setReturnDetails(
        selectedItem.products.map((product) => ({
          productId: product.productId,
          name: product.name,
          qty: product.qty,
          discountPrice: product.discountPrice,
          paidAmount: product.paidAmount,
          availableSizes: product.availableSizes || [],
          selectedSize: "",
          requestType: "Return",
          reason: "",
          images: [],
          selected: false,
          isAvailable: null, // Track availability status
        }))
      );
    }
  }, [selectedItem]);

  const handleImageChange = (productId, e) => {
    const files = Array.from(e.target.files);
    const imagesArray = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          imagesArray.push(reader.result);
          setReturnDetails((prevDetails) =>
            prevDetails.map((item) =>
              item.productId === productId
                ? { ...item, images: [...item.images, ...imagesArray] }
                : item
            )
          );
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (productId, index) => {
    setReturnDetails((prevDetails) =>
      prevDetails.map((item) =>
        item.productId === productId
          ? {
              ...item,
              images: item.images.filter((_, i) => i !== index),
            }
          : item
      )
    );
  };

  const handleQuantityChange = (productId, value) => {
    const product = returnDetails.find((item) => item.productId === productId);
    if (value < 1 || value > product.qty) {
      toast.error(`Please select a quantity between 1 and ${product.qty}`);
      return;
    }
    setReturnDetails((prevDetails) =>
      prevDetails.map((item) =>
        item.productId === productId ? { ...item, quantity: value } : item
      )
    );
  };

  const handleReasonChange = (productId, value) => {
    setReturnDetails((prevDetails) =>
      prevDetails.map((item) =>
        item.productId === productId ? { ...item, reason: value } : item
      )
    );
  };

  const handleProductSelect = (productId) => {
    setReturnDetails((prevDetails) =>
      prevDetails.map((item) =>
        item.productId === productId
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const handleRequestTypeChange = (productId, value) => {
    setReturnDetails((prevDetails) =>
      prevDetails.map((item) =>
        item.productId === productId ? { ...item, requestType: value } : item
      )
    );
  };

  const handleSizeSelection = (productId, value) => {
    setReturnDetails((prevDetails) =>
      prevDetails.map((item) =>
        item.productId === productId ? { ...item, selectedSize: value } : item
      )
    );
  };

  const handleCheckAvailability = async (productId) => {
    try {
      const { data } = await axios.post(
        `${server}/returnRequest/check-product-availability`,
        { productId }
      );

      setReturnDetails((prevDetails) =>
        prevDetails.map((item) =>
          item.productId === productId
            ? { ...item, isAvailable: data.success }
            : item
        )
      );

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred while checking product availability.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedProducts = returnDetails.filter((item) => item.selected);

    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product to return or exchange.");
      return;
    }

    for (let product of selectedProducts) {
      if (product.requestType === "Exchange" && product.isAvailable === null) {
        toast.error(
          `Please check the availability of the product: ${product.name} before submitting.`
        );
        return;
      }

      if (product.images.length === 0) {
        toast.error(
          `Please upload at least one image for the product: ${product.name}`
        );
        return;
      }
    }

    try {
      const { data } = await axios.post(
        `${server}/returnRequest/create-return-request`,
        {
          orderId: selectedItem.orderId,
          shopId: selectedItem.shopId,
          products: selectedProducts.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            reason: item.reason,
            images: item.images,
            requestType: item.requestType,
            discountPrice: item.discountPrice,
            paidAmount: item.paidAmount,
            selectedSize: item.selectedSize,
          })),
        },
        { withCredentials: true }
      );
      toast.success("Return/Exchange request submitted successfully!");
      setOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    open &&
    selectedItem && (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-end">
            <RxCross1
              size={30}
              onClick={() => setOpen(false)}
              className="cursor-pointer"
            />
          </div>
          <h2 className={`${styles.formHeading}`}>Return/Exchange Request</h2>
          <form onSubmit={handleSubmit}>
            {selectedItem.products.map((product) => {
              const productDetail = returnDetails.find(
                (item) => item.productId === product.productId
              );

              return (
                <div key={product.productId} className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={productDetail?.selected || false}
                      onChange={() => handleProductSelect(product.productId)}
                      className="mr-2"
                    />
                    {product.name}
                  </label>
                  {productDetail?.selected && (
                    <>
                      <div className="mt-2">
                        <label
                          htmlFor={`requestType-${product.productId}`}
                          className={`${styles.formLabel}`}
                        >
                          Select Return or Exchange:
                        </label>
                        <select
                          id={`requestType-${product.productId}`}
                          value={productDetail?.requestType || "Return"}
                          onChange={(e) =>
                            handleRequestTypeChange(
                              product.productId,
                              e.target.value
                            )
                          }
                          className={`${styles.formInput}`}
                          required
                        >
                          <option value="Return">Return</option>
                          <option value="Exchange">Exchange</option>
                        </select>
                      </div>
                      {productDetail.requestType === "Exchange" && (
                        <>
                          <button
                            type="button"
                            className={`${styles.button}`}
                            onClick={() =>
                              handleCheckAvailability(product.productId)
                            }
                          >
                            Check Availability
                          </button>
                          <div className="mt-2">
                            <label
                              htmlFor={`size-${product.productId}`}
                              className={`${styles.formLabel}`}
                            >
                              Select New Size:
                            </label>
                            <select
                              id={`size-${product.productId}`}
                              value={productDetail?.selectedSize || ""}
                              onChange={(e) =>
                                handleSizeSelection(
                                  product.productId,
                                  e.target.value
                                )
                              }
                              className={`${styles.formInput}`}
                              required
                            >
                              <option value="" disabled>
                                Select size
                              </option>
                              {productDetail.availableSizes.map((size) => (
                                <option key={size} value={size}>
                                  {size}
                                </option>
                              ))}
                            </select>
                          </div>
                        </>
                      )}
                      <div className="mt-2">
                        <label
                          htmlFor={`quantity-${product.productId}`}
                          className={`${styles.formLabel}`}
                        >
                          Select Quantity to Return/Exchange:
                        </label>
                        <input
                          type="number"
                          id={`quantity-${product.productId}`}
                          onChange={(e) =>
                            handleQuantityChange(
                              product.productId,
                              e.target.value
                            )
                          }
                          className={`${styles.formInput}`}
                          required
                        />
                      </div>
                      <div className="mt-2">
                        <label
                          htmlFor={`reason-${product.productId}`}
                          className={`${styles.formLabel}`}
                        >
                          Reason for Return/Exchange:
                        </label>
                        <textarea
                          className={`${styles.formInput}`}
                          id={`reason-${product.productId}`}
                          value={productDetail?.reason || ""}
                          onChange={(e) =>
                            handleReasonChange(
                              product.productId,
                              e.target.value
                            )
                          }
                          placeholder="Reason for return/exchange"
                          rows="2"
                          required
                        ></textarea>
                      </div>
                      <div className="mt-2">
                        <label className={`${styles.formLabel}`}>
                          Upload Images <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="file"
                          id={`upload-${product.productId}`}
                          className="hidden"
                          multiple
                          onChange={(e) =>
                            handleImageChange(product.productId, e)
                          }
                        />
                        <div className="flex items-center flex-wrap mt-2">
                          <label
                            htmlFor={`upload-${product.productId}`}
                            className="cursor-pointer"
                          >
                            <AiOutlinePlusCircle size={30} color="#555" />
                          </label>
                          {productDetail.images &&
                            productDetail.images.map((img, index) => (
                              <div key={index} className="relative m-2">
                                <img
                                  src={img}
                                  alt=""
                                  className="h-[120px] w-[120px] object-cover"
                                />
                                <AiOutlineCloseCircle
                                  size={20}
                                  color="#555"
                                  className="absolute top-0 right-0 cursor-pointer"
                                  onClick={() =>
                                    handleRemoveImage(product.productId, index)
                                  }
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
            <button type="submit" className={`${styles.wideButton}`}>
              Submit Request
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default ReturnRequestModal;
