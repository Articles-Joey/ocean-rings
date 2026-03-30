import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { degToRad } from 'three/src/math/MathUtils';

function OceanSurface() {
  const meshRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.elapsedTime * 1.5;
    const geometry = meshRef.current.geometry;
    const positions = geometry.attributes.position.array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      positions[i + 2] = Math.sin(x + time) * 0.2 + Math.sin(y + time * 0.5) * 0.1;
    }
    geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, degToRad(180), 0]} position={[0, 7, 0]} castShadow receiveShadow>
      <planeGeometry args={[100, 100, 64, 64]} />
      <meshStandardMaterial color="#215776" transparent opacity={0.8} />
    </mesh>
  );
}

export default OceanSurface;
