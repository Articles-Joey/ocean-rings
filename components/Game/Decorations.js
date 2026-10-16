import {
    Billboard,
    Center,
    Resize,
    useGLTF,
    useTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import { DoubleSide, Quaternion, Vector3 } from "three";
import { useStore } from "@/hooks/useStore";
import generateRandomInteger from "@/util/generateRandomInteger";
import {
    getGroundCenterZ,
    getGroundHeight,
    getGroundNormal,
} from "@/util/terrain";
import getAssetSource from "@articles-media/articles-dev-box/getAssetSource";
import BoneFishModel from "../PlayerModels/BoneFish";
import { ModelKennyNLPirateShipWreck } from "./ship_wreck";
import { ModelDonaldsBoat } from "../Models/DonaldsBoat";
import { ModelPianoTuna } from "../Models/Piano_tuna";

const linkKelp = getAssetSource("/models/decorations/Kelp.glb");
const linkKelpCoral = getAssetSource("/models/decorations/KelpCoral.glb");
const TOONTOWN_DECORATIONS = [
    { url: "/img/toontown/underwater_neptune.png", height: 3.5, count: 1 },
    { url: "/img/toontown/seaweed2.png", height: 2.5, count: 3 },
];

function SwimmingPianoTuna({
    position,
    canonicalCenterZ,
    radius,
    speed,
    phase,
}) {
    const swimmer = useRef();
    const angle = useRef(phase);

    useFrame((_, delta) => {
        if (!swimmer.current) return;
        angle.current = (angle.current + delta * speed) % (Math.PI * 2);
        const x = Math.cos(angle.current) * radius;
        const z = Math.sin(angle.current) * radius;
        swimmer.current.position.set(
            x,
            getGroundHeight(
                position[0] + x,
                canonicalCenterZ + position[2] + z,
            ) + 2.2,
            z,
        );
        swimmer.current.rotation.y = -angle.current + (speed < 0 ? Math.PI : 0);
    });

    return (
        <group position={position}>
            <group ref={swimmer}>
                <Resize scale={2.25}>
                    <Center>
                        <ModelPianoTuna />
                    </Center>
                </Resize>
            </group>
        </group>
    );
}

function ToontownDecoration({ url, height, position }) {
    const billboard = useRef();
    const texture = useTexture(url);
    const width = (height * texture.image.width) / texture.image.height;
    const [worldPosition, cameraPosition] = useMemo(
        () => [new Vector3(), new Vector3()],
        [],
    );

    useFrame(({ camera }) => {
        if (!billboard.current) return;
        billboard.current.getWorldPosition(worldPosition);
        camera.getWorldPosition(cameraPosition);
        const x = cameraPosition.x - worldPosition.x;
        const z = cameraPosition.z - worldPosition.z;
        // Direct yaw keeps a full 360-degree turn without introducing tilt.
        if (x !== 0 || z !== 0) billboard.current.rotation.y = Math.atan2(x, z);
    });

    return (
        <Billboard
            ref={billboard}
            follow={false}
            position={[
                position[0],
                position[1] + height / 2 - 0.04,
                position[2],
            ]}
        >
            <mesh>
                <planeGeometry args={[width, height]} />
                <meshBasicMaterial
                    map={texture}
                    transparent
                    alphaTest={0.05}
                    side={DoubleSide}
                    toneMapped={false}
                />
            </mesh>
        </Billboard>
    );
}

function Kelp(props) {
    const { nodes, materials } = useGLTF(linkKelp);
    return (
        <group
            {...props}
            dispose={null}
        >
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.kelp.geometry}
                material={materials.None}
            />
        </group>
    );
}

function KelpCoral(props) {
    const { nodes, materials } = useGLTF(linkKelpCoral);
    return (
        <group
            {...props}
            dispose={null}
            scale={0.5}
        >
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.node_id61.geometry}
                material={materials["02___Default"]}
            />
        </group>
    );
}

function GroundedBoneFish({ fish, canonicalCenterZ }) {
    const { nodes } = useGLTF("/models/player/FishBone.glb");
    const placement = useMemo(() => {
        const [x, , z] = fish.position;
        const canonicalZ = canonicalCenterZ + z;
        const up = new Vector3(0, 1, 0);
        const quaternion = new Quaternion()
            .setFromUnitVectors(up, getGroundNormal(x, canonicalZ))
            .multiply(new Quaternion().setFromAxisAngle(up, fish.yaw))
            .multiply(
                new Quaternion().setFromAxisAngle(
                    new Vector3(0, 0, 1),
                    Math.PI / 2,
                ),
            );

        // Check the rotated model's footprint, including its internal 100x scale,
        // so the lowest bones rest above the mesh even on a changing slope.
        const vertices = nodes.FishBone.geometry.attributes.position;
        const vertex = new Vector3();
        let height = -Infinity;
        for (let i = 0; i < vertices.count; i++) {
            vertex
                .fromBufferAttribute(vertices, i)
                .multiplyScalar(100 * fish.scale)
                .applyQuaternion(quaternion);
            height = Math.max(
                height,
                getGroundHeight(x + vertex.x, canonicalZ + vertex.z) - vertex.y,
            );
        }
        return { position: [x, height + 0.015, z], quaternion };
    }, [fish, canonicalCenterZ, nodes]);

    return (
        <group
            position={placement.position}
            quaternion={placement.quaternion}
        >
            <BoneFishModel scale={fish.scale} />
        </group>
    );
}

export default function Decorations({ position, obstacle }) {
    const toontownMode = useStore((state) => state.toontownMode);
    const canonicalCenterZ = getGroundCenterZ(obstacle.id ?? 0);

    const decorationItems = useMemo(() => {
        const items = [];
        for (let i = 0; i < 2; i++) {
            const x = generateRandomInteger(-10, 10);
            const z = generateRandomInteger(-5, 5);
            items.push({
                type: "Kelp",
                position: [x, getGroundHeight(x, canonicalCenterZ + z) + 1, z],
                id: `kelp-${i}`,
            });
        }
        for (let i = 0; i < 2; i++) {
            const x = generateRandomInteger(-15, 15) + 20;
            const z = generateRandomInteger(-5, 5);
            items.push({
                type: "KelpCoral",
                position: [x, getGroundHeight(x, canonicalCenterZ + z) + 8, z],
                id: `kelp-coral-${i}`,
            });
        }
        return items;
    }, [canonicalCenterZ]);

    const toontownDecorations = useMemo(
        () =>
            TOONTOWN_DECORATIONS.flatMap(({ url, height, count }) =>
                Array.from({ length: count }, (_, index) => {
                    const x =
                        generateRandomInteger(7, 30) *
                        (Math.random() < 0.5 ? -1 : 1);
                    const z = generateRandomInteger(-4, 4);
                    return {
                        id: `${url}-${index}`,
                        url,
                        height: height * (0.8 + Math.random() * 0.4),
                        position: [
                            x,
                            getGroundHeight(x, canonicalCenterZ + z),
                            z,
                        ],
                    };
                }),
            ),
        [canonicalCenterZ],
    );

    const pianoTuna = useMemo(
        () => ({
            position: [
                generateRandomInteger(8, 24) * (Math.random() < 0.5 ? -1 : 1),
                0,
                generateRandomInteger(-2, 2),
            ],
            radius: 1.5 + Math.random(),
            speed:
                (0.4 + Math.random() * 0.25) * (Math.random() < 0.5 ? -1 : 1),
            phase: Math.random() * Math.PI * 2,
        }),
        [canonicalCenterZ],
    );

    const shipRotation = useMemo(
        () => (generateRandomInteger(0, 360) * Math.PI) / 180,
        [obstacle.id],
    );
    const deadFishPositions = useMemo(
        () =>
            [...Array(2)].map((_, id) => ({
                id,
                position: [
                    generateRandomInteger(-1, 1),
                    0,
                    generateRandomInteger(-1, 1),
                ],
                yaw: (generateRandomInteger(0, 360) * Math.PI) / 180,
                scale: generateRandomInteger(8, 15) / 10,
            })),
        [canonicalCenterZ],
    );

    const shipPosition = useMemo(() => {
        const x = obstacle.id % 2 === 0 ? 12 : -15;
        return [x, getGroundHeight(x, canonicalCenterZ), 0];
    }, [obstacle.id, canonicalCenterZ]);

    return (
        <group position={position}>
            {decorationItems.map((item) =>
                item.type === "Kelp" ? (
                    <Kelp
                        key={item.id}
                        position={item.position}
                    />
                ) : (
                    <KelpCoral
                        key={item.id}
                        position={item.position}
                    />
                ),
            )}
            {/* <Suspense fallback={null}>
                <SwimmingPianoTuna {...pianoTuna} canonicalCenterZ={canonicalCenterZ} />
            </Suspense> */}
            {toontownMode && (
                <Suspense fallback={null}>
                    {toontownDecorations.map(({ id, ...decoration }) => (
                        <ToontownDecoration
                            key={id}
                            {...decoration}
                        />
                    ))}
                </Suspense>
            )}
            {obstacle.id % 3 === 0 && (
                <>
                    {deadFishPositions.map((fish) => (
                        <GroundedBoneFish
                            key={fish.id}
                            fish={fish}
                            canonicalCenterZ={canonicalCenterZ}
                        />
                    ))}
                    <Suspense fallback={null}>
                        {toontownMode ? (
                            <group
                                position={[
                                    shipPosition[0],
                                    shipPosition[1] - 0.35,
                                    shipPosition[2],
                                ]}
                                rotation={[0, shipRotation, 0]}
                            >
                                <Resize
                                    scale={7}
                                    width
                                >
                                    <Center top>
                                        <ModelDonaldsBoat />
                                    </Center>
                                </Resize>
                            </group>
                        ) : (
                            <ModelKennyNLPirateShipWreck
                                position={shipPosition}
                                rotation={[0, shipRotation, 0]}
                            />
                        )}
                    </Suspense>
                </>
            )}
        </group>
    );
}
