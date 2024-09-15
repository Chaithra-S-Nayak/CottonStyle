import React, { useEffect, useState } from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import Footer from "../components/Layout/Footer";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForAdmin } from "../redux/actions/order";
import styles from "../styles/styles";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

const AdminDashboardOrders = () => {
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);

  const { adminOrders } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (adminOrders) {
      const formattedRows = adminOrders.map((item) => ({
        id: item._id,
        itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
        total: "₹" + item.totalPrice,
        status: item.status,
        createdAt: item.createdAt.slice(0, 10),
      }));
      setRows(formattedRows);
    }
  }, [adminOrders]);

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 220,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 220,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "createdAt",
      headerName: "Order Date",
      type: "date",
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "orderDetails",
      flex: 1,
      minWidth: 150,
      headerName: "Order Details",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/admin/order/${params.id}`}>
            <Button>
              <AiOutlineArrowRight size={20} />
            </Button>
          </Link>
        );
      },
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <div>
      <AdminHeader />
      <div className={`${styles.section} min-h-screen`}>
        <div className="w-full flex mt-5">
          <div className="flex items-start justify-between w-full">
            <div className="w-full min-h-[45vh] pt-5 rounded flex justify-center">
              <div className="w-[97%] flex justify-center">
                {rows.length > 0 && (
                  <DataGrid
                    className="bg-white"
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    disableSelectionOnClick
                    autoHeight
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboardOrders;
