import { Navbar, Container, Nav, Button, NavbarBrand, NavbarToggle, InputGroup, FormControl } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import {href, useNavigate} from 'react-router-dom'
import logo from '../../../Images/logo.png'
import '../Styles/Header_styles.css'
import Modal from 'react-modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey} from "@fortawesome/free-solid-svg-icons";
import Google from '../assets/Google.png'
import loginCar from '../assets/loginCar.jpg'
import SignUpcar from '../assets/SignUp.jpg'
import { Form } from "react-bootstrap";
import axios from "axios"
function Header(){
    const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
    const [signUpModalIsOpen, setsignUpModalIsOpen] = useState(false);  
    const [value, setValue] = useState("");
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("")
    const [confirmPass, setConfirmPass] = useState("")
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    const openLoginModal = () => setLoginModalIsOpen(true);
    const opensignUpModal = () => setsignUpModalIsOpen(true);
    const closeLoginModal = () => setLoginModalIsOpen(false);
    const closesignUpModal = () => setsignUpModalIsOpen(false);

    const API_URL = "http://localhost:3542"


    const createUser = async (e) => {
      e.preventDefault()
      if (password != confirmPass){
      alert("Passwords do not match")
      return
    }
      try{
        const response = await axios.post(`${API_URL}/users/new`, {
          email,
          password,
          role
        })
        const { token, user: userData } = response.data;
        handleLogin(userData); 
        setsignUpModalIsOpen(false);
        console.log(response.data)
      } catch (err){
        console.error(err.response?.data || err.message)
        alert(err.response?.data?.message || "Sign Up failed");
      }
    }
    
    const loginUser = async (e) => {
      e.preventDefault()
      try{
        const response = await axios.post(`${API_URL}/users/login`, {
          email,
          password,
        })
        const { token, user: userData } = response.data;
        handleLogin(userData); // saves user and redirects
        setLoginModalIsOpen(false);
        console.log(response.data)
      } catch (err){
        console.error(err.response?.data || err.message)
        alert(err.response?.data?.message || "Login failed");
      }
    }

    //USER LOGGED IN
    useEffect(() => {
      const savedUser = JSON.parse(localStorage.getItem('user'))
      if (savedUser) handleLogin(savedUser, false)
    }, [])

    const handleLogin = (userData, redirect = true) => {
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      if (redirect) navigate('/home')
    }

    const handleLogout = () => {
      localStorage.removeItem('user')
      setUser(null)
      navigate('/')
    }

    {/*LOGIN MODAL*/}
    const firstStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      height: '80vh',
      width: '60vw',
      borderRadius: '30px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      display: 'flex',
      flexDirection: 'row',
      gap: '2rem',
      overflowY: 'hidden',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
  };
  const secondStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      height: '55vh',
      width: '30vw',
      padding: '2rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
  };
  return(
        <section>
          <Navbar
        expand='lg'
        className='w-100'
        >
            <Container fluid>
              <NavbarBrand>
                <a href="/">
                  <img src={logo} alt=""/>
                </a>
            </NavbarBrand>
            <Navbar.Toggle aria-controls='basic-navbar-nav'/>
            <Navbar.Collapse id='basic-navbar-nav' className='justify-content-end'>
              <Nav>
                <Nav.Link
                onClick={() => user ? navigate('/home') : openLoginModal}
                >
                  HOME
                </Nav.Link>
                <Nav.Link>
                  SAMPLE-REPORT
                </Nav.Link>
                <Nav.Link
                onClick={user ? handleLogout : openLoginModal}
                >
                  {user ? 'LOG OUT' : 'LOGIN'}
                </Nav.Link>
                <Nav.Link className='signup bg-black text-white' onClick={user ? null : opensignUpModal}>
                  {user ? `Welcome, ${user.email.split('@')[0]}` : 'SIGN UP'}
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>
        {/*LOGIN MODAL*/}
        <Modal
        isOpen={loginModalIsOpen}
        onRequestClose={closeLoginModal}
        style={firstStyles}
        >
        <div style={{width: '25vw'}} className='d-flex flex-column align-items-center p-4'>
           <h2 className='mt-5'>Welcome Back!</h2>
          <p className='mb-5'>Please enter your details</p>
          <form onSubmit={loginUser}>
            <div>
              <InputGroup className="mb-3 w-100 mx-auto">
            <InputGroup.Text className=' rounded-start rounded-start-3'>
            <FontAwesomeIcon icon={faEnvelope} />
              </InputGroup.Text>
            <FormControl type='email' value={email} onChange={(e) => setEmail(e.target.value)} className='rounded rounded-3 rounded-start rounded-start-0' placeholder="Enter your Email Address" />
            </InputGroup>
            </div>
            <div>
                <InputGroup className="w-100 mx-auto">
            <InputGroup.Text className=' rounded-start rounded-start-3'>
            <FontAwesomeIcon icon={faKey} />
              </InputGroup.Text>
            <FormControl type='password' value={password} onChange={(e) => setPassword(e.target.value)} className='rounded rounded-3 rounded-start rounded-start-0 ' placeholder="Enter your Password" />
            </InputGroup>
            </div>
            <br />
            <Button className='mt-3 w-100 rounded rounded-pill' type="submit">Login</Button>
          </form>
          <div class="d-flex align-items-center text-muted w-100">
        <hr class="flex-grow-1 me-2" />
         or
        <hr class="flex-grow-1 ms-2" />
        </div>
        <div className='w-100 d-flex justify-content-center mt-2'>
          <a href="" className=' border border-1 rounded rounded-circle p-2'>
          <img style={{width: '1.8rem'}} src={Google} alt="" />
        </a>
        </div>
        </div>
        <div className='d-flex justify-content-end rounded rounded-5' 
        style={{
          backgroundImage: `url(${loginCar})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '75vh',
          width: '30vw',
        }}
        >   
        </div>
        </Modal>
        {/*SIGNUP MODAL*/}
        <Modal
        isOpen={signUpModalIsOpen}
        onRequestClose={closesignUpModal}
        style={firstStyles}
        >
        <div style={{width: '25vw'}} className='d-flex flex-column align-items-center justify-content-center p-1'>
           <h2 className='mt-3'>Welcome!</h2>
          <p className='mb-3'>Please enter your details</p>
          <form onSubmit={createUser}>
            <div>
              <InputGroup className="mb-3 w-100 mx-auto">
            <InputGroup.Text className=' rounded-start rounded-start-3'>
            <FontAwesomeIcon icon={faEnvelope} />
              </InputGroup.Text>
            <FormControl type='email' value={email} onChange={(e) => setEmail(e.target.value)} className='rounded rounded-3 rounded-start rounded-start-0' placeholder="Enter your Email Address" />
            </InputGroup>
            </div>
            <div>
                <InputGroup className="w-100 mx-auto">
            <InputGroup.Text className=' rounded-start rounded-start-3'>
            <FontAwesomeIcon icon={faKey} />
              </InputGroup.Text>
            <FormControl type='password' value={password} onChange={(e) => setPassword(e.target.value)} className='rounded rounded-3 rounded-start rounded-start-0 ' placeholder="Enter your Password" />
            </InputGroup>
            </div>
            <div>
                <InputGroup className="w-100 mx-auto mt-3 mb-3">
            <InputGroup.Text className=' rounded-start rounded-start-3'>
            <FontAwesomeIcon icon={faKey} />
              </InputGroup.Text>
            <FormControl type='password' value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} className='rounded rounded-3 rounded-start rounded-start-0 ' placeholder="Confirm your Password" />
            </InputGroup>
            </div>
            <div>
      <Form.Select
        value={role} onChange={(e) => setRole(e.target.value)}
      >
        <option value="">Choose...</option>
        <option value="Buyer">Buyer</option>
        <option value="Dealership">Dealership</option>
      </Form.Select>
            </div>
            <Button className='mt-3 w-100 rounded rounded-pill' type="submit">Sign Up</Button>
          </form>
          <div class="d-flex align-items-center text-muted w-100">
        <hr class="flex-grow-1 me-2" />
         or
        <hr class="flex-grow-1 ms-2" />
        </div>
        <div className='w-100 d-flex justify-content-center mt-2'>
          <a href="" className=' border border-1 rounded rounded-circle p-2'>
          <img style={{width: '1.8rem'}} src={Google} alt="" />
        </a>
        </div>
        </div>
        <div className='d-flex justify-content-end rounded rounded-5' 
        style={{
          backgroundImage: `url(${SignUpcar})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '75vh',
          width: '30vw',
        }}
        >   
        </div>
        </Modal>
        </section>
    )
}

export default Header