import React from 'react';
import MonthlyRoomDensityReport from './reports/MonthlyRoomDensityReport';
import RoomTypeMonthlyReport from './reports/RoomTypeMonthlyReport';
import UsageDensityMonthlyReport from './reports/UsageDensityMonthlyReport';

const DashBoard = () => {
    return (
        <div className="container mt-4">
            <h1>Dashboard</h1>
            <MonthlyRoomDensityReport />
            <RoomTypeMonthlyReport />
            <UsageDensityMonthlyReport />
        </div>
    );
};

export default DashBoard;
