// 'use client'

// import React, { useRef, useEffect, useMemo } from 'react'
// import { Canvas, useFrame } from '@react-three/fiber'
// import { InstancedMesh, Object3D, Color, Group } from 'three'
// import { Environment, ContactShadows } from '@react-three/drei'
// import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
// import gsap from 'gsap'
// import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

// gsap.registerPlugin(ScrollTrigger)

// type Props = {
//   count?: number
//   maxDpr?: number
// }

// function CrystalField({ count = 120 }: { count?: number }) {
//   const instRef = useRef<InstancedMesh | null>(null)
//   const dummy = useMemo(() => new Object3D(), [])
//   const tempColor = useMemo(() => new Color(), [])

//   const configs = useMemo(() => {
//     return new Array(count).fill(0).map((_, i) => {
//       const angle = Math.random() * Math.PI * 2
//       const radius = 2.5 + Math.random() * 5.5
//       const x = Math.cos(angle) * radius
//       const y = (Math.random() - 0.5) * 1.6
//       const z = Math.sin(angle) * radius
//       const scale = 0.5 + Math.random() * 1.1
//       const rotY = Math.random() * Math.PI * 2
//       const speed = 0.2 + Math.random() * 0.6
//       const hue = 190 + Math.random() * 60
//       return { x, y, z, scale, rotY, speed, hue }
//     })
//   }, [count])

//   useEffect(() => {
//     const mesh = instRef.current
//     if (!mesh) return
//     for (let i = 0; i < configs.length; i++) {
//       const c = configs[i]
//       dummy.position.set(c.x, c.y, c.z)
//       dummy.rotation.set(0, c.rotY, 0)
//       dummy.scale.setScalar(c.scale)
//       dummy.updateMatrix()
//       mesh.setMatrixAt(i, dummy.matrix)

//       tempColor.setHSL((c.hue % 360) / 360, 0.6, 0.55)
//       mesh.setColorAt(i, tempColor)
//     }
//     mesh.instanceMatrix.needsUpdate = true
//     if ((mesh as any).instanceColor) (mesh as any).instanceColor.needsUpdate = true
//   }, [configs, dummy, tempColor])

//   useFrame((state) => {
//     const mesh = instRef.current
//     if (!mesh) return
//     const t = state.clock.elapsedTime
//     for (let i = 0; i < configs.length; i++) {
//       const c = configs[i]
//       const bob = Math.sin(t * (0.6 + c.speed * 0.5) + i) * 0.06
//       dummy.position.set(c.x, c.y + bob, c.z)
//       dummy.rotation.set(0.05 * Math.sin(t * c.speed + i), c.rotY + t * 0.02 * c.speed, 0)
//       const scale = c.scale * (1 + Math.sin(t * (0.8 + c.speed * 0.5) + i) * 0.02)
//       dummy.scale.setScalar(scale)
//       dummy.updateMatrix()
//       mesh.setMatrixAt(i, dummy.matrix)
//     }
//     mesh.instanceMatrix.needsUpdate = true
//   })

//   return (
//     <instancedMesh ref={instRef} args={[undefined, undefined, count]} castShadow receiveShadow>
//       <cylinderGeometry args={[0.12, 0.28, 1.4, 6, 1]} />
//       <meshStandardMaterial
//         vertexColors
//         metalness={0.85}
//         roughness={0.2}
//         emissive={'#0ea5e9'}
//         emissiveIntensity={0.18}
//       />
//     </instancedMesh>
//   )
// }

// function Scene({ outerRef, count }: { outerRef: React.RefObject<HTMLDivElement>; count: number }) {
//   const groupRef = useRef<Group | null>(null)

//   // Scroll-linked animation
//   useEffect(() => {
//     const hero = document.getElementById('home') || document.getElementById('hero')
//     const features = document.getElementById('features')
//     if (!hero || !features || !groupRef.current) return

//     const tl = gsap.timeline({
//       scrollTrigger: {
//         trigger: hero,
//         start: 'top top',
//         end: () => `${features.offsetTop}px top`,
//         scrub: 0.6,
//       },
//     })

//     tl.to(groupRef.current.rotation, { y: Math.PI * 1.4, duration: 1 }, 0)
//       .to(groupRef.current.position, { x: 2.4, y: -1.2, duration: 1.1 }, 0.05)
//       .to(groupRef.current.rotation, { x: 0.8, duration: 1.1 }, 0.2)
//       .to(groupRef.current.position, { x: 0, y: 0, duration: 1.2 }, 0.75)
//       .to(groupRef.current.scale, { x: 0.92, y: 0.92, z: 0.92, duration: 1.2 }, 0.85)

//     return () => {
//       tl.kill()
//     }
//   }, [])

//   // Mouse parallax inside Canvas
//   useFrame(() => {
//     if (!outerRef.current || !groupRef.current) return
//     const nx = parseFloat(outerRef.current.dataset.mx || '0')
//     const ny = parseFloat(outerRef.current.dataset.my || '0')
//     groupRef.current.rotation.x += (ny * 0.05 - groupRef.current.rotation.x) * 0.06
//     groupRef.current.rotation.y += (nx * 0.08 - groupRef.current.rotation.y) * 0.06
//     groupRef.current.position.x += (nx * 0.6 - groupRef.current.position.x) * 0.06
//     groupRef.current.position.y += (ny * -0.4 - groupRef.current.position.y) * 0.06
//   })

//   return (
//     <group ref={groupRef}>
//       <ambientLight intensity={0.4} />
//       <directionalLight position={[4, 8, 6]} intensity={0.8} castShadow />
//       <pointLight position={[-6, -4, -2]} intensity={0.3} />

//       <CrystalField count={count} />

//       <ContactShadows position={[0, -2.5, 0]} opacity={0.3} blur={2} far={4} />

//       <React.Suspense fallback={null}>
//         <Environment preset="dawn" background={false} />
//       </React.Suspense>

//       <EffectComposer multisampling={0}>
//         <Bloom luminanceThreshold={0.25} luminanceSmoothing={0.8} intensity={0.55} />
//         <ChromaticAberration offset={[0.001, 0.0008]} />
//       </EffectComposer>
//     </group>
//   )
// }

// export default function AnimatedCrystals({ count = 120, maxDpr = 1.5 }: Props) {
//   const outerRef = useRef<HTMLDivElement | null>(null)

//   // Track mouse
//   useEffect(() => {
//     const onMove = (e: MouseEvent) => {
//       const _w = window.innerWidth
//       const _h = window.innerHeight
//       const nx = (e.clientX / _w) * 2 - 1
//       const ny = (e.clientY / _h) * 2 - 1
//       if (outerRef.current) {
//         outerRef.current.dataset.mx = String(nx)
//         outerRef.current.dataset.my = String(ny)
//       }
//     }
//     window.addEventListener('mousemove', onMove)
//     return () => window.removeEventListener('mousemove', onMove)
//   }, [])

//   return (
//     <div
//       ref={outerRef}
//       id="crystals-overlay"
//       style={{
//         position: 'fixed',
//         inset: 0,
//         pointerEvents: 'none',
//         zIndex: 5,
//       }}
//     >
//       <Canvas
//         gl={{ antialias: false, toneMapping: 2 }}
//         shadows
//         dpr={[0.7, maxDpr]}
//         camera={{ position: [0, 0, 9], fov: 50 }}
//       >
//         <Scene outerRef={outerRef} count={count} />
//       </Canvas>
//     </div>
//   )
// }


"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Suspense, useRef } from "react"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import { useScroll } from "framer-motion"

type Props = {
  count?: number
  maxDpr?: number
}

function Crystal({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
      meshRef.current.rotation.x += 0.003
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial color="#4FD1C5" roughness={0.4} metalness={0.6} />
    </mesh>
  )
}

function Scene({ count }: { count: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const { scrollYProgress } = useScroll()

  useFrame(() => {
    if (groupRef.current) {
      // rotate based on scroll progress (0 -> 1)
      groupRef.current.rotation.y = scrollYProgress.get() * Math.PI * 4
      groupRef.current.rotation.x = scrollYProgress.get() * Math.PI * 2
    }
  })

  const crystals = Array.from({ length: count }, () => [
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
  ]) as [number, number, number][]

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      {crystals.map((pos, i) => (
        <Crystal key={i} position={pos} />
      ))}
      <OrbitControls enableZoom={false} enablePan={false} />
    </group>
  )
}

export default function AnimatedCrystals({ count = 120, maxDpr = 1.5 }: Props) {
  return (
    <div
      id="crystals-overlay"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      <Canvas
        gl={{ antialias: false }}
        shadows
        dpr={[0.7, maxDpr]} // adaptive resolution for performance
        camera={{ position: [0, 0, 9], fov: 50 }}
      >
        <Suspense fallback={null}>
          <Scene count={count} />
        </Suspense>
      </Canvas>
    </div>
  )
}
