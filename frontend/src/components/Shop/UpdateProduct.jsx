import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetails, updateProduct } from "../../redux/actions/product";
import { toast } from "react-toastify";
import { AiOutlinePlusCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { fetchAdminOptions } from "../../redux/actions/adminOptions";
import styles from "../../styles/styles";

const UpdateProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product } = useSelector((state) => state.products);
  const { adminOptions } = useSelector((state) => state.adminOptions);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fabric, setFabric] = useState("");
  const [color, setColor] = useState("");
  const [availableSizes, setAvailableSizes] = useState([]);
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);

  useEffect(() => {
    dispatch(fetchAdminOptions());
  }, [dispatch]);

  useEffect(() => {
    if (product && product._id !== id) {
      dispatch(getProductDetails(id));
    } else {
      setName(product.name);
      setDescription(product.description);
      setFabric(product.fabric);
      setColor(product.color);
      setAvailableSizes(product.availableSizes || []);
      setOriginalPrice(product.originalPrice);
      setDiscountPrice(product.discountPrice);
      setStock(product.stock);
      setOldImages(product.images);
    }
  }, [dispatch, id, product]);

  const handleSizeChange = (size) => {
    if (availableSizes.includes(size)) {
      setAvailableSizes(availableSizes.filter((s) => s !== size));
    } else {
      setAvailableSizes([...availableSizes, size]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }
    if (availableSizes.length === 0) {
      toast.error("Please select at least one size.");
      return;
    }
    const productData = {
      name,
      description,
      fabric,
      color,
      availableSizes,
      originalPrice,
      discountPrice,
      stock,
      newImages: images,
      oldImages,
    };

    try {
      await dispatch(updateProduct(id, productData));
      toast.success("Product updated successfully!");
      navigate("/dashboard-products");
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 413) {
        toast.error("Failed to update product! Payload too large.");
      } else {
        toast.error("Failed to update product!");
      }
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((oldArray) => [...oldArray, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index, isOldImage = false) => {
    if (isOldImage) {
      setOldImages(oldImages.filter((_, i) => i !== index));
    } else {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className={`${styles.formHeading}`}>Update Product</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`${styles.formLabel}`}>
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your product name"
              className={`${styles.formInput}`}
              required
            />
          </div>
          <div>
            <label className={`${styles.formLabel}`}>
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your product description"
              className={`${styles.formInput}`}
              required
              rows="4"
            ></textarea>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={`${styles.formLabel}`}>
              Fabric <span className="text-red-500">*</span>
            </label>
            <select
              value={fabric}
              onChange={(e) => setFabric(e.target.value)}
              className={`${styles.formInput}`}
              required
            >
              <option value="">Choose the Fabric</option>
              {adminOptions.fabric &&
                adminOptions.fabric.map((i) => (
                  <option value={i} key={i}>
                    {i}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className={`${styles.formLabel}`}>
              Color <span className="text-red-500">*</span>
            </label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className={`${styles.formInput}`}
              required
            >
              <option value="">Choose a color</option>
              {adminOptions.color &&
                adminOptions.color.map((i) => (
                  <option value={i} key={i}>
                    {i}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className={`${styles.formLabel}`}>
              Available Sizes <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mt-1">
              {adminOptions.sizeChart?.map((sizeObj) => (
                <div key={sizeObj.size} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`size-${sizeObj.size}`}
                    value={sizeObj.size}
                    checked={availableSizes.includes(sizeObj.size)}
                    onChange={() => handleSizeChange(sizeObj.size)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`size-${sizeObj.size}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {sizeObj.size}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={`${styles.formLabel}`}>
              Original Price(₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="Enter your product price"
              className={`${styles.formInput}`}
              required
            />
          </div>
          <div>
            <label className={`${styles.formLabel}`}>
              Discount Price(₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              placeholder="Enter discount product price"
              className={`${styles.formInput}`}
              required
            />
          </div>
          <div>
            <label className={`${styles.formLabel}`}>
              Product Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Enter your product stock"
              className={`${styles.formInput}`}
              required
            />
          </div>
        </div>
        <div>
          <label className="pb-2">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="upload"
            className="hidden"
            multiple
            onChange={handleImageChange}
          />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
            </label>
            {oldImages &&
              oldImages.map((i, index) => (
                <div key={index} className="relative">
                  <img
                    src={i.url}
                    alt=""
                    className="h-[120px] w-[120px] object-cover m-2"
                  />
                  <AiOutlineCloseCircle
                    size={20}
                    color="#555"
                    className="absolute top-0 right-0 cursor-pointer"
                    onClick={() => handleRemoveImage(index, true)}
                  />
                </div>
              ))}
            {images &&
              images.map((i, index) => (
                <div key={index} className="relative">
                  <img
                    src={i}
                    alt=""
                    className="h-[120px] w-[120px] object-cover m-2"
                  />
                  <AiOutlineCloseCircle
                    size={20}
                    color="#555"
                    className="absolute top-0 right-0 cursor-pointer"
                    onClick={() => handleRemoveImage(index)}
                  />
                </div>
              ))}
          </div>
        </div>
        <div className="mt-4">
          <button type="submit" className={`${styles.simpleButton}`}>
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
