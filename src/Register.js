import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Register.css'; // Import custom CSS for styling

export default function Register() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mobileNo, setmobileNo] = useState("");
    const [isActive, setIsActive] = useState(false);

    const registerUser = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch('http://localhost:4000/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ firstName, lastName, email, password, mobileNo })
            });
    
            const data = await response.json();
            console.log(data); // Check what data is returned
    
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
    
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setmobileNo('');
    };
    

    // Enable submit button only if all fields are filled
    useState(() => {
        setIsActive(firstName !== "" && lastName !== "" && email !== "" && password !== "" && mobileNo !== "");
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
                                    required
                                    className="form-input"
                                />
                            </Form.Group>
                            <Form.Group controlId="lastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your last name"
                                    onChange={(e) => setLastName(e.target.value)}
                                    value={lastName}
                                    required
                                    className="form-input"
                                />
                            </Form.Group>
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
                            <Form.Group controlId="mobileNoNo">
                                <Form.Label>mobile Number</Form.Label>
                                <Form.Control
                                    type="tel"
                                    placeholder="Enter mobileNo number"
                                    onChange={(e) => setmobileNo(e.target.value)}
                                    value={mobileNo}
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
                                id="registerBtn" 
                                className="w-100"
                            >
                                Register
                            </Button>
                        </Form>
                        <div className="text-center mt-2">
                            <Button 
                                variant="link" 
                                onClick={() => navigate('/login')} 
                                className="login-button"
                            >
                                Already have an account? Login
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
