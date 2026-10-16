import { useEffect, useMemo, useRef } from "react";
import {
    RigidBody,
    TrimeshCollider,
    useBeforePhysicsStep,
} from "@react-three/rapier";
import { useTexture } from "@react-three/drei";
import { DoubleSide, PlaneGeometry, RepeatWrapping } from "three";
import { ModelRockLarge } from "./Rock_Large";
import generateRandomInteger from "@/util/generateRandomInteger";
import { hillHeight } from "@/util/hillHeight";
import {
    GROUND_WIDTH,
    GROUND_DEPTH,
    GROUND_SEGMENTS_X,
    GROUND_SEGMENTS_Z,
    getGroundCenterZ,
    getGroundHeight,
} from "@/util/terrain";

export default function Ground({ position, segmentId = 0, invisible = false }) {
    const body = useRef();
    const initialPosition = useRef(position).current;
    const centerX = position[0];
    const canonicalCenterZ = getGroundCenterZ(segmentId);
    const geometry = useMemo(() => {
        const geometry = new PlaneGeometry(
            GROUND_WIDTH,
            GROUND_DEPTH,
            GROUND_SEGMENTS_X,
            GROUND_SEGMENTS_Z,
        );
        geometry.rotateX(-Math.PI / 2);
        const vertices = geometry.attributes.position;
        for (let i = 0; i < vertices.count; i++) {
            vertices.setY(
                i,
                hillHeight(
                    centerX + vertices.getX(i),
                    canonicalCenterZ + vertices.getZ(i),
                ),
            );
        }
        geometry.computeVertexNormals();
        geometry.computeBoundingSphere();
        return geometry;
    }, [centerX, canonicalCenterZ]);
    const colliderArgs = useMemo(
        () => [geometry.attributes.position.array, geometry.index.array],
        [geometry],
    );
    useEffect(() => () => geometry.dispose(), [geometry]);

    const baseLink = `${process.env.NEXT_PUBLIC_CDN}games/US Tycoon/Textures/GroundSand005/`;
    const sourceTexture = useTexture(`${baseLink}GroundSand005_COL_1K.jpg`);
    const texture = useMemo(() => {
        const texture = sourceTexture.clone();
        texture.repeat.set(1, 0.2);
        texture.wrapS = texture.wrapT = RepeatWrapping;
        texture.needsUpdate = true;
        return texture;
    }, [sourceTexture]);
    useEffect(() => () => texture.dispose(), [texture]);

    const rocks = useMemo(
        () =>
            [...Array(3)].map((_, id) => {
                const x = generateRandomInteger(
                    -GROUND_WIDTH / 2.5,
                    GROUND_WIDTH / 2.5,
                );
                const z = generateRandomInteger(
                    -GROUND_DEPTH / 2.5,
                    GROUND_DEPTH / 2.5,
                );
                return {
                    id,
                    position: [
                        x,
                        getGroundHeight(centerX + x, canonicalCenterZ + z),
                        z,
                    ],
                    rotation: [
                        0,
                        (generateRandomInteger(0, 360) * Math.PI) / 180,
                        0,
                    ],
                    scale: generateRandomInteger(8, 15) / 100,
                };
            }),
        [centerX, canonicalCenterZ],
    );

    useBeforePhysicsStep(() => {
        body.current?.setNextKinematicTranslation({
            x: position[0],
            y: position[1],
            z: position[2],
        });
    });

    return (
        <>
            <RigidBody
                ref={body}
                type="kinematicPosition"
                colliders={false}
                position={initialPosition}
            >
                <TrimeshCollider
                    args={colliderArgs}
                    restitution={0}
                    friction={0}
                />
            </RigidBody>
            <group position={position}>
                <mesh
                    geometry={geometry}
                    visible={!invisible}
                    receiveShadow
                    dispose={null}
                >
                    <meshStandardMaterial
                        map={texture}
                        side={DoubleSide}
                    />
                </mesh>
                {rocks.map(({ id, ...rock }) => (
                    <ModelRockLarge
                        key={id}
                        {...rock}
                    />
                ))}
            </group>
        </>
    );
}
