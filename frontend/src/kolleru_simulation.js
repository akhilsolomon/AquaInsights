import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

// Importing images
import backgroundImg from './assets/kolleru_background.png'; // Adjust path as needed
import phytoplanktonImg from './assets/water_lily.png';
import mudskipperImg from './assets/tilapia.png';
import mangroveSnapperImg from './assets/catfish.png';
import oilSpillImg from './assets/oilSpill.png';
import plasticWasteImg from './assets/invasive_kolleru.png';
import './Simulation.css';
const KolleruSimulation = () => {
    
    const scene = useRef(null);
    const engine = useRef(Matter.Engine.create());

    const [ballRate, setBallRate] = useState(1000);     // Ball spawn rate
    const [blockRate, setBlockRate] = useState(2000);   // Block spawn rate
    const [diamondRate, setDiamondRate] = useState(3000); // Diamond spawn rate
    
    //const [pollutionIntensity, setPollutionIntensity] = useState(0); // Pollution intensity
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
    const calculateSpawnRates = () => {
        setBallRate(1000 + plasticWaste * 100);     // Phytoplankton spawn rate affected by plastic waste
        setBlockRate(2000 + chemicalRunoff * 100);  // Mudskipper spawn rate affected by chemical runoff
        setDiamondRate(3000 + oilSpill * 100);       // Mangrove Snapper spawn rate affected by oil spill
    };
    useEffect(() => {
        calculateSpawnRates();
    }, [plasticWaste, chemicalRunoff, oilSpill]);
    useEffect(() => {
      if (!isSimulationRunning) return;
        const { Engine, Render, Runner, Bodies, World, Events } = Matter;

        // Set gravity to zero for aquatic environment
        engine.current.gravity.y = 0;
        const baseWidth = 1000; // Initial canvas width

        const width = baseWidth - (oilSpill * 50); // Reduce width by 50px per oil spill intensity level
        const height = 600; // Height of the simulation area

        const render = Render.create({
            element: scene.current,
            engine: engine.current,
            options: {
                width: width,
                height: height,
                wireframes: false,
                background: `url(${backgroundImg})`,
                backgroundSize: 'auto',   // Keep the image at its original size (1000x600)
                backgroundPosition: `left top`,  // Align the image to the left, showing the left part
                backgroundRepeat: 'no-repeat',  // Prevent the image from repeating
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
                // Apply random direction and speed change to phytoplankton
                Matter.Body.setVelocity(ball, {
                    x: getPhytoplanktonSpeed() * (Math.random() > 0.5 ? 1 : -1) + Math.random() * 0.5, // Random movement added
                    y: getPhytoplanktonSpeed() * (Math.random() > 0.5 ? 1 : -1) + Math.random() * 0.5, // Random movement added
                });
            });
            blocks.forEach(block => {
                // Apply random direction and speed change to mudskippers
                Matter.Body.setVelocity(block, {
                    x: getMudskipperSpeed() * (Math.random() > 0.5 ? 1 : -1) + Math.random() * 0.5, // Random movement added
                    y: getMudskipperSpeed() * (Math.random() > 0.5 ? 1 : -1) + Math.random() * 0.5, // Random movement added
                });
            });
            diamonds.forEach(diamond => {
                // Apply random direction and speed change to mangrove snappers
                Matter.Body.setVelocity(diamond, {
                    x: getMangroveSnapperSpeed() * (Math.random() > 0.5 ? 1 : -1) + Math.random() * 0.5, // Random movement added
                    y: getMangroveSnapperSpeed() * (Math.random() > 0.5 ? 1 : -1) + Math.random() * 0.5, // Random movement added
                });
            });
            plastics.forEach(plastic => {
                // Apply random direction and speed change to plastic waste
                Matter.Body.setVelocity(plastic, {
                    x: getPlasticWasteSpeed() * (Math.random() > 0.5 ? 1 : -1) + Math.random() * 0.5, // Random movement added
                    y: getPlasticWasteSpeed() * (Math.random() > 0.5 ? 1 : -1) + Math.random() * 0.5, // Random movement added
                });
            });
        };
        
        const addBall = () => {
          const randomX = Math.random() * (width - 40) + 20;
          const randomY = Math.random() * (height - 40) + 20;
          const ball = Bodies.circle(randomX, 20, 20, {
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
              x:0,
              y:0,
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
                if ((bodyA.label === 'plastic waste' && bodyB.label === 'mangrove snapper') || (bodyA.label === 'mangrove snapper' && bodyB.label === 'plastic waste')) {
                    const block = bodyA.label === 'mangrove snapper' ? bodyA : bodyB;
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
              {/* <img 
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
              /> */}
  
              {/* Chemical runoff overlay */}
              {/* <div 
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
              /> */}
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
                      
                      { label: 'Invasive Species Intensity', min: 0, max: 10, value: plasticWaste, onChange: setPlasticWaste },
                      { label: 'Global warming Intensity', min: 0, max: 10, value: chemicalRunoff, onChange: setChemicalRunoff },
                      { label: 'Habitat destruction Intensity', min: 0, max: 10, value: oilSpill, onChange: setOilSpill }
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
                <h2 style={{ fontSize: '1.5em', marginBottom: '5px', color: '#333' }}>Species Speed & Spawn Rates</h2>
                <p style={{ marginBottom: '5px', color: '#555' }}>
                    {/* Phytoplankton Speed: <strong>{getPhytoplanktonSpeed().toFixed(2)} m/s</strong> |  */}
                    Water Lily Spawn Rate: <strong>{ballRate} ms</strong>
                </p>
                <p style={{ marginBottom: '5px', color: '#555' }}>
                    Tilapia Speed: <strong>{getMudskipperSpeed().toFixed(2)} m/s</strong> | 
                    Spawn Rate: <strong>{blockRate} ms</strong>
                </p>
                <p style={{ color: '#555' }}>
                    Catfish Speed: <strong>{getMangroveSnapperSpeed().toFixed(2)} m/s</strong> | 
                    Spawn Rate: <strong>{diamondRate} ms</strong>
                </p>
            </div>
          </div>
      </div>
  );
  
};

export default KolleruSimulation;
