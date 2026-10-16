import {
    BallCollider,
    RigidBody,
    useBeforePhysicsStep,
} from "@react-three/rapier";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { useGameStore } from "@/hooks/useGameStore";
import { useStore } from "@/hooks/useStore";
import Shadow from "./Shadow";

const RING_COLORS = [
    "#30c6ed",
    "#ff8b47",
    "#a987ff",
    "#ff72b2",
    "#5ee6a4",
    "#ffe16a",
];
const BAND_ARC = Math.PI / 5;
const BAND_ANGLES = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];

function Ring({ position, id }) {
    const body = useRef();
    const hitRef = useRef(false);
    const [hit, setHit] = useState(false);
    const initialPosition = useRef(position).current;
    const userData = useMemo(
        () => ({ isObstacle: true, obstacleId: id }),
        [id],
    );
    const debug = useStore((state) => state.debug);
    const showPhysicsDebug = useStore(
        (state) => state?.debugConfig?.showPhysicsDebug,
    );
    const color = useMemo(
        () => RING_COLORS[Math.floor(Math.random() * RING_COLORS.length)],
        [],
    );
    const opacity = Math.max(0, Math.min(1, 1 - Math.max(0, position[2]) / 10));
    const debugColor =
        position[2] < 0 ? "#aab8c8" : hit ? "#43ef83" : "#ff5366";

    useBeforePhysicsStep(() => {
        body.current?.setNextKinematicTranslation({
            x: position[0],
            y: position[1],
            z: position[2],
        });
    });

    const handleIntersection = useCallback(({ other }) => {
        if (!other.rigidBody?.userData?.isPlayer || hitRef.current) return;
        const state = useGameStore.getState();
        if (state.gameState.status !== "In Progress") return;
        hitRef.current = true;
        setHit(true);
        state.addScore();
    }, []);

    return (
        <>
            {opacity > 0 && (
                <Shadow
                    radius={1.2}
                    opacity={0.6 * opacity}
                    position={position}
                />
            )}
            <RigidBody
                ref={body}
                type="kinematicPosition"
                colliders={false}
                position={initialPosition}
                userData={userData}
            >
                <BallCollider
                    args={[0.5]}
                    sensor
                    onIntersectionEnter={handleIntersection}
                />
            </RigidBody>
            {opacity > 0 && (
                <group position={position}>
                    <mesh renderOrder={2}>
                        <torusGeometry args={[1, 0.21, 8, 48]} />
                        <meshStandardMaterial
                            color={color}
                            emissive={color}
                            emissiveIntensity={0.18}
                            roughness={0.75}
                            metalness={0}
                            toneMapped={false}
                            transparent
                            opacity={opacity}
                            depthWrite={opacity === 1}
                            flatShading
                        />
                    </mesh>
                    {BAND_ANGLES.map((angle) => (
                        <mesh
                            key={angle}
                            rotation={[0, 0, angle - BAND_ARC / 2]}
                            renderOrder={3}
                        >
                            <torusGeometry args={[1, 0.216, 8, 8, BAND_ARC]} />
                            <meshStandardMaterial
                                color="#ffffff"
                                emissive="#dceaff"
                                emissiveIntensity={0.12}
                                roughness={0.75}
                                metalness={0}
                                toneMapped={false}
                                transparent
                                opacity={opacity}
                                depthWrite={opacity === 1}
                                flatShading
                                polygonOffset
                                polygonOffsetFactor={-1}
                                polygonOffsetUnits={-1}
                            />
                        </mesh>
                    ))}
                    {showPhysicsDebug && (
                        <mesh>
                            <sphereGeometry args={[0.5, 16, 16]} />
                            <meshBasicMaterial
                                color={debugColor}
                                transparent
                                opacity={0.4}
                                wireframe
                                depthWrite={false}
                            />
                        </mesh>
                    )}
                </group>
            )}
        </>
    );
}

export default memo(Ring);
