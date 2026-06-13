"use client";

// HeroScene3D: the floating 3D object for the portfolio hero, in the charcoal +
// forest-green scheme. A distorted, slowly spinning icosahedron with a green
// material that eases toward the mouse. One low-poly mesh, kept light for perf.

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Icosahedron } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";

function Blob() {
  const mesh = useRef(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  // Follow the mouse to add subtle parallax to the object's rotation.
  useEffect(() => {
    function onMove(e) {
      setPointer({
        x: (e.clientX / window.innerWidth - 0.5) * 0.6,
        y: (e.clientY / window.innerHeight - 0.5) * 0.6,
      });
    }
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Spin slowly and ease toward the pointer each frame.
  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += delta * 0.2;
    mesh.current.rotation.x += (pointer.y - mesh.current.rotation.x) * 0.05;
    mesh.current.rotation.z += (pointer.x - mesh.current.rotation.z) * 0.05;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1.2}>
      <Icosahedron ref={mesh} args={[1.4, 4]}>
        {/* Forest-green material — deep green base, soft accent-green glow. */}
        <MeshDistortMaterial
          color="#33543f"
          emissive="#5e9c78"
          emissiveIntensity={0.35}
          roughness={0.2}
          metalness={0.5}
          distort={0.3}
          speed={1.6}
        />
      </Icosahedron>
    </Float>
  );
}

export default function HeroScene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} dpr={[1, 1.8]} gl={{ alpha: true }}>
      <ambientLight intensity={0.7} />
      {/* Light sage + accent green lights instead of cyan/purple. */}
      <pointLight position={[4, 4, 4]} intensity={2} color="#9fe1cb" />
      <pointLight position={[-4, -2, 2]} intensity={1.6} color="#5e9c78" />
      <Blob />
    </Canvas>
  );
}
