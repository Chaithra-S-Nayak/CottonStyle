import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../server";
import { DataGrid } from "@material-ui/data-grid";
import { BsPencil } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { toast } from "react-toastify";

const AllWithdraw = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState();
  const [withdrawStatus, setWithdrawStatus] = useState("Processing");

  useEffect(() => {
    axios
      .get(`${server}/withdraw/get-all-withdraw-request`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data.withdraws);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "Withdraw Id",
      minWidth: 150,
      flex: 0.7,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Shop Name",
      minWidth: 180,
      flex: 0.7,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "shopId",
      headerName: "Shop Id",
      minWidth: 180,
      flex: 0.7,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 100,
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "status",
      type: "text",
      minWidth: 80,
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "createdAt",
      headerName: "Created at",
      type: "number",
      minWidth: 130,
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: " ",
      headerName: "Update Status",
      type: "number",
      minWidth: 130,
      flex: 0.5,
      renderCell: (params) => {
        return (
          <BsPencil
            size={20}
            className={`${
              params.row.status !== "Processing" ? "hidden" : ""
            } mr-5 cursor-pointer`}
            onClick={() => setOpen(true) || setWithdrawData(params.row)}
          />
        );
      },
      align: "center",
      headerAlign: "center",
    },
  ];

  const handleSubmit = async () => {
    await axios
      .put(
        `${server}/withdraw/update-withdraw-request/${withdrawData.id}`,
        {
          sellerId: withdrawData.shopId,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Withdraw request updated successfully!");
        setData(res.data.withdraws);
        setOpen(false);
        window.location.reload();
      });
  };

  const row = [];

  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        shopId: item.seller._id,
        name: item.seller.name,
        amount: "₹" + item.amount,
        status: item.status,
        createdAt: item.createdAt.slice(0, 10),
      });
    });

  return (
    <div className="w-full flex items-center pt-5 mt-5 justify-center">
      <div className="w-[95%] ">
        <DataGrid
          className="bg-white"
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>
      {open && (
        <div className="w-full fixed h-screen top-0 left-0 bg-[#00000031] z-[9999] flex items-center justify-center">
          <div className="w-[90%] 800px:w-[50%] bg-white min-h-[40vh] rounded-lg shadow-lg p-6">
            <div className="flex justify-end w-full">
              <RxCross1
                size={25}
                onClick={() => setOpen(false)}
                className="cursor-pointer hover:text-red-500 transition duration-200"
              />
            </div>
            <div className="text-center mt-4">
              <h2 className="text-[22px] font-semibold text-gray-800">
                Update Withdraw Status
              </h2>
            </div>
            <div className="mt-8 flex flex-col items-center">
              <select
                name="withdrawStatus"
                id="withdrawStatus"
                onChange={(e) => setWithdrawStatus(e.target.value)}
                className="w-[80%] 800px:w-[200px] h-[40px] border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-200 p-2"
              >
                <option value={withdrawStatus}>{withdrawData.status}</option>
                <option value="Succeed">Succeed</option>
              </select>
              <button
                type="submit"
                className={`${styles.simpleButton} mt-4`}
                onClick={handleSubmit}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllWithdraw;
