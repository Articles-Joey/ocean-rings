import { useRef } from 'react'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'

import ClownfishModel from '../PlayerModels/Clownfish'
import BoneFishModel from '../PlayerModels/BoneFish'

export default function Viewer({ scale, children, model }) {

    const ref = useRef()

    const Model = {
        'Clownfish': ClownfishModel,
        'Bone Fish': BoneFishModel,
    }[model]

    return (
        <Canvas camera={{ position: [-10, 10, 40], fov: 50 }}>

            <hemisphereLight color="white" groundColor="lightgray" intensity={10} />

            <spotLight position={[50, 50, 20]} angle={0.15} penumbra={1} />

            <group position={[0, -10, 0]}>

                <group position={[0, 0.25, 0]} scale={scale ? scale : 12} >
                    {Model && <Model />}
                    {children}
                </group>

                <ContactShadows scale={20} blur={10} far={20} />

            </group>

            <OrbitControls />

        </Canvas>
    )
}