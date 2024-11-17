import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Register.css'; // Import custom CSS for styling

export default function Register() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [errors, setErrors] = useState({});

    // Email validation
    const validateEmail = (email) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    
    // Password validation
    const validatePassword = (password) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);
    
    // Mobile number validation
    const validateMobile = (mobileNo) => /^[0-9]{10}$/.test(mobileNo);

    const registerUser = async (e) => {
        e.preventDefault();

        const newErrors = {};
        
        if (!firstName) newErrors.firstName = "First name is required.";
        if (!lastName) newErrors.lastName = "Last name is required.";
        if (!email || !validateEmail(email)) newErrors.email = "Please enter a valid email address.";
        if (!password || !validatePassword(password)) newErrors.password = "Password must be at least 8 characters long, with at least one number and one special character.";
        if (!mobileNo || !validateMobile(mobileNo)) newErrors.mobileNo = "Please enter a valid 10-digit mobile number.";
        
        if (Object.keys(newErrors).length) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ firstName, lastName, email, password, mobileNo })
            });

            const data = await response.json();
            if (data.success) {
                Swal.fire({
                    title: "Registration Successful",
                    icon: "success",
                    text: data.message
                });
                navigate('/login');
            } else {
                throw new Error(data.message || 'Registration failed');
            }
        } catch (error) {
            Swal.fire({
                title: "Registration Failed",
                icon: "error",
                text: error.message || "Please try again!"
            });
        }

        // Reset form and errors
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setMobileNo('');
        setErrors({});
    };

    // Enable submit button only if all fields are valid
    useEffect(() => {
        setIsActive(
            firstName !== "" &&
            lastName !== "" &&
            email !== "" && validateEmail(email) &&
            password !== "" && validatePassword(password) &&
            mobileNo !== "" && validateMobile(mobileNo)
        );
    }, [firstName, lastName, email, password, mobileNo]);

    return (
        <>
            <Button
                variant="link"
                onClick={() => navigate('/login')}
                className="back-button"
            >
                Back
            </Button>
            <Container className="register-container">
                <Row className="justify-content-center">
                    <Col md={6} className="register-form">
                        <h1 className="text-center">Register</h1>
                        <Form onSubmit={registerUser}>
                            <Form.Group controlId="firstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your first name"
                                    onChange={(e) => setFirstName(e.target.value)}
                                    value={firstName}
                                    className="form-input"
                                />
                                {errors.firstName && <div className="error-text">{errors.firstName}</div>}
                            </Form.Group>
                            <Form.Group controlId="lastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your last name"
                                    onChange={(e) => setLastName(e.target.value)}
                                    value={lastName}
                                    className="form-input"
                                />
                                {errors.lastName && <div className="error-text">{errors.lastName}</div>}
                            </Form.Group>
                            <Form.Group controlId="userEmail">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email here"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    className="form-input"
                                />
                                {errors.email && <div className="error-text">{errors.email}</div>}
                            </Form.Group>
                            <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter 8-Character password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    className="form-input"
                                />
                                {errors.password && <div className="error-text">{errors.password}</div>}
                            </Form.Group>
                            <Form.Group controlId="mobileNo">
                                <Form.Label>Mobile Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your 10-digit mobile number"
                                    onChange={(e) => setMobileNo(e.target.value)}
                                    value={mobileNo}
                                    className="form-input"
                                />
                                {errors.mobileNo && <div className="error-text">{errors.mobileNo}</div>}
                            </Form.Group>
                            
                            <div className="button-box">
                                <Button
                                    variant={isActive ? "primary" : "danger"}
                                    type="submit"
                                    id="registerBtn"
                                    className="w-100"
                                    disabled={!isActive}
                                >
                                    Register
                                </Button>
                            </div>
                        </Form>
                        
                        <div className="login-box">
                            <p
                                className="login-text"
                                onClick={() => navigate('/login')}
                            >
                                Already have an account? Login
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
