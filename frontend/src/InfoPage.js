import React, { useState, useEffect, useCallback } from "react";
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './InfoPage.css'; // Custom CSS
import chemical_runoff_info from './assets/chemical_runoff_info.jpeg';
import mangrove_snapper_info from './assets/mangrove_snapper_info.jpeg';
import mudskipper_info from './assets/mudskipper_info.jpeg';
import oil_spill_info from './assets/oil_spill_info.jpeg';
import plastic_waste_info from './assets/plastic_waste_info.jpeg';
import phytoplankton_info from './assets/phytoplankton_info.jpeg';

const data = [
    {
        title: 'Phytoplankton (Producer)',
        image: phytoplankton_info,
        description: 'Microscopic organisms that perform photosynthesis, forming the base of the marine food web and producing oxygen.',
        alt: 'Phytoplankton in water'
    },
    {
        title: 'Mudskippers (Primary Consumer)',
        image: mudskipper_info,
        description: 'Amphibious fish feeding on invertebrates and detritus. They bridge the aquatic and terrestrial environments.',
        alt: 'Mudskippers on the shore'
    },
    {
        title: 'Mangrove Snapper (Secondary Consumer)',
        image: mangrove_snapper_info,
        description: 'Predatory fish feeding on smaller fish and crustaceans, helping maintain balance within the mangrove ecosystem.',
        alt: 'Mangrove snapper swimming'
    },
    {
        title: 'Plastic Waste',
        image: plastic_waste_info,
        description: '- Reduced phytoplankton growth<br />- Microplastic ingestion in Mudskippers<br />- Toxin accumulation weakens ecosystem',
        alt: 'Plastic waste in the ocean'
    },
    {
        title: 'Chemical Runoff',
        image: chemical_runoff_info,
        description: '- Phytoplankton blooms cause dead zones<br />- Mudskippers and Snappers face contamination<br />- Ecosystem destabilization over time',
        alt: 'Chemical runoff affecting the ecosystem'
    },
    {
        title: 'Oil Spills',
        image: oil_spill_info,
        description: '- Phytoplankton population drop<br />- Habitat contamination<br />- Potential ecosystem collapse',
        alt: 'Oil spill in the ocean'
    }
];

export default function InfoPage() {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, []);

    const prevSlide = useCallback(() => {
        setActiveIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
    }, []);

    const handleKeyDown = useCallback((e) => {
        if (e.key === "ArrowRight") {
            nextSlide();
        } else if (e.key === "ArrowLeft") {
            prevSlide();
        } else if (e.key === "Enter") {
            // Navigate to the corresponding page on Enter
            navigate(`/info/${activeIndex}`);
        }
    }, [activeIndex, nextSlide, prevSlide, navigate]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]); // Only re-run when `handleKeyDown` changes

    return (
        <Container className="info-page-container">
            <Button 
                variant="link" 
                onClick={() => navigate('/homepage')} 
                className="back-button"
            >
                Back
            </Button>
            <h1 className="page-title">Mangrove Ecosystem Information</h1>

            <div className="carousel-container">
                <div className="carousel-items">
                    {data.map((item, index) => (
                        <Card
                            key={index}
                            className={`carousel-item ${index === activeIndex ? "active" : ""}`}
                            onClick={() => navigate(`/info/${index}`)}
                        >
                            <Card.Img 
                                variant="top" 
                                src={item.image} 
                                alt={item.alt} 
                                className="card-img" 
                            />
                            <Card.Body>
                                <Card.Title>{item.title}</Card.Title>
                                <Card.Text dangerouslySetInnerHTML={{ __html: item.description }} />
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </div>
        </Container>
    );
}
