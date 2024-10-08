import { Container, Card, Button, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './InfoPage.css'; // Import custom CSS for additional styling
import chemical_runoff_info from './assets/chemical_runoff_info.jpeg';
import mangrove_snapper_info from './assets/mangrove_snapper_info.jpeg';
import mudskipper_info from './assets/mudskipper_info.jpeg';
import oil_spill_info from './assets/oil_spill_info.jpeg';
import plastic_waste_info from './assets/plastic_waste_info.jpeg';
import phytoplankton_info from './assets/phytoplankton_info.jpeg';

const speciesData = [
    {
        title: 'Phytoplankton (Producer)',
        image: phytoplankton_info,
        description: 'Microscopic organisms that perform photosynthesis, forming the base of the marine food web and producing oxygen.'
    },
    {
        title: 'Mudskippers (Primary Consumer)',
        image: mudskipper_info,
        description: 'Amphibious fish feeding on invertebrates and detritus. They bridge the aquatic and terrestrial environments.'
    },
    {
        title: 'Mangrove Snapper (Secondary Consumer)',
        image: mangrove_snapper_info,
        description: 'Predatory fish feeding on smaller fish and crustaceans, helping maintain balance within the mangrove ecosystem.'
    }
];

const pollutantData = [
    {
        title: 'Plastic Waste',
        image: plastic_waste_info,
        description: '- Reduced phytoplankton growth<br />- Microplastic ingestion in Mudskippers<br />- Toxin accumulation weakens ecosystem'
    },
    {
        title: 'Chemical Runoff',
        image: chemical_runoff_info,
        description: '- Phytoplankton blooms cause dead zones<br />- Mudskippers and Snappers face contamination<br />- Ecosystem destabilization over time'
    },
    {
        title: 'Oil Spills',
        image: oil_spill_info,
        description: '- Phytoplankton population drop<br />- Habitat contamination<br />- Potential ecosystem collapse'
    }
];

export default function InfoPage() {
    const navigate = useNavigate();

    return (
        <Container className="info-page-container mt-4">
            <Button variant="link" onClick={() => navigate('/homepage')} className="back-button">
                Back
            </Button>
            <h1 className="text-center mb-4">Mangrove Ecosystem Information</h1>

            
            {/* Species Section */}
            <h2 className="text-center mb-4 species-title">Species in the Mangrove Ecosystem</h2>
            {speciesData.map((species, index) => (
                <Card key={index} className="info-card mb-4">
                    <Card.Img variant="top" src={species.image} className="card-img" />
                    <Card.Body>
                        <Card.Title>{species.title}</Card.Title>
                        <Card.Text dangerouslySetInnerHTML={{ __html: species.description }} />
                    </Card.Body>
                </Card>
            ))}

            {/* Pollutants Section */}
            <h2 className="text-center mb-4">Effects of Pollutants</h2>
            {pollutantData.map((pollutant, index) => (
                <Card key={index} className="pollutant-card mb-4">
                    <Card.Img variant="top" src={pollutant.image} className="card-img" />
                    <Card.Body>
                        <Card.Title>{pollutant.title}</Card.Title>
                        <Card.Text dangerouslySetInnerHTML={{ __html: pollutant.description }} />
                    </Card.Body>
                </Card>
            ))}
        </Container>
    );
}
