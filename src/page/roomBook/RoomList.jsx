import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Form, InputGroup, DropdownButton, Dropdown, Offcanvas } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllRooms, postAddRoom, patchUpdateRoom, delDeleteRoom, getAllRoomTypes } from '../../service/apiServices';

function RoomList() {
    const [rooms, setRooms] = useState([]);
    const [roomtypes, setRoomTypes] = useState([]);
    const [totalRooms, setTotalRooms] = useState(NaN);
    const [totalRoomTypes, setTotalRoomTypes] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState(null); //
    const [pageInput, setPageInput] = useState(currentPage); // Input để người dùng nhập
    const [showModal, setShowModal] = useState(false);
    const [newRoom, setNewRoom] = useState({ roomName: '', roomTypeId: '', status: "available", notes: '' });
    const [editingRoom, setEditingRoom] = useState(null);
    const [errors, setErrors] = useState({});


    const handlePagination = useCallback((totalRooms) => {
        setTotalRooms(totalRooms);
        setTotalPages(Math.ceil(totalRooms / rowsPerPage));
    }, [rowsPerPage]);

    const fetchListRoom = useCallback(async () => {
        try {
            const queryParams = {
                search: search?.trim(),
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

    const fetchListRoomTypes = useCallback(async () => {
        try {
            const queryParams = {
                limit: totalRoomTypes,
                page: 1,

            };
            const res = await getAllRoomTypes(queryParams);
            if (res && res.data && res.data.data) {
                setRoomTypes(res.data.data);
                setTotalRoomTypes(res.data.count);

            }
        } catch (error) {
            console.error("Error fetching roomtypes:", error);
        }
    }, [totalRoomTypes]);


    useEffect(() => {
        fetchListRoom();
        fetchListRoomTypes();
    }, [fetchListRoom, fetchListRoomTypes]);

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


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRoom((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleAddRoom = async () => {

        try {
            const requiredFields = ['roomName', 'roomTypeId', 'status'];
            const fieldsToCompare = ['roomName', 'status', 'notes'];

            const fieldNamesMap = {
                roomName: "Room Name",
                status: "Status",
                roomTypeId: "Room Type",
            };

            let isRoomChanged = true;
            const emptyFields = requiredFields.filter((field) => !newRoom[field] || newRoom[field].trim() === '');

            if (emptyFields.length > 0) {
                const readableFieldNames = emptyFields.map((field) => fieldNamesMap[field]);
                toast.error(`The following fields are required: ${readableFieldNames.join(', ')}`, { autoClose: 2000 });
                return;
            }
            let res;
            if (editingRoom) {
                isRoomChanged = fieldsToCompare.some(
                    (field) => newRoom[field] !== editingRoom[field]
                ) || newRoom.roomTypeId !== editingRoom.roomTypeId._id;
                if (!isRoomChanged) {
                    toast.info('No changes detected.', { autoClose: 2000 });

                } else {
                    res = await patchUpdateRoom({ ...newRoom, id: editingRoom._id });
                }
            } else {
                res = await postAddRoom(newRoom);
                if (res.error && res.error.error.toLowerCase().includes('already exists')) {
                    toast.error('Room already exists. Please use a different name.', { autoClose: 2000 });
                }
            }
            if (res.success) {
                toast.success(`${editingRoom ? 'Room updated' : 'Room added'} successfully!`, { autoClose: 2000 });
                fetchListRoom();
                handleModalClose();

            } else {
                toast.error(res.error.error || 'Operation failed', { autoClose: 2000 });
            }
        } catch (err) {
            toast.error('Error while saving room', { autoClose: 2000 });
        }
    };

    const handleEditClick = (room) => {
        setEditingRoom(room);
        setNewRoom({
            roomName: room.roomName,
            roomTypeId: room.roomTypeId,
            status: room.status,
            notes: room.notes || '',
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            const res = await delDeleteRoom(id);
            if (res.success) {
                toast.success('Room deleted successfully!');
                fetchListRoom();
            } else {
                toast.error(res.error.error || 'Failed to delete room');
            }
        }
    };


    const handleModalClose = () => {
        setShowModal(false);
        setEditingRoom(null);
        setNewRoom({ roomName: '', roomTypeId: '', status: '', notes: '' });
        setErrors({});
    };

    const handleModalShow = () => setShowModal(true);

    // Other unchanged functions: handleSearch, handleSort, etc.

    return (
        <div className="pt-16 pb-8 pr-8 mt-2 ">
            <ToastContainer />
            <div className="flex items-center mb-3 justify-between">
                <h2 className="font-bold text-3xl font-sans">Room List</h2>
                <Button variant="dark" onClick={handleModalShow}>Add Room</Button>
            </div>

            <div className="bg-white font-dm-sans rounded-md shadow-sm p-3">
                <div className="flex justify-between">
                    <div className="d-flex items-center">
                        {/* <Button
                            variant="outline-secondary"
                            onClick={() => {
                                setSearch('');
                                setSearchField('');
                                setCurrentPage(1);
                            }}
                            className="btn btn-outline-danger mr-2"
                        >
                            Clear
                        </Button>
                        <DropdownButton
                            id="dropdownSearch"
                            title={`Search by: ${searchField ? (searchField === 'roomName' ? 'Room Name' : 'Room Type') : 'Select a field'}`}
                            onSelect={(field) => setSearchField(field)}
                            variant="outline-secondary"
                            className="mr-3"
                        >
                            <Dropdown.Item eventKey="roomName">Room Name</Dropdown.Item>
                            <Dropdown.Item eventKey="roomTypeId.name">Room Type</Dropdown.Item>
                        </DropdownButton> */}
                        <InputGroup>
                            <input
                                placeholder="Enter room name" //{/*`Enter ${searchField ? (searchField === 'roomName' ? 'Room Name' : 'Room Type') : ''}`*/}
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

                <Table className="text-center align-middle" bordered-y="true" hover>
                    <colgroup>
                        <col style={{ width: '5%' }} />
                        <col style={{ width: '20%' }} />
                        <col style={{ width: '20%' }} />
                        <col style={{ width: '20%' }} />
                        <col style={{ width: '20%' }} />
                        <col style={{ width: '20%' }} />
                        <col style={{ width: '5%' }} />
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
                            <th>Status</th>
                            <th>Note</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room, index) => (
                            <tr key={room._id}>
                                <td >{index + 1}</td>
                                <td >{room.roomName}</td>
                                <td>{room.roomTypeId ? room.roomTypeId.name : 'N/A'}</td>
                                <td>{room.roomTypeId ? room.roomTypeId.price : 'N/A'}</td>
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
                                <td >{room.notes}</td>
                                <td className="flex justify-center gap-2 p-3">
                                    <button className="hover:text-blue-800 text-blue-500 text-xl" onClick={() => handleEditClick(room)}>✎</button>
                                    <button className="hover:text-red-800 text-red-500 font-bold text-xl" onClick={() => handleDelete(room._id)}>🗑</button>
                                </td>
                            </tr>
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
            {/* Modal for adding room */}
            <Offcanvas show={showModal} onHide={handleModalClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{editingRoom ? 'Update Room' : 'Add Room'}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form>
                        <Form.Group controlId="formRoomName">
                            <Form.Label className="text-muted">
                                Room Name <span style={{ color: 'red' }}>*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter room name"
                                name="roomName"
                                value={newRoom.roomName}
                                onChange={handleInputChange}
                                isInvalid={!!errors.roomName}
                                className="mb-3"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.roomName}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formRoomType">
                            <Form.Label className="text-muted">
                                Room Type <span style={{ color: 'red' }}>*</span>
                            </Form.Label>
                            <Form.Select
                                name="roomTypeId"
                                value={newRoom.roomTypeId}
                                onChange={handleInputChange}
                                isInvalid={!!errors.roomTypeId}
                                className="mb-3"
                            >
                                <option value="">Select room type</option>
                                {roomtypes.map((type) => (
                                    <option key={type._id} value={type._id}>
                                        {type.name}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.roomTypeId}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formRoomStatus">
                            <Form.Label className="text-muted">
                                Status <span style={{ color: 'red' }}>*</span>
                            </Form.Label>
                            <Form.Select
                                name="status"
                                value={newRoom.status}
                                onChange={handleInputChange}
                                isInvalid={!!errors.status}
                                className="mb-3"
                            >
                                <option value="">Select room status</option>
                                <option value="available">Available</option>
                               
                                <option value="maintenance">Maintenance</option>

                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                {errors.status}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formRoomNote">
                            <Form.Label className="text-muted"> Note </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter note"
                                name="notes"
                                value={newRoom.notes}
                                onChange={handleInputChange}
                                isInvalid={!!errors.notes}
                                className="mb-3"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.notes}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Offcanvas.Body>
                <div className="offcanvas-footer flex-row justify-between gap-8">
                    <div className="flex justify-between gap-8 p-3">
                        <Button variant="secondary" onClick={handleModalClose}>
                            Close
                        </Button>
                        <Button variant="dark" onClick={handleAddRoom}>
                            {editingRoom ? 'Save changes' : 'Add Room'}
                        </Button>
                    </div>
                </div>
            </Offcanvas>
        </div>

    );
}

export default RoomList;