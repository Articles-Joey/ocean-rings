import { Canvas, useThree } from '@react-three/fiber';
import { Debug, Physics } from '@react-three/cannon';
import { Center, Image, OrbitControls, Plane, Sky, Text, Text3D } from '@react-three/drei'

import Player from './Player';
// import RainbowCube from './RainbowCube';
// import generateRandomInteger from 'util/generateRandomInteger';
// import OneWayPlatform from './Platforms/OneWayPlatform';
import { memo, useMemo } from 'react';
// import MovingPlatform from './Platforms/MovingPlatform';
import { useGameStore } from '@/hooks/useGameStore';
import Bounds from './Bounds';
import Rings from './Rings';
// import getRandomHexColor from 'util/getRandomHexColor';
import Decorations from './Decorations';

function GameCanvas(props) {

    // const {
    //     // setPlayerData, 
    //     players
    // } = props;

    // const generateRandomPlatforms = useMemo((platformNumbers) => {

    //     const originalMaterial = [...Array(platformNumbers)].map((item, i) => {
    //         return (
    //             <OneWayPlatform key={i} color="pink" position={[generateRandomInteger(-1.5, 1.5), (16 + (i * 1.5)), 0]} />
    //         )
    //     })

    //     return originalMaterial

    // }, [])

    // const { playerLocation } = useGameStore()

    const {
        debug,
    } = useGameStore(state => ({
        debug: state.debug,
    }));

    let gameContent = (
        <>

            <Rings />

            <Player
                position={[0, 1, 0]}
            />

        </>
    )

    let physicsContent
    if (debug) {
        physicsContent = (
            <Debug>
                {gameContent}
            </Debug>
        )
    } else {
        physicsContent = (
            gameContent
        )
    }

    return (
        <Canvas camera={{ fov: 45, position: [0, 5, 20] }}>

            {/* <color
                attach="background"
                args={[0, 0, 0]}
            /> */}

            {/* <Sky
                // scale={3000}
            /> */}

            <color attach="background" args={['#215776']} />

            {/* Add your 3D scene components here */}
            <ambientLight intensity={2} />
            {/* <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} /> */}

            {/* <BackWalls /> */}

            <Physics gravity={[0, 0, 0]}>

                {physicsContent}

            </Physics>

            <OrbitControls
                target={[0, 1, 0]}
            />

        </Canvas>
    )
}

export default memo(GameCanvas)