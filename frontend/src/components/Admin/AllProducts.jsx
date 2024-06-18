import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { useState } from "react";
import styles from "../../styles/styles";
const AllProducts = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${server}/product/admin-all-products`, { withCredentials: true })
      .then((res) => {
        setData(res.data.products);
      });
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "Product Id",
      minWidth: 150,
      flex: 0.8,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 0.6,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 130,
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Preview",
      flex: 0.3,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
      align: "center",
      headerAlign: "center",
    },
  ];

  const row = [];

  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: "₹" + item.discountPrice,
        Stock: item.stock,
        sold: item?.sold_out,
      });
    });

  return (
    <div className={`${styles.section}`}>
      <div className="w-full mx-8 pt-1 mt-10 ">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>
    </div>
  );
};

export default AllProducts;
