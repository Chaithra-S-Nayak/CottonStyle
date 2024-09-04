import React, { useEffect } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch, seller._id]);

  const availableBalance = seller?.availableBalance.toFixed(2);

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
          <Link to={`/order/${params.id}`}>
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

  const rows = [];

  orders &&
    orders.forEach((item) => {
      rows.push({
        id: item._id,
        itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
        total: "₹" + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className={`${styles.section}`}>
      <div className="w-full block 800px:flex items-center justify-between mt-4">
        <div className="w-full bg-white mb-4 800px:w-[30%] min-h-[10vh] shadow rounded px-2 py-5 flex flex-col items-center">
          <div className={`${styles.normalFlex}`}>
            <h3 className={`${styles.title}`}>Account Balance</h3>
          </div>
          <h5 className="pt-2 text-[22px] font-[500]">₹{availableBalance}</h5>
          <Link to="/dashboard-withdraw-money">
            <h5 className="pt-2 text-[#077f9c]">Withdraw Money</h5>
          </Link>
        </div>
        <div className="w-full bg-white mb-4 800px:w-[30%] min-h-[10vh] shadow rounded px-2 py-5 flex flex-col items-center">
          <div className={`${styles.normalFlex}`}>
            <h3 className={`${styles.title}`}>All Orders</h3>
          </div>
          <h5 className="pt-2 text-[22px] font-[500]">
            {orders && orders.length}
          </h5>
          <Link to="/dashboard-orders">
            <h5 className="pt-2 text-[#077f9c]">View Orders</h5>
          </Link>
        </div>
        <div className="w-full bg-white mb-4 800px:w-[30%] min-h-[10vh] shadow rounded px-2 py-5 flex flex-col items-center">
          <div className={`${styles.normalFlex}`}>
            <h3 className={`${styles.title}`}>All Products</h3>
          </div>
          <h5 className="pt-2 text-[22px] font-[500]">
            {products && products.length}
          </h5>
          <Link to="/dashboard-products">
            <h5 className="pt-2 text-[#077f9c]">View Products</h5>
          </Link>
        </div>
      </div>
      <h3 className={`${styles.title} m-4`}>Latest Orders</h3>
      <div className="w-full min-h-[45vh] rounded">
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
  );
};

export default DashboardHero;
