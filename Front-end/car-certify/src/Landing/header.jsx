import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button, NavbarBrand, InputGroup, FormControl, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';

import logo from '../../../Images/logo.png';
import Google from '../assets/Google.png';
import loginCar from '../assets/loginCar.jpg';
import SignUpcar from '../assets/SignUp.jpg';
import '../Styles/Header_styles.css';

function Header() {
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [signUpModalIsOpen, setSignUpModalIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [role, setRole] = useState('');
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const API_URL = "https://car-certify.onrender.com";

  // --- Modal handlers ---
  const openLoginModal = () => setLoginModalIsOpen(true);
  const closeLoginModal = () => setLoginModalIsOpen(false);
  const openSignUpModal = () => setSignUpModalIsOpen(true);
  const closeSignUpModal = () => setSignUpModalIsOpen(false);

  // --- Handle login state ---
  const handleLogin = (userData, token, redirect = true) => {
    if (token) localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    localStorage.removeItem('vehicleData')
    localStorage.removeItem('vehicleStep')
    if (redirect) navigate('/home');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('vehicleData');
    localStorage.removeItem('vehicleStep');
    setUser(null);
    navigate('/');
  };

  // --- Signup ---
  const createUser = async (e) => {
    e.preventDefault();
    if (password !== confirmPass) return alert("Passwords do not match");

    try {
      const response = await axios.post(`${API_URL}/users/new`, { email, password, role });
      const { token, user: userData } = response.data;

      handleLogin(userData, token, true);
      setSignUpModalIsOpen(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Sign Up failed");
    }
  };

  // --- Login ---
  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/users/login`, { email, password });
      const { token, user: userData } = response.data;

      handleLogin(userData, token, true);
      setLoginModalIsOpen(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  // --- Restore user on mount ---
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    if (savedUser) handleLogin(savedUser, token, false);
  }, []);

  // --- Modal styles ---
  const firstStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      height: '80vh',
      width: '60vw',
      borderRadius: '30px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      display: 'flex',
      gap: '2rem',
      overflowY: 'hidden',
    },
    overlay: { backgroundColor: 'rgba(0,0,0,0.4)' },
  };

  return (
    <section>
      {/* NAVBAR */}
      <Navbar expand='lg' className='w-100'>
        <Container fluid>
          <NavbarBrand>
            <a href="/"><img src={logo} alt="Logo" /></a>
          </NavbarBrand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav' className='justify-content-end'>
            <Nav>
              <Nav.Link onClick={() => user ? navigate('/home') : openLoginModal()}>HOME</Nav.Link>
              <Nav.Link>SAMPLE-REPORT</Nav.Link>
              <Nav.Link onClick={() => user ? handleLogout() : openLoginModal()}>
                {user ? 'LOG OUT' : 'LOGIN'}
              </Nav.Link>
              <Nav.Link className='signup bg-black text-white' onClick={user ? null : openSignUpModal}>
                {user ? `Welcome, ${user.email.split('@')[0]}` : 'SIGN UP'}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* LOGIN MODAL */}
      <Modal isOpen={loginModalIsOpen} onRequestClose={closeLoginModal} style={firstStyles}>
        <div style={{ width: '25vw' }} className='d-flex flex-column align-items-center p-4'>
          <h2 className='mt-5'>Welcome Back!</h2>
          <p className='mb-5'>Please enter your details</p>
          <form onSubmit={loginUser}>
            <InputGroup className="mb-3 w-100 mx-auto">
              <InputGroup.Text><FontAwesomeIcon icon={faEnvelope} /></InputGroup.Text>
              <FormControl type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
            </InputGroup>
            <InputGroup className="w-100 mx-auto">
              <InputGroup.Text><FontAwesomeIcon icon={faKey} /></InputGroup.Text>
              <FormControl type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
            </InputGroup>
            <Button className='mt-3 w-100 rounded-pill' type="submit">Login</Button>
          </form>
        </div>
        <div style={{
          backgroundImage: `url(${loginCar})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '30vw',
          height: '75vh',
        }}></div>
      </Modal>

      {/* SIGNUP MODAL */}
      <Modal isOpen={signUpModalIsOpen} onRequestClose={closeSignUpModal} style={firstStyles}>
        <div style={{ width: '25vw' }} className='d-flex flex-column align-items-center justify-content-center p-1'>
          <h2 className='mt-3'>Welcome!</h2>
          <p className='mb-3'>Please enter your details</p>
          <form onSubmit={createUser}>
            <InputGroup className="mb-3 w-100 mx-auto">
              <InputGroup.Text><FontAwesomeIcon icon={faEnvelope} /></InputGroup.Text>
              <FormControl type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
            </InputGroup>
            <InputGroup className="mb-3 w-100 mx-auto">
              <InputGroup.Text><FontAwesomeIcon icon={faKey} /></InputGroup.Text>
              <FormControl type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
            </InputGroup>
            <InputGroup className="mb-3 w-100 mx-auto">
              <InputGroup.Text><FontAwesomeIcon icon={faKey} /></InputGroup.Text>
              <FormControl type='password' value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Confirm Password" />
            </InputGroup>
            <Form.Select value={role} onChange={e => setRole(e.target.value)} className="mb-3">
              <option value="">Choose...</option>
              <option value="Buyer">Buyer</option>
              <option value="Dealership">Dealership</option>
            </Form.Select>
            <Button className='mt-3 w-100 rounded-pill' type="submit">Sign Up</Button>
          </form>
        </div>
        <div style={{
          backgroundImage: `url(${SignUpcar})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '30vw',
          height: '75vh',
        }}></div>
      </Modal>
    </section>
  );
}

export default Header;
