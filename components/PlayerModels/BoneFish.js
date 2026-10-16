import { useGLTF } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";

const linkFishBone = "/models/player/FishBone.glb";

export default function BoneFishModel({ scale = 1.75, ...props }) {
    const { nodes, materials } = useGLTF(linkFishBone);
    return (
        <group
            {...props}
            dispose={null}
            scale={scale}
        >
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.FishBone.geometry}
                material={materials.Beige}
                rotation={[0, degToRad(90), 0]}
                position={[-0.5, 0, 0]}
                scale={100}
            />
        </group>
    );
}
