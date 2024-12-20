import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { useMemo } from 'react';

function FloatingSpheres() {
  const spheres = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      position: [
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
        Math.random() * 20 - 10
      ],
      scale: Math.random() * 0.5 + 0.2
    }));
  }, []);

  return (
    <>
      {spheres.map((sphere, i) => (
        <Sphere key={i} position={sphere.position as [number, number, number]} scale={sphere.scale}>
          <meshPhongMaterial
            color="#38bdf8"
            transparent
            opacity={0.3}
            wireframe
          />
        </Sphere>
      ))}
    </>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 15] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <FloatingSpheres />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}