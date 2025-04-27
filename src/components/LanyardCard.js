import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Text } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

// Type for the GLTF result
const GLTFResult = GLTF;

/**
 * LanyardCard Component
 * An interactive 3D card with a lanyard that can be flipped and hovered
 */
const LanyardCard = ({
  frontImage,
  backImage = '/assets/card-back.png',
  lanyardColor = '#0047AB',
  name,
  title,
  company
}) => {
  return (
    <div className="relative w-full h-[500px]">
      <Canvas camera={{ position: [0, 0, 4], fov: 40 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        <Lanyard color={lanyardColor} />
        <Card3DScene 
          frontImage={frontImage} 
          backImage={backImage}
          name={name}
          title={title}
          company={company}
        />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

/**
 * Lanyard Component
 * Renders a 3D lanyard with a swaying animation
 */
function Lanyard({ color = '#0047AB' }) {
  const points = [];
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 2, 0),
    new THREE.Vector3(0, 1.5, 0.1),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0.5, -0.1),
    new THREE.Vector3(0, 0, 0)
  ]);
  
  const divisions = 50;
  const curvePoints = curve.getPoints(divisions);
  for (let i = 0; i < curvePoints.length; i++) {
    points.push(curvePoints[i].x, curvePoints[i].y, curvePoints[i].z);
  }

  const lineRef = useRef();
  
  useFrame((state) => {
    if (lineRef.current) {
      // Add subtle sway animation for the lanyard
      lineRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
    }
  });

  return (
    <group ref={lineRef}>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length / 3}
            array={new Float32Array(points)}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} linewidth={3} />
      </line>
    </group>
  );
}

/**
 * Card3DScene Component
 * Renders a 3D card with front and back sides
 */
function Card3DScene({ frontImage, backImage, name, title, company }) {
  const cardGroupRef = useRef();
  const cardFrontRef = useRef();
  const cardBackRef = useRef();
  
  // Load textures
  const cardTexture = useTexture(frontImage);
  const cardBackTexture = useTexture(backImage);
  const { nodes, materials } = useGLTF('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb');

  // Set state for hover and flip effects
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // Apply texture transformations
  useEffect(() => {
    if (cardTexture) {
      cardTexture.rotation = Math.PI;
      cardTexture.center.set(0.5, 0.5);
      cardTexture.repeat.set(0.95, 0.95);
      cardTexture.offset.set(-0.2, 0.05);
    }
    if (cardBackTexture) {
      cardBackTexture.rotation = Math.PI;
      cardBackTexture.center.set(0.5, 0.5);
      cardBackTexture.repeat.set(1.8, 1.3);
      cardBackTexture.offset.set(0.4, -0.35);
      cardBackTexture.repeat.x *= -1;
    }
  }, [cardTexture, cardBackTexture]);

  // Handle cursor style changes
  useEffect(() => {
    if (isHovered) {
      document.body.style.cursor = 'pointer';
      return () => { document.body.style.cursor = 'auto' };
    }
  }, [isHovered]);

  // Animation (gentle floating + flip animation)
  useFrame((state, delta) => {
    if (cardGroupRef.current) {
      // Gentle hovering animation
      if (!isFlipped) {
        cardGroupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
        cardGroupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      } else {
        // When flipped, lerp to a stable position
        cardGroupRef.current.rotation.y = THREE.MathUtils.lerp(
          cardGroupRef.current.rotation.y,
          Math.PI,
          delta * 5
        );
      }
      
      // If hovering, add a slight lift effect
      if (isHovered && !isFlipped) {
        cardGroupRef.current.position.y = THREE.MathUtils.lerp(
          cardGroupRef.current.position.y,
          0.1,
          delta * 3
        );
      }
    }
  });

  // Handle flip animation
  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <group 
      ref={cardGroupRef}
      onClick={handleClick}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      <mesh 
        ref={cardFrontRef} 
        geometry={nodes.card.geometry}
        visible={!isFlipped}
      >
        <meshPhysicalMaterial 
          map={cardTexture} 
          map-anisotropy={16} 
          clearcoat={1} 
          clearcoatRoughness={0.15} 
          roughness={0.3} 
          metalness={0.5} 
        />
      </mesh>
      <mesh 
        ref={cardBackRef} 
        geometry={nodes.card.geometry} 
        rotation={[0, Math.PI, 0]}
        visible={isFlipped}
      >
        <meshPhysicalMaterial 
          map={cardBackTexture} 
          map-anisotropy={16} 
          clearcoat={1} 
          clearcoatRoughness={0.15} 
          roughness={0.3} 
          metalness={0.5} 
        />
      </mesh>

      {/* Text elements - only shown on front */}
      {!isFlipped && name && (
        <Text
          position={[0, -0.5, 0.06]}
          fontSize={0.1}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
      )}
      
      {!isFlipped && title && (
        <Text
          position={[0, -0.65, 0.06]}
          fontSize={0.07}
          color="#444444"
          anchorX="center"
          anchorY="middle"
        >
          {title}
        </Text>
      )}
      
      {!isFlipped && company && (
        <Text
          position={[0, -0.8, 0.06]}
          fontSize={0.07}
          color="#666666"
          anchorX="center"
          anchorY="middle"
        >
          {company}
        </Text>
      )}
    </group>
  );
}

export default LanyardCard; 