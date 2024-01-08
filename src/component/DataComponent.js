import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/data.css'
import { Button, Modal, Form } from 'react-bootstrap';

const DataComponent = () => {
    const [data, setData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [updatedSerial, setUpdatedSerial] = useState('');
    const [updatedStatus, setUpdatedStatus] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const inputRef = useRef(null);
    const [searchText, setSearchText] = useState('');

    const navigate = useNavigate();

    const headers = useMemo(() => {
        return {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        };
    }, []);

    const config = useMemo(() => {
        return {
            headers: headers,
        };
    }, [headers]);

    useEffect(() => {
        // Fetch data from the server
        axios.get('https://msubotserver-edaea1829455.herokuapp.com/api/getdata', config)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                if (error.response || error.response.status === 422) {
                    localStorage.removeItem('token');
                    navigate('/', { replace: true });
                }
            });
    }, [editId, config, navigate]);

    const handleSave = (id, updatedSerial, updatedStatus) => {
        const isEditMode = id !== 'new';
        const requestData = { serial: updatedSerial, status: updatedStatus };

        const httpMethod = isEditMode ? 'PUT' : 'POST';
        const apiUrl = isEditMode
            ? `https://msubotserver-edaea1829455.herokuapp.com/api/updatedata/${id}`
            : 'https://msubotserver-edaea1829455.herokuapp.com/api/adddata';

        axios({ method: httpMethod, url: apiUrl, data: requestData, headers: config.headers })
            .then(response => {
                console.log(response.data);
                const updatedData = isEditMode
                    ? data.map(item => (item[0] === id ? [id, updatedSerial, updatedStatus] : item))
                    : [...data, [response.data.id, updatedSerial, updatedStatus]];

                setData(updatedData);
                setEditId(null);
                handleClose();
            })
            .catch(error => console.error('Error updating/adding data:', error));
    };

    const handleDelete = (id) => {
        // Send the delete request to the server
        axios.delete(`https://msubotserver-edaea1829455.herokuapp.com/api/deletedata/${id}`,config)
            .then(response => {
                console.log(response.data);
                // Remove the deleted item from the data state
                setData(prevData => prevData.filter(item => item[0] !== id));
                setEditId(null);
            })
            .catch(error => {
                console.error('Error deleting data:', error);
            });
    };

    const handleSearch = (text) => {
        setSearchText(text);
    };

    const filteredData = data.filter(
        (row) =>
            (row[0] && row[0].toString().includes(searchText)) ||
            (row[1] && row[1].toLowerCase().includes(searchText.toLowerCase())) ||
            (row[2] && row[2].toString().includes(searchText))
    );

    const handleEdit = (id, serial, status) => {
        setEditId(id);
        setUpdatedSerial(serial);
        setUpdatedStatus(status);
        // Show the Edit modal
        setShowAddModal(true);
    };

    const handleSaveEdit = () => {
        handleSave(editId, updatedSerial, updatedStatus);
    };

    const handleSaveAdd = () => {
        handleSave('new', updatedSerial, updatedStatus);
    };

    const handleShowAddModal = () => {
        setUpdatedSerial(''); // Reset updatedSerial to an empty string
        setUpdatedStatus(''); // Reset updatedStatus to an empty string
        setShowAddModal(true);
        setEditId(null); // Reset editId when opening the modal for adding
    };

    const handleClose = () => {
        setShowAddModal(false);
        setEditId(null);
    };

    const handleRandom = () => {
        // สร้างข้อมูลสุ่มสำหรับ Serial และ Status
        const randomSerial = generateRandomString(16);
        const randomStatus = Math.random() < 0.5 ? '0' : '1';

        // อัพเดทสถานะข้อมูลที่กำลังแก้ไขใน Modal
        setUpdatedSerial(randomSerial);
        setUpdatedStatus(randomStatus);
    };

    // ฟังก์ชันสำหรับสร้างสตริงสุ่ม
    const generateRandomString = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    useEffect(() => {
        setUpdatedSerial(updatedSerial);
    }, [updatedSerial]);

    const handleCopy = () => {
        inputRef.current.select();
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 3000);
    };

    const columns = [
        { name: 'ID', selector: row => row[0] },
        { name: 'Serial', selector: row => row[1] },
        { name: 'Status', selector: row => row[2] },
        {
            name: 'Action',
            cell: row => (
                <div className='btnbox'>
                    <Button className='editbtn' variant="info" onClick={() => handleEdit(row[0], row[1], row[2])}>
                        Edit
                    </Button>
                    <Button className='deletebtn' variant="danger" onClick={() => handleDelete(row[0])}>
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="container">
            <input
                type="text"
                placeholder="Search..."
                value={searchText}
                className='form-control mt-5 mb-2 w-25'
                onChange={(e) => handleSearch(e.target.value)}
            />

            <DataTable
                title="Data Table"
                columns={columns}
                data={filteredData}
                className='faBkiP'
                pagination
                selectableRows
                onSelectedRowsChange={({ selectedRows }) => {
                    // Handle selected rows (if needed)
                }}
                search
            />

            <Button variant="success" onClick={handleShowAddModal}>
                Add Data
            </Button>

            <Modal show={showAddModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editId ? 'Edit Data' : 'Add Data'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formSerial">
                            <Form.Label>Serial</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter serial"
                                value={updatedSerial}
                                onChange={(e) => setUpdatedSerial(e.target.value)}
                                ref={inputRef}
                            />
                        </Form.Group>
                        {/* Render the Status input only in edit mode */}
                        {editId && (
                            <Form.Group className="mb-3" controlId="formStatus">
                                <Form.Label>Status</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter status"
                                    value={updatedStatus}
                                    onChange={(e) => setUpdatedStatus(e.target.value)}
                                />
                            </Form.Group>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <div className="ms-1 me-1">
                        <Button variant="warning" onClick={handleRandom}>
                            Random
                        </Button>
                    </div>
                    <Button className='me-auto' variant="light" onClick={handleCopy}>
                        {isCopied ? <i className=" bi bi-check"></i> : <i className="bi bi-clipboard"></i>}
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        onClick={editId ? handleSaveEdit : handleSaveAdd}
                    >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DataComponent;
