import { useState, useEffect } from "react"
import Loader from "../../components/Loader"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Form, Button } from "react-bootstrap"
import FormContainer from '../../components/FormContainer'
import { useAdminLoginMutation } from "../../slices/adminSlices/adminApiSlice"
import { useAdminLogoutMutation } from "../../slices/adminSlices/adminApiSlice"
import { setCredentials } from "../../slices/adminSlices/adminAuthSlice"


const AdminLogin = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [adminLogin, { isLoading }] = useAdminLoginMutation()

  const { adminInfo } = useSelector((state) => state.adminAuth)

  useEffect(() => {
    if (adminInfo) {
      navigate('/admin/home')
    }
  }, [navigate, adminInfo])

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const res = await adminLogin({ email, password }).unwrap()

      dispatch(setCredentials({ ...res }))
      navigate('/admin/home')
    } catch (error) {
      console.log(error);
      toast.error(err?.data?.message || err.error);
    }
  }

  return (
    <>
      <FormContainer>
        <h1> Admin Login </h1>
        <Form onSubmit={submitHandler} >
          <Form.Group className='my-2' controlId='email'>
            <Form.Label> Email Address </Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group className='my-2' controlId='password'>
            <Form.Label> Password </Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type='submit' variant='primary' className='mt-3'>
            Sign In
          </Button>
        </Form>
      </FormContainer>
    </>
  )
}

export default AdminLogin
