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
import { hillHeight } from "@/util/hillHeight";

function Ring(props) {

    // Local hit tracking — no store needed
    const hitRef = useRef(false);       // set to true when player collides with this ring
    const lockedRef = useRef(false);    // prevents overwriting color once it's been set
    const [innerColor, setInnerColor] = useState('gray');

    const distance = useGameStore(state => state.distance)

    // Calculate opacity based on position relative to player
    // Rings fade out as they move from z=0 to z=10 (past the player)
    const calculateOpacity = () => {
        const z = props.position[2];
        if (z < 0) return 1; // Before player, fully visible
        if (z > 10) return 0; // Past despawn point, invisible
        // Fade from 1 to 0 between z=0 and z=10
        return 1 - (z / 10);
    };

    const ringOpacity = calculateOpacity();

    // const ref = useRef();
    const [ref, api] = useSphere(() => ({
        // mass: 0,
        // type: 'Static',
        isTrigger: true,
        onCollide: (e) => {
            // Mark hit using a ref — avoids stale closure issues entirely
            hitRef.current = true;
        },
        args: [0.5, 0.5, 8],
        position: props.position,
        userData: {
            isObstacle: true,
            obstacleId: props.id
        }
    }))

    useEffect(() => {

        api.position.set(...props.position)

        // When ring crosses z=0 it has just passed the player — lock in hit or miss color
        if (props.position[2] >= 0 && !lockedRef.current) {
            lockedRef.current = true;
            setInnerColor(hitRef.current ? 'green' : 'red');
        }

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

            {ringOpacity > 0 && (
                <Shadow
                    radius={1.2}
                    opacity={0.6 * ringOpacity}
                    position={[
                        0,
                        -2 + hillHeight(props.position[0], props.position[2] - distance) + 0.05 - props.position[1],
                        0
                    ]}
                />
            )}

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

                    {ringOpacity > 0 &&
                        <mesh
                        // position={props.position}
                        >
                            <torusGeometry attach="geometry" args={[1, 0.1]} />
                            <meshStandardMaterial
                                attach="material"
                                color={randomColor}
                                transparent={true}
                                opacity={ringOpacity}
                            />
                        </mesh>
                    }

                    {ringOpacity > 0 && <mesh
                        // ref={refCylinder}as
                        // position={props.position}
                        rotation={[-Math.PI / 2, 0, 0]}
                    >

                        <cylinderGeometry args={[0.5, 0.5, 0.25]} />

                        <meshStandardMaterial
                            // opacity={innerColor !== 'gray' ? 0.85 : ringOpacity * 0.5}
                            opacity={ringOpacity}
                            transparent={true}
                            color={innerColor}
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

export default memo(Ring)