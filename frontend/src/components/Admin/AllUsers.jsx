import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux/actions/user";
import { DataGrid } from "@mui/x-data-grid";
import { AiOutlineDelete } from "react-icons/ai";
import { Button } from "@mui/material";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const AllUsers = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (users) {
      const formattedRows = users.map((item) => ({
        id: item._id,
        name: item.name,
        email: item.email,
        phoneNumber: item.phoneNumber,
        role: item.role,
        joinedAt: item.createdAt.slice(0, 10),
      }));
      setRows(formattedRows);
    }
  }, [users]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/user/delete-user/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllUsers()); // Refresh the user list after deletion
      })
      .catch((error) => {
        toast.error("Failed to delete user");
      });
  };

  const columns = [
    {
      field: "id",
      headerName: "User ID",
      minWidth: 220,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 220,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "email",
      headerName: "Email",
      type: "text",
      minWidth: 250,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      type: "text",
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "role",
      headerName: "User Role",
      type: "text",
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "joinedAt",
      headerName: "Joined on",
      type: "date",
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Delete User",
      minWidth: 150,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Button
          onClick={() => {
            setUserId(params.id);
            setOpen(true);
          }}
        >
          <AiOutlineDelete size={20} />
        </Button>
      ),
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <div className="w-full flex justify-center pt-5 mt-5 min-h-screen">
      <div className="w-[97%]">
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
        {open && (
          <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
            <div className="w-[95%] bg-white 800px:w-[40%] min-h-[20vh] p-6 rounded-lg shadow-lg">
              <div className="flex justify-end cursor-pointer">
                <RxCross1
                  size={25}
                  onClick={() => setOpen(false)}
                  className="hover:text-red-500 transition duration-200"
                />
              </div>
              <div className="text-center py-5">
                <div className="text-[20px] font-semibold font-Poppins text-[#000000cb]">
                  Are you sure you want to delete this user?
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  className={`${styles.simpleButton}`}
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className={`${styles.simpleButton} !bg-red-500`}
                  onClick={() => {
                    setOpen(false);
                    handleDelete(userId);
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
