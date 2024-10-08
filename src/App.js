import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import penguinImage from './assets/peng.png';
import Homepage from './Homepage'; // Assuming you have a Homepage component
import InfoPage from './InfoPage'; // Ensure these imports match your file structure
import Simulation from './Simulation';

function Intro() {
  const navigate = useNavigate(); // Hook to navigate programmatically

  useEffect(() => {
    const bubbles = [
      document.getElementById('bubble1'),
      document.getElementById('bubble2'),
      document.getElementById('bubble3'),
      document.getElementById('bubble4'),
      document.getElementById('bubble5'),
      document.getElementById('bubble6')
    ];

    let delay = 0;

    bubbles.forEach((bubble) => {
      setTimeout(() => {
        if (bubble) {
          bubble.classList.add('bubble-show');
        }
      }, delay);
      delay += 2500;
    });
  }, []);

  const skipIntro = () => {
    navigate('/homepage'); // Navigate to the homepage using react-router
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
      {/* Skip Button */}
      <button id="skip-button" onClick={skipIntro}>Skip to Homepage</button>

      {/* Contact Us Button */}
      <button id="contact-button" onClick={openContactPopup}>Contact Us</button>

      {/* Penguin Character at Bottom Right */}
      <div className="penguin-container">
        <img src={penguinImage} alt="Penguin Character" className="penguin" />

        {/* Speech Bubbles Positioned to the Left of the Penguin */}
        <div id="bubble1" className="speech-bubble">Someone is here...</div>
        <div id="bubble2" className="speech-bubble">Hello...!!</div>
        <div id="bubble3" className="speech-bubble">Welcome to AquaInsights.</div>
        <div id="bubble4" className="speech-bubble">I'm your personal SeaBot.</div>
        <div id="bubble5" className="speech-bubble">You can ask me questions related to sea life.</div>
        <div id="bubble6" className="speech-bubble">Have fun and learn to the fullest!</div>
      </div>

      {/* Contact Us Popup Form */}
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
        <Route path="/homepage" element={<Homepage />} /> {/* Add your Homepage component here */}
        <Route path="/info" element={<InfoPage />} />   {/* Info Page */}
        <Route path="/simulation" element={<Simulation />} /> {/* Simulation Page */}
      </Routes>
    </Router>
  );
}

export default App;
