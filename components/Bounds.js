import { useRef, useState } from 'react'

import { useFrame } from '@react-three/fiber'
import { useBox } from '@react-three/cannon';
import { useTexture } from '@react-three/drei';

import * as THREE from 'three'

import { useGameStore } from '@/hooks/useGameStore';

const floor_size = [50, 0.25, 10]

export default function Bounds(props) {

    const { invisible } = props

    // This reference gives us direct access to the THREE.Mesh object
    // const ref = useRef()

    const [ref, api] = useBox(() => ({
        mass: 0,
        position: props.position,
        args: floor_size, // Dimensions of the cube
        material: {
            restitution: 0, // Adjust this value to control the bounce
        },
    }));

    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)

    const { playerLocation } = useGameStore()

    // useFrame(() => {

    //     api.position.set([0, 10, 50]);

    // })

    // Subscribe this component to the render-loop, rotate the mesh every frame
    // useFrame((state, delta) => (ref.current.rotation.x += delta))

    const base_link = `${process.env.NEXT_PUBLIC_CDN}games/US Tycoon/Textures/GroundSand005/`

    const texture = useTexture({
        map: `${base_link}GroundSand005_COL_1K.jpg`,
        // displacementMap: `${base_link}GroundSand005_DISP_1K.jpg`,
        // normalMap: `${base_link}GroundSand005_NRM_1K.jpg`,
        // roughnessMap: `${base_link}GroundSand005_BUMP_1K.jpg`,
        // aoMap: `${base_link}GroundSand005_AO_1K.jpg`,
    })

    texture.map.repeat.set(6, 60);
    texture.map.wrapS = texture.map.wrapT = THREE.RepeatWrapping;

    useFrame(() => {

        api.position.set(
            ref.current.position.x,
            ref.current.position.y,
            ref.current.position.z
        );

        // // Update the position of the box along the x-axis based on the current direction
        // ref.current.position.z += 0.05 * 1;

        // // console.log(ref.current.position.x, direction)

        // // Use api.position to update the position
        // api.position.set(
        //     ref.current.position.x,
        //     ref.current.position.y,
        //     ref.current.position.z
        // );

    });

    // Return the view, these are regular Threejs elements expressed in JSX
    return (
        <mesh
            {...props}
            ref={ref}
        // scale={clicked ? 1.5 : 1}
        // onClick={(event) => click(!clicked)}
        // onPointerOver={(event) => (event.stopPropagation(), hover(true))}
        // onPointerOut={(event) => hover(false)}
        >
            <boxGeometry args={floor_size} />
            {!invisible && <meshStandardMaterial
                {...texture}
                transparent={invisible ? true : false}
                opacity={invisible ? 0 : 1}
            />}
        </mesh>
    )

}