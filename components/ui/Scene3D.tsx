"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

export default function Scene3D() {
    return (
        <div className="fixed inset-0 -z-10 bg-black">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <ParticleField />
            </Canvas>
        </div>
    );
}

function ParticleField() {
    const ref = useRef<any>(null);

    // Generate a bunch of random points in a sphere
    const sphere = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
        const r = 2 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);

        sphere[i * 3] = r * Math.sin(phi) * Math.cos(theta); // x
        sphere[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta); // y
        sphere[i * 3 + 2] = r * Math.cos(phi); // z
    }

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#ff0000"
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}
