import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Debug, Physics } from '@react-three/cannon';
import { Center, Image, OrbitControls, Plane, Sky, Stats, Text, Text3D } from '@react-three/drei'
import { memo, useMemo, useRef } from 'react';
// import MovingPlatform from './Platforms/MovingPlatform';
// import { useGameStore } from '@/hooks/useGameStore';
// import Bounds from './Bounds';
import Player from './Player';
import Rings from './Rings';
// import getRandomHexColor from 'util/getRandomHexColor';
import Decorations from './Decorations';
import OceanSurface from './OceanSurface';
import { useStore } from '@/hooks/useStore';

const TARGET = [0, 1, 0];
const CAM_Y = 5;
const CAM_Z = 20;
const SWING_RANGE = 3;   // units left/right from center
const SWING_SPEED = 0.3; // radians per second

function LandingCamera() {
    const { camera } = useThree();
    useFrame(({ clock }) => {
        camera.position.x = Math.sin(clock.elapsedTime * SWING_SPEED) * SWING_RANGE;
        camera.position.y = CAM_Y;
        camera.position.z = CAM_Z;
        camera.lookAt(...TARGET);
    });
    return null;
}

function GameCanvas({
    landingAnimation
}) {

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

    // const {
    //     debug,
    // } = useGameStore(state => ({
    //     debug: state.debug,
    // }));

    const debug = useStore(state => state.debug)
    const darkMode = useStore(state => state.darkMode)

    let gameContent = (
        <>

            <OceanSurface />

            <Rings />

            {!landingAnimation &&
                <Player
                    position={[0, 1, 0]}
                />
            }

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

            <Stats />

            {/* <color
                attach="background"
                args={[0, 0, 0]}
            /> */}

            {/* <Sky
                // scale={3000}
            /> */}

            <color attach="background" args={['#215776']} />
            <fog attach="fog" args={['#215776', 10, 50]} />

            {/* Add your 3D scene components here */}
            <ambientLight intensity={darkMode ? 1 : 2} />
            {/* <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} /> */}

            {/* <BackWalls /> */}

            <Physics gravity={[0, 0, 0]}>

                {physicsContent}

            </Physics>

            <OrbitControls
                target={TARGET}
                enabled={!landingAnimation}
            />

            {landingAnimation && <LandingCamera />}

        </Canvas>
    )
}

export default memo(GameCanvas)