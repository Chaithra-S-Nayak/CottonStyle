import React, { useEffect } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForAdmin } from "../../redux/actions/order";
import { getAllSellers } from "../../redux/actions/sellers";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { Button } from "@mui/material";

const AdminDashboardMain = () => {
  const dispatch = useDispatch();
  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );

  const { sellers } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
    dispatch(getAllSellers());
  }, [dispatch]);

  const adminEarning =
    adminOrders &&
    adminOrders.reduce((acc, item) => acc + item.totalPrice * 0.1, 0);
  const adminBalance = adminEarning?.toFixed(2);

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
      field: "orderDetails",
      flex: 1,
      minWidth: 150,
      headerName: "Order Details",
      type: "number",
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

  const rows = adminOrders
    ? adminOrders.map((item) => ({
        id: item._id,
        itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
        total: "₹" + item.totalPrice,
        status: item.status,
        createdAt: item.createdAt.slice(0, 10),
      }))
    : [];

  return (
    <>
      {adminOrderLoading ? (
        <Loader />
      ) : (
        <div className={`${styles.section}`}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="bg-white rounded border px-2 py-5 flex flex-col items-center min-h-[10vh]">
              <div className={`${styles.normalFlex}`}>
                <h3 className={`${styles.title}`}>Total Earning</h3>
              </div>
              <h5 className="pt-2 text-[22px] font-[500]">₹{adminBalance}</h5>
            </div>

            <div className="bg-white rounded border px-2 py-5 flex flex-col items-center min-h-[10vh]">
              <div className={`${styles.normalFlex}`}>
                <h3 className={`${styles.title}`}>All Sellers</h3>
              </div>
              <h5 className="pt-2 text-[22px] font-[500]">
                {sellers && sellers.length}
              </h5>
              <Link to="/admin-sellers">
                <h5 className="pt-2 text-[#077f9c]">View Sellers</h5>
              </Link>
            </div>

            <div className="bg-white rounded border px-2 py-5 flex flex-col items-center min-h-[10vh]">
              <div className="flex items-center">
                <h3 className={`${styles.title}`}>All Orders</h3>
              </div>
              <h5 className="pt-2 text-[22px] font-[500]">
                {adminOrders && adminOrders.length}
              </h5>
              <Link to="/admin-orders">
                <h5 className="pt-2 text-[#077f9c]">View Orders</h5>
              </Link>
            </div>
          </div>

          <h3 className={`${styles.title} m-4`}>Latest Orders</h3>
          <div className="w-full min-h-[45vh] rounded">
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
      )}
    </>
  );
};

export default AdminDashboardMain;
