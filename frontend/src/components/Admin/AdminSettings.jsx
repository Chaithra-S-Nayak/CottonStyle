import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { server } from "../../server";
import {
  loadAdmin,
  updateAdminProfile,
  clearErrors,
  clearMessages,
} from "../../redux/actions/admin";
import axios from "axios";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../styles/styles";

const AdminSettings = () => {
  const { admin, error, successMessage } = useSelector((state) => state.admin);
  const [name, setName] = useState(admin && admin.name);
  const [email, setEmail] = useState(admin && admin.email);
  const [phoneNumber, setPhoneNumber] = useState(admin && admin.phoneNumber);
  const [avatar, setAvatar] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearMessages());
    }
  }, [error, successMessage, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateAdminProfile(email, name, phoneNumber));
  };

  const handleImage = async (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        axios
          .put(
            `${server}/admin/update-admin-info`,
            { avatar: reader.result },
            {
              withCredentials: true,
            }
          )
          .then(() => {
            dispatch(loadAdmin());
            toast.success("Avatar updated successfully!");
          })
          .catch((error) => {
            toast.error(
              error.response?.data?.message || "Failed to update avatar"
            );
          });
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="bg-white p-6 rounded-md border">
      <div className="flex justify-center mb-4">
        <div className="relative">
          <img
            src={avatar || admin?.avatar?.url}
            className="w-32 h-32 rounded-full object-cover border-4 border-green-500"
            alt="Admin Avatar"
          />
          <div className="absolute bottom-2 right-2 bg-gray-300 rounded-full p-1 cursor-pointer">
            <input
              type="file"
              id="image"
              className="hidden"
              onChange={handleImage}
            />
            <label htmlFor="image">
              <AiOutlineCamera size={20} />
            </label>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`${styles.formLabel}`}>Full Name</label>
          <input
            type="text"
            className={`${styles.formInput}`}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className={`${styles.formLabel}`}>Email Address</label>
          <input
            type="email"
            className={`${styles.formInput}`}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className={`${styles.formLabel}`}>Phone Number</label>
          <input
            type="tel"
            className={`${styles.formInput}`}
            required
            maxLength={10}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <button type="submit" className={`${styles.wideButton}`}>
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
