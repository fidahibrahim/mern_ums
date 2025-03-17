import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import Swal from 'sweetalert2'
import { useGetUsersMutation, useDeleteUserMutation } from '../../slices/adminSlices/adminApiSlice';
import AddUser from './AddUser';
import EditUser from './EditUser';
import { toast } from 'react-toastify';

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [isAddUserModal, setIsAddUserModal] = useState(false);
    const [search, setSearch] = useState('');
    const [isEditUserModal, setIsEditUserModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [getUsers, { isLoading }] = useGetUsersMutation();
    const [deleteUser] = useDeleteUserMutation();

    const fetchData = async (searchText = '') => {

        try {
            const response = await getUsers({ search: searchText }).unwrap();
            setUsers(response || []);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users");
            setUsers([]);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const openAddUserModal = () => setIsAddUserModal(true);
    const closeAddUserModal = () => setIsAddUserModal(false);

    const openEditUserModal = (user) => {
        setSelectedUser(user);
        setIsEditUserModal(true);
    };
    const closeEditUserModel = () => {
        setSelectedUser(null);
        setIsEditUserModal(false);
    };

    const handleDelete = (userId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this user!',
            icon: 'warning',
            iconColor: '#3F51B5',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3F51B5',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await deleteUser({ userId: userId }).unwrap();
                    if (res) {
                        fetchData(search);
                        toast.success('User deleted successfully');
                    }
                } catch (error) {
                    toast.error(error?.data?.message || error.message);
                }
            }
        });
    };

    return (
        <>
            <Container className="mt-4">
                <Row className="mb-4">
                    <Col>
                        <h2>User Management Dashboard</h2>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="searchUsers">
                            <Form.Control
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search users..."
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="text-md-end">
                        <Button onClick={openAddUserModal} variant="primary">
                            <FaUserPlus className="me-2" />
                            Add New User
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {isLoading ? (
                            <p>Loading users...</p>
                        ) : (
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => openEditUserModal(user)}>
                                                    <FaEdit />
                                                </Button>
                                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(user._id)}>
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="text-center">
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        )}
                    </Col>
                </Row>
            </Container>
            {isAddUserModal && (
                <AddUser isOpen={isAddUserModal} onClose={closeAddUserModal} onUserAdded={() => fetchData(search)} />
            )}
            {isEditUserModal && (
                <EditUser userData={selectedUser} isOpen={isEditUserModal} onClose={closeEditUserModel} onUserUpdated={() => fetchData(search)} />
            )}
        </>
    );
};

export default AdminUserList;