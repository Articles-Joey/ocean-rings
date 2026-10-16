import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CanvasTexture, PlaneGeometry, Vector3 } from "three";
import { useGameStore } from "@/hooks/useGameStore";
import { hillHeight } from "@/util/hillHeight";
import {
    GROUND_STEP_X,
    GROUND_STEP_Z,
    GROUND_WIDTH,
    GROUND_Y,
    getGroundScrollOffset,
} from "@/util/terrain";

export default function Shadow({
    radius = 1,
    opacity = 0.6,
    position = [0, 0, 0],
    target,
}) {
    const mesh = useRef();
    const anchor = useMemo(() => new Vector3(), []);
    const obstacles = useGameStore((state) => state.obstacles);
    const scroll = getGroundScrollOffset(obstacles);
    const columns = Math.ceil((radius * 2) / GROUND_STEP_X) + 1;
    const rows = Math.ceil((radius * 2) / GROUND_STEP_Z) + 1;
    const geometry = useMemo(
        () =>
            new PlaneGeometry(
                columns * GROUND_STEP_X,
                rows * GROUND_STEP_Z,
                columns,
                rows,
            ),
        [columns, rows],
    );
    const texture = useMemo(() => {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 128;
        const ctx = canvas.getContext("2d");
        const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
        gradient.addColorStop(0.5, "rgba(0, 0, 0, 0.5)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);
        return new CanvasTexture(canvas);
    }, []);

    useEffect(() => () => geometry.dispose(), [geometry]);
    useEffect(() => () => texture.dispose(), [texture]);

    useFrame(() => {
        if (!mesh.current) return;
        if (target) {
            if (!target.current) {
                mesh.current.visible = false;
                return;
            }
            target.current.getWorldPosition(anchor);
        } else {
            anchor.set(...position);
        }

        const canonicalZ = anchor.z - scroll;
        // Match Ground's vertex grid and triangles so the entire patch stays on
        // the sand, even when it crosses a ridge or a segment boundary.
        const startX =
            Math.floor((anchor.x - radius + GROUND_WIDTH / 2) / GROUND_STEP_X) *
                GROUND_STEP_X -
            GROUND_WIDTH / 2;
        const startZ =
            Math.floor((canonicalZ - radius) / GROUND_STEP_Z) * GROUND_STEP_Z;
        const vertices = geometry.attributes.position;
        const uvs = geometry.attributes.uv;
        for (let row = 0; row <= rows; row++) {
            for (let column = 0; column <= columns; column++) {
                const index = row * (columns + 1) + column;
                const x = startX + column * GROUND_STEP_X;
                const z = startZ + row * GROUND_STEP_Z;
                vertices.setXYZ(
                    index,
                    x - anchor.x,
                    canonicalZ - z,
                    hillHeight(x, z),
                );
                uvs.setXY(
                    index,
                    (x - anchor.x) / (radius * 2) + 0.5,
                    (canonicalZ - z) / (radius * 2) + 0.5,
                );
            }
        }
        vertices.needsUpdate = true;
        uvs.needsUpdate = true;
        mesh.current.position.set(anchor.x, GROUND_Y + 0.012, anchor.z);
        mesh.current.visible = obstacles.some((obstacle) => {
            const center = obstacle.position[2] + 18;
            return (
                Math.abs(anchor.z - center) <= 5 &&
                Math.abs(anchor.x) <= GROUND_WIDTH / 2
            );
        });
    });

    return (
        <mesh
            ref={mesh}
            geometry={geometry}
            rotation={[-Math.PI / 2, 0, 0]}
            renderOrder={1}
            frustumCulled={false}
            dispose={null}
        >
            <meshBasicMaterial
                map={texture}
                transparent
                depthWrite={false}
                opacity={opacity}
                polygonOffset
                polygonOffsetFactor={-1}
                polygonOffsetUnits={-1}
            />
        </mesh>
    );
}
