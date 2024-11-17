import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './chatbot.css';

const Bot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [backendMessage, setBackendMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  // Fetch initial data from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/message')  // Updated to match backend port
      .then((response) => {
        setBackendMessage(response.data.message);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []); 

  // Handle sending user message and getting response from backend
  const handleSend = async () => {
    setMessages([...messages, { user: true, text: input }]);  // Display user message

    try {
      const response = await axios.post('http://localhost:5000/api/chat', { message: input });
      setMessages((prev) => [...prev, { user: false, text: response.data.reply }]); // Display bot response
    } catch (error) {
      console.error('Error communicating with the backend:', error);
    }

    setInput('');
  };

  // Toggle popup for showing predefined questions
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="chatbot-body"> {/* Apply the renamed class here */}
      <h1>{backendMessage}</h1>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={msg.user ? 'user-message' : 'bot-message'}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={handleSend}>Send</button>
      </div>

      {/* Info Button */}
      <button className="info-btn" onClick={togglePopup}>i</button>

      {/* Popup with questions */}
      <div className={`popup ${showPopup ? 'show' : ''}`}>
        <h3>Questions you can ask:</h3>
        <ul>
          <li>What are mangrove forests?</li>
          <li>What species live in mangrove forests?</li>
          <li>How do pollutants affect mangroves?</li>
          <li>What is the largest sea creature?</li>
          <li>What is Aqua Insights?</li>
        </ul>
      </div>
    </div>
  );
};

export default Bot;
