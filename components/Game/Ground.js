import { useEffect, useRef, useMemo } from 'react'

import { useFrame } from '@react-three/fiber'
import { useBox } from '@react-three/cannon';
import { useTexture } from '@react-three/drei';
import { ModelRockLarge } from "./Rock_Large"

import generateRandomInteger from "@/util/generateRandomInteger"
import { hillHeight } from "@/util/hillHeight"
import * as THREE from 'three'

const floor_size = [75, 0.1, 10]

// Subdivisions for the visual hill mesh
const HILL_SEGS_X = 30
const HILL_SEGS_Z = 20

export default function Ground(props) {

    // Physics body stays as a flat invisible box
    const [ref, api] = useBox(() => ({
        mass: 0,
        position: [
            props.position[0],
            props.position[1] + 2,
            props.position[2]
        ],
        args: floor_size,
        material: {
            restitution: 0,
        },
    }));

    const geoRef = useRef();

    // Canonical Z for this segment: derived deterministically from segmentId so
    // adjacent Ground components always share the same boundary worldZ values,
    // regardless of when the React component actually mounts/remounts.
    // id=0 → center 18, id=1 → center 8, id=k → 18 - k*10
    const canonicalCenterZ = 18 - (props.segmentId ?? 0) * 10;

    const base_link = `${process.env.NEXT_PUBLIC_CDN}games/US Tycoon/Textures/GroundSand005/`

    const texture = useTexture({
        map: `${base_link}GroundSand005_COL_1K.jpg`,
    })

    texture.map.repeat.set(1, 0.2);
    texture.map.wrapS = texture.map.wrapT = THREE.RepeatWrapping;

    // Bake hill displacement once at mount. Using canonicalCenterZ (not props.position)
    // guarantees that segment k's far-edge worldZ === segment k+1's near-edge worldZ.
    useEffect(() => {
        if (!geoRef.current) return;
        const posAttr = geoRef.current.attributes.position;
        const segCenterX = props.position[0];
        const segCenterZ = canonicalCenterZ;

        for (let i = 0; i < posAttr.count; i++) {
            const localX = posAttr.getX(i);
            // PlaneGeometry rotated Rx(-PI/2): localY maps to world -Z
            const localY = posAttr.getY(i);
            const worldX = segCenterX + localX;
            const worldZ = segCenterZ - localY;
            posAttr.setZ(i, hillHeight(worldX, worldZ));
        }

        posAttr.needsUpdate = true;
        geoRef.current.computeVertexNormals();
    }, []);

    const visualRef = useRef();
    const rocksRef = useRef();

    // Generate random rock properties once on mount
    const rockPositions = useMemo(() => {
        const segCenterX = props.position[0];
        const [segWidth, , segDepth] = floor_size;

        return [...Array(3)].map(() => {
            const localX = generateRandomInteger(-segWidth / 2.5, segWidth / 2.5);
            const localZ = generateRandomInteger(-segDepth / 2.5, segDepth / 2.5);

            // Rock's world position at spawn = group center + local offset.
            // Group center Z = canonicalCenterZ at spawn, so worldZ = canonicalCenterZ + localZ.
            // (PlaneGeometry after Rx(-PI/2): localY = -(worldZ - centerZ), so the
            //  height at (worldX, worldZ) is hillHeight(worldX, worldZ).)
            const worldX = segCenterX + localX;
            const worldZ = canonicalCenterZ + localZ;

            // Get height from the same hillHeight function
            const yHeight = hillHeight(worldX, worldZ);

            return {
                id: Math.random().toString(36).substring(2, 11),
                position: [localX, yHeight, localZ],
                rotation: [0, generateRandomInteger(0, 360) * (Math.PI / 180), 0],
                scale: generateRandomInteger(8, 15) / 100
            };
        });
    }, [canonicalCenterZ]);

    useFrame(() => {
        api.position.set(
            ref.current.position.x,
            ref.current.position.y,
            ref.current.position.z
        );

        // Sync the visual mesh and rocks group position with the scrolling physics body
        if (visualRef.current) {
            visualRef.current.position.set(...props.position);
        }
        if (rocksRef.current) {
            rocksRef.current.position.set(...props.position);
        }
    });

    return (
        <>
            {/* Invisible flat box used only for physics collision */}
            <mesh ref={ref} castShadow={false} {...props} visible={false}>
                <boxGeometry args={floor_size} />
                <meshStandardMaterial />
            </mesh>

            {/* Visual terrain mesh with smooth hill displacement */}
            <mesh
                ref={visualRef}
                position={props.position}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <planeGeometry
                    ref={geoRef}
                    args={[floor_size[0], floor_size[2], HILL_SEGS_X, HILL_SEGS_Z]}
                />
                <meshStandardMaterial
                    {...texture}
                    transparent={props.invisible ? true : false}
                    opacity={props.invisible ? 0 : 1}
                    side={THREE.DoubleSide}
                />
            </mesh>

            <group ref={rocksRef} position={props.position}>
                {rockPositions.map((rock) => (
                    <ModelRockLarge
                        key={rock.id}
                        position={rock.position}
                        rotation={rock.rotation}
                        scale={rock.scale}
                    />
                ))}
            </group>
        </>
    )

}