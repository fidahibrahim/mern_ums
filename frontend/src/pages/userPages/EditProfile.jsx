import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Image, Container, Row, Col, Card } from 'react-bootstrap'
import { toast } from 'react-toastify'
import Loader from '../../components/Loader'
import { setCredentials } from '../../slices/authSlice'
import { useUpdateUserMutation } from '../../slices/usersApiSlice'
import Header from '../../components/Header'
import { PlusCircle } from 'lucide-react'

const EditProfile = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [image, setImage] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)
    const [validation, setValidation] = useState({})

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { userInfo } = useSelector((state) => state.auth)
    const [updateProfile, { isLoading }] = useUpdateUserMutation()

    useEffect(() => {
        setName(userInfo.name)
        setEmail(userInfo.email)
        setPreviewImage(userInfo.image)
    }, [userInfo.name, userInfo.email, userInfo.image])

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            setPreviewImage(URL.createObjectURL(file))
        }
    }

    const validateForm = () => {
        const newErrors = {}
        const nameRegex = /^[a-zA-Z0-9 ]+$/
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const passwordRegex = /^\d{5}$/

        if (!name.trim()) {
            newErrors.name = 'Name is required'
        } else if (!nameRegex.test(name)) {
            newErrors.name = 'Name can only contain letters, numbers, and spaces'
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Invalid email format'
        }

        if (currentPassword && !passwordRegex.test(currentPassword)) {
            newErrors.currentPassword = 'Password must be 5 numbers'
        }

        if (newPassword && !passwordRegex.test(newPassword)) {
            newErrors.newPassword = 'Password must be 5 numbers'
        }

        setValidation(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const submitHandler = async (e) => {
        e.preventDefault()
       if(validateForm()){
        try {
            const formData = new FormData()
            formData.append('name', name)
            formData.append('email', email)
            if (currentPassword) formData.append('currentPassword', currentPassword)
            if (newPassword) formData.append('newPassword', newPassword)
            if (image) formData.append('image', image)

            const res = await updateProfile(formData).unwrap()
            dispatch(setCredentials({ ...res }))
            toast.success('Profile updated')

        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
       } else {
        toast.error('Please fix the errors in the form')
       }

    }

    return (
        <>
            <Header />
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={6}>
                        <Card className="p-4  ">
                            <h2 className='text-center mb-4'>Update Profile</h2>
                            <Form onSubmit={submitHandler}>
                                <Form.Group className='mb-4' controlId='image'>
                                    <div className="d-flex justify-content-center">
                                        <div className="position-relative">
                                            <label htmlFor="imageUpload" className="cursor-pointer">
                                                <div className="rounded-circle overflow-hidden" style={{ width: '200px', height: '200px', border: '2px dashed #007bff' }}>
                                                    {previewImage ? (
                                                        <Image
                                                            src={previewImage}
                                                            alt="Profile Preview"
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <div className="d-flex justify-content-center align-items-center h-100 bg-light">
                                                            <PlusCircle size={40} color="#007bff" />
                                                        </div>
                                                    )}
                                                </div>
                                            </label>
                                            <Form.Control
                                                type='file'
                                                id="imageUpload"
                                                onChange={handleImageChange}
                                                accept="image/*"
                                                className="d-none"
                                            />
                                        </div>
                                    </div>
                                </Form.Group>
                                <Form.Group className='mb-3' controlId='name'>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter Name'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        isInvalid={!!validation.name}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {validation.name}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className='mb-3' controlId='email'>
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type='email'
                                        placeholder='Enter Email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        isInvalid={!!validation.email}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {validation.email}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className='mb-3' controlId='password'>
                                    <Form.Label>Current Password</Form.Label>
                                    <Form.Control
                                        type='password'
                                        placeholder='Enter Password'
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        isInvalid={!!validation.currentPassword}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {validation.currentPassword}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className='mb-3' controlId='confirmPassword'>
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control
                                        type='password'
                                        placeholder='New Password'
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        isInvalid={!!validation.newPassword}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {validation.newPassword}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                {isLoading && <Loader />}
                                <div className="d-grid">
                                    <Button type='submit' variant='primary' className='mt-3'>
                                        Update
                                    </Button>
                                </div>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default EditProfile