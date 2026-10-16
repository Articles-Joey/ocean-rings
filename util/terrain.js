import { Vector3 } from "three";
import { hillHeight } from "./hillHeight";

export const GROUND_WIDTH = 75;
export const GROUND_DEPTH = 10;
export const GROUND_Y = -2;
export const GROUND_SEGMENTS_X = 30;
export const GROUND_SEGMENTS_Z = 20;
export const GROUND_STEP_X = GROUND_WIDTH / GROUND_SEGMENTS_X;
export const GROUND_STEP_Z = GROUND_DEPTH / GROUND_SEGMENTS_Z;

export function getGroundCenterZ(segmentId) {
    return 18 - segmentId * GROUND_DEPTH;
}

// Sample Ground's triangles, rather than the smooth function between vertices.
function getGroundTriangle(x, z) {
    const x0 =
        Math.floor((x + GROUND_WIDTH / 2) / GROUND_STEP_X) * GROUND_STEP_X -
        GROUND_WIDTH / 2;
    const z0 = Math.floor(z / GROUND_STEP_Z) * GROUND_STEP_Z;
    return {
        u: (x - x0) / GROUND_STEP_X,
        v: (z - z0) / GROUND_STEP_Z,
        a: hillHeight(x0, z0),
        b: hillHeight(x0, z0 + GROUND_STEP_Z),
        c: hillHeight(x0 + GROUND_STEP_X, z0 + GROUND_STEP_Z),
        d: hillHeight(x0 + GROUND_STEP_X, z0),
    };
}

export function getGroundHeight(x, z) {
    const { u, v, a, b, c, d } = getGroundTriangle(x, z);
    return u + v <= 1
        ? a + (d - a) * u + (b - a) * v
        : c + (b - c) * (1 - u) + (d - c) * (1 - v);
}

export function getGroundNormal(x, z) {
    const { u, v, a, b, c, d } = getGroundTriangle(x, z);
    const dx = (u + v <= 1 ? d - a : c - b) / GROUND_STEP_X;
    const dz = (u + v <= 1 ? b - a : c - d) / GROUND_STEP_Z;
    return new Vector3(-dx, 1, -dz).normalize();
}

export function getGroundScrollOffset(obstacles) {
    const first = obstacles[0];
    // Also follows the landing animation, where player distance is paused.
    return first ? first.position[2] + first.id * GROUND_DEPTH : 0;
}
