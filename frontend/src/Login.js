import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Login.css'; // Import custom CSS for styling

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [errors, setErrors] = useState({});

    // Email validation
    const validateEmail = (email) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    
    // Password validation
    const validatePassword = (password) => password.length >= 6; // Basic check for password length

    const authenticate = async (e) => {
        e.preventDefault();

        const newErrors = {};
        
        if (!email || !validateEmail(email)) newErrors.email = "Please enter a valid email address.";
        if (!password || !validatePassword(password)) newErrors.password = "Password must be at least 6 characters long.";

        if (Object.keys(newErrors).length) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.access) {
                localStorage.setItem('token', data.access);
                Swal.fire({
                    title: "Login Successful",
                    icon: "success",
                    text: "Welcome!"
                });
                navigate('/homepage');
            } else {
                throw new Error(data.message || 'Authentication failed');
            }
        } catch (error) {
            Swal.fire({
                title: "Authentication Failed",
                icon: "error",
                text: error.message || "Please check your login details and try again!"
            });
        }

        // Reset form and errors
        setEmail('');
        setPassword('');
        setErrors({});
    };

    // Enable submit button only if all fields are valid
    useEffect(() => {
        setIsActive(
            email !== "" && validateEmail(email) &&
            password !== "" && validatePassword(password)
        );
    }, [email, password]);

    return (
        <>
            <Button
                variant="link"
                onClick={() => navigate('/')}
                className="back-button"
            >
                Back
            </Button>
            <Container className="login-container">
                <Row className="justify-content-center">
                    <Col md={6} className="login-form">
                        <h1 className="text-center">Login</h1>
                        <Form onSubmit={authenticate}>
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
                                    placeholder="Enter password here"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    className="form-input"
                                />
                                {errors.password && <div className="error-text">{errors.password}</div>}
                            </Form.Group>

                            <div className="button-box">
                                <Button
                                    variant={isActive ? "primary" : "danger"}
                                    type="submit"
                                    id="submitBtn"
                                    className="w-100"
                                    disabled={!isActive}
                                >
                                    Submit
                                </Button>
                            </div>
                        </Form>
                        
                        <div className="register-box">
                            <p
                                className="register-text"
                                onClick={() => navigate('/register')}
                            >
                                New user? Register
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
