import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Login.css'; // Import custom CSS for additional styling

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(false);

    const authenticate = async (e) => {
        e.preventDefault();

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
                text: "Please check your login details and try again!"
            });
        }

        setEmail('');
        setPassword('');
    };

    useEffect(() => {
        setIsActive(email !== "" && password !== "");
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
                        <h1 className="text-center">Login Form</h1>
                        <Form onSubmit={authenticate}>
                            <Form.Group controlId="userEmail">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email here"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    required
                                    className="form-input"
                                />
                            </Form.Group>
                            <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password here"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    required
                                    className="form-input"
                                />
                            </Form.Group>
                            <Button 
                                variant={isActive ? "primary" : "danger"} 
                                my-3 
                                type="submit" 
                                id="submitBtn" 
                                className="w-100"
                            >
                                Submit
                            </Button>
                        </Form>
                        <div className="text-center mt-2">
                            <Button 
                                variant="link" 
                                onClick={() => navigate('/register')} 
                                className="register-button"
                            >
                                New user? Register
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
    
}
