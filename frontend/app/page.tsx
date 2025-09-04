
// "use client"

// import { useRef, useEffect, useState } from "react"
// import { motion, useScroll, useTransform } from "framer-motion"
// import Link from "next/link"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
// } from "recharts"

// // === COLORS ===
// const palette = {
//   bg: "bg-gradient-to-br from-black via-slate-950 to-blue-950",
//   card: "bg-gradient-to-br from-slate-900/80 to-blue-950/80",
//   accent: "from-cyan-400 to-blue-600",
//   neon: "shadow-[0_0_40px_#38bdf8cc]",
//   border: "border border-blue-800",
//   text: "text-blue-100",
// }

// // === SAMPLE DATA ===
// const chartData = [
//   { time: "10:00", mentions: 20 },
//   { time: "11:00", mentions: 35 },
//   { time: "12:00", mentions: 28 },
//   { time: "13:00", mentions: 50 },
//   { time: "14:00", mentions: 40 },
// ]

// // === CYBER EYE ===
// function CyberEye() {
//   const [mouse, setMouse] = useState({ x: 0, y: 0 })
//   const ref = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (!ref.current) return
//       const rect = ref.current.getBoundingClientRect()
//       const x = e.clientX - rect.left - rect.width / 2
//       const y = e.clientY - rect.top - rect.height / 2
//       setMouse({ x, y })
//     }
//     window.addEventListener("mousemove", handleMouseMove)
//     return () => window.removeEventListener("mousemove", handleMouseMove)
//   }, [])

//   const pupilX = mouse.x / 50
//   const pupilY = mouse.y / 50

//   return (
//     <motion.div
//       ref={ref}
//       className="relative flex items-center justify-center"
//       initial={{ opacity: 0, scale: 0.7 }}
//       animate={{ opacity: 1, scale: 1 }}
//       transition={{ duration: 1, ease: "easeOut" }}
//     >
//       {/* Outer glow */}
//       <motion.div
//         className="w-[280px] h-[280px] rounded-full border-4 border-cyan-500/40 flex items-center justify-center"
//         animate={{
//           boxShadow: [
//             "0 0 40px #38bdf8cc",
//             "0 0 70px #0ea5e9cc",
//             "0 0 40px #38bdf8cc",
//           ],
//         }}
//         transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
//       >
//         {/* Iris */}
//         <div className="w-[160px] h-[160px] rounded-full bg-gradient-to-br from-cyan-600 to-blue-900 flex items-center justify-center">
//           {/* Pupil */}
//           <motion.div
//             className="w-16 h-16 rounded-full bg-black shadow-[0_0_25px_#38bdf8cc]"
//             animate={{ x: pupilX, y: pupilY }}
//             transition={{ type: "spring", stiffness: 100, damping: 10 }}
//           />
//         </div>
//       </motion.div>
//     </motion.div>
//   )
// }

// // === FEATURE CARD ===
// function FeatureCard({
//   title,
//   text,
//   icon,
//   delay,
// }: {
//   title: string
//   text: string
//   icon: React.ReactNode
//   delay: number
// }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 40 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true }}
//       transition={{ duration: 0.8, delay }}
//       className={`rounded-2xl ${palette.card} ${palette.border} shadow-lg hover:shadow-cyan-400/30 transition-all duration-300 flex flex-col items-center p-8`}
//     >
//       <motion.div
//         initial={{ scale: 0.5, opacity: 0 }}
//         whileInView={{ scale: 1, opacity: 1 }}
//         transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
//       >
//         {icon}
//       </motion.div>
//       <h3 className="text-2xl font-bold text-cyan-300 mb-2 text-center">{title}</h3>
//       <p className="text-blue-100 text-lg text-center">{text}</p>
//     </motion.div>
//   )
// }

// // === LANDING PAGE ===
// export default function Home() {
//   const ref = useRef(null)
//   const { scrollYProgress } = useScroll({ target: ref })
//   const yHero = useTransform(scrollYProgress, [0, 1], [0, -120])

//   return (
//     <main
//       ref={ref}
//       className={`relative min-h-screen w-full overflow-x-hidden ${palette.bg} text-white`}
//     >
//       {/* HERO */}
//       <section className="h-screen flex flex-col md:flex-row items-center justify-center text-center md:text-left space-y-7 md:space-y-0 md:space-x-12 px-6 relative">
//         <CyberEye />
//         <div>
//           <motion.h1
//             style={{ y: yHero }}
//             className="text-6xl md:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 drop-shadow-[0_0_40px_#38bdf8cc]"
//             initial={{ opacity: 0, y: 60, scale: 0.96 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             transition={{ duration: 1.1, ease: "easeOut" }}
//           >
//             Sentinel<span className="text-white">.io</span>
//           </motion.h1>
//           <motion.p
//             style={{ y: yHero }}
//             className="text-2xl text-blue-100 max-w-xl font-semibold mt-4"
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1.2, delay: 0.2 }}
//           >
//             Advanced VIP Threat & Misinformation Monitoring Platform
//           </motion.p>
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1.2, delay: 0.6 }}
//             className="mt-6"
//           >
//             <Link
//               href="/app"
//               className="px-10 py-4 text-lg font-bold rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 hover:from-blue-600 hover:to-cyan-400 transition shadow-lg shadow-cyan-400/40 animate-glowPulse"
//             >
//               Launch Demo
//             </Link>
//           </motion.div>
//         </div>
//       </section>

//       {/* FEATURES */}
//       <section
//         id="features"
//         className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-12 relative"
//       >
//         <FeatureCard
//           title="Real-time Monitoring"
//           text="Track VIP mentions instantly across platforms with consolidated insights."
//           icon={<span className="text-cyan-400 text-4xl">📡</span>}
//           delay={0.1}
//         />
//         <FeatureCard
//           title="AI-driven Detection"
//           text="Leverage AI for deep analysis of patterns, fake profiles & campaigns."
//           icon={<span className="text-cyan-400 text-4xl">🤖</span>}
//           delay={0.3}
//         />
//         <FeatureCard
//           title="Visual Alerts"
//           text="Get real-time alerts with clear visualizations of critical activity."
//           icon={<span className="text-cyan-400 text-4xl">📊</span>}
//           delay={0.5}
//         />
//         <FeatureCard
//           title="Network Analysis"
//           text="Interactive graph views expose connections in misinformation networks."
//           icon={<span className="text-cyan-400 text-4xl">🕸️</span>}
//           delay={0.7}
//         />
//       </section>

//       {/* TRENDS */}
//       <section
//         id="trends"
//         className="min-h-[60vh] flex items-center justify-center px-6 relative"
//       >
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 1 }}
//           className={`w-full max-w-3xl ${palette.card} ${palette.border} shadow-lg rounded-xl`}
//         >
//           <CardHeader>
//             <CardTitle className="text-xl text-cyan-300">Live Mentions Trend</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={chartData}>
//                 <XAxis dataKey="time" stroke="#7dd3fc" />
//                 <YAxis stroke="#7dd3fc" />
//                 <Tooltip
//                   contentStyle={{
//                     background: "#0f172a",
//                     border: "1px solid #38bdf8",
//                     color: "#fff",
//                   }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="mentions"
//                   stroke="#38bdf8"
//                   strokeWidth={3}
//                   dot={false}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </motion.div>
//       </section>

//       {/* CTA */}
//       <section
//         id="cta"
//         className="text-center py-24 bg-gradient-to-r from-blue-900 via-cyan-800 to-blue-900 shadow-inner rounded-tl-[5rem] rounded-tr-[5rem] relative"
//       >
//         <motion.h2
//           className="text-5xl font-extrabold mb-6 text-white drop-shadow-lg"
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8 }}
//         >
//           Ready to Protect?
//         </motion.h2>
//         <motion.p
//           className="text-blue-100 max-w-xl mx-auto mb-10 text-lg font-semibold"
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//         >
//           Join Sentinel.io today and safeguard VIPs from misinformation & online threats.
//         </motion.p>
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           whileInView={{ opacity: 1, scale: 1 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8, delay: 0.4 }}
//         >
//           <Link
//             href="/app"
//             className="inline-block px-12 py-5 font-bold rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 hover:from-blue-500 hover:to-cyan-400 transition shadow-lg shadow-cyan-400/40 animate-glowPulse"
//           >
//             Explore the Demo
//           </Link>
//         </motion.div>
//       </section>

//       {/* FOOTER */}
//       <footer className="text-center p-6 text-gray-500 text-sm bg-black border-t border-gray-800">
//         © 2025 Sentinel.io. All rights reserved.
//       </footer>

//       {/* Glow Animation */}
//       <style>{`
//         @keyframes glowPulse {
//           0%, 100% { text-shadow: 0 0 15px #00bfff, 0 0 30px #00bfff; }
//           50% { text-shadow: 0 0 10px #38bdf8, 0 0 30px #0ea5e9; }
//         }
//         .animate-glowPulse { animation: glowPulse 3s ease-in-out infinite; }
//       `}</style>
//     </main>
//   )
// }





















// "use client"

// import { useState, useRef, useEffect } from "react"
// import { motion, useAnimation, AnimatePresence } from "framer-motion"
// import {
//   ResponsiveContainer,
//   LineChart, Line, XAxis, YAxis, Tooltip,
//   BarChart, Bar,
//   RadarChart, PolarGrid, PolarAngleAxis, Radar
// } from "recharts"

// // === CYBER EYE COMPONENT ===
// function CyberEye() {
//   const [mouse, setMouse] = useState({ x: 0, y: 0 })
//   const ref = useRef<HTMLDivElement>(null)
//   const irisControls = useAnimation()
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (!ref.current) return
//       const rect = ref.current.getBoundingClientRect()
//       const x = e.clientX - rect.left - rect.width / 2
//       const y = e.clientY - rect.top - rect.height / 2
//       setMouse({ x, y })
//     }
//     window.addEventListener("mousemove", handleMouseMove)
//     return () => window.removeEventListener("mousemove", handleMouseMove)
//   }, [])
//   // Iris "blink" and pulse
//   useEffect(() => {
//     const interval = setInterval(() => {
//       irisControls.start({ scaleY: 0.7 }, { duration: 0.13 }).then(() =>
//         irisControls.start({ scaleY: 1.1 }, { duration: 0.18 }).then(() =>
//           irisControls.start({ scaleY: 1 }, { duration: 0.12 })
//         )
//       )
//     }, 4200 + Math.random() * 2000)
//     return () => clearInterval(interval)
//   }, [irisControls])
//   const pupilX = mouse.x / 28
//   const pupilY = mouse.y / 28
//   return (
//     <div ref={ref} className="relative flex items-center justify-center select-none">
//       {/* Outer neon ring + holographic glow */}
//       <motion.div
//         className="absolute w-[340px] h-[340px] rounded-full border-4 border-cyan-400/30 shadow-[0_0_120px_#38bdf8cc] bg-gradient-radial from-cyan-400/10 via-blue-900/10 to-transparent"
//         animate={{ rotate: [0, 360] }}
//         transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
//       />
//       {/* Animated iris */}
//       <motion.div
//         className="w-[200px] h-[200px] rounded-full bg-gradient-to-br from-cyan-400 via-blue-900 to-black flex items-center justify-center shadow-[0_0_80px_#38bdf8cc] relative overflow-hidden border-4 border-cyan-400/30"
//         animate={irisControls}
//         initial={{ scaleY: 1 }}
//         style={{ zIndex: 2 }}
//       >
//         {/* Holographic grid */}
//         <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" fill="none">
//           <defs>
//             <radialGradient id="irisGrid" cx="50%" cy="50%" r="50%">
//               <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.12" />
//               <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.02" />
//             </radialGradient>
//           </defs>
//           <circle cx="100" cy="100" r="98" stroke="url(#irisGrid)" strokeWidth="2" />
//           {[1,2,3,4].map(r => <circle key={r} cx="100" cy="100" r={r*30} stroke="#38bdf8" strokeOpacity="0.07" strokeWidth="1" />)}
//           {[...Array(12)].map((_,i) => <line key={i} x1="100" y1="100" x2={100+90*Math.cos(i*Math.PI/6)} y2={100+90*Math.sin(i*Math.PI/6)} stroke="#38bdf8" strokeOpacity="0.07" strokeWidth="1" />)}
//         </svg>
//         {/* Shine sweep */}
//         <motion.div
//           className="absolute w-32 h-32 bg-gradient-to-r from-transparent via-white/30 to-transparent rotate-45"
//           animate={{ x: ["-150%", "150%"] }}
//           transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
//         />
//         {/* Pupil */}
//         <motion.div
//           className="w-16 h-16 rounded-full bg-black shadow-[0_0_60px_#38bdf8] border-2 border-cyan-400/60"
//           animate={{ x: pupilX, y: pupilY, scale: [1, 1.08, 1] }}
//           transition={{ type: "spring", stiffness: 120, damping: 14, repeat: Infinity, duration: 2 }}
//         />
//         {/* Reflection dot */}
//         <motion.div
//           className="absolute left-8 top-8 w-4 h-4 rounded-full bg-white/80 blur-[2px]"
//           animate={{ opacity: [0.7, 0.3, 0.7] }}
//           transition={{ duration: 2.5, repeat: Infinity }}
//         />
//       </motion.div>
//       {/* Subtle grid overlay */}
//       <div className="absolute w-[200px] h-[200px] pointer-events-none z-10">
//         {[...Array(8)].map((_, i) => (
//           <div key={i} className="absolute left-1/2 top-1/2 w-[2px] h-[200px] bg-cyan-400/10" style={{ transform: `translate(-50%,-50%) rotate(${i * 22.5 * 2}deg)` }} />
//         ))}
//       </div>
//     </div>
//   )
// }

// // === LANDING PAGE ===
// export default function Landing() {
//   const [icons, setIcons] = useState<{ icon: string; left: string; size: number }[]>([])
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const generated = ["📡", "🔒", "🛰️", "💻", "🧠", "🦾", "🧬", "🛰️"].map(icon => ({
//         icon,
//         left: `${Math.random() * 100}%`,
//         size: 32 + Math.random() * 32
//       }))
//       setIcons(generated)
//     }
//   }, [])
//   return (
//     <main className="bg-gradient-to-b from-[#0a0f1c] via-[#0a1a2f] to-[#0a0f1c] text-white min-h-screen overflow-x-hidden relative scroll-smooth">
//       {/* Floating icons */}
//       {icons.map((obj, i) => (
//         <motion.div
//           key={i}
//           className="absolute select-none pointer-events-none"
//           initial={{ y: "-10%", opacity: 0 }}
//           animate={{ y: "120%", opacity: 0.13 + Math.random() * 0.13 }}
//           transition={{ duration: 28 + i * 4, repeat: Infinity, ease: "linear" }}
//           style={{ left: obj.left, fontSize: obj.size }}
//         >
//           {obj.icon}
//         </motion.div>
//       ))}
//       {/* Scanning grid background */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
//         {[...Array(16)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute w-full h-px bg-cyan-400/5"
//             style={{ top: `${i * 6.5}vh` }}
//             animate={{ x: ["-10%", "110%"] }}
//             transition={{ duration: 10, repeat: Infinity, delay: i * 0.3, ease: "linear" }}
//           />
//         ))}
//       </div>
//       {/* Tiny glowing particles */}
//       {[...Array(32)].map((_, i) => (
//         <motion.div
//           key={i}
//           className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400/80 blur-[2px] pointer-events-none"
//           initial={{ x: Math.random() * 100 + "%", y: Math.random() * 100 + "%", opacity: 0 }}
//           animate={{ opacity: [0, 1, 0], y: `+=${Math.random() * 60 - 30}` }}
//           transition={{ duration: 7 + Math.random() * 7, repeat: Infinity }}
//         />
//       ))}
//       {/* === Hero Section === */}
//       <section className="flex flex-col items-center justify-center text-center px-6 py-32 relative z-10">
//         <motion.h1
//           initial="hidden"
//           animate="visible"
//           variants={{
//             hidden: {},
//             visible: { transition: { staggerChildren: 0.09 } }
//           }}
//           className="text-5xl md:text-7xl font-extrabold mb-7 bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_60px_#38bdf8cc] tracking-tight"
//         >
//           {"Cyber Intelligence Dashboard".split(" ").map((word, i) => (
//             <motion.span
//               key={i}
//               variants={{ hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } }}
//               transition={{ duration: 0.7 }}
//               className="inline-block mr-2"
//             >
//               {word}
//             </motion.span>
//           ))}
//         </motion.h1>
//         <motion.p
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1, delay: 0.7 }}
//           className="max-w-2xl text-lg text-cyan-100 mb-12 font-medium"
//         >
//           Real-time insights powered by AI. Detecting threats, trends, and signals across the digital sphere.
//         </motion.p>
//         <div className="mt-10 mb-8">
//           <CyberEye />
//         </div>
//         <motion.a
//           href="#features"
//           initial={{ opacity: 0, y: 30, scale: 0.95 }}
//           animate={{ opacity: 1, y: 0, scale: 1 }}
//           transition={{ duration: 1, delay: 1.2 }}
//           className="inline-flex items-center gap-3 px-12 py-5 text-xl font-bold rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-cyan-400 hover:from-blue-600 hover:to-cyan-400 transition shadow-2xl shadow-cyan-400/40 animate-glowPulse group ring-2 ring-cyan-400/30 hover:scale-105 active:scale-98"
//         >
//           Explore Features
//           <motion.span
//             className="inline-block"
//             animate={{ x: [0, 8, 0] }}
//             transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
//           >→</motion.span>
//         </motion.a>
//       </section>
//       {/* === Insights Section === */}
//       <section id="insights" className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-14 z-10 relative">
//         {/* Line Chart with Feature */}
//         <motion.div
//           initial={{ opacity: 0, y: 60, scale: 0.97 }}
//           whileInView={{ opacity: 1, y: 0, scale: 1 }}
//           viewport={{ once: true }}
//           transition={{ duration: 1.1, delay: 0.1 }}
//           className="bg-gradient-to-br from-[#0a1a2f]/80 to-[#0a0f1c]/80 border border-cyan-700/40 p-10 rounded-3xl flex flex-col gap-7 shadow-xl hover:shadow-cyan-400/20 transition-all group relative overflow-hidden"
//           whileHover={{ scale: 1.025, boxShadow: "0 0 60px #38bdf8cc" }}
//         >
//           <div>
//             <h3 className="text-cyan-300 font-bold text-2xl mb-2 tracking-tight">Sentiment Trends</h3>
//             <p className="text-cyan-100 text-base">
//               Monitor how public opinion shifts across time with real-time tracking of sentiment scores.
//             </p>
//           </div>
//           <ResponsiveContainer width="100%" height={240}>
//             <LineChart data={[
//               { name: "Mon", value: 40 },
//               { name: "Tue", value: 60 },
//               { name: "Wed", value: 35 },
//               { name: "Thu", value: 80 },
//               { name: "Fri", value: 55 },
//             ]}>
//               <XAxis dataKey="name" stroke="#7dd3fc" />
//               <YAxis stroke="#7dd3fc" />
//               <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #38bdf8", color: "#fff" }}/>
//               <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={3} dot={false} />
//             </LineChart>
//           </ResponsiveContainer>
//         </motion.div>
//         {/* Bar Chart with Feature */}
//         <motion.div
//           initial={{ opacity: 0, y: 60, scale: 0.97 }}
//           whileInView={{ opacity: 1, y: 0, scale: 1 }}
//           viewport={{ once: true }}
//           transition={{ duration: 1.1, delay: 0.3 }}
//           className="bg-gradient-to-br from-[#0a1a2f]/80 to-[#0a0f1c]/80 border border-cyan-700/40 p-10 rounded-3xl flex flex-col gap-7 shadow-xl hover:shadow-cyan-400/20 transition-all group relative overflow-hidden"
//           whileHover={{ scale: 1.025, boxShadow: "0 0 60px #38bdf8cc" }}
//         >
//           <div>
//             <h3 className="text-cyan-300 font-bold text-2xl mb-2 tracking-tight">Platform Activity</h3>
//             <p className="text-cyan-100 text-base">
//               Compare engagement levels across social and media platforms to identify emerging hotspots.
//             </p>
//           </div>
//           <ResponsiveContainer width="100%" height={240}>
//             <BarChart data={[
//               { platform: "Twitter", activity: 120 },
//               { platform: "Instagram", activity: 80 },
//               { platform: "Reddit", activity: 60 },
//               { platform: "News", activity: 40 }
//             ]}>
//               <XAxis dataKey="platform" stroke="#7dd3fc" />
//               <YAxis stroke="#7dd3fc" />
//               <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #38bdf8", color: "#fff" }}/>
//               <Bar dataKey="activity" fill="#38bdf8" radius={[8, 8, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </motion.div>
//         {/* Radar Chart with Feature */}
//         <motion.div
//           initial={{ opacity: 0, y: 60, scale: 0.97 }}
//           whileInView={{ opacity: 1, y: 0, scale: 1 }}
//           viewport={{ once: true }}
//           transition={{ duration: 1.1, delay: 0.5 }}
//           className="bg-gradient-to-br from-[#0a1a2f]/80 to-[#0a0f1c]/80 border border-cyan-700/40 p-10 rounded-3xl md:col-span-2 flex flex-col gap-7 shadow-xl hover:shadow-cyan-400/20 transition-all group relative overflow-hidden"
//           whileHover={{ scale: 1.025, boxShadow: "0 0 60px #38bdf8cc" }}
//         >
//           <div>
//             <h3 className="text-cyan-300 font-bold text-2xl mb-2 tracking-tight">Threat Distribution</h3>
//             <p className="text-cyan-100 text-base">
//               Understand the spread of threats across categories like phishing, botnets, and misinformation.
//             </p>
//           </div>
//           <ResponsiveContainer width="100%" height={320}>
//             <RadarChart data={[
//               { type: "Fake News", value: 90 },
//               { type: "Phishing", value: 70 },
//               { type: "Bots", value: 60 },
//               { type: "Harassment", value: 50 },
//               { type: "Leaks", value: 40 }
//             ]}>
//               <PolarGrid stroke="#1e293b" />
//               <PolarAngleAxis dataKey="type" stroke="#7dd3fc" />
//               <Radar name="Threats" dataKey="value" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.4} />
//             </RadarChart>
//           </ResponsiveContainer>
//         </motion.div>
//       </section>
//       {/* === Features Section === */}
//       <section className="max-w-7xl mx-auto px-6 py-24 relative z-10">
//         <motion.h2
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 1 }}
//           className="text-4xl font-extrabold text-center mb-16 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent tracking-tight drop-shadow-[0_0_30px_#38bdf8cc]"
//         >
//           Key Features
//         </motion.h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
//           {[
//             {
//               icon: "🔍",
//               title: "Advanced Monitoring",
//               desc: "Track signals across multiple platforms with real-time intelligence and anomaly detection."
//             },
//             {
//               icon: "⚡",
//               title: "AI-Powered Insights",
//               desc: "Leverage machine learning to predict threats, detect sentiment shifts, and uncover patterns."
//             },
//             {
//               icon: "🌐",
//               title: "Multi-Platform Coverage",
//               desc: "From social media to news portals — stay updated on global conversations and risks."
//             },
//             {
//               icon: "🛡️",
//               title: "Threat Detection",
//               desc: "Identify phishing, fake news, botnets, and other malicious activity before it spreads."
//             }
//           ].map((f, i) => (
//             <motion.div
//               key={i}
//               initial={{ opacity: 0, y: 40, scale: 0.97 }}
//               whileInView={{ opacity: 1, y: 0, scale: 1 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.8, delay: i * 0.18 }}
//               className="bg-gradient-to-br from-[#0a1a2f]/80 to-[#0a0f1c]/80 border border-cyan-700/40 p-8 rounded-2xl shadow-xl hover:shadow-cyan-400/30 transition-all group relative overflow-hidden flex flex-col items-center text-center"
//               whileHover={{ scale: 1.045, boxShadow: "0 0 60px #38bdf8cc" }}
//             >
//               <motion.div
//                 className="text-5xl mb-4 drop-shadow-[0_0_20px_#38bdf8cc]"
//                 animate={{ rotate: [0, 8, -8, 0] }}
//                 transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", delay: i * 0.2 }}
//               >{f.icon}</motion.div>
//               <h3 className="text-xl font-bold text-cyan-300 mb-2 tracking-tight">{f.title}</h3>
//               <p className="text-cyan-100 text-base">{f.desc}</p>
//             </motion.div>
//           ))}
//         </div>
//       </section>
//       {/* === Sticky Footer === */}
//       <footer className="fixed bottom-0 left-0 w-full z-50 bg-gradient-to-r from-[#0a1a2f]/90 via-[#0a0f1c]/90 to-[#0a1a2f]/90 border-t border-cyan-700/30 py-3 flex items-center justify-center">
//         <span className="text-cyan-300 font-semibold tracking-wide text-base flex items-center gap-2">
//           Presented by RejectedDevs
//           <motion.span
//             className="inline-block h-1 w-12 rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 ml-2"
//             animate={{ scaleX: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
//             transition={{ duration: 2.2, repeat: Infinity }}
//           />
//         </span>
//       </footer>
//       {/* Glow Animation */}
//       <style>{`
//         @keyframes glowPulse {
//           0%, 100% { text-shadow: 0 0 20px #00bfff, 0 0 40px #00bfff; }
//           50% { text-shadow: 0 0 18px #38bdf8, 0 0 40px #0ea5e9; }
//         }
//         .animate-glowPulse { animation: glowPulse 2.5s ease-in-out infinite; }
//         html { scroll-behavior: smooth; }
//       `}</style>
//     </main>
//   )
// }






















"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip,
  BarChart, Bar,
  RadarChart, PolarGrid, PolarAngleAxis, Radar
} from "recharts"


// === CYBER EYE COMPONENT ===
function CyberEye({ open = true }: { open?: boolean }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)
  const irisControls = useAnimation()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      setMouse({ x, y })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      irisControls.start({ scaleY: 0.7 }, { duration: 0.13 }).then(() =>
        irisControls.start({ scaleY: 1.1 }, { duration: 0.18 }).then(() =>
          irisControls.start({ scaleY: 1 }, { duration: 0.12 })
        )
      )
    }, 4200 + Math.random() * 2000)
    return () => clearInterval(interval)
  }, [irisControls])

  const pupilX = mouse.x / 28
  const pupilY = mouse.y / 28

  return (
    <motion.div
      ref={ref}
      className="relative flex items-center justify-center select-none"
      initial={false}
      animate={{ scaleY: open ? 1 : 0 }}
      transition={{ duration: 0.85, ease: "easeInOut" }}
      style={{ originY: 0.5 }}
    >
      {/* Outer neon ring + holographic glow */}
      <motion.div
        className="absolute w-[340px] h-[340px] rounded-full border-4 border-cyan-400/30 shadow-[0_0_120px_#38bdf8cc] bg-gradient-radial from-cyan-400/10 via-blue-900/10 to-transparent"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      {/* Animated iris */}
      <motion.div
        className="w-[200px] h-[200px] rounded-full bg-gradient-to-br from-cyan-400 via-blue-900 to-black flex items-center justify-center shadow-[0_0_80px_#38bdf8cc] relative overflow-hidden border-4 border-cyan-400/30"
        animate={irisControls}
        initial={{ scaleY: 1 }}
        style={{ zIndex: 2 }}
      >
        {/* Holographic grid */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" fill="none">
          <defs>
            <radialGradient id="irisGrid" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.02" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="98" stroke="url(#irisGrid)" strokeWidth="2" />
          {[1,2,3,4].map(r => <circle key={r} cx="100" cy="100" r={r*30} stroke="#38bdf8" strokeOpacity="0.07" strokeWidth="1" />)}
          {[...Array(12)].map((_,i) => <line key={i} x1="100" y1="100" x2={100+90*Math.cos(i*Math.PI/6)} y2={100+90*Math.sin(i*Math.PI/6)} stroke="#38bdf8" strokeOpacity="0.07" strokeWidth="1" />)}
        </svg>
        {/* Shine sweep */}
        <motion.div
          className="absolute w-32 h-32 bg-gradient-to-r from-transparent via-white/30 to-transparent rotate-45"
          animate={{ x: ["-150%", "150%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        {/* Pupil */}
        <motion.div
          className="w-16 h-16 rounded-full bg-black shadow-[0_0_60px_#38bdf8] border-2 border-cyan-400/60"
          animate={{ x: pupilX, y: pupilY, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
        />
        {/* Reflection dot */}
        <motion.div
          className="absolute left-8 top-8 w-4 h-4 rounded-full bg-white/80 blur-[2px]"
          animate={{ opacity: [0.7, 0.3, 0.7] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </motion.div>
      {/* Subtle grid overlay */}
      <div className="absolute w-[200px] h-[200px] pointer-events-none z-10">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute left-1/2 top-1/2 w-[2px] h-[200px] bg-cyan-400/10" style={{ transform: `translate(-50%,-50%) rotate(${i * 22.5 * 2}deg)` }} />
        ))}
      </div>
    </motion.div>
  )
}

// === LANDING PAGE ===
export default function Landing() {
  const [icons, setIcons] = useState<{ icon: string; left: string; size: number }[]>([])
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [eyeOpen, setEyeOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setEyeOpen(true), 650)
      return () => clearTimeout(timer)
    }
  }, [loading])
  // floating icons only after mount (prevents hydration error)
  useEffect(() => {
    if (mounted) {
      const generated = ["📡", "🔒", "🛰️", "💻", "🧠", "🦾", "🧬", "🛰️"].map(icon => ({
        icon,
        left: `${Math.random() * 100}%`,
        size: 32 + Math.random() * 32
      }))
      setIcons(generated)
    }
  }, [mounted])

  // Loading spinner overlay
  if (!mounted || loading)
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.7, opacity: 0.2, rotate: 0 }}
          animate={{ scale: [1, 1.12, 1], opacity: 1, rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 1.15, ease: "easeInOut" }}
          className="w-24 h-24 rounded-full border-4 border-cyan-500 border-t-transparent border-b-transparent"
          style={{
            borderTopColor: "#0ea5e9",
            borderBottomColor: "#38bdf8cc",
            boxShadow: "0 0 40px #38bdf8cc",
          }}
        />
        <div className="mt-7 text-cyan-200 text-lg tracking-wide font-semibold">
          Loading dashboard...
        </div>
      </div>
    )

  // Eye opener: animate CyberEye opening before loading rest of UI
  if (!eyeOpen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-[#09081a] via-[#0a1a2f] to-[#09081a] flex items-center justify-center z-50">
        <CyberEye open={false} />
      </div>
    )
  }

  // MAIN DASHBOARD UI HERE
  return (
    <main className="bg-gradient-to-b from-[#0a0f1c] via-[#0a1a2f] to-[#0a0f1c] text-white min-h-screen overflow-x-hidden relative scroll-smooth">
      {/* Floating icons */}
      {mounted && icons.map((obj, i) => (
        <motion.div
          key={i}
          className="absolute select-none pointer-events-none"
          initial={{ y: "-10%", opacity: 0 }}
          animate={{ y: "120%", opacity: 0.13 + Math.random() * 0.13 }}
          transition={{ duration: 28 + i * 4, repeat: Infinity, ease: "linear" }}
          style={{ left: obj.left, fontSize: obj.size }}
        >
          {obj.icon}
        </motion.div>
      ))}
      {/* Scanning grid background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-px bg-cyan-400/5"
            style={{ top: `${i * 6.5}vh` }}
            animate={{ x: ["-10%", "110%"] }}
            transition={{ duration: 10, repeat: Infinity, delay: i * 0.3, ease: "linear" }}
          />
        ))}
      </div>
      {/* Tiny glowing particles */}
      {mounted && [...Array(32)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400/80 blur-[2px] pointer-events-none"
          initial={{ x: Math.random() * 100 + "%", y: Math.random() * 100 + "%", opacity: 0 }}
          animate={{ opacity: [0, 1, 0], y: `+=${Math.random() * 60 - 30}` }}
          transition={{ duration: 7 + Math.random() * 7, repeat: Infinity }}
        />
      ))}
      {/* === Hero Section === */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32 relative z-10">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.09 } }
          }}
          className="text-5xl md:text-7xl font-extrabold mb-7 bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_60px_#38bdf8cc] tracking-tight"
        >
          {"Sentinel.io".split(" ").map((word, i) => (
            <motion.span
              key={i}
              variants={{ hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7 }}
              className="inline-block mr-2"
            >{word}</motion.span>
          ))}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="max-w-2xl text-lg text-cyan-100 mb-12 font-medium"
        >
          Real-time insights powered by AI. Detecting threats, trends, and signals across the digital sphere.
        </motion.p>
        <div className="mt-10 mb-8">
          <CyberEye />
        </div>
        <motion.a
          href="/app"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="inline-flex items-center gap-3 px-12 py-5 text-xl font-bold rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-cyan-400 hover:from-blue-600 hover:to-cyan-400 transition shadow-2xl shadow-cyan-400/40 animate-glowPulse group ring-2 ring-cyan-400/30 hover:scale-105 active:scale-98"
        >
          Try it!
          <motion.span
            className="inline-block"
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
          >→</motion.span>
        </motion.a>
      </section>
      {/* === Insights Section === */}
      <section id="insights" className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-14 z-10 relative">
        {/* Line Chart with Feature */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.1 }}
          className="bg-gradient-to-br from-[#0a1a2f]/80 to-[#0a0f1c]/80 border border-cyan-700/40 p-10 rounded-3xl flex flex-col gap-7 shadow-xl hover:shadow-cyan-400/20 transition-all group relative overflow-hidden"
          whileHover={{ scale: 1.025, boxShadow: "0 0 60px #38bdf8cc" }}
        >
          <div>
            <h3 className="text-cyan-300 font-bold text-2xl mb-2 tracking-tight">Sentiment Trends</h3>
            <p className="text-cyan-100 text-base">
              Monitor how public opinion shifts across time with real-time tracking of sentiment scores.
            </p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={[
              { name: "Mon", value: 40 },
              { name: "Tue", value: 60 },
              { name: "Wed", value: 35 },
              { name: "Thu", value: 80 },
              { name: "Fri", value: 55 },
            ]}>
              <XAxis dataKey="name" stroke="#7dd3fc" />
              <YAxis stroke="#7dd3fc" />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #38bdf8", color: "#fff" }}/>
              <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
        {/* Bar Chart with Feature */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.3 }}
          className="bg-gradient-to-br from-[#0a1a2f]/80 to-[#0a0f1c]/80 border border-cyan-700/40 p-10 rounded-3xl flex flex-col gap-7 shadow-xl hover:shadow-cyan-400/20 transition-all group relative overflow-hidden"
          whileHover={{ scale: 1.025, boxShadow: "0 0 60px #38bdf8cc" }}
        >
          <div>
            <h3 className="text-cyan-300 font-bold text-2xl mb-2 tracking-tight">Platform Activity</h3>
            <p className="text-cyan-100 text-base">
              Compare engagement levels across social and media platforms to identify emerging hotspots.
            </p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={[
              { platform: "Twitter", activity: 120 },
              { platform: "Instagram", activity: 80 },
              { platform: "Reddit", activity: 60 },
              { platform: "News", activity: 40 }
            ]}>
              <XAxis dataKey="platform" stroke="#7dd3fc" />
              <YAxis stroke="#7dd3fc" />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #38bdf8", color: "#fff" }}/>
              <Bar dataKey="activity" fill="#38bdf8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
        {/* Radar Chart with Feature */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.5 }}
          className="bg-gradient-to-br from-[#0a1a2f]/80 to-[#0a0f1c]/80 border border-cyan-700/40 p-10 rounded-3xl md:col-span-2 flex flex-col gap-7 shadow-xl hover:shadow-cyan-400/20 transition-all group relative overflow-hidden"
          whileHover={{ scale: 1.025, boxShadow: "0 0 60px #38bdf8cc" }}
        >
          <div>
            <h3 className="text-cyan-300 font-bold text-2xl mb-2 tracking-tight">Threat Distribution</h3>
            <p className="text-cyan-100 text-base">
              Understand the spread of threats across categories like phishing, botnets, and misinformation.
            </p>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={[
              { type: "Fake News", value: 90 },
              { type: "Phishing", value: 70 },
              { type: "Bots", value: 60 },
              { type: "Harassment", value: 50 },
              { type: "Leaks", value: 40 }
            ]}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="type" stroke="#7dd3fc" />
              <Radar name="Threats" dataKey="value" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </section>
      {/* === Features Section === */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-4xl font-extrabold text-center mb-16 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent tracking-tight drop-shadow-[0_0_30px_#38bdf8cc]"
        >
          Key Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {[
            {
              icon: "🔍",
              title: "Advanced Monitoring",
              desc: "Track signals across multiple platforms with real-time intelligence and anomaly detection."
            },
            {
              icon: "⚡",
              title: "AI-Powered Insights",
              desc: "Leverage machine learning to predict threats, detect sentiment shifts, and uncover patterns."
            },
            {
              icon: "🌐",
              title: "Multi-Platform Coverage",
              desc: "From social media to news portals — stay updated on global conversations and risks."
            },
            {
              icon: "🛡️",
              title: "Threat Detection",
              desc: "Identify phishing, fake news, botnets, and other malicious activity before it spreads."
            }
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.18 }}
              className="bg-gradient-to-br from-[#0a1a2f]/80 to-[#0a0f1c]/80 border border-cyan-700/40 p-8 rounded-2xl shadow-xl hover:shadow-cyan-400/30 transition-all group relative overflow-hidden flex flex-col items-center text-center"
              whileHover={{ scale: 1.045, boxShadow: "0 0 60px #38bdf8cc" }}
            >
              <motion.div
                className="text-5xl mb-4 drop-shadow-[0_0_20px_#38bdf8cc]"
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", delay: i * 0.2 }}
              >{f.icon}</motion.div>
              <h3 className="text-xl font-bold text-cyan-300 mb-2 tracking-tight">{f.title}</h3>
              <p className="text-cyan-100 text-base">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      {/* === Sticky Footer === */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-gradient-to-r from-[#0a1a2f]/90 via-[#0a0f1c]/90 to-[#0a1a2f]/90 border-t border-cyan-700/30 py-3 flex items-center justify-center">
        <span className="text-cyan-300 font-semibold tracking-wide text-base flex items-center gap-2">
          Presented by RejectedDevs
          <motion.span
            className="inline-block h-1 w-12 rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 ml-2"
            animate={{ scaleX: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          />
        </span>
      </footer>
      {/* Glow Animation */}
      <style>{`
        @keyframes glowPulse {
          0%, 100% { text-shadow: 0 0 20px #00bfff, 0 0 40px #00bfff; }
          50% { text-shadow: 0 0 18px #38bdf8, 0 0 40px #0ea5e9; }
        }
        .animate-glowPulse { animation: glowPulse 2.5s ease-in-out infinite; }
        html { scroll-behavior: smooth; }
      `}</style>
    </main>
  )
}
