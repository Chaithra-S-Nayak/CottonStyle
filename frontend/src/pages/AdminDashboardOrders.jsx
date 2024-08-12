import React, { useEffect } from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import Footer from "../components/Layout/Footer";
import { DataGrid } from "@material-ui/data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForAdmin } from "../redux/actions/order";
import styles from "../styles/styles";

const AdminDashboardOrders = () => {
  const dispatch = useDispatch();

  const { adminOrders } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 150,
      flex: 0.7,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "createdAt",
      headerName: "Order Date",
      type: "number",
      minWidth: 130,
      flex: 0.8,
      align: "center",
      headerAlign: "center",
    },
  ];

  const row = [];

  adminOrders &&
    adminOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item?.cart?.reduce((acc, item) => acc + item.qty, 0),
        total: "₹" + item?.totalPrice,
        status: item?.status,
        createdAt: item?.createdAt.slice(0, 10),
      });
    });

  return (
    <div>
      <AdminHeader />
      <div className={`${styles.section}`}>
        <div className="w-full flex mt-5">
          <div className="flex items-start justify-between w-full">
            <div className="w-full min-h-[45vh] pt-5 rounded flex justify-center">
              <div className="w-[97%] flex justify-center">
                <DataGrid
                  rows={row}
                  columns={columns}
                  pageSize={10}
                  disableSelectionOnClick
                  autoHeight
                />
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
