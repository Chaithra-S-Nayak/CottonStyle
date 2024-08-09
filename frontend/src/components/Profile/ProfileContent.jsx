import React, { useState, useEffect } from "react";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import styles from "../../styles/styles";
import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { MdTrackChanges } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import {
  deleteUserAddress,
  loadUser,
  updateUserAddress,
  updateUserInformation,
} from "../../redux/actions/user";
import { Country, State } from "country-state-city";
import { toast } from "react-toastify";
import axios from "axios";
import { getAllOrdersOfUser } from "../../redux/actions/order";

const ProfileContent = ({ active }) => {
  const { user, error, successMessage } = useSelector((state) => state.user);
  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch({ type: "clearMessages" });
    }
  }, [dispatch, error, successMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserInformation(name, email, phoneNumber))
      .then(() => {
        toast.success("User information updated successfully!");
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Failed to update user information."
        );
      });
  };

  const handleImage = async (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        axios
          .put(
            `${server}/user/update-avatar`,
            { avatar: reader.result },
            {
              withCredentials: true,
            }
          )
          .then(() => {
            dispatch(loadUser());
            toast.success("Avatar updated successfully!");
          })
          .catch((error) => {
            toast.error(error);
          });
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="w-full">
      {active === 1 && (
        <>
          <div className="flex justify-center mb-4 w-full md:w-1/2 mx-auto">
            <div className="relative">
              <img
                src={`${user?.avatar?.url}`}
                className="w-32 h-32 rounded-full object-cover border-4 border-green-500"
                alt="User Avatar"
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
          <form
            onSubmit={handleSubmit}
            className="space-y-4 w-full md:w-1/2 px-4 md:px-0 mx-auto"
          >
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
                value={phoneNumber}
                maxLength={10}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <button type="submit" className={`${styles.simpleButton}`}>
                Update Profile
              </button>
            </div>
          </form>
        </>
      )}

      {/* order */}
      {active === 2 && (
        <div>
          <AllOrders />
        </div>
      )}

      {/* Refund */}
      {active === 3 && (
        <div>
          <AllRefundOrders />
        </div>
      )}

      {/* Track order */}
      {active === 4 && (
        <div>
          <TrackOrder />
        </div>
      )}

      {/* Change Password */}
      {active === 5 && (
        <div>
          <ChangePassword />
        </div>
      )}

      {/*  user Address */}
      {active === 6 && (
        <div>
          <Address />
        </div>
      )}
    </div>
  );
};

const AllOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "₹" + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={8}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

const AllRefundOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const eligibleOrders =
    orders && orders.filter((item) => item.status === "Processing refund");

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  eligibleOrders &&
    eligibleOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "₹" + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        autoHeight
        disableSelectionOnClick
      />
    </div>
  );
};

const TrackOrder = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/track/order/${params.id}`}>
              <Button>
                <MdTrackChanges size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "₹" + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
};

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordChangeHandler = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    try {
      await axios.put(
        `${server}/user/change-user-password`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );
      toast.success("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="w-full px-5">
      <h1 className={`${styles.formHeading}`}>Change Password</h1>
      <div className="w-full">
        <form
          onSubmit={passwordChangeHandler}
          className="flex flex-col items-center"
        >
          <div className=" w-[100%] 800px:w-[50%] mt-5">
            <label className={`${styles.formLabel}`}>
              Enter your old password
            </label>
            <input
              type="password"
              className={`${styles.formInput}`}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className=" w-[100%] 800px:w-[50%] mt-2">
            <label className={`${styles.formLabel}`}>
              Enter your new password
            </label>
            <input
              type="password"
              className={`${styles.formInput}`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className=" w-[100%] 800px:w-[50%] mt-2">
            <label className={`${styles.formLabel}`}>
              Enter your confirm password
            </label>
            <input
              type="password"
              className={`${styles.formInput}`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button className={`${styles.wideButton} mt-4`} type="submit">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Address = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const addressTypeData = [
    { name: "Default" },
    { name: "Home" },
    { name: "Office" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (addressType === "" || country === "" || city === "") {
      toast.error("Please fill all the fields!");
    } else {
      dispatch(
        updateUserAddress(
          country,
          city,
          address1,
          address2,
          zipCode,
          addressType
        )
      );
      setOpen(false);
      setCountry("");
      setCity("");
      setAddress1("");
      setAddress2("");
      setZipCode("");
      setAddressType("");
    }
  };

  const handleDelete = (item) => {
    const id = item._id;
    dispatch(deleteUserAddress(id));
  };

  return (
    <div className="w-full px-5">
      {open && (
        <div className="fixed w-full h-screen bg-[#0000004b] top-0 left-0 flex items-center justify-center">
          <div className="w-[90%] md:w-[60%] lg:w-[35%] h-[80vh] bg-white rounded shadow relative overflow-y-scroll">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <h1 className={`${styles.formHeading} text-center`}>
              Add New Address
            </h1>
            <div className="w-full">
              <form onSubmit={handleSubmit} className="w-full p-4">
                <div className="w-full pb-2">
                  <label className={`${styles.formLabel}`}>Country</label>
                  <select
                    name=""
                    id=""
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className={`${styles.formInput}`}
                  >
                    <option value="">Select your country</option>
                    {Country &&
                      Country.getAllCountries().map((item) => (
                        <option key={item.isoCode} value={item.isoCode}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="w-full pb-2">
                  <label className={`${styles.formLabel}`}>
                    Choose your City
                  </label>
                  <select
                    name=""
                    id=""
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={`${styles.formInput}`}
                  >
                    <option value="">Select your city</option>
                    {State &&
                      State.getStatesOfCountry(country).map((item) => (
                        <option key={item.isoCode} value={item.isoCode}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="w-full pb-2">
                  <label className={`${styles.formLabel}`}>Address 1</label>
                  <textarea
                    type="text"
                    className={`${styles.formInput}`}
                    required
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                  />
                </div>
                <div className="w-full pb-2">
                  <label className={`${styles.formLabel}`}>Address 2</label>
                  <textarea
                    type="text"
                    className={`${styles.formInput}`}
                    required
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                  />
                </div>
                <div className="w-full pb-2">
                  <label className={`${styles.formLabel}`}>Zip Code</label>
                  <input
                    type="number"
                    className={`${styles.formInput}`}
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>
                <div className="w-full pb-2">
                  <label className={`${styles.formLabel}`}>Address Type</label>
                  <select
                    name=""
                    id=""
                    value={addressType}
                    onChange={(e) => setAddressType(e.target.value)}
                    className={`${styles.formInput}`}
                  >
                    <option value="">Choose your Address Type</option>
                    {addressTypeData.map((item) => (
                      <option key={item.name} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full pb-2">
                  <button className={`${styles.wideButton} mt-4`} type="submit">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-[20px] font-[600] text-[#000000ba] pb-2">
          My Address
        </h1>
        <button
          className={`${styles.simpleButton}`}
          type="submit"
          onClick={() => setOpen(true)}
        >
          Add new
        </button>
      </div>
      <br />
      {user &&
        user.addresses.map((item, index) => (
          <div
            className="w-full border h-min lg:h-[70px] rounded-[4px] flex flex-col lg:flex-row items-center px-3 shadow justify-between pr-10 mb-5"
            key={index}
          >
            <div className="flex items-center">
              <h5 className="pl-5 font-[600]">{item.addressType}</h5>
            </div>
            <div className="pl-8 flex items-center">
              <h6 className="text-[12px] lg:text-[unset]">
                {item.address1} {item.address2}
              </h6>
            </div>
            <div className="pl-8 flex items-center">
              <h6 className="text-[12px] lg:text-[unset]">
                {user && user.phoneNumber}
              </h6>
            </div>
            <div className="min-w-[10%] flex items-center justify-between pl-8">
              <AiOutlineDelete
                size={25}
                className="cursor-pointer"
                onClick={() => handleDelete(item)}
              />
            </div>
          </div>
        ))}
      {user && user.addresses.length === 0 && (
        <h5 className="text-center pt-8 text-[18px]">
          You do not have any saved address!
        </h5>
      )}
    </div>
  );
};

export default ProfileContent;
