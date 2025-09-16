import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap
import { getUncompletedBookings, addInvoice } from "../../service/apiServices";
import { toast } from "react-toastify";
import { ToastContainer } from "react-bootstrap";

const RoomCheckout = () => {
    const [roomID, setRoomID] = useState("");
    const [error, setError] = useState("");
    const [foundBills, setFoundBills] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [totalBookings, setTotalBookings] = useState(0);

    // Tải dữ liệu khi trang load
    useEffect(() => {
        fetchBookings();
    }, [roomID, totalBookings]);

    const fetchBookings = async () => {
        setError("");
        setFoundBills([]);
        setSuccessMessage("");
        try {
            const response = await getUncompletedBookings({ search: roomID, limit: totalBookings });
            if (response.success) {
                const bookings = response.data.data;
                setTotalBookings(response.data.total);
                // Lọc kết quả để chỉ lấy các phòng khớp với roomID (nếu có)
                const filteredBookings = bookings.filter((booking) =>
                    booking.bookingDetails.some((detail) =>
                        detail.roomId.roomName
                            .toLowerCase()
                            .includes(roomID.toLowerCase())
                    )
                );
   
                if (filteredBookings.length > 0) {
                    setFoundBills(filteredBookings);
          
                }
                if (roomID && filteredBookings.length === 0) {
                    setError("No bookings found for this room.");
                }
            } else {
                setError("Failed to fetch bookings. Please try again later.");
            }
        } catch (err) {
            setError("Failed to fetch bookings. Please try again later.");
        }
    };

    const handleCheckout = async (id) => {
        try {
            const response = await addInvoice({ bookingId: id });
            console.log(response); 
            if (response.success) {
                toast.success("Checkout successfully!",{autoClose: 2000});
                setFoundBills(foundBills.filter((bill) => bill._id !== id));
            } else {
                setError("Failed to checkout. Please try again later.");
            }
        } catch (err) {
            setError("Failed to checkout. Please try again later.");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            fetchBookings();
        }
    };

    return (
        <div className="pt-16 pb-8 pr-8 mt-2">
            <ToastContainer />
            <div className="flex items-center mb-3 justify-between">
                <h2 className="font-bold text-3xl font-sans">Room Checkout</h2>
            </div>
            {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
            )}
            <div className="card mb-4 shadow">
                <div className="card-header bg-white">
                    <h4 className="mb-0">Search for Room</h4>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <label htmlFor="roomID" className="form-label">
                            Room Name
                        </label>
                        <input
                            type="text"
                            id="roomID"
                            placeholder="Enter room name"
                            className="form-control"
                            value={roomID}
                            onChange={(e) => setRoomID(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {foundBills.length > 0 && (
                <>
                    {foundBills.map((foundBill, index) => (
                        <div key={foundBill._id} className="card shadow mb-4">
                            <div className="card-header bg-white">
                                <h4 className="mb-0">Customer Details - Booking {index + 1}</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered-y table-striped">
                                        <thead className="table-light">
                                            <tr>
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Phone</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {foundBill.customerIds.map((customer, idx) => (
                                                <tr key={idx}>
                                                    <td>{idx + 1}</td>
                                                    <td>{customer.fullName}</td>
                                                    <td>{customer.phone}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="card bg-white shadow mb-4">
                                <div className="card-header bg-white">
                                    <h4 className="mb-0">Booking Details</h4>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Room</th>
                                                    <th>Check-In</th>
                                                    <th>Check-Out</th>
                                                    <th>Price</th>
                                                    <th>Additional Fees</th>
                                                    <th>Total</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {foundBill.bookingDetails.map((detail, idx) => (
                                                    <tr key={idx}>
                                                        <td>{idx + 1}</td>
                                                        <td className="text-truncate" style={{ maxWidth: "150px" }}>
                                                            {detail.roomId.roomName}
                                                        </td>
                                                        <td>{new Date(detail.checkInDate).toLocaleDateString()}</td>
                                                        <td>{new Date(detail.checkOutDate).toLocaleDateString()}</td>
                                                        <td>{detail.roomPrice} VNĐ</td>
                                                        <td>
                                                            {detail.additionalFees.map((fee) => (
                                                                <div key={fee._id}>
                                                                    {fee.description}: {fee.amount} VNĐ
                                                                </div>
                                                            ))}
                                                        </td>
                                                        <td>{detail.totalPrice} VNĐ</td>
                                                        <td>{foundBill.status}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="text-end mt-3">
                                <button
                                    className="btn btn-dark me-3 mb-3"
                                    onClick={() => handleCheckout(foundBill._id)}
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default RoomCheckout;
