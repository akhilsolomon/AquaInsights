import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import penguinImage from './assets/peng.png';
import Homepage from './Homepage'; 
import InfoPage from './InfoPage'; 
import Simulation from './Simulation';
import KolleruSimulation from './kolleru_simulation'; // Ensure this is correctly imported
import Login from './Login';
import Register from './Register';
import Bot from './chatbot';

function Intro() {
  const navigate = useNavigate(); 
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  useEffect(() => {
    fetch('http://localhost:4000/users/details', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setIsLoggedIn(typeof data._id !== 'undefined');
      });
  }, []);

  const skipIntro = () => {
    navigate(isLoggedIn ? '/homepage' : '/login');
  };

  const openContactPopup = () => {
    const popup = document.getElementById('contact-popup');
    if (popup) {
      popup.style.display = 'flex';
    }
  };

  const closeContactPopup = () => {
    const popup = document.getElementById('contact-popup');
    if (popup) {
      popup.style.display = 'none';
    }
  };

  const sendEmail = () => {
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    const mailtoLink = `mailto:cs22b011@iittp.ac.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message + "\n\nFrom: " + email)}`;
    window.location.href = mailtoLink;
    closeContactPopup();
  };

  return (
    <div className="App">
      <h1 className="website-title">AquaInsights</h1>
      <p className="website-description">
        Discover the impact of human activities on marine ecosystems through immersive simulations.
        Learn how pollution affects marine life and ways to protect these vital environments.
      </p>
      <button id="homepage-button" onClick={skipIntro}>Explore</button>
      <button id="contact-button" onClick={openContactPopup}>Contact Us</button>
      <div className="penguin-container">
        <img src={penguinImage} alt="Penguin Character" className="penguin" />
      </div>
      <div id="contact-popup" className="popup" style={{ display: 'none' }}>
        <div className="popup-content">
          <span className="close" onClick={closeContactPopup}>&times;</span>
          <h2>Contact Us</h2>
          <form id="contact-form">
            <label htmlFor="email">Your Email:</label>
            <input type="email" id="email" name="email" required /><br />
            <label htmlFor="subject">Subject:</label>
            <input type="text" id="subject" name="subject" required /><br />
            <label htmlFor="message">Message:</label>
            <textarea id="message" name="message" rows="4" required></textarea><br />
            <button type="button" onClick={sendEmail}>Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/Bot" element={<Bot/>} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/simulation/:location" element={<Simulation />} />
        <Route path="/simulation/kolleru" element={<KolleruSimulation />} />  {/* Correct path */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router> 
  );
}

export default App;
