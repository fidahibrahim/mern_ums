import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { toast } from "react-toastify"
import { useEditUserMutation } from "../../slices/adminSlices/adminApiSlice"

const EditUser = ({ userData, isOpen, onClose }) => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [userId, setUserId] = useState()

    const [editUser, { isLoading }] = useEditUserMutation()

    useEffect(() => {
        setName(userData.name)
        setEmail(userData.email)
        setUserId(userData._id)
    }, [])

    const handleSave = async (e) =>{
        e.preventDefault()
        const isEmailValid = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(email);
        const isNameValid = /^[a-zA-Z _-]{3,16}$/.test(name);
        let errors = {};

        if (!isNameValid || name.trim() == '') {
            errors.name = 'Please Enter a valid name'
        }
        if (!isEmailValid || email.trim() == '') {
            errors.email = 'Please Enter a valid email';
        }

        if (Object.keys(errors).length > 0) {
            toast.error(errors.name);
            toast.error(errors.email);
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            const res = await editUser({ name, email, password, userId }).unwrap()
            toast.success('Profile updated');
            onClose()
        } catch (err) {
            toast.error(err?.data?.message || err.message);
        }
    }

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit User</Modal.Title>
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
    )
}

export default EditUser
