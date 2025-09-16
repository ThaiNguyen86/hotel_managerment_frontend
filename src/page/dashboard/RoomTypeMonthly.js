import React, { useState, useEffect, useCallback } from "react";
import { fetchRoomTypeMonthlyReport } from "../../service/apiServices";
import "bootstrap/dist/css/bootstrap.min.css";

const RoomTypeMonthly = () => {
    const [data, setData] = useState(null); // Dữ liệu từ API
    const [month, setMonth] = useState("12"); // Tháng mặc định
    const [year, setYear] = useState("2024"); // Năm mặc định
    const [loading, setLoading] = useState(false); // Trạng thái tải
    const [error, setError] = useState(null); // Lỗi nếu xảy ra
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // Cấu hình sắp xếp

    // Hàm fetch dữ liệu từ API
    const fetchReportData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetchRoomTypeMonthlyReport(month, year);
         
            if (response.success && response.data && Array.isArray(response.data.report)) {
                setData(response.data.report); // Lấy dữ liệu từ API
            } 
        } catch (err) {
            setError(err.response.data.error  || "Network error");
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [month, year]);

    // Tự động fetch dữ liệu khi `month` hoặc `year` thay đổi
    useEffect(() => {
        fetchReportData();
    }, [fetchReportData]);

    // Xử lý thay đổi tháng
    const handleMonthChange = (e) => setMonth(e.target.value);

    // Xử lý thay đổi năm
    const handleYearChange = (e) => setYear(e.target.value);

    // Hàm xử lý sắp xếp dữ liệu
    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });

        if (data) {
            const sortedData = [...data].sort((a, b) => {
                if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
                if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
                return 0;
            });
            setData(sortedData);
        }
    };

    // Hàm hiển thị mũi tên chỉ báo sắp xếp
    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === "asc" ? "↑" : "↓";
        }
        return "";
    };

    return (
        <div className="container mt-5">

            {/* Bộ chọn tháng và năm */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <label htmlFor="month" className="form-label">Select Month:</label>
                    <select id="month" className="form-select" value={month} onChange={handleMonthChange}>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                                {new Date(0, i).toLocaleString("en", { month: "long" })}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-4">
                    <label htmlFor="year" className="form-label">Enter Year:</label>
                    <input
                        type="number"
                        id="year"
                        className="form-control"
                        value={year}
                        onChange={handleYearChange}
                        min="2000"
                        max="2100"
                    />
                </div>
               
            </div>

            {/* Phần hiển thị báo cáo */}
            {loading && <p>Loading...</p>}
            {error && <div className="alert alert-danger">{error}</div>}
            {data && Array.isArray(data) && data.length > 0 ? (
                <div>
                    <h4 className="mt-4">Room Type Revenue Data:</h4>
                    <table className="table table-bordered mt-3">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort("roomTypeName")}>
                                    Room Type {getSortIndicator("roomTypeName")}
                                </th>
                                <th onClick={() => handleSort("totalRevenue")}>
                                    Total Revenue (VND) {getSortIndicator("totalRevenue")}
                                </th>
                                <th onClick={() => handleSort("revenue")}>
                                    Revenue (VND) {getSortIndicator("revenue")}
                                </th>
                                <th onClick={() => handleSort("percentage")}>
                                    Percentage (%) {getSortIndicator("percentage")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.roomTypeName}</td>
                                    <td>{item.totalRevenue.toLocaleString()}</td>
                                    <td>{item.revenue.toLocaleString()}</td>
                                    <td>{item.percentage.toFixed(2)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                !loading && !error && <p className="text-warning">No data available for the selected month and year.</p>
            )}
        </div>
    );
};

export default RoomTypeMonthly;
