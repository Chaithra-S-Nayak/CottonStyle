import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../redux/actions/product";
import { fetchAdminOptions } from "../../redux/actions/adminOptions";
import { toast } from "react-toastify";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);
  const { adminOptions } = useSelector((state) => state.adminOptions);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fabric, setFabric] = useState("");
  const [color, setColor] = useState("");
  const [availableSizes, setAvailableSizes] = useState([]);
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminOptions());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setLoading(false);
    }
    if (success) {
      toast.success("Product created successfully!");
      navigate("/dashboard");
      window.location.reload();
    }
  }, [dispatch, error, success, navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSizeChange = (size) => {
    setAvailableSizes((prevSizes) =>
      prevSizes.includes(size)
        ? prevSizes.filter((s) => s !== size)
        : [...prevSizes, size]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }
    if (availableSizes.length === 0) {
      toast.error("Please select at least one size.");
      return;
    }

    setLoading(true);

    const newForm = new FormData();
    images.forEach((image) => {
      newForm.append("images", image);
    });
    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("fabric", fabric);
    newForm.append("color", color);
    newForm.append("availableSizes", availableSizes);
    newForm.append("originalPrice", originalPrice);
    newForm.append("discountPrice", discountPrice);
    newForm.append("stock", stock);
    newForm.append("shopId", seller._id);

    dispatch(
      createProduct({
        name,
        description,
        fabric,
        color,
        availableSizes,
        originalPrice,
        discountPrice,
        stock,
        shopId: seller._id,
        images,
      })
    ).finally(() => setLoading(false));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1 className={`${styles.formHeading}`}>Create Product</h1>
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
                    <div key={sizeObj.size} className={`${styles.noramlFlex}`}>
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
              <label className={`${styles.formLabel}`}>
                Upload Images <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="upload"
                className="hidden"
                multiple
                onChange={handleImageChange}
              />
              <div className="flex items-center flex-wrap mt-2">
                <label htmlFor="upload" className="cursor-pointer">
                  <AiOutlinePlusCircle size={30} color="#555" />
                </label>
                {images &&
                  images.map((i, index) => (
                    <div key={index} className="relative m-2">
                      <img
                        src={i}
                        alt=""
                        className="h-[120px] w-[120px] object-cover"
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
                Create Product
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default CreateProduct;
