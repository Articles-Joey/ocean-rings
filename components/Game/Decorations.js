import { useCylinder } from "@react-three/cannon";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from '@react-three/drei'
import { useMemo, useRef, useState } from "react"

import generateRandomInteger from "@/util/generateRandomInteger"
import { ModelRockLarge } from "./Rock_Large"
import BoneFishModel from "../PlayerModels/BoneFish";
import { ModelKennyNLPirateShipWreck } from "./ship_wreck";
import { degToRad } from "three/src/math/MathUtils.js";
// import getRandomHexColor from "util/getRandomHexColor"

// let linkKelp = `${process.env.NEXT_PUBLIC_CDN}games/Ocean Rings/Kelp.glb`
// let linkKelpCoral = `${process.env.NEXT_PUBLIC_CDN}games/Ocean Rings/KelpCoral.glb`

import { hillHeight } from "@/util/hillHeight"
import getAssetSource from '@articles-media/articles-dev-box/getAssetSource';

const linkKelp = getAssetSource(
    `/models/decorations/Kelp.glb`
);
const linkKelpCoral = getAssetSource(
    `/models/decorations/KelpCoral.glb`
);

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

function Decorations({ position, obstacle }) {

    const canonicalCenterZ = 18 - (obstacle.id ?? 0) * 10;

    const decorationItems = useMemo(() => {
        const items = [];
        // Add random Kelp
        for (let i = 0; i < 2; i++) {
            const localX = generateRandomInteger(-10, 10);
            const localZ = generateRandomInteger(-5, 5);
            // Height based on world position (simulating Ground logic)
            // Ground is at x=0
            const worldX = localX;
            const worldZ = canonicalCenterZ + localZ;
            const y = hillHeight(worldX, worldZ);
            items.push({ type: 'Kelp', position: [localX, y, localZ], id: `kelp-${i}` });
        }
        // Add random KelpCoral
        for (let i = 0; i < 2; i++) {
            const localX = generateRandomInteger(-15, 15);
            const localZ = generateRandomInteger(-5, 5);
            const worldX = localX;
            const worldZ = canonicalCenterZ + localZ;
            const y = hillHeight(worldX, worldZ);
            items.push({ type: 'KelpCoral', position: [localX, y, localZ], id: `kelp-coral-${i}` });
        }
        return items;
    }, [obstacle.id, canonicalCenterZ]);

    const shipRotation = useMemo(() => degToRad(generateRandomInteger(0, 360)), [obstacle.id])

    const deadFishPostions = useMemo(() => {
        return [...Array(2)].map(() => {
            const localX = generateRandomInteger(-1, 1);
            const localZ = generateRandomInteger(-1, 1);
            const worldX = localX;
            const worldZ = canonicalCenterZ + localZ;
            const y = hillHeight(worldX, worldZ) + 0.1;

            return {
                id: Math.random().toString(36).substring(2, 11),
                position: [localX, y, localZ],
                rotation: [0, generateRandomInteger(0, 360) * (Math.PI / 180), 0],
                scale: generateRandomInteger(8, 15) / 100
            };
        });
    }, [canonicalCenterZ]);

    const shipPosition = useMemo(() => {
        const localX = (obstacle.id % 2 === 0) ? 12 : -15;
        const localZ = 0;
        const worldX = localX;
        const worldZ = canonicalCenterZ + localZ;
        const y = hillHeight(worldX, worldZ);
        return [localX, y, localZ];
    }, [obstacle.id, canonicalCenterZ]);

    // useFrame(() => {
    //     if (ref.current) {
    //         const newZ = ref.current.position.z + 0.05;
    //         ref.current.position.z = newZ;
    //     }
    // });

    // const kelpMemo = useMemo(() => {

    //     return [...Array(1)].map((item, i) => {
    //         return (
    //             <Kelp
    //                 key={i}
    //                 position={[generateRandomInteger(-3, 3), position[1], -(i * 20)]}
    //             // currentZ={ref.current.position.z}
    //             />
    //         )
    //     })

    // }, [])

    // const kelpCoralMemo = useMemo(() => {

    //     return [...Array(1)].map((item, i) => {
    //         return (
    //             <KelpCoral
    //                 key={i}
    //                 position={[generateRandomInteger(-3 + 22, 3 + 22), 8, -(i * 20)]}
    //             // currentZ={ref.current.position.z}
    //             />
    //         )
    //     })

    // }, [])

    return (
        <group
            position={[
                0,
                position[1],
                position[2]
            ]}
        >

            {decorationItems.map((item) => (
                item.type === 'Kelp' ?
                    <Kelp
                        key={item.id}
                        position={[
                            item.position[0] + 0,
                            item.position[1] + 1,
                            item.position[2]
                        ]}
                    /> :
                    <KelpCoral key={item.id} position={[
                        item.position[0] + 20,
                        item.position[1] + 8,
                        item.position[2]
                    ]} />
            ))}

            {obstacle.id % 3 === 0 && <>
                {deadFishPostions.map((fish) => (
                    <group
                        key={fish.id}
                        rotation={[0, 0, degToRad(90)]}
                    >
                        <BoneFishModel
                            // key={fish.id}
                            position={fish.position}
                            rotation={fish.rotation}
                            scale={fish.scale}
                        />
                    </group>
                ))}
            </>}

            {(obstacle.id % 3 === 0) &&
                <ModelKennyNLPirateShipWreck
                    position={shipPosition}
                    rotation={[
                        0,
                        shipRotation,
                        0
                    ]}
                />
            }

        </group>
    )
}

export default Decorations