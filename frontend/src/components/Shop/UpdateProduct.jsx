import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetails, updateProduct } from "../../redux/actions/product";
import { toast } from "react-toastify";
import { AiOutlinePlusCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { fetchAdminOptions } from "../../redux/actions/adminOptions";

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
    <div className="w-[90%] 800px:w-[50%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Update Product</h5>
      <form onSubmit={handleSubmit}>
        <br />
        <div>
          <label className="pb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your product name"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            required
            rows="8"
            type="text"
            name="description"
            value={description}
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your product description"
          ></textarea>
        </div>
        <br />
        <div>
          <label className="pb-2">
            Fabric <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={fabric}
            onChange={(e) => setFabric(e.target.value)}
          >
            <option value="Choose the Fabric">Choose the Fabric</option>
            {adminOptions.fabric &&
              adminOptions.fabric.map((i) => (
                <option value={i} key={i}>
                  {i}
                </option>
              ))}
          </select>
        </div>
        <br />
        <div>
          <div>
            <label className="pb-2">
              Color <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full mt-2 border h-[35px] rounded-[5px]"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            >
              <option value="Choose a color">Choose a color</option>
              {adminOptions.color &&
                adminOptions.color.map((i) => (
                  <option value={i} key={i}>
                    {i}
                  </option>
                ))}
            </select>
          </div>
          <br />
          <label className="pb-2">
            Available Sizes <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap">
            {adminOptions.sizeChart?.map((sizeObj) => (
              <div key={sizeObj.size} className="mr-5 mb-2">
                <input
                  type="checkbox"
                  id={`size-${sizeObj.size}`}
                  value={sizeObj.size}
                  checked={availableSizes.includes(sizeObj.size)}
                  onChange={() => handleSizeChange(sizeObj.size)}
                />
                <label htmlFor={`size-${sizeObj.size}`} className="ml-1">
                  {sizeObj.size}
                </label>
              </div>
            ))}
          </div>
        </div>
        <br />
        <div>
          <label className="pb-2">Original Price</label>
          <input
            type="number"
            name="price"
            value={originalPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="Enter your product price"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Price (With Discount) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={discountPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDiscountPrice(e.target.value)}
            placeholder="Enter your product price with discount"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Product Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={stock}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setStock(e.target.value)}
            placeholder="Enter your product stock"
          />
        </div>
        <br />
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
        <br />
        <div>
          <input
            type="submit"
            value="Update"
            className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
