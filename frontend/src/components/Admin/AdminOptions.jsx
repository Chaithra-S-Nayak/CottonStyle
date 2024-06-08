import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminOptions,
  updateAdminOptions,
  resetAdminOptionsState,
} from "../../redux/actions/adminOptions";
import { toast } from "react-toastify";

const AdminOptions = () => {
  const dispatch = useDispatch();
  const { adminOptions, success, error } = useSelector(
    (state) => state.adminOptions
  );

  const [logoUrl, setLogoUrl] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [banners, setBanners] = useState([]);
  const [gstTax, setGstTax] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [thresholdFee, setThresholdFee] = useState(0);

  // Store the initial state to revert to on cancel
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
      };
      setInitialState(initialValues);

      setLogoUrl(initialValues.logoUrl);
      setPrimaryColor(initialValues.primaryColor);
      setSecondaryColor(initialValues.secondaryColor);
      setBanners(initialValues.banners);
      setGstTax(initialValues.gstTax);
      setDeliveryFee(initialValues.deliveryFee);
      setThresholdFee(initialValues.thresholdFee);
    }
  }, [adminOptions]);

  useEffect(() => {
    if (success) {
      toast.success("Settings updated successfully!");
      dispatch(resetAdminOptionsState());
    }
    if (error) {
      console.error("Error:", error); // Log the error for debugging
      toast.error(`Error updating settings: ${error}`);
      dispatch(resetAdminOptionsState());
    }
  }, [success, error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedOptions = {
      logoUrl,
      theme: { primaryColor, secondaryColor },
      banners,
      gstTax,
      deliveryFee,
      thresholdFee,
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
  };

  const handleBannerChange = (index, field, value) => {
    const newBanners = [...banners];
    newBanners[index][field] = value;
    setBanners(newBanners);
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
    const newBanners = [...banners];
    newBanners[bannerIndex] = {
      ...newBanners[bannerIndex],
      textLines: [...newBanners[bannerIndex].textLines],
    };
    newBanners[bannerIndex].textLines[textLineIndex] = {
      ...newBanners[bannerIndex].textLines[textLineIndex],
      [field]: value,
    };
    setBanners(newBanners);
  };

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Admin Options</h5>
      <form onSubmit={handleSubmit}>
        <br />
        <div>
          <label className="pb-2">Logo URL</label>
          <input
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter logo URL"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Primary Color</label>
          <input
            type="text"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter primary color"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Secondary Color</label>
          <input
            type="text"
            value={secondaryColor}
            onChange={(e) => setSecondaryColor(e.target.value)}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter secondary color"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">GST Tax</label>
          <input
            type="number"
            value={gstTax}
            onChange={(e) => setGstTax(Number(e.target.value))}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter GST tax"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Delivery Fee</label>
          <input
            type="number"
            value={deliveryFee}
            onChange={(e) => setDeliveryFee(Number(e.target.value))}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter delivery fee"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Threshold Fee</label>
          <input
            type="number"
            value={thresholdFee}
            onChange={(e) => setThresholdFee(Number(e.target.value))}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter threshold fee"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Banners</label>
          {banners.map((banner, index) => (
            <div key={index}>
              <input
                type="text"
                value={banner.imageUrl}
                onChange={(e) =>
                  handleBannerChange(index, "imageUrl", e.target.value)
                }
                className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter banner image URL"
              />
              {banner.textLines.map((textLine, textLineIndex) => (
                <div key={textLineIndex} className="flex items-center mt-2">
                  <input
                    type="text"
                    value={textLine.text}
                    onChange={(e) =>
                      handleTextLineChange(
                        index,
                        textLineIndex,
                        "text",
                        e.target.value
                      )
                    }
                    className="appearance-none block w-[calc(100%-70px)] px-3 h-[35px] border border-gray-300 rounded-[3px]                     placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mr-2"
                    placeholder="Text"
                  />
                  <input
                    type="number"
                    value={textLine.fontSize}
                    onChange={(e) =>
                      handleTextLineChange(
                        index,
                        textLineIndex,
                        "fontSize",
                        e.target.value
                      )
                    }
                    className="appearance-none block w-[70px] px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mr-2"
                    placeholder="Font Size"
                  />
                  <input
                    type="text"
                    value={textLine.fontStyle}
                    onChange={(e) =>
                      handleTextLineChange(
                        index,
                        textLineIndex,
                        "fontStyle",
                        e.target.value
                      )
                    }
                    className="appearance-none block w-[70px] px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mr-2"
                    placeholder="Font Style"
                  />
                  <input
                    type="text"
                    value={textLine.color}
                    onChange={(e) =>
                      handleTextLineChange(
                        index,
                        textLineIndex,
                        "color",
                        e.target.value
                      )
                    }
                    className="appearance-none block w-[70px] px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Text Color"
                  />
                </div>
              ))}
              <button
                type="button"
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                onClick={() => addTextLine(index)}
              >
                Add Text Line
              </button>
              <button
                type="button"
                className="mt-2 ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                onClick={() => removeBanner(index)}
              >
                Remove Banner
              </button>
            </div>
          ))}
          <button
            type="button"
            className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
            onClick={addBanner}
          >
            Add Banner
          </button>
        </div>
        <br />
        <div className="flex justify-end">
          <button
            type="submit"
            className=" mr-2 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
          >
            Save Changes
          </button>
          <button
            type="button"
            className=" px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminOptions;
