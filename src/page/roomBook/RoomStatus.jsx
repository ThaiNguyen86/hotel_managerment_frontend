import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllRooms } from '../../service/apiServices';

function RoomStatus() {
    const [rooms, setRooms] = useState([]);
    const [totalRooms, setTotalRooms] = useState(NaN);
    const [totalPages, setTotalPages] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState(null); //
    const [pageInput, setPageInput] = useState(currentPage); // Input để người dùng nhập
    const [errors, setErrors] = useState({});

    const handlePagination = useCallback((totalRooms) => {
        setTotalRooms(totalRooms);
        setTotalPages(Math.ceil(totalRooms / rowsPerPage));
    }, [rowsPerPage]);


    const fetchListRoom = useCallback(async () => {
        try {
            const queryParams = {
                search: search.trim(),
                sort: sortField,
                limit: rowsPerPage,
                page: currentPage,
            };
            const res = await getAllRooms(queryParams);
            if (res && res.data && res.data.data) {
                setRooms(res.data.data);
                handlePagination(res.data.total);

            }
            else {
                setErrors({ err: res.error.error });
                return;
            }
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }

    }, [search, sortField, rowsPerPage, currentPage, handlePagination]);


    useEffect(() => {
        fetchListRoom();
    }, [fetchListRoom]);

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

    const handleSort = (field, order) => {
        setSortField(order === 'asc' ? field : `-${field}`);
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

    // Other unchanged functions: handleSearch, handleSort, etc.
    return (
        <div className="pt-16 pb-8 pr-8 mt-2  ">
            <ToastContainer />
            <div className="flex items-center mb-3 justify-between">
                <h2 className="font-bold text-3xl font-sans">Room Status</h2>
            </div>

            <div className="bg-white font-dm-sans rounded-md shadow-sm p-3">
                <div className="flex justify-between">
                    <div className="d-flex">
                        <InputGroup>
                            <input
                                placeholder="Enter room name"
                                className="outline-none focus:outline-dashed focus:outline-2 focus:outline-violet-500 border border-gray-300 rounded-md p-2"
                                value={search}
                                onChange={handleSearch}
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

                <Table className="text-center" bordered-y="true" hover>
                    <colgroup>
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '20%' }} />
                        <col style={{ width: '20%' }} />
                        <col style={{ width: '15%' }} />
                        <col style={{ width: '20%' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>
                                ID
                            </th>
                            <th>Room Name
                                <button
                                    onClick={() => handleSort('roomName', 'asc')}
                                    className="ml-1 text-l"
                                >
                                    ▲
                                </button>
                                <button
                                    onClick={() => handleSort('roomName', 'desc')}
                                    className=" text-l"
                                >
                                    ▼
                                </button>
                            </th>
                            <th>Room Type</th>
                            <th>
                                Room Price
                            </th>
                            <th>Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room, index) => (
                            <tr key={room._id}>
                                <td className="align-middle py-3">{index + 1}</td>
                                <td className="align-middle py-3">{room.roomName}</td>
                                <td className="align-middle py-3">{room.roomTypeId.name}</td>
                                <td className="align-middle py-3">{room.roomTypeId.price}</td>
                                <td className="align-middle py-3">
                                    <span
                                        className={`px-2 py-2 font-medium rounded-lg text-white ${room.status === 'available'
                                            ? 'bg-green-600'
                                            : room.status === 'maintenance'
                                                ? 'bg-amber-600'
                                                    : 'bg-black'
                                            }`}
                                    >
                                        {room.status || "N/A"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* Pagination Controls */}
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
                    <span> of {Math.ceil(totalRooms / rowsPerPage)}</span>
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

export default RoomStatus;
