// 'use client'

// import React, { useRef } from 'react'
// import { Canvas, useFrame } from '@react-three/fiber'
// import { MeshWobbleMaterial, Environment, PerspectiveCamera } from '@react-three/drei'
// import { Group } from 'three' // <--- IMPORTANT

// function CrystalCluster() {
//   const group = useRef<Group>(null) // <--- CORRECT TYPING

//   useFrame((state) => {
//     if (!group.current) return
//     group.current.rotation.y = state.clock.getElapsedTime() * 0.4
//     group.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.12) * 0.2
//   })

//   return (
//     <group ref={group}>
//       {[...Array(8)].map((_, i) => (
//         <mesh
//           key={i}
//           position={[
//             Math.sin((i / 8) * Math.PI * 2) * 2,
//             Math.cos((i / 8) * Math.PI * 2) * 2,
//             0,
//           ]}
//           rotation={[0, 0, Math.random() * Math.PI]}
//         >
//           <boxGeometry args={[0.5, 2.3, 0.5]} />
//           <MeshWobbleMaterial
//             color={i % 2 === 0 ? "#22d3ee" : "#2563eb"}
//             speed={2}
//             factor={0.2}
//             metalness={0.75}
//             roughness={0.18}
//             envMapIntensity={1}
//           />
//         </mesh>
//       ))}
//     </group>
//   )
// }

// export default function AnimatedHero3D() {
//   return (
//     <Canvas
//       style={{
//         width: 560,
//         height: 560,
//         position: 'absolute',
//         top: '50%',
//         left: '50%',
//         pointerEvents: 'none',
//         transform: 'translate(-50%, -53%)',
//         zIndex: 2,
//       }}
//       dpr={[1, 2]}
//     >
//       <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={55} />
//       <ambientLight intensity={0.7} />
//       <directionalLight position={[2, 8, 10]} intensity={0.95} />
//       <CrystalCluster />
//       <Environment preset="sunset" />
//     </Canvas>
//   )
// }


// 'use client'
// import React, { useRef, useEffect } from 'react'
// import { Canvas, useFrame } from '@react-three/fiber'
// import { MeshWobbleMaterial, Environment, PerspectiveCamera } from '@react-three/drei'
// import gsap from 'gsap'
// import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
// import { Group, Mesh } from 'three'

// gsap.registerPlugin(ScrollTrigger)

// // Child component INSIDE <Canvas>
// function CrystalCluster() {
//   const group = useRef<Group>(null)
//   const crystals = useRef<Mesh[]>([])

//   // Subtle per-frame rotations for vibrance
//   useFrame(() => {
//     crystals.current.forEach((mesh, i) => {
//       if (!mesh) return
//       mesh.rotation.x += 0.002 + i * 0.001
//       mesh.rotation.y += 0.003 + i * 0.0011
//     })
//   })

//   useEffect(() => {
//     if (!group.current) return

//     const hero = document.getElementById('home')
//     const features = document.getElementById('features')
//     if (!hero || !features) return

//     const tl = gsap.timeline({
//       scrollTrigger: {
//         trigger: hero,
//         start: 'top top',
//         end: () => `${features.offsetTop + features.offsetHeight - window.innerHeight}px top`,
//         scrub: true,
//       },
//     })
//     tl.to(
//       group.current.position,
//       { x: 3.8, y: -2.2, ease: 'power2.inOut', duration: 1 },
//       0
//     )
//     tl.to(
//       group.current.position,
//       { x: 0, y: 0, ease: 'power2.inOut', duration: 1 },
//       0.55
//     )
//     tl.to(
//       crystals.current.map((m) => m.material),
//       { opacity: 0, ease: 'power1.inOut', duration: 1.1 },
//       0.85
//     )

//     return () => { tl.kill() }
//   }, [])

//   return (
//     <group ref={group}>
//       {[...Array(8)].map((_, i) => (
//         <mesh
//           key={i}
//           ref={el => { if (el) crystals.current[i] = el }}
//           position={[
//             Math.sin((i / 8) * Math.PI * 2) * 2.3,
//             Math.cos((i / 8) * Math.PI * 2) * 2.3,
//             0,
//           ]}
//           rotation={[0, 0, Math.random() * Math.PI]}
//         >
//           <boxGeometry args={[0.45, 2.5, 0.45]} />
//           <MeshWobbleMaterial
//             transparent
//             opacity={1}
//             color={i % 2 === 0 ? '#22d3ee' : '#2563eb'}
//             speed={2}
//             factor={0.25}
//             metalness={0.76}
//             roughness={0.17}
//             envMapIntensity={1.3}
//           />
//         </mesh>
//       ))}
//     </group>
//   )
// }

// export default function AnimatedHero3D() {
//   return (
//     <Canvas
//       style={{
//         width: '100vw',
//         height: '100vh',
//         position: 'fixed',
//         left: 0,
//         top: 0,
//         zIndex: 10,
//         pointerEvents: 'none',
//         background: 'transparent',
//       }}
//       dpr={[1, 2]}
//     >
//       <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={55} />
//       <ambientLight intensity={0.75} />
//       <directionalLight position={[3, 7, 10]} intensity={1} />
//       <CrystalCluster />
//       <Environment preset="sunset" />
//     </Canvas>
//   )
// }


'use client'

import React, { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Environment,
  Float,
  Sparkles,
  ContactShadows,
  PerformanceMonitor,
  Html,
} from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { Group, Mesh, PointLight } from 'three'

gsap.registerPlugin(ScrollTrigger)

/** Crystal ring with gentle float, wobble and color blend */
function CrystalCluster() {
  const group = useRef<Group>(null)
  const crystals = useRef<Mesh[]>([])
  const light = useRef<PointLight>(null)

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.2
      group.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.15) * 0.1
    }
    if (light.current) {
      light.current.intensity = 1.5 + Math.sin(clock.getElapsedTime() * 2) * 0.5
    }
  })

  useEffect(() => {
    gsap.fromTo(
      group.current!.rotation,
      { y: -Math.PI },
      {
        y: Math.PI,
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      }
    )
  }, [])

  return (
    <group ref={group} dispose={null}>
      <pointLight ref={light} position={[0, 2, 4]} intensity={2.5} color="#88c0d0" />
      {Array.from({ length: 8 }).map((_, i) => (
        <Float
          key={i}
          speed={2}
          rotationIntensity={1.2}
          floatIntensity={1.5}
          position={[
            Math.sin((i / 8) * Math.PI * 2) * 3,
            Math.cos((i / 8) * Math.PI * 2) * 3,
            (i % 2) * 2 - 1,
          ]}
        >
          <mesh
            ref={(el) => el && (crystals.current[i] = el)}
            castShadow
            receiveShadow
          >
            <icosahedronGeometry args={[0.4, 0]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#5e81ac' : '#81a1c1'}
              roughness={0.1}
              metalness={0.8}
              emissive={i % 2 === 0 ? '#88c0d0' : '#b48ead'}
              emissiveIntensity={0.5}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

export default function AnimatedHero3D() {
  return (
    <div className="w-full h-[100vh]" id="hero">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 10], fov: 50 }}
      >
        <Suspense fallback={<Html center>Loading 3D...</Html>}>
          <ambientLight intensity={0.5} />
          <CrystalCluster />
          <Sparkles
            count={60}
            scale={8}
            size={2}
            speed={0.4}
            opacity={0.8}
            color="#a3be8c"
          />
          <ContactShadows
            position={[0, -2.5, 0]}
            opacity={0.5}
            scale={10}
            blur={2}
            far={4}
          />
          <Environment preset="sunset" />

          {/* ✅ Fixed postprocessing */}
          <EffectComposer>
            <Bloom
              intensity={1.2}
              luminanceThreshold={0.25}
              luminanceSmoothing={0.9}
            />
            <ChromaticAberration offset={[0.0015, 0.001]} />
            <Vignette eskil={false} offset={0.2} darkness={0.85} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
