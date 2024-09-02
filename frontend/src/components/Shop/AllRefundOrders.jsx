import axios from "axios";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { server } from "../../server";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineArrowRight } from "react-icons/ai";
import { toast } from "react-toastify";

const AllRefundOrders = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchReturnRequests = async () => {
      try {
        const response = await axios.get(
          `${server}/returnRequest/get-all-exchange-requests`,
          { withCredentials: true }
        );
        setData(response.data.exchangeRequests || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
        setData([]);
      }
    };

    fetchReturnRequests();
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "Request ID",
      minWidth: 150,
      flex: 0.7,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "shopId",
      headerName: "Shop ID",
      minWidth: 180,
      flex: 0.7,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "orderId",
      headerName: "Order ID",
      minWidth: 180,
      flex: 0.7,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "userId",
      headerName: "User Id",
      minWidth: 100,
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "createdAt",
      headerName: "Created At",
      type: "dateTime",
      minWidth: 180,
      flex: 0.7,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 130,
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Link to={`/shop-exchange-details/${params.id}`}>
          <Button>
            <AiOutlineArrowRight size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  const rows =
    data?.map((item) => ({
      id: item._id,
      shopId: item.shopId,
      orderId: item.orderId,
      userId: item.userId,
      userEmail: item.userEmail,
      createdAt: new Date(item.createdAt).toLocaleDateString(),
    })) || [];

  return (
    <div className="w-full flex items-center pt-5 mt-5 justify-center">
      <div className="w-[95%]">
        <DataGrid
          className="bg-white"
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>
    </div>
  );
};

export default AllRefundOrders;
