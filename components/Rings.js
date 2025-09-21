import { useCylinder, useSphere } from "@react-three/cannon";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { memo, useEffect, useMemo, useRef, useState } from "react"

import generateRandomInteger from "@/util/generateRandomInteger"
import getRandomHexColor from "@/util/getRandomHexColor"
import { useGameStore } from "@/hooks/useGameStore";
import Bounds from "./Bounds";
import Decorations from "./Decorations";
import { ModelKennyNLPirateShipWreck } from "@/components/Game/ship_wreck";
import { degToRad } from "three/src/math/MathUtils.js";

function Ring(props) {

    const [zPosition, setZPosition] = useState(props.position[2]);
    const [hasPassed, setHasPassed] = useState(false);
    const [hasPassedFar, setHasPassedFar] = useState(false);

    // const ref = useRef();
    const [ref, api] = useSphere(() => ({
        // mass: 0,
        // type: 'Static',
        isTrigger: true,
        onCollide: (e) => {

            // console.log("collide detected!", alreadyTriggeredRef.current)

            // Could not pass trigger state via userData to player as state was always stale so now just passing the obstacle id now and player will prevent recalling game over for the same obstacle id after restart

            // alreadyTriggeredRef.current = true
            // setAlreadyTriggered(true)

        },
        args: [1, 1, 8],
        position: props.position,
        userData: {
            isObstacle: true,
            // id: obstacle.id
        }
    }))

    useEffect(() => {

        api.position.set(...props.position)

    }, [props.position])

    // const [ref] = useCylinder(() => ({
    //     mass: 0,
    //     isTrigger: true,
    //     position: props.position
    //     // rotation: [-Math.PI / 2, 0, 0],
    //     // ...props,
    // }));

    // useFrame(() => {
    //     if (ref.current) {

    //         const newZ = ref.current.position.z
    //         // const newZ = ref.current.position.z + 0.05;
    //         // ref.current.position.z = newZ;
    //         // setZPosition(newZ);

    //         if (
    //             newZ
    //             <
    //             Math.abs(props.position[2]) + 10
    //         ) {
    //             setHasPassed(false)
    //         } else {
    //             setHasPassed(true)
    //         }

    //         if (
    //             newZ
    //             <
    //             Math.abs(props.position[2]) + 15
    //         ) {
    //             setHasPassedFar(false)
    //         } else {
    //             setHasPassedFar(true)
    //         }

    //     }
    // });

    const randomColor = useMemo(() => {
        return getRandomHexColor()
    }, [])

    // const ring = useMemo(() => {

    //     return (

    //     )

    // }, [zPosition])

    // function hasPassed(pos) {

    //     if (
    //         zPosition.toFixed(0)
    //         >
    //         Math.abs(pos)
    //     ) {
    //         return true
    //     } else {
    //         return false
    //     }

    // }

    return (
        <group ref={ref}>

            {
                // (
                //     zPosition.toFixed(0)
                //     <
                //     Math.abs(props.position[2])
                // )
                // &&
                <group
                // position={props.position}
                >

                    {!hasPassedFar &&
                        <mesh
                        // position={props.position}
                        >
                            <torusGeometry attach="geometry" args={[1, 0.1]} />
                            <meshStandardMaterial
                                attach="material"
                                color={randomColor}
                                transparent={true}
                                opacity={hasPassed ? 0.1 : 1}
                            />
                        </mesh>
                    }

                    {!hasPassedFar && <mesh
                        // ref={refCylinder}as
                        opacity={hasPassed ? 0.1 : 1}
                        transparent={true}
                        // position={props.position}
                        rotation={[-Math.PI / 2, 0, 0]}
                    >

                        <cylinderGeometry args={[0.5, 0.5, 0.25]} />

                        <meshStandardMaterial
                            {...props}
                            opacity={hasPassed ? 0.1 : 0.5}
                            transparent={true}
                            color="gray"
                        />

                        {/* {((Math.abs(props.position[2]) - zPosition.toFixed(0)) < 100) &&
                            <Text
                                position={[0, -1, 1]}
                                scale={0.6}
                                color="black" rotation={[Math.PI / 2, 0, 0]} anchorX="center" anchorY="middle"
                            >
                                {Math.abs(props.position[2])}/{zPosition.toFixed(0)}
                                <meshStandardMaterial attach="material" opacity={hasPassed ? 0 : 1} />
                            </Text>
                        } */}

                    </mesh>}

                </group>
            }



        </group>
    );
}

function Rings(props) {

    const ref = useRef();

    const obstacleCount = 10

    let yBounds = [2, 5]

    const {
        obstacles,
        setObstacles
    } = useGameStore()

    // Generate initial obstacles
    useEffect(() => {

        // if (obstacles?.length !== 0) return

        let initialObstacles = []

        for (let i = 0; i < obstacleCount; i++) {
            initialObstacles.push({
                position: [
                    generateRandomInteger(-1.5, 1.5),
                    generateRandomInteger(yBounds[0], yBounds[1]),
                    -i * 10
                ],
                id: i
            })
        }

        setObstacles(initialObstacles)

    }, [])

    useFrame(() => {

        let newObstacles = obstacles.map((obstacle) => ({
            ...obstacle,
            position: [obstacle.position[0], obstacle.position[1], obstacle.position[2] + 0.1], // Move toward the player
        }))

        // Filter out obstacles that went past the player
        newObstacles = newObstacles.filter((obstacle) => obstacle.position[2] <= 10);

        // Add new obstacles to maintain the array length
        while (newObstacles.length < obstacles.length) {
            const lastObstacle = newObstacles[newObstacles.length - 1];
            const newPositionZ = lastObstacle ? lastObstacle.position[2] - 10 : -10;

            newObstacles.push({
                position: [
                    // Math.random() * 2 - 1, 
                    // 0, 
                    generateRandomInteger(-1.5, 1.5),
                    generateRandomInteger(yBounds[0], yBounds[1]),
                    newPositionZ
                ],
                id: Date.now(), // Ensure unique ID
            });
        }

        setObstacles(newObstacles);

    });

    const rings = useMemo(() => {

        return <>
            {obstacles?.map((obstacle) => (
                <group key={obstacle.id} position={obstacle.position}>

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

                    <Bounds
                        position={
                            // obstacle.position
                            [
                                0,
                                0,
                                obstacle.position[2] + 18
                            ]
                        }
                    />

                    {(obstacle.id % 5 === 0) &&
                        <ModelKennyNLPirateShipWreck
                            position={
                                [
                                    (obstacle.id % 10 === 0) ? 10 : -20,
                                    0,
                                    obstacle.position[2] + 18
                                ]
                            }
                            rotation={[
                                0,
                                degToRad(45),
                                0
                            ]}
                        />
                    }

                    <Decorations
                        position={
                            [
                                0,
                                0,
                                obstacle.position[2] + 18
                            ]
                        }
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

export default memo(Rings)