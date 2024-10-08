import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import './Homepage.css'; // Ensure this CSS file exists
import MangroveImage from './assets/background.jpeg';

function Homepage() {
    return (
        <div className="homepage">
            <h1 className="homepage-title">Welcome to AquaInsights</h1>

            <div className="card-container">
                <Link to="/InfoPage" className="card"> {/* Link to InfoPage */}
                    <img src={MangroveImage} alt="Mangrove Ecosystem" className="card-image" />
                    <div className="card-info">
                        <h2>Explore the Mangrove Ecosystem in Kakinada</h2>
                        <p>Discover the unique flora and fauna of the mangrove ecosystem and learn about their importance to marine life.</p>
                    </div>
                </Link>

                <Link to="/Simulation" className="card"> {/* Link to Simulation Page */}
                    <img src={MangroveImage} alt="Simulate Ecosystem" className="card-image" />
                    <div className="card-info">
                        <h2>Simulate Your Own Mangrove Ecosystem</h2>
                        <p>Use our interactive tools to create and manage your own mangrove ecosystem. See how different factors affect marine life!</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default Homepage;
