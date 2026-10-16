import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { OrbitControls, Stats } from "@react-three/drei";
import { memo, Suspense } from "react";
import Player from "./Player";
import OceanSurface from "./OceanSurface";
import { useStore } from "@/hooks/useStore";
import GameSections from "./GameSections";

const TARGET = [0, 1, 0];
const CAM_Y = 5;
const CAM_Z = 20;
const SWING_RANGE = 3;
const SWING_SPEED = 0.3;

function LandingCamera() {
    const { camera } = useThree();
    useFrame(({ clock }) => {
        camera.position.x =
            Math.sin(clock.elapsedTime * SWING_SPEED) * SWING_RANGE;
        camera.position.y = CAM_Y;
        camera.position.z = CAM_Z;
        camera.lookAt(...TARGET);
    });
    return null;
}

function GameCanvas({ landingAnimationMode }) {
    const debug = useStore((state) => state.debug);
    const darkMode = useStore((state) => state.darkMode);
    const showStats = useStore((state) => state?.debugConfig?.showStats);
    const showPhysicsDebug = useStore(
        (state) => state?.debugConfig?.showPhysicsDebug,
    );

    return (
        <Canvas camera={{ fov: 45, position: [0, 5, 20] }}>
            {showStats && <Stats className="stats-overlay" />}
            <color
                attach="background"
                args={["#215776"]}
            />
            <fog
                attach="fog"
                args={["#215776", 10, 50]}
            />
            <ambientLight intensity={darkMode ? 1 : 2} />
            <Suspense fallback={null}>
                <Physics
                    gravity={[0, 0, 0]}
                    debug={showPhysicsDebug}
                    colliders={false}
                >
                    <OceanSurface />
                    <GameSections landingAnimationMode={landingAnimationMode} />
                    {!landingAnimationMode && <Player position={[0, 2, 0]} />}
                </Physics>
            </Suspense>
            <OrbitControls
                target={TARGET}
                enabled={!landingAnimationMode}
            />
            {landingAnimationMode && <LandingCamera />}
        </Canvas>
    );
}

export default memo(GameCanvas);
