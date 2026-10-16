import { useFrame, useThree } from "@react-three/fiber";
import {
    BallCollider,
    RigidBody,
    useBeforePhysicsStep,
} from "@react-three/rapier";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { MathUtils, Vector3 } from "three";
import { useSearchParams } from "next/navigation";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useControllerStore } from "@/hooks/useControllerStore";
import { useGameStore } from "@/hooks/useGameStore";
import useTouchControlsStore from "@/hooks/useTouchControlsStore";
import { useStore } from "@/hooks/useStore";
import { useSocketStore } from "@/hooks/useSocketStore";
import ClownfishModel from "@/components/PlayerModels/Clownfish";
import BoneFishModel from "@/components/PlayerModels/BoneFish";
import { ModelQuaterniusFishingGoldfish } from "@/components/PlayerModels/Goldfish";
import { ModelAnglerfish } from "@/components/PlayerModels/Anglerfish";
import { ModelQuaterniusFishingWorm } from "@/components/PlayerModels/Worm";
import { ModelQuaterniusFishingZebraClownFish } from "@/components/PlayerModels/ZebraClownFish";
import ModelToonCharacter from "@/components/Models/ModelToonCharacter";
import Shadow from "./Shadow";
import PlayerAppearance from "./PlayerAppearance";
import { degToRad } from "three/src/math/MathUtils.js";

const JUMP_FORCE = 6;
const SPEED = 4;
const TOON_PLAYER_SCALE = 0.01 / 6;
const PLAYER_DATA = { isPlayer: true };
const PLAYER_MODELS = {
    Clownfish: ClownfishModel,
    "Bone Fish": BoneFishModel,
    Goldfish: ModelQuaterniusFishingGoldfish,
    "Angler Fish": ModelAnglerfish,
    Worm: ModelQuaterniusFishingWorm,
    "Zebra Clownfish": ModelQuaterniusFishingZebraClownFish,
};

export default function Player({ position = [0, 2, 0] }) {
    const body = useRef();
    const visual = useRef();
    const lastLocation = useRef();
    const initialPosition = useRef(position).current;
    const direction = useMemo(() => new Vector3(), []);
    const cameraTarget = useMemo(() => new Vector3(), []);
    const server = useSearchParams().get("server");
    const socket = useSocketStore((state) => state.socket);
    const cameraMode = useGameStore((state) => state.cameraMode);
    const teleport = useGameStore((state) => state.teleport);
    const setTeleport = useGameStore((state) => state.setTeleport);
    const setPlayerLocation = useGameStore((state) => state.setPlayerLocation);
    const setShift = useGameStore((state) => state.setShift);
    const debug = useStore((state) => state.debug);
    const showPhysicsDebug = useStore(
        (state) => state?.debugConfig?.showPhysicsDebug,
    );
    const toontownMode = useStore((state) => state.toontownMode);
    const character = useStore((state) => state.character);
    const SelectedModel = PLAYER_MODELS[character?.model] ?? ClownfishModel;
    const playerModelScale =
        character?.model === "Worm" || character?.model === "Zebra Clownfish"
            ? 0.8
            : 1;
    const touchControls = useTouchControlsStore((state) => state.touchControls);
    const setTouchControls = useTouchControlsStore(
        (state) => state.setTouchControls,
    );
    const controllerState = useControllerStore(
        (state) => state.controllerState,
    );
    const { moveBackward, moveForward, moveRight, moveLeft, jump, shift } =
        useKeyboard();
    const { camera } = useThree();

    useEffect(() => {
        if (!teleport || !body.current) return;
        body.current.setTranslation(
            { x: teleport[0], y: teleport[1], z: teleport[2] },
            true,
        );
        body.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        setTeleport(false);
    }, [teleport, setTeleport]);

    useEffect(() => {
        setShift(shift);
    }, [shift, setShift]);

    useBeforePhysicsStep(() => {
        if (!body.current) return;
        const current = body.current.translation();
        const velocity = body.current.linvel();
        const x = MathUtils.clamp(current.x, -4, 4);
        const y = Math.min(current.y, 6.5);
        if (x !== current.x || y !== current.y) {
            body.current.setTranslation({ x, y, z: current.z }, true);
        }

        const axes = controllerState.axes;
        const axisX = Math.abs(axes?.[0] ?? 0) > 0.3 ? axes[0] : 0;
        const axisY = Math.abs(axes?.[1] ?? 0) > 0.3 ? axes[1] : 0;
        direction
            .set(
                Number(moveRight || touchControls.right) -
                    Number(moveLeft || touchControls.left) +
                    axisX,
                Number(moveForward || touchControls.up) -
                    Number(moveBackward || touchControls.down) -
                    axisY,
                0,
            )
            .clampLength(0, 1)
            .multiplyScalar(SPEED * (shift ? 2 : 1));

        if ((jump || touchControls.jump) && Math.abs(velocity.y) < 0.05) {
            direction.y = JUMP_FORCE;
            if (touchControls.jump)
                setTouchControls((controls) => ({ ...controls, jump: false }));
        }
        if ((x <= -4 && direction.x < 0) || (x >= 4 && direction.x > 0))
            direction.x = 0;
        if (y >= 6.5 && direction.y > 0) direction.y = 0;
        body.current.setLinvel(direction, true);
    });

    useFrame(() => {
        if (!body.current) return;
        const state = useGameStore.getState();
        if (state.gameState.status === "In Progress") state.addDistance(0.1);

        const current = body.current.translation();
        if (cameraMode === "Player") {
            camera.position.set(0, current.y, current.z + 15);
            cameraTarget.set(0, current.y, current.z + 5);
            camera.lookAt(cameraTarget);
        }

        const location = new Vector3(
            Math.floor(current.x * 100) / 100,
            Math.floor(current.y * 100) / 100,
            Math.floor(current.z * 100) / 100,
        );
        if (!lastLocation.current?.equals(location)) {
            setPlayerLocation(location);
            if (socket && server) {
                socket.emit(`game:${process.env.NEXT_PUBLIC_GAME_KEY}:move`, {
                    server,
                    x: location.x,
                    y: location.y,
                    z: location.z,
                });
            }
            lastLocation.current = location;
        }
    });

    return (
        <>
            <Shadow
                radius={0.8}
                opacity={0.7}
                target={visual}
            />
            <RigidBody
                ref={body}
                position={initialPosition}
                colliders={false}
                enabledRotations={[false, false, false]}
                enabledTranslations={[true, true, false]}
                canSleep={false}
                ccd
                userData={PLAYER_DATA}
            >
                <BallCollider
                    args={[0.5]}
                    mass={1}
                    friction={0}
                    restitution={0}
                />
                <group ref={visual}>
                    {showPhysicsDebug && (
                        <mesh>
                            <sphereGeometry args={[0.5, 16, 16]} />
                            <meshBasicMaterial
                                color="red"
                                wireframe
                                transparent
                                opacity={0.5}
                            />
                        </mesh>
                    )}
                    <Suspense fallback={null}>
                        <PlayerAppearance
                            key={
                                toontownMode
                                    ? "toon"
                                    : (character?.model ?? "Clownfish")
                            }
                        >
                            {toontownMode ? (
                                <ModelToonCharacter
                                    scale={TOON_PLAYER_SCALE}
                                    position={[0, 0, 0]}
                                    rotation={[-Math.PI / 2, Math.PI, 0]}
                                    action="swim"
                                    isSwimming
                                />
                            ) : (
                                <group scale={playerModelScale}>
                                    <SelectedModel
                                        position={
                                            character?.model === "Bone Fish"
                                                ? [-0.7, 0, 0]
                                                : [0, 0, 0]
                                        }
                                        rotation={
                                            character?.model === "Bone Fish"
                                                ? [0, degToRad(180), 0]
                                                : [0, Math.PI, 0]
                                        }
                                    />
                                </group>
                            )}
                        </PlayerAppearance>
                    </Suspense>
                </group>
            </RigidBody>
        </>
    );
}
