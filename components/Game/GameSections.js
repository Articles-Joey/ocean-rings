import { useCylinder, useSphere } from "@react-three/cannon";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { memo, useEffect, useMemo, useRef, useState } from "react"

import generateRandomInteger from "@/util/generateRandomInteger"
import getRandomHexColor from "@/util/getRandomHexColor"
import { useGameStore } from "@/hooks/useGameStore";
import Ground from "./Ground";
import Decorations from "./Decorations";
import { ModelKennyNLPirateShipWreck } from "@/components/Game/ship_wreck";
import { degToRad } from "three/src/math/MathUtils.js";
import Shadow from "./Shadow";
import Ring from "./Ring";

function GameSections({
    landingAnimationMode
}) {

    const ref = useRef();

    const obstacleCount = 10

    let yBounds = [2, 5]

    // const {
    //     obstacles,
    //     setObstacles
    // } = useGameStore()

    const obstacles = useGameStore(state => state.obstacles)
    const setObstacles = useGameStore(state => state.setObstacles)
    const distance = useGameStore(state => state.distance)
    const status = useGameStore(state => state.gameState.status)
    const totalObstaclesGenerated = useGameStore(state => state.totalObstaclesGenerated)
    const setTotalObstaclesGenerated = useGameStore(state => state.setTotalObstaclesGenerated)

    // Generate initial obstacles
    useEffect(() => {

        // if (obstacles?.length !== 0) return

        let initialObstacles = []

        for (let i = 0; i < obstacleCount; i++) {

            // if (i === 0) {
            //     return
            // }

            initialObstacles.push({
                position: [
                    generateRandomInteger(-1.5, 1.5),
                    generateRandomInteger(yBounds[0], yBounds[1]),
                    -i * 10
                ],
                id: i
            })
        }

        const newInitialObstacles = initialObstacles.slice(1);

        setObstacles(newInitialObstacles)
        setTotalObstaclesGenerated(obstacleCount)

    }, [])

    useFrame(() => {

        if (
            status !== "In Progress"
            &&
            !landingAnimationMode
        ) return

        // Use getState() to always read the latest obstacles, avoiding stale closure overwriting hit flags
        const currentObstacles = useGameStore.getState().obstacles;
        const currentDistance = useGameStore.getState().distance;
        let runningTotalId = useGameStore.getState().totalObstaclesGenerated;

        // Determine horizontal movement probability based on distance
        const horizontalChance = currentDistance > 100 ? 0.5 : currentDistance > 20 ? 0.25 : 0;

        let newObstacles = currentObstacles.map((obstacle) => {
            let newX = obstacle.position[0];
            let newHorizontalSpeed = obstacle.horizontalSpeed || 0;

            if (newHorizontalSpeed !== 0) {
                newX += newHorizontalSpeed;
                if (newX > 2.5 || newX < -2.5) {
                    newHorizontalSpeed = -newHorizontalSpeed;
                    newX = Math.max(-2.5, Math.min(2.5, newX));
                }
            }

            return {
                ...obstacle,
                position: [newX, obstacle.position[1], obstacle.position[2] + 0.1], // Move toward the player
                horizontalSpeed: newHorizontalSpeed,
            };
        });

        // Filter out obstacles that went past the player
        newObstacles = newObstacles.filter((obstacle) => obstacle.position[2] <= 10);

        // Add new obstacles to maintain the array length
        while (newObstacles.length < currentObstacles.length) {
            const lastObstacle = newObstacles[newObstacles.length - 1];
            const newPositionZ = lastObstacle ? lastObstacle.position[2] - 10 : -10;

            const isMoving = Math.random() < horizontalChance;
            const horizontalSpeed = isMoving ? (Math.random() < 0.5 ? 0.04 : -0.04) : 0;

            newObstacles.push({
                position: [
                    generateRandomInteger(-1.5, 1.5),
                    generateRandomInteger(yBounds[0], yBounds[1]),
                    newPositionZ
                ],
                id: runningTotalId, // Use sequential ID
                horizontalSpeed,
            });

            runningTotalId++;
        }

        if (runningTotalId !== useGameStore.getState().totalObstaclesGenerated) {
            setTotalObstaclesGenerated(runningTotalId);
        }

        setObstacles(newObstacles);

    });

    const rings = useMemo(() => {

        return <>
            {obstacles?.map((obstacle) => (
                <group key={obstacle.id} position={obstacle.position}>

                    <Ring
                        // key={i}
                        id={obstacle.id}
                        position={
                            obstacle.position
                            // [
                            //     generateRandomInteger(-3, 3),
                            //     (generateRandomInteger(-3, 3) + 5),
                            //     -(i * 20)
                            // ]
                        }
                    // currentZ={ref.current.position.z}
                    />

                    {/* <Walls /> */}

                    {/* <mesh>
                        <boxGeometry args={[1, 1, 1]} />
                        <meshStandardMaterial color="red" />
                    </mesh> */}

                </group>
            ))}
        </>

        return [...Array(60)].map((item, i) => {
            return (
                <Ring
                    key={i}
                    position={[generateRandomInteger(-3, 3), (generateRandomInteger(-3, 3) + 5), -(i * 20)]}
                // currentZ={ref.current.position.z}
                />
            )
        })

    }, [])

    return (
        <group ref={ref} position={[0, 0, 0]}>

            {obstacles?.map((obstacle, obstacle_i) => (
                <group key={obstacle.id}>

                    <Ground
                        position={[
                            0,
                            -2,
                            obstacle.position[2] + 18
                        ]}
                        segmentId={obstacle.id}
                    />                    

                    <Decorations
                        position={
                            [
                                0,
                                -2,
                                obstacle.position[2] + 18
                            ]
                        }
                        obstacle={obstacle}
                    />

                    <Ring
                        // key={i}
                        position={
                            obstacle.position
                            // [
                            //     generateRandomInteger(-3, 3),
                            //     (generateRandomInteger(-3, 3) + 5),
                            //     -(i * 20)
                            // ]
                        }
                    // currentZ={ref.current.position.z}
                    />

                    {/* <Walls /> */}

                    {/* <mesh>
                        <boxGeometry args={[1, 1, 1]} />
                        <meshStandardMaterial color="red" />
                    </mesh> */}

                </group>
            ))}

            {/* {rings} */}

        </group>
    )
}

export default GameSections