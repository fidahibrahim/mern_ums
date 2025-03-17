import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { FaSignOutAlt } from "react-icons/fa"
import { useDispatch } from "react-redux"
import { LinkContainer } from "react-router-bootstrap"
import { useNavigate } from "react-router-dom"
import { useAdminLogoutMutation } from "../../slices/adminSlices/adminApiSlice"
import { adminLogout } from "../../slices/adminSlices/adminAuthSlice"

const AdminHeader = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [adminLogoutApiCall] = useAdminLogoutMutation()

  const adminLogoutHandler = async () => {
    try {
      await adminLogoutApiCall().unwrap()
      dispatch(adminLogout())
      navigate('/admin/')
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/admin/home'>
            <Navbar.Brand>MERN Auth</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
            <NavDropdown title="Welcome Admin" id="admin-options-dropdown">
                <NavDropdown.Item onClick={adminLogoutHandler} className="logout-button">
                  <FaSignOutAlt className="me-2" /> Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default AdminHeader
