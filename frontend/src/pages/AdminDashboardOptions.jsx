import React from 'react';
import AdminHeader from '../components/Layout/AdminHeader';
import AdminSideBar from '../components/Admin/Layout/AdminSideBar';
import AdminOptions from '../components/Admin/AdminOptions';

const AdminDashboardOptions = () => {
  return (
    <div>
      <AdminHeader />
      <div className="flex items-center justify-between w-full">
      <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={9} />
            </div>
            <div className="w-full justify-center flex">
          <AdminOptions />
        </div>
      </div>
      </div>
  );
};

export default AdminDashboardOptions
