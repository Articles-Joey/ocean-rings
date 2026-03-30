import { useCylinder } from "@react-three/cannon";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from '@react-three/drei'
import { useMemo, useRef, useState } from "react"

import generateRandomInteger from "@/util/generateRandomInteger"
import { ModelRockLarge } from "./Rock_Large"
// import getRandomHexColor from "util/getRandomHexColor"

let linkKelp = `${process.env.NEXT_PUBLIC_CDN}games/Ocean Rings/Kelp.glb`
let linkKelpCoral = `${process.env.NEXT_PUBLIC_CDN}games/Ocean Rings/KelpCoral.glb`

// Will load from local public folder instead of CDN
if (process.env.NEXT_PUBLIC_MODEL_SOURCE == "LOCAL") {
    linkKelp = `/models/decorations/Kelp.glb`
    linkKelpCoral = `/models/decorations/KelpCoral.glb`
}

function Kelp(props) {
    const { nodes, materials } = useGLTF(linkKelp)
    return (
        <group {...props} dispose={null}>
            <mesh castShadow receiveShadow geometry={nodes.kelp.geometry} material={materials.None} />
        </group>
    )
}

function KelpCoral(props) {
    const { nodes, materials } = useGLTF(linkKelpCoral)
    return (
        <group {...props} dispose={null} scale={0.5}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.node_id61.geometry}
                material={materials['02___Default']}
            />
        </group>
    )
}

function Decorations({ position }) {

    const refX = useRef(generateRandomInteger(-5, 5));

    // Generate random rock properties once on mount
    const rockPositions = useMemo(() => {
        return [...Array(3)].map(() => ({
            id: Math.random().toString(36).substring(2, 11),
            position: [
                generateRandomInteger(-10, 10),
                0, // Fixed height on the floor
                generateRandomInteger(-5, 5)
            ],
            rotation: [0, generateRandomInteger(0, 360) * (Math.PI / 180), 0],
            scale: generateRandomInteger(8, 15) / 100
        }));
    }, []);

    // useFrame(() => {
    //     if (ref.current) {
    //         const newZ = ref.current.position.z + 0.05;
    //         ref.current.position.z = newZ;
    //     }
    // });

    const kelpMemo = useMemo(() => {

        return [...Array(1)].map((item, i) => {
            return (
                <Kelp
                    key={i}
                    position={[generateRandomInteger(-3, 3), 0, -(i * 20)]}
                // currentZ={ref.current.position.z}
                />
            )
        })

    }, [])

    const kelpCoralMemo = useMemo(() => {

        return [...Array(1)].map((item, i) => {
            return (
                <KelpCoral
                    key={i}
                    position={[generateRandomInteger(-3 + 22, 3 + 22), 8, -(i * 20)]}
                // currentZ={ref.current.position.z}
                />
            )
        })

    }, [])

    return (
        <group
            position={[
                refX.current,
                0,                    
                position[2]
            ]}
        >

            {/* <group>{kelpMemo}</group>
            <group>{kelpCoralMemo}</group> */}

            <KelpCoral
                position={[
                    20,
                    8,                    
                    0
                ]}
            />

            <Kelp
                position={[
                    0,
                    1,                    
                    0
                ]}
            />

            <KelpCoral
                position={[
                    25,
                    8,
                    0
                ]}
            />

            {rockPositions.map((rock) => (
                <ModelRockLarge
                    key={rock.id}
                    position={rock.position}
                    rotation={rock.rotation}
                    scale={rock.scale}
                />
            ))}

        </group>
    )
}

export default Decorations