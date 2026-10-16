import { useLayoutEffect, useRef } from "react";
import { MeshBasicMaterial } from "three";

export default function PlayerAppearance({ children, brightness = 1.25 }) {
    const group = useRef();

    useLayoutEffect(() => {
        const materials = new Map();
        const meshes = [];

        const getPlayerMaterial = (source) => {
            if (!materials.has(source)) {
                // Keep textures and cutouts while removing dependence on lights.
                const material = new MeshBasicMaterial({
                    name: source.name,
                    color: source.color ?? 0xffffff,
                    map: source.map ?? null,
                    alphaMap: source.alphaMap ?? null,
                    opacity: source.opacity,
                    transparent: source.transparent,
                    alphaTest: source.alphaTest,
                    side: source.side,
                    vertexColors: source.vertexColors,
                    depthTest: source.depthTest,
                    depthWrite: source.depthWrite,
                    colorWrite: source.colorWrite,
                    blending: source.blending,
                    polygonOffset: source.polygonOffset,
                    polygonOffsetFactor: source.polygonOffsetFactor,
                    polygonOffsetUnits: source.polygonOffsetUnits,
                    fog: source.fog ?? true,
                    toneMapped: false,
                });
                material.color.multiplyScalar(brightness);
                materials.set(source, material);
            }
            return materials.get(source);
        };

        group.current.traverse((object) => {
            if (!object.isMesh || !object.material) return;
            const original = object.material;
            object.material = Array.isArray(original)
                ? original.map(getPlayerMaterial)
                : getPlayerMaterial(original);
            meshes.push({ object, original });
        });

        return () => {
            meshes.forEach(({ object, original }) => {
                object.material = original;
            });
            materials.forEach((material) => material.dispose());
        };
    }, [brightness]);

    return <group ref={group}>{children}</group>;
}
