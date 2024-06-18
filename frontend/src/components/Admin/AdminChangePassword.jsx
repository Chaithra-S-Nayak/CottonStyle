import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";

const AdminChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordChangeHandler = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    await axios
      .put(
        `${server}/admin/change-admin-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Password updated successfully");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className=" p-6 rounded-md border ">
      <h1 className="text-xl font-semibold text-gray-700 mb-4 text-center">
        Change Password
      </h1>
      <form onSubmit={passwordChangeHandler} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Enter your old password
          </label>
          <input
            type="password"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Enter your new password
          </label>
          <input
            type="password"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm your new password
          </label>
          <input
            type="password"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#243450] text-white py-2 rounded-md transition duration-300"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default AdminChangePassword;
