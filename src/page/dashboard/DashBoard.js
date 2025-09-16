import React from "react";
import RevenueReport from "./RevenueReport"; // Import component bảng doanh thu
import RoomTypeMonthlyReport from "./RoomTypeMonthly"; // Import bảng Room Type Monthly Report
import UsageDensityMonthlyReport from "./RoomDensityMonthly"; // Import bảng Room Density Monthly Report

const DashBoard = () => {
  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Bảng báo cáo doanh thu hàng tháng */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Monthly Revenue Report</h2>
        <RevenueReport />
      </div>

      {/* Bảng Room Type Monthly Revenue Report */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Room Type Monthly Revenue Report</h2>
        <RoomTypeMonthlyReport />
      </div>

      {/* Thêm khoảng cách giữa hai bảng */}
      <div className="mb-8"></div>

      {/* Bảng Usage Density Monthly Report */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Room Usage Density Monthly Report</h2>
        <UsageDensityMonthlyReport />
      </div> 
      
    </div>
  );
};

export default DashBoard;
