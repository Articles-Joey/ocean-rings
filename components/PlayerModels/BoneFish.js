import { useGLTF, useAnimations } from '@react-three/drei'

const linkFishBone = `${process.env.NEXT_PUBLIC_CDN}games/Ocean Rings/Fish Bone.glb`

export default function BoneFishModel(props) {
    const { nodes, materials } = useGLTF(linkFishBone)
    return (
        <group {...props} dispose={null} scale={1.75}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.FishBone.geometry}
                material={materials.Beige}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
            />
        </group>
    )
}