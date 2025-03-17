import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAddNewUserMutation } from '../../slices/adminSlices/adminApiSlice';
import { toast } from 'react-toastify';

const AddUser = ({ isOpen, onClose }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [addNewUser, {isLoading}] = useAddNewUserMutation()

    const handleSave = async (e) =>{
        e.preventDefault()
        console.log(name,email,password);
        
        if (password !== confirmPassword) {
            toast.error('Password do not match')
        } else {
            try {
                await addNewUser({ name, email, password }).unwrap()
                toast.success('New User Added');
                onClose()
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    }

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form >
                    <Form.Group className="mb-3" controlId="userName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="userEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="userPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="userConfirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" onClick={handleSave} type="submit">
                        Save
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddUser;