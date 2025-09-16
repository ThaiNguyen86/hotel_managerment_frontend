import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Form, Offcanvas, InputGroup, FormControl, DropdownButton, Dropdown } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllUsers, updateUser, deleteUser, getAllRoles } from "../../service/apiServices";

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState({});
    const [formData, setFormData] = useState({});
    const [showDetails, setShowDetails] = useState(null);
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [errors, setErrors] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(NaN);
    const [pageInput, setPageInput] = useState(currentPage); // Input để người dùng nhập

    const handlePagination = useCallback((total) => {
        setTotalUsers(total);
        setTotalPages(Math.ceil(total / rowsPerPage));
    }, [rowsPerPage]);

    useEffect(() => {
        fetchUsers();
    }, [currentPage, rowsPerPage, handlePagination]);
    useEffect(() => {
        fetchRoles();
    }, []);
    const fetchRoles = async () => {
        try {
            const response = await getAllRoles();
       
            if (response.success) {
                setRoles(response.data.data);
            } else {
                setErrors(response.error.error);
            }
        } catch (err) {
            console.error(err.message || "Error fetching roles", err);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await getAllUsers({
                limit: rowsPerPage,
                page: currentPage,
            })
      
            if (response.success) {
                setUsers(response.data.data);
                handlePagination(response.data.total);
            } else {
                setErrors(response.error.error);
            }
        } catch (err) {
            console.error(err.message || "Error fetching users", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await deleteUser(id);
                if (response.success) {
                    setUsers(users.filter((user) => user._id !== id));
                    toast.success("User deleted successfully");
                } else {
                    toast.error(response.error.error, { autoClose: 2000 });
                }
            } catch (error) {
                toast.error(error.message || "Error deleting user");
            }
        }
    };

    const handleEditClick = (user) => {
        setEditData(user);
   

        setFullName(user.fullName);
        setPhone(user.phone);
        setAddress(user.address);
        setUserName(user.username);
        setPassword(user.password);
        setFormData({ role: user.role.map((role) => role._id) });
        setShowModal(true);
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


    const handleModalClose = () => {
        setShowModal(false);
        setEditData(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {

            if (editData) {
                const response = await updateUser(editData._id, {
                    username: username,
                    password: password,
                    fullName: fullName,
                    phone: phone,
                    address: address,
                    role: formData.role, // Gửi danh sách role
                });
          
                if (response.success === true) {
                    setUsers(users.map((user) => (user._id === editData._id ? response.data : user)));
                    toast.success(response.data.message, { autoClose: 2000 });
                    fetchUsers();
                    handleModalClose();
                }
                else {
           
                    toast.error(response.error.message, { autoClose: 2000 });
                }
            }
        } catch (error) {
            toast.error(error.message || "Error saving user", { autoClose: 2000 });
        }
    };


    return (
        <div className="pt-16 pb-8 pr-8 mt-2">
            <ToastContainer />
            <div className="flex items-center mb-3 justify-between">
                <h2 className="font-bold text-3xl font-sans">User Management</h2>
            </div>
            <div className="bg-white font-dm-sans rounded-md shadow-sm p-3">
                <div className="flex justify-end items-center mb-3">
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
                <Table className="text-center align-middle" bordered-y="true" hover>
                    <colgroup>
                        <col style={{ width: '5%' }} />
                        <col style={{ width: '25%' }} />
                        <col style={{ width: '25%' }} />
                        <col style={{ width: '10%' }} />
                        <col style={{ width: '25%' }} />
                    </colgroup>
                    <thead>
                        <tr>

                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Role</th>
                            <th>Actions</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <>
                                <tr key={user._id}>
                                    <td>{index + 1}</td>
                                    <td>{user.fullName}</td>
                                    <td>
                                        {user.role && user.role.length > 0
                                            ? user.role.map((role) => role.name).join(", ")
                                            : "No roles assigned"}
                                    </td>
                                    <td className="flex justify-center gap-2 p-3">
                                        <button
                                            className="hover:text-blue-800 text-blue-500 text-xl"
                                            onClick={() => handleEditClick(user)}
                                        >
                                            ✎
                                        </button>
                                    </td>
                                    <td>
                                        <Button
                                            variant="link"
                                            className="p-0 text-decoration-none"
                                            onClick={() => setShowDetails(showDetails === user._id ? null : user._id)}
                                        >
                                            {showDetails === user._id ? "Hide Details" : "Show Details"}
                                        </Button>
                                    </td>
                                </tr>
                                {showDetails === user._id && (

                                    <tr>
                                        <td colSpan="6" className="p-0">
                                            <div className="p-3 bg-white shadow-md">
                                                <Table bordered-y="true" className="text-center align-middle mb-10">
                                                    <colgroup>
                                                        <col style={{ width: '20%' }} />
                                                        <col style={{ width: '30%' }} />
                                                        <col style={{ width: '50%' }} />
                                                    
                                                    </colgroup>
                                                    <thead>
                                                        <tr>
                                                            <th>Username</th>
                                                            

                                                            <th>Phone</th>
                                                            <th>Address</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>

                                                            <td>{user.username}</td>
                                                          


                                                            <td>{user.phone || "N/A"}</td>

                                                            <td>{user.address || "N/A"}</td>
                                                        </tr>

                                                    </tbody>
                                                </Table>
                                            </div>
                                        </td>
                                    </tr>
                                )}

                            </>
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
                    <span> of {Math.ceil(totalUsers / rowsPerPage)}</span>

                    <Button variant="dark"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange('next')}>
                        Next
                    </Button>
                </div>

                <Offcanvas show={showModal} onHide={handleModalClose} placement="end">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Edit User</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Form onSubmit={handleSave}>
                            <div className="mb-3 mt-3">
                                <label htmlFor="fullName" className="form-label ">Full Name <span style={{ color: 'red' }}>*</span></label>
                                <InputGroup>
                                    <FormControl
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Enter your full name"
                                        className="shadow-sm"
                                    />
                                </InputGroup>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label ">Phone</label>
                                <InputGroup>
                                    <FormControl
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Enter your phone"
                                        className="shadow-sm"
                                    />
                                </InputGroup>

                            </div>
                            <div className="mb-3">
                                <label htmlFor="address" className="form-label ">Address</label>
                                <InputGroup>
                                    <FormControl
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Enter your address"
                                        className="shadow-sm"
                                    />
                                </InputGroup>
                            </div>
                            <Form.Group className="mb-3">
                                <Form.Label>Role</Form.Label>
                                <Form.Select
                                    multiple
                                    as="select"
                                    value={Array.isArray(formData.role) ? formData.role : []}
                                    onChange={(e) => {
                                        const options = Array.from(e.target.selectedOptions, (option) => option.value);
                                        setFormData({ ...formData, role: options });
                                    }}
                                >
                                    <option value="">Select role</option>
                                    {roles.map((role) => (
                                        <option key={role._id} value={role._id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <div className="flex justify-between gap-8 p-3">
                                <Button variant="secondary" onClick={handleModalClose}>
                                    Close
                                </Button>
                                <Button variant="dark" type="submit">
                                    Save
                                </Button>
                            </div>
                        </Form>
                    </Offcanvas.Body>
                </Offcanvas>
            </div>
            {errors && <div className="alert alert-danger mt-4">{errors}</div>}
        </div>
    );
}

export default UserManagement;
