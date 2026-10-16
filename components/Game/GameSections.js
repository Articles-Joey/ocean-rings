import { useFrame } from "@react-three/fiber";
import { useEffect } from "react";
import generateRandomInteger from "@/util/generateRandomInteger";
import { useGameStore } from "@/hooks/useGameStore";
import { GROUND_Y } from "@/util/terrain";
import Ground from "./Ground";
import Decorations from "./Decorations";
import Ring from "./Ring";

const OBSTACLE_COUNT = 10;
const Y_BOUNDS = [2, 5];

export default function GameSections({ landingAnimationMode }) {
    const obstacles = useGameStore((state) => state.obstacles);
    const setObstacles = useGameStore((state) => state.setObstacles);
    const setTotalObstaclesGenerated = useGameStore(
        (state) => state.setTotalObstaclesGenerated,
    );

    useEffect(() => {
        const initial = [];
        for (let i = 1; i < OBSTACLE_COUNT; i++) {
            initial.push({
                position: [
                    generateRandomInteger(-1.5, 1.5),
                    generateRandomInteger(...Y_BOUNDS),
                    -i * 10,
                ],
                id: i,
            });
        }
        setObstacles(initial);
        setTotalObstaclesGenerated(OBSTACLE_COUNT);
    }, [setObstacles, setTotalObstaclesGenerated]);

    useFrame(() => {
        const state = useGameStore.getState();
        if (state.gameState.status !== "In Progress" && !landingAnimationMode)
            return;
        const horizontalChance =
            state.distance > 100 ? 0.5 : state.distance > 20 ? 0.25 : 0;
        let nextId = state.totalObstaclesGenerated;
        let next = state.obstacles
            .map((obstacle) => {
                let x = obstacle.position[0];
                let horizontalSpeed = obstacle.horizontalSpeed || 0;
                if (horizontalSpeed !== 0) {
                    x += horizontalSpeed;
                    if (x > 2.5 || x < -2.5) {
                        horizontalSpeed = -horizontalSpeed;
                        x = Math.max(-2.5, Math.min(2.5, x));
                    }
                }
                return {
                    ...obstacle,
                    position: [
                        x,
                        obstacle.position[1],
                        obstacle.position[2] + 0.1,
                    ],
                    horizontalSpeed,
                };
            })
            .filter((obstacle) => obstacle.position[2] <= 10);

        while (next.length < state.obstacles.length) {
            const last = next[next.length - 1];
            const moving = Math.random() < horizontalChance;
            next.push({
                position: [
                    generateRandomInteger(-1.5, 1.5),
                    generateRandomInteger(...Y_BOUNDS),
                    last ? last.position[2] - 10 : -10,
                ],
                id: nextId++,
                horizontalSpeed: moving
                    ? Math.random() < 0.5
                        ? 0.04
                        : -0.04
                    : 0,
            });
        }
        if (nextId !== state.totalObstaclesGenerated)
            setTotalObstaclesGenerated(nextId);
        setObstacles(next);
    });

    return (
        <group>
            {obstacles.map((obstacle) => (
                <group key={obstacle.id}>
                    <Ground
                        position={[0, GROUND_Y, obstacle.position[2] + 18]}
                        segmentId={obstacle.id}
                    />
                    <Decorations
                        position={[0, GROUND_Y, obstacle.position[2] + 18]}
                        obstacle={obstacle}
                    />
                    <Ring
                        id={obstacle.id}
                        position={obstacle.position}
                    />
                </group>
            ))}
        </group>
    );
}
