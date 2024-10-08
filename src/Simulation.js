import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

// Importing images
import backgroundImg from './assets/background.jpeg'; // Adjust path as needed
import phytoplanktonImg from './assets/phytoplankton.png';
import mudskipperImg from './assets/mudskipper.png';
import mangroveSnapperImg from './assets/mangrooveSnapper.png';
import oilSpillImg from './assets/oilSpill.png';
import plasticWasteImg from './assets/plasticWaste.png';
import './Simulation.css';
const Simulation = () => {
    const scene = useRef(null);
    const engine = useRef(Matter.Engine.create());

    const [ballRate, setBallRate] = useState(1000);     // Ball spawn rate
    const [blockRate, setBlockRate] = useState(2000);   // Block spawn rate
    const [diamondRate, setDiamondRate] = useState(3000); // Diamond spawn rate

    const [plasticWaste, setPlasticWaste] = useState(0);  // Plastic waste intensity
    const [chemicalRunoff, setChemicalRunoff] = useState(0);  // Chemical runoff intensity
    const [oilSpill, setOilSpill] = useState(0);  // Oil spill intensity

    const ballLifetime = 8000;  // Ball lifespan in milliseconds
    const blockLifetime = 10000; // Block lifespan in milliseconds
    const diamondLifetime = 5000; // Diamond lifespan in milliseconds
    const plasticWasteLifetime = 6000; // Plastic waste lifespan in milliseconds
    // Base speed for each species
    const baseBallSpeed = 3;
    const baseBlockSpeed = 1.5;
    const baseDiamondSpeed = 2;
    const basePlasticSpeed = 1; // Speed for plastic waste
    // Calculate speeds considering pollution effects
    const getPhytoplanktonSpeed = () => baseBallSpeed * (1 - plasticWaste / 10);
    const getMudskipperSpeed = () => baseBlockSpeed * (1 - chemicalRunoff / 10);
    const getMangroveSnapperSpeed = () => baseDiamondSpeed * (1 - oilSpill / 10);
    const getPlasticWasteSpeed = () => basePlasticSpeed;
    const [isSimulationRunning, setIsSimulationRunning] = useState(true);
    const resetSimulation = () => {
      window.location.reload();
    };
    useEffect(() => {
      if (!isSimulationRunning) return;
        const { Engine, Render, Runner, Bodies, World, Events } = Matter;

        // Set gravity to zero for aquatic environment
        engine.current.gravity.y = 0;

        const width = 1000; // Width of the simulation area
        const height = 600; // Height of the simulation area

        const render = Render.create({
            element: scene.current,
            engine: engine.current,
            options: {
                width: width,
                height: height,
                wireframes: false,
                background: `url(${backgroundImg})`, // Background image
            }
        });

        const balls = [];
        const blocks = [];
        const diamonds = [];
        const plastics = [];
        // Create boundaries
        const floor = Bodies.rectangle(width / 2, height, width, 20, { isStatic: true });
        const ceiling = Bodies.rectangle(width / 2, 0, width, 20, { isStatic: true });
        const leftWall = Bodies.rectangle(0, height / 2, 20, height, { isStatic: true });
        const rightWall = Bodies.rectangle(width, height / 2, 20, height, { isStatic: true });

        World.add(engine.current.world, [floor, ceiling, leftWall, rightWall]);

        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine.current);

        const applyPollutantEffects = () => {
            balls.forEach(ball => {
                Matter.Body.setVelocity(ball, {
                    x: getPhytoplanktonSpeed() * (Math.random() > 0.5 ? 1 : -1),
                    y: getPhytoplanktonSpeed() * (Math.random() > 0.5 ? 1 : -1),
                });
            });
            blocks.forEach(block => {
                Matter.Body.setVelocity(block, {
                    x: getMudskipperSpeed() * (Math.random() > 0.5 ? 1 : -1),
                    y: getMudskipperSpeed() * (Math.random() > 0.5 ? 1 : -1),
                });
            });
            diamonds.forEach(diamond => {
                Matter.Body.setVelocity(diamond, {
                    x: getMangroveSnapperSpeed() * (Math.random() > 0.5 ? 1 : -1),
                    y: getMangroveSnapperSpeed() * (Math.random() > 0.5 ? 1 : -1),
                });
            });
            plastics.forEach(plastic => {
              Matter.Body.setVelocity(plastic, {
                  x: getPlasticWasteSpeed() * (Math.random() > 0.5 ? 1 : -1),
                  y: getPlasticWasteSpeed() * (Math.random() > 0.5 ? 1 : -1),
              });
          });
        };

        const addBall = () => {
          const randomX = Math.random() * (width - 40) + 20;
          const randomY = Math.random() * (height - 40) + 20;
          const ball = Bodies.circle(randomX, randomY, 20, {
              restitution: 0.9,
              frictionAir: 0,
              label: 'phytoplankton',
              inertia: Infinity,  // Prevents rotation
              render: {
                  sprite: {
                      texture: phytoplanktonImg,
                      xScale: 0.1,
                      yScale: 0.1,
                  }
              }
          });
          balls.push(ball);
          World.add(engine.current.world, ball);
      
          Matter.Body.setVelocity(ball, {
              x: getPhytoplanktonSpeed() * (Math.random() > 0.5 ? 1 : -1),
              y: getPhytoplanktonSpeed() * (Math.random() > 0.5 ? 1 : -1),
          });
          ball.angularVelocity = 0; // No rotational movement
      
          setTimeout(() => {
              World.remove(engine.current.world, ball);
              balls.splice(balls.indexOf(ball), 1);
          }, ballLifetime);
      };
      
      const addBlock = () => {
          const randomX = Math.random() * (width - 80) + 40;
          const randomY = Math.random() * (height - 80) + 40;
          const block = Bodies.rectangle(randomX, randomY, 40, 40, {
              restitution: 0.9,
              frictionAir: 0,
              label: 'mudskipper',
              inertia: Infinity,  // Prevents rotation
              render: {
                  sprite: {
                      texture: mudskipperImg,
                      xScale: 0.1,
                      yScale: 0.1,
                  }
              }
          });
          blocks.push(block);
          World.add(engine.current.world, block);
      
          Matter.Body.setVelocity(block, {
              x: getMudskipperSpeed() * (Math.random() > 0.5 ? 1 : -1),
              y: getMudskipperSpeed() * (Math.random() > 0.5 ? 1 : -1),
          });
          block.angularVelocity = 0; // No rotational movement
      
          setTimeout(() => {
              World.remove(engine.current.world, block);
              blocks.splice(blocks.indexOf(block), 1);
          }, blockLifetime);
      };
      
      const addDiamond = () => {
          const randomX = Math.random() * (width - 40) + 20;
          const randomY = Math.random() * (height - 40) + 20;
          const diamond = Bodies.polygon(randomX, randomY, 6, 15, {
              restitution: 0.9,
              frictionAir: 0,
              label: 'mangrove snapper',
              inertia: Infinity,  // Prevents rotation
              render: {
                  sprite: {
                      texture: mangroveSnapperImg,
                      xScale: 0.1,
                      yScale: 0.1,
                  }
              }
          });
          diamonds.push(diamond);
          World.add(engine.current.world, diamond);
      
          Matter.Body.setVelocity(diamond, {
              x: getMangroveSnapperSpeed() * (Math.random() > 0.5 ? 1 : -1),
              y: getMangroveSnapperSpeed() * (Math.random() > 0.5 ? 1 : -1),
          });
          diamond.angularVelocity = 0; // No rotational movement
      
          setTimeout(() => {
              World.remove(engine.current.world, diamond);
              diamonds.splice(diamonds.indexOf(diamond), 1);
          }, diamondLifetime);
      };
      
      // Function to add plastic waste
      const addPlasticWaste = () => {
        const amount = plasticWaste ; // Adjust number of plastics based on intensity (for example, 0-20 plastics)
        for (let i = 0; i < amount; i++) {
            const randomX = Math.random() * (width - 20) + 10;
            const randomY = Math.random() * (height - 20) + 10;
            const plastic = Bodies.circle(randomX, randomY, 10, {
                restitution: 0.5,
                frictionAir: 0.05,
                label: 'plastic waste',
                inertia: Infinity,  // Prevents rotation
                render: {
                    sprite: {
                        texture: plasticWasteImg,
                        xScale: 0.1,
                        yScale: 0.1,
                    }
                }
            });
            plastics.push(plastic);
            World.add(engine.current.world, plastic);

            Matter.Body.setVelocity(plastic, {
                x: getPlasticWasteSpeed() * (Math.random() > 0.5 ? 1 : -1),
                y: getPlasticWasteSpeed() * (Math.random() > 0.5 ? 1 : -1),
            });
            plastic.angularVelocity = 0; // No rotational movement

            setTimeout(() => {
                World.remove(engine.current.world, plastic);
                plastics.splice(plastics.indexOf(plastic), 1);
            }, plasticWasteLifetime);
        }
      };

        const ballInterval = setInterval(addBall, ballRate);
        const blockInterval = setInterval(addBlock, blockRate);
        const diamondInterval = setInterval(addDiamond, diamondRate);
        const plasticInterval = setInterval(addPlasticWaste, 1000); // Add plastic waste every second

        Events.on(engine.current, 'collisionStart', (event) => {
            const pairs = event.pairs;
            pairs.forEach((pair) => {
                const { bodyA, bodyB } = pair;
                if ((bodyA.label === 'phytoplankton' && bodyB.label === 'mudskipper') || (bodyA.label === 'mudskipper' && bodyB.label === 'phytoplankton')) {
                    const ball = bodyA.label === 'phytoplankton' ? bodyA : bodyB;
                    World.remove(engine.current.world, ball);
                    balls.splice(balls.indexOf(ball), 1);
                }
                if ((bodyA.label === 'mangrove snapper' && bodyB.label === 'mudskipper') || (bodyA.label === 'mudskipper' && bodyB.label === 'mangrove snapper')) {
                    const block = bodyA.label === 'mudskipper' ? bodyA : bodyB;
                    World.remove(engine.current.world, block);
                    blocks.splice(blocks.indexOf(block), 1);
                }
            });
        });

        return () => {
            clearInterval(ballInterval);
            clearInterval(blockInterval);
            clearInterval(diamondInterval);
            clearInterval(plasticInterval);
            Render.stop(render);
            World.clear(engine.current.world);
            Engine.clear(engine.current);
            Runner.stop(runner);
            render.canvas.remove();
            render.canvas = null;
            render.context = null;
            render.textures = {};
        };
    }, [isSimulationRunning,ballRate, blockRate, diamondRate, plasticWaste, chemicalRunoff, oilSpill]);

    return (
      <div style={{ display: 'flex', flexDirection: 'row',marginTop:'50px' }}>
          {/* Scene Container on the left */}
          <div ref={scene} style={{ width: '70%', height: '600px', position: 'relative', overflow: 'hidden',marginTop:'70px',marginLeft:'10px' }}>
              {/* Oil spill overlay */}
              <img 
                  src={oilSpillImg} 
                  alt="Oil Spill" 
                  style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '20%',
                      opacity: oilSpill / 10,
                      pointerEvents: 'none',
                  }} 
              />
  
              {/* Chemical runoff overlay */}
              <div 
                  style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(0, 255, 0, 0.5)',
                      opacity: chemicalRunoff / 10,
                      pointerEvents: 'none',
                  }} 
              />
          </div>
  
          {/* Controls and Speed Display Container on the right */}
          <div style={{ marginTop:'50px',width: '30%', padding: '10px', backgroundColor: '#f7f7f7', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <div className="controls" style={{ marginBottom: '10px' }}>
                  <h2 style={{ fontSize: '1.5em', marginBottom: '5px', color: '#333' }}>Simulation Controls</h2>
                  
                  <button 
                      onClick={resetSimulation} 
                      style={{
                          backgroundColor: '#007bff', 
                          color: '#fff', 
                          padding: '10px 15px', 
                          borderRadius: '5px', 
                          border: 'none', 
                          cursor: 'pointer', 
                          marginBottom: '20px'
                      }}
                  >
                      Reset Simulation
                  </button>
                  
                  {[
                      { label: 'Phytoplankton Rate', min: 500, max: 5000, value: ballRate, onChange: setBallRate },
                      { label: 'Mudskipper Rate', min: 1000, max: 5000, value: blockRate, onChange: setBlockRate },
                      { label: 'Mangrove Snapper Rate', min: 1500, max: 5000, value: diamondRate, onChange: setDiamondRate },
                      { label: 'Plastic Waste Intensity', min: 0, max: 10, value: plasticWaste, onChange: setPlasticWaste },
                      { label: 'Chemical Runoff Intensity', min: 0, max: 10, value: chemicalRunoff, onChange: setChemicalRunoff },
                      { label: 'Oil Spill Intensity', min: 0, max: 10, value: oilSpill, onChange: setOilSpill }
                  ].map(({ label, min, max, value, onChange }, index) => (
                      <div key={index} style={{ marginBottom: '5px' }}>
                          <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>{label}</label>
                          <input 
                              type="range" 
                              min={min} 
                              max={max} 
                              value={value} 
                              onChange={(e) => onChange(Number(e.target.value))} 
                              style={{ width: '100%' }}
                          />
                      </div>
                  ))}
              </div>
  
              <div className="speed-display" style={{ marginTop: '15px' }}>
                  <h2 style={{ fontSize: '1.5em', marginBottom: '5px', color: '#333' }}>Species Speed</h2>
                  <p style={{ marginBottom: '5px', color: '#555' }}>Phytoplankton Speed: <strong>{getPhytoplanktonSpeed().toFixed(2)} m/s</strong></p>
                  <p style={{ marginBottom: '5px', color: '#555' }}>Mudskipper Speed: <strong>{getMudskipperSpeed().toFixed(2)} m/s</strong></p>
                  <p style={{ color: '#555' }}>Mangrove Snapper Speed: <strong>{getMangroveSnapperSpeed().toFixed(2)} m/s</strong></p>
              </div>
          </div>
      </div>
  );
  
};

export default Simulation;
