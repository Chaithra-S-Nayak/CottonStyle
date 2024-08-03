import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineCamera } from "react-icons/ai";
import axios from "axios";
import { loadSeller } from "../../redux/actions/user";
import { toast } from "react-toastify";
import styles from "../../styles/styles";
import { server } from "../../server";

const ShopSettings = () => {
  const { seller } = useSelector((state) => state.seller);
  const [avatar, setAvatar] = useState();
  const [name, setName] = useState(seller && seller.name);
  const [description, setDescription] = useState(
    seller && seller.description ? seller.description : ""
  );
  const [address, setAddress] = useState(seller && seller.address);
  const [phoneNumber, setPhoneNumber] = useState(seller && seller.phoneNumber);
  const [email, setEmail] = useState(seller && seller.email);
  const [zipCode, setZipcode] = useState(seller && seller.zipCode);

  const dispatch = useDispatch();

  const handleImage = async (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        axios
          .put(
            `${server}/shop/update-shop-avatar`,
            { avatar: reader.result },
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            dispatch(loadSeller());
            toast.success("Avatar updated successfully!");
          })
          .catch((error) => {
            toast.error(error.response.data.message);
          });
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    await axios
      .put(
        `${server}/shop/update-seller-info`,
        {
          name,
          address,
          zipCode,
          phoneNumber,
          email,
          description,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Shop info updated successfully!");
        dispatch(loadSeller());
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <div className="w-full 800px:w-[80%] flex flex-col justify-center my-5">
        <div className="w-full flex items-center justify-center">
          <div className="relative">
            <img
              src={avatar ? avatar : `${seller.avatar?.url}`}
              alt=""
              className="w-[200px] h-[200px] rounded-full cursor-pointer"
            />
            <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[10px] right-[15px]">
              <input
                type="file"
                id="image"
                className="hidden"
                onChange={handleImage}
              />
              <label htmlFor="image">
                <AiOutlineCamera />
              </label>
            </div>
          </div>
        </div>
        <form
          className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-8"
          onSubmit={updateHandler}
        >
          <div className="w-full">
            <label className={`${styles.formLabel}`}>Shop Name</label>
            <input
              type="text"
              placeholder={`${seller.name}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${styles.formInput}`}
              required
            />
          </div>
          <div>
            <label className={`${styles.formLabel}`}>
              Shop Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`${
                seller?.description
                  ? seller.description
                  : "Enter your shop description"
              }`}
              className={`${styles.formInput}`}
              required
              rows="4"
            ></textarea>
          </div>
          <div className="w-full">
            <label className={`${styles.formLabel}`}>Shop Email</label>
            <input
              type="email"
              placeholder={seller?.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${styles.formInput}`}
              required
            />
          </div>
          <div className="w-full">
            <label className={`${styles.formLabel}`}>Shop Phone Number</label>
            <input
              type="tel"
              placeholder={seller?.phoneNumber}
              value={phoneNumber}
              maxLength={10}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={`${styles.formInput}`}
              required
            />
          </div>
          <div className="w-full">
            <label className={`${styles.formLabel}`}>Shop Address</label>
            <input
              type="text"
              placeholder={seller?.address}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`${styles.formInput}`}
              required
            />
          </div>
          <div className="w-full">
            <label className={`${styles.formLabel}`}>Shop Zip Code</label>
            <input
              type="number"
              placeholder={seller?.zipCode}
              value={zipCode}
              onChange={(e) => setZipcode(e.target.value)}
              className={`${styles.formInput}`}
              required
            />
          </div>
          <div className="mt-4">
            <button type="submit" className={`${styles.simpleButton}`}>
              Update Shop
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopSettings;
