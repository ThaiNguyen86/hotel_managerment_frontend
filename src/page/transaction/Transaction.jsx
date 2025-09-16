import React, { useEffect, useState, useCallback } from 'react';
import { getInvoices } from "../../service/apiServices";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Transaction = () => {
    const [data, setData] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState(null); //
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageInput, setPageInput] = useState(currentPage);
    const [totalPages, setTotalPages] = useState(1);
    const [totalData, setTotalData] = useState(NaN);
    const [error, setError] = useState("");
    const handlePagination = useCallback((totalData) => {
        setTotalData(totalData);
        setTotalPages(Math.ceil(totalData / rowsPerPage));
    }, [rowsPerPage]);

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
    const handleSort = (field, order) => {
        setSortField(order === 'asc' ? field : `-${field}`);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = {
                    page: currentPage,
                    limit: rowsPerPage,
                    search: searchTerm || undefined,
                    sort: sortField, // Dynamic sort parameter
                };

                const response = await getInvoices(params);
                console.log(response);
                if (response.success) {
                    const invoicesData = response.data.data;
                    const combinedData = invoicesData.map((invoice, index) => ({
                        id: (currentPage - 1) * rowsPerPage + index + 1, // Sequential ID
                        customers: invoice.bookingId?.customerIds?.length
                            ? invoice.bookingId.customerIds.map(c => c.fullName).join('\n')
                            : 'N/A',

                        date: invoice.createdAt
                            ? new Date(invoice.createdAt).toLocaleString('vi-VN', { timeZone: 'UTC' })
                            : 'N/A',
                        total: invoice.totalAmount || 0,
                        details: invoice.bookingId?.bookingDetails?.length
                            ? invoice.bookingId.bookingDetails.map(detail => ({
                                roomName: detail.roomId?.roomName || 'N/A',
                                roomPrice: detail.roomPrice || 0,
                            }))
                            : [],
                    }));
                    setData(combinedData);
                    handlePagination(response.data.total);
                } else {
                    setError(response.error.error || "No data available.");
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [currentPage, rowsPerPage, searchTerm, sortField, handlePagination]);

    const toggleDetails = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    useEffect(() => {
        setPageInput(currentPage); // Đồng bộ input khi thay đổi trang

    }, [currentPage]);

    return (
        <div className="pt-16 pb-8 pr-8 mt-2 ">
            <ToastContainer />
            <div className="flex items-center mb-3 justify-between">
                <h2 className="font-bold text-3xl font-sans">Transaction</h2>
            </div>

            <div className="bg-white rounded-md shadow-sm p-3">
                <div className="flex justify-between ">
                    <div className="d-flex items-center">
                        <InputGroup>
                            <input
                                type="text"
                                placeholder="Search"
                                className="outline-none focus:outline-dashed focus:outline-2 focus:outline-violet-500 border border-gray-300 rounded-md p-2"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </InputGroup>
                    </div>
                    <div>
                        <DropdownButton
                            id="dropdownRowsPerPage"
                            title={`${rowsPerPage} rows`}
                            onSelect={(value) => handleRowsPerPageChange(Number(value))}
                            variant="outline-secondary"
                        >
                            {[5, 10, 25, 50].map((value) => (
                                <Dropdown.Item key={value} eventKey={value}>
                                    {value} rows
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </div>
                </div>
                <Table className="align-middle text-center" bordered-y="true" hover>
                    <colgroup>
                        <col style={{ width: '5%' }} />
                        <col style={{ width: '20%' }} />
                        <col style={{ width: '25%' }} />
                        <col style={{ width: '20%' }} />
                        <col style={{ width: '15%' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer</th>
                            <th>Date
                            </th>
                            <th>Total
                                <button
                                    onClick={() => handleSort('totalAmount', 'asc')}
                                    className="ml-1 text-l"
                                >
                                    ▲
                                </button>
                                <button
                                    onClick={() => handleSort('totalAmount', 'desc')}
                                    className=" text-l"
                                >
                                    ▼
                                </button>
                            </th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <React.Fragment key={item.id}>
                                <tr className={index % 2 === 0 ? "bg-light" : ""}>
                                    <td>{item.id}</td>
                                    <td>
                                        {item.customers.split("\n").map((name, idx) => (
                                            <div key={idx}>{name}</div>
                                        ))}
                                    </td>
                                    <td>{item.date}</td>
                                    <td>{item.total.toLocaleString("en-US")} VND</td>
                                    <td>
                                        <Button
                                            variant="link"
                                            className="p-0 text-decoration-none"
                                            onClick={() => toggleDetails(item.id)}
                                        >
                                            {expandedRow === item.id ? "Hide Details" : "Show Details"}
                                        </Button>
                                    </td>
                                </tr>
                                {expandedRow === item.id && (
                                    <tr>
                                        <td colSpan="5" className='p-0'>
                                            <div className="p-3 bg-white shadow-md">
                                                <Table bordered-y="true" className="mx-60 text-left align-middle mb-10">
                                                    <colgroup>
                                                        <col style={{ width: '30%' }} />
                                                        <col style={{ width: '10%' }} />
                                                        <col style={{ width: '30%' }} />
                                                        <col style={{ width: '30%' }} />

                                                    </colgroup>
                                                    <thead>
                                                        <tr>
                                                            <th>Room Name</th>
                                                            <th>Room Price</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {item.details.map((detail, i) => (
                                                            <tr key={i}>
                                                                <td className="py-3">{detail.roomName}</td>
                                                                <td className="py-3">{detail.roomPrice.toLocaleString("en-US")} VND</td>

                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
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
                    <span> of {Math.ceil(totalData / rowsPerPage)}</span>

                    <Button variant="dark"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange('next')}>
                        Next
                    </Button>
                </div>
            </div>
            {error && <div className="alert alert-danger mt-4">{error}</div>}
        </div>
    );
};


export default Transaction;
