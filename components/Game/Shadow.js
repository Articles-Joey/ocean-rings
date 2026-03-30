import { useRef } from 'react';
import * as THREE from 'three';

export default function Shadow({ radius = 1, opacity = 0.6, position = [0, 0.26, 0] }) {
    // Create a radial gradient texture for the shadow
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, `rgba(0, 0, 0, ${opacity})`);
    gradient.addColorStop(0.5, `rgba(0, 0, 0, ${opacity * 0.5})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    
    const texture = new THREE.CanvasTexture(canvas);
    
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={position}>
            <circleGeometry args={[radius, 32]} />
            <meshBasicMaterial 
                map={texture}
                transparent={true}
                depthWrite={false}
                opacity={opacity}
            />
        </mesh>
    );
}
