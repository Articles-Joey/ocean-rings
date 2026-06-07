import { useGLTF, useAnimations } from '@react-three/drei'

const linkFishBone = `models/player/FishBone.glb`

export default function BoneFishModel(props) {
    const { nodes, materials } = useGLTF(linkFishBone)
    return (
        <group {...props} dispose={null} scale={1.75}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.FishBone.geometry}
                material={materials.Beige}
                rotation={[0, 0, 0]}
                position={[0, 0, 0]}
                scale={100}
            />
        </group>
    )
}