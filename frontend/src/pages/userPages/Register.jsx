import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Row, Col } from 'react-bootstrap'
import FormContainer from '../../components/FormContainer'
import { toast } from 'react-toastify'
import Loader from '../../components/Loader'
import { useRegisterMutation } from '../../slices/usersApiSlice'
import { setCredentials } from '../../slices/authSlice'


const Register = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [validation, setValidation] = useState('')

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { userInfo } = useSelector((state) => state.auth)

    const [register, { isLoading }] = useRegisterMutation()

    useEffect(() => {
        if (userInfo) {
            navigate('/')
        }
    }, [navigate, userInfo])

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

        if (!password.trim()) {
            newErrors.password = 'Password is required'
        } else if (!passwordRegex.test(password)) {
            newErrors.password = 'Password must be 5 numbers'
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = 'Confirm password is required'
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        setValidation(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        if (validateForm()) {
            if (password !== confirmPassword) {
                toast.error('Password do not match')
            } else {
                try {
                    const res = await register({ name, email, password }).unwrap()
                    dispatch(setCredentials({ ...res }))
                    navigate('/')
                } catch (err) {
                    toast.error(err?.data?.message || err.error);
                }
            }
        } else {
            toast.error('Please fix the errors in the form')
        }
    }


    return (
        <FormContainer>
            <h1> Sign Up </h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className='my-2' controlId='name'>
                    <Form.Label> Name </Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        isInvalid={!!validation.name}
                    ></Form.Control>

                    {validation.name && (
                        <Form.Control.Feedback type='invalid'>
                            {validation.name}
                        </Form.Control.Feedback>
                    )}

                </Form.Group>
                <Form.Group className='my-2' controlId='email'>
                    <Form.Label> Email Address </Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isInvalid={!!validation.email}
                    ></Form.Control>

                    {validation.email && (
                        <Form.Control.Feedback type='invalid'>
                            {validation.email}
                        </Form.Control.Feedback>
                    )}

                </Form.Group>
                <Form.Group className='my-2' controlId='password'>
                    <Form.Label> Password </Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        isInvalid={!!validation.password}
                    ></Form.Control>

                    {validation.password && (
                        <Form.Control.Feedback type='invalid'>
                            {validation.password}
                        </Form.Control.Feedback>
                    )}

                </Form.Group>
                <Form.Group className='my-2' controlId='confirmPassword'>
                    <Form.Label> Confirm Password </Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        isInvalid={!!validation.confirmPassword}
                    ></Form.Control>

                    {validation.confirmPassword && (
                        <Form.Control.Feedback type='invalid'>
                            {validation.confirmPassword}
                        </Form.Control.Feedback>
                    )}

                </Form.Group>


                {isLoading && <Loader />}

                <Button type='submit' variant='primary' className='mt-3'>
                    Sign Up
                </Button>

                <Row className='py-3'>
                    <Col>
                        Already have an account? <Link to='/login'> Login </Link>
                    </Col>
                </Row>
            </Form>
        </FormContainer>
    )
}

export default Register
