import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Homepage.css';
import penguinImage from './assets/peng.png';
import backgroundImage from './assets/blog_backgroung.png';

const Homepage = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('');

  // Handle dropdown selection change
  const handleChange = (event) => {
    setSelectedOption(event.target.value); // Update the selected option
  };

  // Handle Start Simulation button click
  const handleStartSimulation = () => {
    if (selectedOption === 'simulation') {
      navigate('/simulation/mangrove'); // Navigate to the Mangrove Ecosystem simulation
    } else if (selectedOption === 'k_simulation') {
      navigate('/simulation/kolleru'); // Navigate to the Kolleru Lake simulation
    }
  };

  // Handle Log Out
  const handleLogOut = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    
    // Redirect the user to the Login page after log out
    navigate('/login');
  };

  return (
    <div className="homepage-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="content">
        <header className="navbar">
          <h1 className="logo">AquaInsights</h1>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/Bot">SeaBot</Link></li>
              <li><Link to="/info">Blogs</Link></li>
            </ul>
          </nav>
          <div className="auth-buttons">
            <button className="login" onClick={handleLogOut}>Log Out</button>
          </div>
        </header>

        <h2>Welcome to AquaInsights!</h2>
        <p>Explore the wonders of the ocean and learn about marine life.<br/>
          Stay tuned for exciting articles, stunning images, and amazing facts!
        </p>

        <div className="simulation-form">
          <label>Choose a Simulation Location: </label>
          <select 
            value={selectedOption} 
            onChange={handleChange} 
            className="simulation-dropdown"
          >
            <option value="">Select a Location</option>
            <option value="simulation">Mangrove ecosystem</option>
            <option value="k_simulation">Kolleru Lake</option>
          </select>
        </div>

        {/* Start Simulation Button */}
        <button  
          className="start-btn" 
          onClick={handleStartSimulation}
          disabled={!selectedOption} // Disable button if no location is selected
        >
          Start Simulation
        </button>

        <img src={penguinImage} alt="Penguin" className="penguin" />
      </div>
    </div>
  );
};

export default Homepage;
