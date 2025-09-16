import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Form, InputGroup, DropdownButton, Dropdown, Offcanvas } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllRoomTypes, postAddRoomType, patchUpdateRoomType, delDeleteRoomType } from '../../service/apiServices';

function RoomConfigure() {
  const [roomtypes, setRoomTypes] = useState([]);
  const [totalRooms, setTotalRooms] = useState(NaN);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState(null); //
  const [pageInput, setPageInput] = useState(currentPage); // Input để người dùng nhập
  const [showModal, setShowModal] = useState(false);
  const [newRoomType, setNewRoomType] = useState({ name: '', maxOccupancy: '', surchargeRate: '', price: '' });
  const [editingRoomType, setEditingRoomType] = useState(null);
  const [errors, setErrors] = useState({});


  const handlePagination = useCallback((totalRooms) => {
    setTotalRooms(totalRooms);
    setTotalPages(Math.ceil(totalRooms / rowsPerPage));
   
  }, [rowsPerPage]);


  const fetchListRoomTypes = useCallback(async () => {
    try {
      const queryParams = {
        search: search.trim(),
        sort: sortField,
        limit: rowsPerPage,
        page: currentPage,
      };
      const res = await getAllRoomTypes(queryParams);
      if (res && res.data && res.data.data) {
        setRoomTypes(res.data.data);
   
        handlePagination(res.data.total);
      }
      else {
        setErrors({ err: res.error.error });
      }
    } catch (error) {
      console.error("Error fetching roomtypes:", error);
    }
  }, [search, sortField, rowsPerPage, currentPage, handlePagination]);

  useEffect(() => {
    fetchListRoomTypes();

  }, [fetchListRoomTypes]);

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
    setNewRoomType((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleAddRoomType = async () => {
    try {
      const requiredFields = ['name', 'maxOccupancy', 'surchargeRate', 'price'];
      const fieldsToCompare = ['name', 'maxOccupancy', 'surchargeRate', 'price'];

      const fieldNamesMap = {
        name: 'Type Name',
        maxOccupancy: 'Max Occupancy',
        surchargeRate: 'Surcharge Rate',
        price: 'Price',
      };
      const emptyFields = requiredFields.filter((field) => {
        const fieldValue = newRoomType[field];
        return fieldValue == null || (typeof fieldValue === 'string' && fieldValue.trim() === '');
      });
      if (emptyFields.length > 0) {
        const readableFieldNames = emptyFields.map((field) => fieldNamesMap[field]);
        toast.error(`The following fields are required: ${readableFieldNames.join(', ')}`, { autoClose: 2000 });
      }
      let isRoomChanged = false;

      let res;
      if (editingRoomType) {
        isRoomChanged = fieldsToCompare.some(
          (field) => newRoomType[field] !== editingRoomType[field]
        )
        if (!isRoomChanged) {
          toast.info('No changes detected.', { autoClose: 2000 });
        } else {
          res = await patchUpdateRoomType(editingRoomType._id, newRoomType);
        }
      } else {
        res = await postAddRoomType(newRoomType);
      }
      if (res.error && res.error.error.toLowerCase().includes('already exists')) {
        toast.error('Type name already exists. Please use a different type name.', { autoClose: 2000 });
      }
      if (res.success) {
        toast.success(`${editingRoomType ? 'RoomType updated' : 'RoomType added'} successfully! `, { autoClose: 2000 });
        fetchListRoomTypes();
        handleModalClose();
      } else {
        toast.error(res.error.error || 'Operation failed', { autoClose: 2000 });
      }
    } catch (error) {

      toast.error('Error while saving room type', { autoClose: 2000 });
      console.error(error);
    }
  };

  const handleEditClick = (roomtype) => {
    setEditingRoomType(roomtype);
    setNewRoomType({
      name: roomtype.name,
      maxOccupancy: roomtype.maxOccupancy,
      surchargeRate: roomtype.surchargeRate,
      price: roomtype.price,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room type?')) {
      const res = await delDeleteRoomType(id);
      if (res.success) {
        toast.success('Room type deleted successfully!', { autoClose: 2000 });
        fetchListRoomTypes();
      } else {
        toast.error(res.error.error || 'Failed to delete room', { autoClose: 2000 });
      }
    }
  };


  const handleModalClose = () => {
    setShowModal(false);
    setEditingRoomType(null);
    setNewRoomType({ name: '', maxOccupancy: '', surchargeRate: '', price: '' });
    setErrors({});
  };

  const handleModalShow = () => setShowModal(true);

  return (
    <div className="pt-16 pb-8 pr-8 mt-2">
      <ToastContainer />
      <div className="flex items-center mb-3 justify-between ">
        <h2 className="font-bold text-3xl font-sans">Room Configure</h2>
        <Button variant="dark" onClick={handleModalShow}>Add RoomType</Button>
      </div>
      <div className="bg-white font-dm-sans rounded-md shadow-sm p-3">
        <div className="flex justify-between">
          <div className="d-flex">
            {/* Search Input */}

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

        {/* Table displaying the rooms */}
        <div className="bg-white font-dm-sans rounded-md p-3">
          <Table className="text-center " bordered-y="true" hover>
            <colgroup>
              <col style={{ width: '10%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '25%' }} />
              <col style={{ width: '5%' }} />
            </colgroup>
            <thead>
              <tr>
                <th >
                  ID
                </th>
                <th>
                  Room Type
                  <button
                    onClick={() => handleSort('name', 'asc')}
                    className="ml-1 text-l"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => handleSort('name', 'desc')}
                    className=" text-l"
                  >
                    ▼
                  </button>
                </th>
                <th >
                  Max Occupancy
                </th>
                <th >
                  Surcharge Rate
                </th>
                <th>
                  Price
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roomtypes.map((roomtype, index) => (
                <tr key={roomtype._id}>
                  <td className="align-middle py-3">{index + 1}</td>
                  <td className="align-middle py-3">{roomtype.name}</td>
                  <td className="align-middle py-3">{roomtype.maxOccupancy}</td>
                  <td className="align-middle py-3">{roomtype.surchargeRate}</td>
                  <td className="align-middle py-3">{roomtype.price}</td>
                  <td className="align-middle py-3">
                    <button
                      className="hover:text-blue-800 text-blue-500 text-xl me-2"
                      onClick={() => handleEditClick(roomtype)}
                    >
                      ✎
                    </button>
                    <button
                      className="hover:text-red-800 text-red-500 font-bold text-xl"
                      onClick={() => handleDelete(roomtype._id)}
                    >
                      🗑
                    </button>
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
        
        {/* Offcanvas for Edit */}
        <Offcanvas show={showModal} onHide={handleModalClose} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>{editingRoomType ? 'Update RoomType' : 'Add RoomType'}</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Form>
              <Form.Group controlId="formTypeName">
                <Form.Label className="text-muted">
                  Type Name <span style={{ color: 'red' }}>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter room name"
                  name="name"
                  value={newRoomType.name}
                  onChange={handleInputChange}
                  isInvalid={!!errors.name}
                  className="mb-3"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formMaxOccupancy">
                <Form.Label className="text-muted">
                  Max Occupancy <span style={{ color: 'red' }}>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter max occupancy"
                  name="maxOccupancy"
                  value={newRoomType.maxOccupancy}
                  onChange={handleInputChange}
                  isInvalid={!!errors.maxOccupancy}
                  className="mb-3"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.maxOccupancy}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formSurchargeRate">
                <Form.Label className="text-muted">
                  Surcharge Rate <span style={{ color: 'red' }}>*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter surcharge rate"
                  name="surchargeRate"
                  value={newRoomType.surchargeRate}
                  onChange={handleInputChange}
                  isInvalid={!!errors.surchargeRate}
                  className="mb-3"
                  step="0.1"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.surchargeRate}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formPrice">
                <Form.Label className="text-muted">
                  Price <span style={{ color: 'red' }}>*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter price"
                  name="price"
                  value={newRoomType.price}
                  onChange={handleInputChange}
                  isInvalid={!!errors.price}
                  step="100"
                  className="mb-3"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.price}
                </Form.Control.Feedback>
              </Form.Group>
            </Form>
          </Offcanvas.Body>
          <div className="offcanvas-footer flex-row justify-between gap-8">
            <div className="flex justify-between gap-8 p-3">
              <Button variant="secondary" onClick={handleModalClose}>
                Close
              </Button>
              <Button variant="dark" onClick={handleAddRoomType}>
                {editingRoomType ? 'Save changes' : 'Add RoomType'}
              </Button>
            </div>
          </div>
        </Offcanvas>
      </div>
      <div className="mt-4">
          {errors.err && <div className="alert alert-danger">{errors.err}</div>}
        </div>
    </div>
  );
}

export default RoomConfigure;
