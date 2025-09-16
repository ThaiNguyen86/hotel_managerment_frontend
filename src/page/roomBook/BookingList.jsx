// <<<<<<< HEAD
import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllBookings } from '../../service/apiServices';
import { useNavigate } from 'react-router-dom';

const BookingList = () => {
    const navigate = useNavigate();
    const [expandedRow, setExpandedRow] = useState(null);

    const [bookings, setBookings] = useState([]);
    const [totalBookings, setTotalBookings] = useState(NaN);
    const [totalPages, setTotalPages] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState(null); //
    const [pageInput, setPageInput] = useState(currentPage); // Input để người dùng nhập
    const [errors, setErrors] = useState({});

    const toggleDetails = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };
    const handlePagination = useCallback((totalBookings) => {
        setTotalBookings(totalBookings);
        setTotalPages(Math.ceil(totalBookings / rowsPerPage));
    }, [rowsPerPage]);

    const fetchListBooking = useCallback(async () => {
        try {
            const queryParams = {
                search: search?.trim(),
                sort: sortField,
                limit: rowsPerPage,
                page: currentPage,
            };

            const res = await getAllBookings(queryParams);
         
            if (res && res.data && res.data.data) {
                const data = res.data.data;
        
                const combinedData = data.map((booking, index) => ({
                    id: booking._id,
                    index: index + 1,
                    status: booking.status,
                    customers: booking.customerIds && booking.customerIds.length > 0
                        ? booking.customerIds.map(c => c.fullName).join('\n')
                        : null,
                    bookingDetails: booking.bookingDetails,
                    employee: booking.userId?.fullName || "N/A",
                    date: new Date(booking.createdAt).toLocaleString('vi-VN', { timeZone: 'UTC' }),
                }));
                setBookings(combinedData);
                handlePagination(res.data.total);

            }
            else {
                setErrors({ err: res.error.error });
                return;
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    }, [search, sortField, rowsPerPage, currentPage, handlePagination]);

    useEffect(() => {
        fetchListBooking();
    }, [fetchListBooking]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };
    const handleRowsPerPageChange = (value) => {
        setRowsPerPage(Number(value));
        setCurrentPage(1); // Reset về trang 1 khi thay đổi số dòng trên 1 trang
    };

    const handlePageChange = (type) => {
        if (type === 'prev') {
            setCurrentPage((prev) => prev - 1);
        } else {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePageInput = (e) => {
        setPageInput(e.target.value);
    };

    const handleGoToPage = () => {
        const page = parseInt(pageInput, 10);
        if (!isNaN(page) && page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        } else {
            toast.error("Invalid page number!", { autoClose: 2000 });
            setPageInput(currentPage); // Reset input về trang hiện tại nếu không hợp lệ
        }
    };

    useEffect(() => {
        setPageInput(currentPage); // Đồng bộ input khi thay đổi trang
    }, [currentPage]);

    return (
        <div className="pt-16 pb-8 pr-8 mt-2 ">
            <ToastContainer />
            <div className="flex items-center mb-3 justify-between">
                <h2 className="font-bold text-3xl font-sans">Booking List</h2>
                <Button variant="dark" onClick={() => navigate('/room-book')}>Add Booking</Button>
            </div>

            <div className="bg-white font-dm-sans rounded-md shadow-sm p-3">
                <div className="flex justify-between">
                    <div className="d-flex items-center">
                        <InputGroup>
                            <input
                                placeholder="Search"
                                className="outline-none focus:outline-dashed focus:outline-2 focus:outline-violet-500 border border-gray-300 rounded-md p-2"
                                value={search}
                                onChange={handleSearch}
                                type="text"
                            />
                        </InputGroup>
                    </div>
                    <div className="flex ">
                        {/* Rows Per Page Dropdown */}
                        <DropdownButton
                            id="dropdownRowsPerPage"
                            title={`${rowsPerPage} rows`}
                            onSelect={handleRowsPerPageChange}
                            variant="outline-secondary"
                        >
                            {[5, 10, 25, 50].map((value) => (
                                <Dropdown.Item eventKey={value} key={value}>
                                    {value} rows
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </div>

                </div>

                <Table className="text-center align-middle" bordered-y="true" hover>
                    <colgroup>
                        <col style={{ width: '5%' }} />
                        <col style={{ width: '20%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '15%' }} />
                        <col style={{ width: '20%' }} />
                        <col style={{ width: '5%' }} />
                        <col style={{ width: '10%' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>
                                ID
                            </th>
                            <th>Customers</th>
                            <th>User

                            </th>
                            <th>Number of Rooms</th>
                            <th>
                                Date

                            </th>
                            <th>Status</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings &&
                            bookings.length > 0 &&
                            bookings.map((booking) =>
                                <React.Fragment key={booking.id}>
                                    <tr key={`${booking.id}`}>
                                        <td className="py-3">{booking.index}</td>
                                        <td>
                                            {booking.customers.split("\n").map((name, idx) => (
                                                <div key={idx}>{name}</div>
                                            ))}
                                        </td>
                                        <td className="py-3">{booking.employee}</td>
                                        <td className="py-3">{booking.bookingDetails?.length}</td>
                                        <td className="py-3">{booking.date}</td>
                                        <td className="py-3">
                                            <span
                                                className={`px-2 py-2 font-medium rounded-lg text-white ${booking.status === 'completed'
                                                    ? 'bg-green-600'
                                                    : booking.status === 'confirmed'
                                                        ? 'bg-amber-600'
                                                        : booking.status === 'cancelled'
                                                            ? 'bg-red-600'
                                                            : 'bg-blue-600'
                                                    }`}
                                            >
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td>
                                            <Button
                                                variant="link"
                                                className="p-0 text-decoration-none"
                                                onClick={() => toggleDetails(booking.id)}
                                            >
                                                {expandedRow === booking.id ? "Hide Details" : "Show Details"}
                                            </Button>
                                        </td>
                                    </tr>
                                    {expandedRow === booking.id && (
                                        <tr>
                                            <td colSpan="7" className='p-0'>
                                                <div className="p-3 bg-white shadow-md">
                                                    <Table bordered-y="true" className="text-center align-middle mb-10">
                                                        <colgroup>
                                                            <col style={{ width: '5%' }} />
                                                            <col style={{ width: '20%' }} />
                                                            <col style={{ width: '20%' }} />
                                                            <col style={{ width: '20%' }} />
                                                            <col style={{ width: '20%' }} />
                                                            <col style={{ width: '20%' }} />
                                                        </colgroup>
                                                        <thead>
                                                            <tr>
                                                                <th>ID</th>
                                                                <th>Room Name</th>
                                                                <th>Room Price</th>
                                                                <th>Number of Guests</th>
                                                                <th>CheckIn Date</th>
                                                                <th>CheckOut Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {booking.bookingDetails.map((detail, index) => (
                                                                <tr key={detail._id || index}>
                                                                    <td className="py-3">{index + 1}</td>
                                                                    <td className="py-3">{detail.roomId?.roomName || "N/A"}</td>
                                                                    <td className="py-3">{detail.roomPrice ? detail.roomPrice.toLocaleString("en-US") + " VND" : "N/A"}</td>
                                                                    <td className="py-3">{detail.numberOfGuests ?? "N/A"}</td>
                                                                    <td className="py-3">
                                                                        {detail.checkInDate ? new Date(detail.checkInDate).toLocaleString("vi-VN", { timeZone: "UTC" }) : "N/A"}
                                                                    </td>
                                                                    <td className="py-3">
                                                                        {detail.checkOutDate ? new Date(detail.checkOutDate).toLocaleString("vi-VN", { timeZone: "UTC" }) : "N/A"}
                                                                    </td>
                                                                </tr>
                                                            ))}

                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            )
                        }
                    </tbody>
                </Table>
                <div className="flex items-center justify-end gap-3">
                    <Button variant="dark"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange('prev')}>
                        Previous
                    </Button>

                    <span>Page </span>
                    <input
                        type="number"
                        value={pageInput}
                        onChange={handlePageInput}
                        className="text-center px-1 py-2 text-sm rounded-md border border-gray-500 w-12"
                        onKeyPress={(e) => e.key === "Enter" && handleGoToPage()}
                        onBlur={handleGoToPage}
                    />
                    <span> of {Math.ceil(totalBookings / rowsPerPage)}</span>

                    <Button variant="dark"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange('next')}>
                        Next
                    </Button>
                </div>
            </div>
            <div className="mt-4">
                {errors.err && <div className="alert alert-danger">{errors.err}</div>}
            </div>
        </div>

    );
}

export default BookingList;
