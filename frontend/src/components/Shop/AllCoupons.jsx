import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { server } from "../../server";
import { toast } from "react-toastify";

const AllCoupons = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [minAmount, setMinAmount] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [value, setValue] = useState(null);
  const { seller } = useSelector((state) => state.seller);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${server}/coupon/get-coupon/${seller._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setIsLoading(false);
        setCoupons(res.data.couponCodes);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, [seller._id]);

  const handleDelete = async (id) => {
    axios
      .delete(`${server}/coupon/delete-coupon/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success("Coupon code deleted successfully!");
      });
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(
        `${server}/coupon/create-coupon-code`,
        {
          name,
          minAmount,
          maxAmount,
          value,
          shopId: seller._id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Coupon code created successfully!");
        setOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const columns = [
    {
      field: "id",
      headerName: "Id",
      minWidth: 150,
      flex: 0.7,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Coupon Code",
      minWidth: 180,
      flex: 1.4,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "price",
      headerName: "Value",
      minWidth: 100,
      flex: 0.6,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Button onClick={() => handleDelete(params.id)}>
            <AiOutlineDelete size={20} />
          </Button>
        );
      },
      align: "center",
      headerAlign: "center",
    },
  ];

  const rows = coupons.map((item) => ({
    id: item._id,
    name: item.name,
    price: `${item.value} %`,
  }));

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full px-4 sm:px-8 pt-1 mt-10">
          <div className="w-full flex justify-end mb-4">
            <div
              className={`${styles.button} !w-max !h-[45px] px-3 !rounded-[5px] mr-3`}
              onClick={() => setOpen(true)}
            >
              <span className="text-white">Create Coupon Code</span>
            </div>
          </div>
          <div className="w-full h-[400px] sm:h-[600px]">
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              autoHeight
            />
          </div>
          {open && (
            <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="w-[90%] sm:w-[80%] md:w-[50%] lg:w-[40%] h-[70vh] bg-white rounded-md shadow p-4 relative overflow-y-auto">
                <div className="absolute top-4 right-4">
                  <RxCross1
                    size={30}
                    className="cursor-pointer"
                    onClick={() => setOpen(false)}
                  />
                </div>
                <h5 className="text-lg font-semibold text-center">
                  Create Coupon Code
                </h5>
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="mb-4">
                    <label className="block mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={name}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your coupon code name"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">
                      Discount Percentage{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="value"
                      value={value}
                      required
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Enter your coupon code value"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Min Amount</label>
                    <input
                      type="number"
                      name="minAmount"
                      value={minAmount}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
                      onChange={(e) => setMinAmount(e.target.value)}
                      placeholder="Enter your coupon code min amount"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-2">Max Amount</label>
                    <input
                      type="number"
                      name="maxAmount"
                      value={maxAmount}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
                      onChange={(e) => setMaxAmount(e.target.value)}
                      placeholder="Enter your coupon code max amount"
                    />
                  </div>
                  <button
                    type="submit"
                    className={`${styles.wideButton} w-full py-2 mt-4`}
                  >
                    Create
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllCoupons;
