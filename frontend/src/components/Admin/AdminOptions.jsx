import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminOptions,
  updateAdminOptions,
  resetAdminOptionsState,
} from "../../redux/actions/adminOptions";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";

const AdminOptions = () => {
  const dispatch = useDispatch();
  const { adminOptions, updateSuccess, error } = useSelector(
    (state) => state.adminOptions
  );
  const [logoUrl, setLogoUrl] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [banners, setBanners] = useState([]);
  const [gstTax, setGstTax] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [thresholdFee, setThresholdFee] = useState(0);
  const [fabrics, setFabrics] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizeChart, setSizeChart] = useState([]);
  const [initialState, setInitialState] = useState({});

  useEffect(() => {
    dispatch(fetchAdminOptions());
  }, [dispatch]);

  useEffect(() => {
    if (adminOptions) {
      const initialValues = {
        logoUrl: adminOptions.logoUrl,
        primaryColor: adminOptions.theme?.primaryColor,
        secondaryColor: adminOptions.theme?.secondaryColor,
        banners: adminOptions.banners || [],
        gstTax: adminOptions.gstTax,
        deliveryFee: adminOptions.deliveryFee,
        thresholdFee: adminOptions.thresholdFee,
        fabrics: adminOptions.fabric || [],
        colors: adminOptions.color || [],
        sizeChart: adminOptions.sizeChart || [],
      };
      setInitialState(initialValues);
      setLogoUrl(initialValues.logoUrl);
      setPrimaryColor(initialValues.primaryColor);
      setSecondaryColor(initialValues.secondaryColor);
      setBanners(initialValues.banners);
      setGstTax(initialValues.gstTax);
      setDeliveryFee(initialValues.deliveryFee);
      setThresholdFee(initialValues.thresholdFee);
      setFabrics(initialValues.fabrics);
      setColors(initialValues.colors);
      setSizeChart(initialValues.sizeChart);
    }
  }, [adminOptions]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success("Settings updated successfully!");
      dispatch(resetAdminOptionsState());
    }
    if (error) {
      console.error("Error:", error);
      toast.error(`Error updating settings: ${error}`);
      dispatch(resetAdminOptionsState());
    }
  }, [updateSuccess, error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedOptions = {
      logoUrl,
      theme: { primaryColor, secondaryColor },
      banners,
      gstTax,
      deliveryFee,
      thresholdFee,
      fabric: fabrics,
      color: colors,
      sizeChart,
    };
    dispatch(updateAdminOptions(updatedOptions));
  };

  const handleCancel = () => {
    setLogoUrl(initialState.logoUrl);
    setPrimaryColor(initialState.primaryColor);
    setSecondaryColor(initialState.secondaryColor);
    setBanners(initialState.banners);
    setGstTax(initialState.gstTax);
    setDeliveryFee(initialState.deliveryFee);
    setThresholdFee(initialState.thresholdFee);
    setFabrics(initialState.fabrics);
    setColors(initialState.colors);
    setSizeChart(initialState.sizeChart);
  };

  const handleBannerChange = (index, field, value) => {
    setBanners((prevBanners) =>
      prevBanners.map((banner, i) =>
        i === index ? { ...banner, [field]: value } : banner
      )
    );
  };

  const addBanner = () => {
    setBanners([...banners, { imageUrl: "", textLines: [] }]);
  };

  const removeBanner = (index) => {
    const newBanners = banners.filter((_, i) => i !== index);
    setBanners(newBanners);
  };

  const addTextLine = (bannerIndex) => {
    const newBanners = [...banners];
    newBanners[bannerIndex].textLines.push({
      text: "",
      fontSize: 12,
      fontStyle: "normal",
      color: "#000000",
    });
    setBanners(newBanners);
  };

  const handleTextLineChange = (bannerIndex, textLineIndex, field, value) => {
    setBanners((prevBanners) =>
      prevBanners.map((banner, i) =>
        i === bannerIndex
          ? {
              ...banner,
              textLines: banner.textLines.map((line, j) =>
                j === textLineIndex ? { ...line, [field]: value } : line
              ),
            }
          : banner
      )
    );
  };

  const addFabric = () => {
    setFabrics([...fabrics, ""]);
  };

  const handleFabricChange = (index, value) => {
    setFabrics((prevFabrics) =>
      prevFabrics.map((fabric, i) => (i === index ? value : fabric))
    );
  };

  const removeFabric = (index) => {
    const newFabrics = fabrics.filter((_, i) => i !== index);
    setFabrics(newFabrics);
  };

  const addColor = () => {
    setColors([...colors, ""]);
  };

  const handleColorChange = (index, value) => {
    setColors((prevColors) =>
      prevColors.map((color, i) => (i === index ? value : color))
    );
  };

  const removeColor = (index) => {
    const newColors = colors.filter((_, i) => i !== index);
    setColors(newColors);
  };

  const addSizeChart = () => {
    setSizeChart([
      ...sizeChart,
      { size: "", chestSize: "", waistSize: "", lengthSize: "" },
    ]);
  };

  const handleSizeChartChange = (index, field, value) => {
    setSizeChart((prevSizeChart) =>
      prevSizeChart.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const removeSizeChart = (index) => {
    const newSizeChart = sizeChart.filter((_, i) => i !== index);
    setSizeChart(newSizeChart);
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] max-h-[70vh] overflow-y-auto grid grid-cols-1 gap-4">
        {/* Row 1: Primary Color and Secondary Color */}
        {/* <div className="grid grid-cols-1 1000px:grid-cols-2 gap-4">
          <div className="p-4">
            <label className={`${styles.formLabel}`}>Website Primary Color</label>
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className={`${styles.input}`}
            />
          </div>
          <div className="p-4">
            <label className={`${styles.formLabel}`}>Website Secondary Color</label>
            <input
              type="text"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className={`${styles.input}`}
            />
          </div>
        </div> */}

        {/* Row 2: GST, Delivery Fee, Threshold Fee */}
        <div className="grid grid-cols-1 1000px:grid-cols-3 gap-4">
          <div className="p-4">
            <label className={`${styles.formLabel}`}>GST Tax (%)</label>
            <input
              type="number"
              value={gstTax}
              onChange={(e) => setGstTax(e.target.value)}
              className={`${styles.formInput}`}
            />
          </div>
          <div className="p-4">
            <label className={`${styles.formLabel}`}>Delivery Fee</label>
            <input
              type="number"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
              className={`${styles.formInput}`}
            />
          </div>
          <div className="p-4">
            <label className={`${styles.formLabel}`}>Threshold Fee</label>
            <input
              type="number"
              value={thresholdFee}
              onChange={(e) => setThresholdFee(e.target.value)}
              className={`${styles.formInput}`}
            />
          </div>
        </div>

        {/* Row 3: Logo URL and Banners */}
        {/* <div className="grid grid-cols-1 1000px:grid-cols-2 gap-4">
          <div className="p-4">
            <h5 className="text-xl font-bold mb-4">Logo URL</h5>
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full p-2 border rounded max-w-xs"
            />
          </div>
          <div className="p-4">
            <h5 className="text-xl font-bold mb-4">Banners</h5>
            {banners.map((banner, index) => (
              <div key={index} className="mb-4">
                <input
                  type="text"
                  placeholder="Banner Image URL"
                  value={banner.imageUrl}
                  onChange={(e) => handleBannerChange(index, "imageUrl", e.target.value)}
                  className="w-full p-2 border rounded mb-2 max-w-xs"
                />
                <button
                  type="button"
                  onClick={() => addTextLine(index)}
                  className="mb-2 bg-blue-500 text-white py-1 px-2 rounded"
                >
                  Add Text Line
                </button>
                {banner.textLines.map((line, lineIndex) => (
                  <div key={lineIndex} className="mb-2">
                    <input
                      type="text"
                      placeholder="Text"
                      value={line.text}
                      onChange={(e) =>
                        handleTextLineChange(index, lineIndex, "text", e.target.value)
                      }
                      className="w-full p-2 border rounded mb-1"
                    />
                    <input
                      type="number"
                      placeholder="Font Size"
                      value={line.fontSize}
                      onChange={(e) =>
                        handleTextLineChange(index, lineIndex, "fontSize", e.target.value)
                      }
                      className="w-full p-2 border rounded mb-1"
                    />
                    <input
                      type="text"
                      placeholder="Font Style"
                      value={line.fontStyle}
                      onChange={(e) =>
                        handleTextLineChange(index, lineIndex, "fontStyle", e.target.value)
                      }
                      className="w-full p-2 border rounded mb-1"
                    />
                    <input
                      type="color"
                      value={line.color}
                      onChange={(e) =>
                        handleTextLineChange(index, lineIndex, "color", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => removeBanner(index)}
                  className="bg-red-500 text-white py-1 px-2 rounded"
                >
                  Remove Banner
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addBanner}
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              Add Banner
            </button>
          </div>
        </div> */}

        {/* Row 4: Fabrics and Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4">
            <label className={`${styles.formLabel}`}>T-Shirt Fabrics</label>
            {fabrics.map((fabric, index) => (
              <div key={index} className="mb-2 flex items-center">
                <input
                  type="text"
                  placeholder="Fabric"
                  value={fabric}
                  onChange={(e) => handleFabricChange(index, e.target.value)}
                  className={`${styles.input}`}
                />
                <button
                  type="button"
                  onClick={() => removeFabric(index)}
                  className="py-1 px-2 rounded"
                >
                  <RxCross1 />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addFabric}
              className={`${styles.simpleButton}`}
            >
              Add Fabric
            </button>
          </div>
          <div className="p-4">
            <label className={`${styles.formLabel}`}>T-Shirt Colors</label>
            {colors.map((color, index) => (
              <div key={index} className="mb-2 flex items-center">
                <input
                  type="text"
                  placeholder="Color"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  className={`${styles.input}`}
                />
                <button
                  type="button"
                  onClick={() => removeColor(index)}
                  className=" py-1 px-2 rounded"
                >
                  <RxCross1 />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addColor}
              className={`${styles.simpleButton}`}
            >
              Add Color
            </button>
          </div>
        </div>

        {/* Row 5: Size Chart */}
        <div className="p-4">
          <label className={`${styles.formLabel}`}>
            T-Shirt Size Chart (inches)
          </label>
          {sizeChart.map((size, index) => (
            <div
              key={index}
              className="mb-2 flex flex-col 800px:flex-row 800px:space-x-2"
            >
              <input
                type="text"
                placeholder="Size"
                value={size.size}
                onChange={(e) =>
                  handleSizeChartChange(index, "size", e.target.value)
                }
                className={`${styles.input}`}
              />
              <input
                type="text"
                placeholder="Chest Size (inches)"
                value={size.chestSize}
                onChange={(e) =>
                  handleSizeChartChange(index, "chestSize", e.target.value)
                }
                className={`${styles.input}`}
              />
              <input
                type="text"
                placeholder="Waist Size (inches)"
                value={size.waistSize}
                onChange={(e) =>
                  handleSizeChartChange(index, "waistSize", e.target.value)
                }
                className={`${styles.input}`}
              />
              <input
                type="text"
                placeholder="Length Size (inches)"
                value={size.lengthSize}
                onChange={(e) =>
                  handleSizeChartChange(index, "lengthSize", e.target.value)
                }
                className={`${styles.input}`}
              />
              <button
                type="button"
                onClick={() => removeSizeChart(index)}
                className="py-1 px-2 rounded"
              >
                <RxCross1 />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSizeChart}
            className={`${styles.simpleButton}`}
          >
            Add Size
          </button>
        </div>
      </div>
      <div className="mt-8">
        <button
          type="button"
          onClick={handleSubmit}
          className={`${styles.simpleButton}`}
        >
          Save
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className={`${styles.simpleButton} !bg-gray-500 m-4`}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AdminOptions;
