import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import CreateEvent from "../../components/Shop/CreateEvent";

const ShopCreateEvents = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-center justify-between w-full">
        <div className="w-full justify-center flex">
          <CreateEvent />
        </div>
      </div>
    </div>
  );
};

export default ShopCreateEvents;
