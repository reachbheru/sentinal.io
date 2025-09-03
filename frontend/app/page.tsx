
// 'use client'

// import React, { useEffect, useRef } from 'react'
// import Link from 'next/link'
// import gsap from 'gsap'
// import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
// import { BeamsBackground } from "@/components/ui/beams-background"

// gsap.registerPlugin(ScrollTrigger)

// export default function Home() {
//   const sectionsRef = useRef<HTMLDivElement[]>([])

//   useEffect(() => {
//     sectionsRef.current.forEach((section, i) => {
//       gsap.fromTo(
//         section,
//         { y: 60, opacity: 0, scale: 0.95 },
//         {
//           y: 0,
//           opacity: 1,
//           scale: 1,
//           duration: 1.1,
//           ease: 'power4.out',
//           scrollTrigger: {
//             trigger: section,
//             start: 'top 85%',
//             toggleActions: 'play none none reverse',
//           },
//           delay: i * 0.15,
//         }
//       )
//     })
//   }, [])

//   const addToRefs = (el: HTMLDivElement | null) => {
//     if (el && !sectionsRef.current.includes(el)) {
//       sectionsRef.current.push(el)
//     }
//   }

//   return (
//     <main className="relative bg-black bg-gradient-to-b from-black via-gray-900 to-black text-gray-200 min-h-screen font-sans select-none overflow-x-hidden">
//       {/* Hero Section */}
//       <section
//         className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 overflow-hidden"
//         ref={addToRefs}
//       >
//         <BeamsBackground className="absolute inset-0 -z-10" />
//         <h1 className="relative text-7xl md:text-9xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 drop-shadow-lg mb-5">
//           Sentinel<span className="text-white">.io</span>
//         </h1>
//         <p className="relative z-10 text-xl text-gray-400 mb-10 max-w-lg tracking-wide font-semibold">
//           Advanced VIP Threat & Misinformation Monitoring Platform
//         </p>
//         <p className="relative z-10 text-sm italic text-gray-600 mb-12">
//           Powered by <span className="text-blue-400 font-bold">RejectedDevs</span>
//         </p>
//         <Link
//           href="/app"
//           className="relative z-10 inline-block px-10 py-4 text-lg font-semibold rounded-xl bg-blue-600 hover:bg-cyan-500 active:scale-95 transition-transform shadow-lg shadow-blue-600/60 before:block before:absolute before:-inset-1 before:rounded-xl before:bg-gradient-to-r before:from-cyan-400 before:to-blue-600 before:blur-sm before:opacity-70 before:animate-tilt"
//         >
//           Launch Demo
//         </Link>
//       </section>

//       {/* Features Section */}
//       <section className="max-w-6xl mx-auto px-6 space-y-24 py-20">
//         <FeatureSection
//           title="Real-time Multi-Platform Monitoring"
//           text="Track VIP mentions instantly across Twitter, Instagram, Google, and more, consolidating data into a single dashboard."
//           iconPath="/icons/multi-platform.svg"
//           bg="bg-gray-900/70"
//           ref={addToRefs}
//         />
//         <FeatureSection
//           title="AI-driven Misinformation & Impersonation Detection"
//           text="Leveraging advanced AI for deep analysis of text, image, and behavior patterns to detect fake profiles and coordinated misinformation."
//           iconPath="/icons/ai.svg"
//           bg="bg-gray-900/60"
//           ref={addToRefs}
//         />
//         <FeatureSection
//           title="Visual Alerts & Interactive Dashboards"
//           text="Receive real-time alerts with clear evidence and explore data visualizations to quickly grasp critical insights."
//           iconPath="/icons/alerts.svg"
//           bg="bg-gray-900/70"
//           ref={addToRefs}
//         />
//         <FeatureSection
//           title="Campaign Visualization & Network Analysis"
//           text="Interactive graph views reveal relationships between fake accounts and misinformation campaigns, enabling strategic responses."
//           iconPath="/icons/visualize.svg"
//           bg="bg-gray-900/60"
//           ref={addToRefs}
//         />
//       </section>

//       {/* Call To Action */}
//       <section
//         className="text-center py-24 bg-gradient-to-r from-blue-900 via-cyan-800 to-blue-900 shadow-inner rounded-tl-[5rem] rounded-tr-[5rem]"
//         ref={addToRefs}
//       >
//         <h2 className="text-5xl tracking-wide font-extrabold mb-4 text-white drop-shadow-lg animate-textPop">
//           Ready to Protect?
//         </h2>
//         <p className="text-gray-300 max-w-xl mx-auto mb-10 text-lg tracking-wide font-semibold">
//           Join Sentinel.io today and safeguard VIPs from misinformation and online threats with confidence.
//         </p>
//         <Link
//           href="/app"
//           className="inline-block px-12 py-5 font-bold rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 hover:from-blue-500 hover:to-cyan-400 transition shadow-lg shadow-cyan-400/60 animate-glowPulse"
//         >
//           Explore the Demo
//         </Link>
//       </section>

//       {/* Footer */}
//       <footer className="text-center p-6 text-gray-500 text-sm bg-black border-t border-gray-800">
//         © 2025 Sentinel.io by RejectedDevs. All rights reserved.
//       </footer>

//       {/* Custom Animations */}
//       <style>{`
//         @keyframes glowPulse {
//           0%, 100% {
//             text-shadow:
//               0 0 15px #00bfff,
//               0 0 30px #00bfff;
//           }
//           50% {
//             text-shadow:
//               0 0 10px #0077cc,
//               0 0 20px #0077cc;
//           }
//         }
//         .animate-glowPulse {
//           animation: glowPulse 3s ease-in-out infinite;
//         }
//         @keyframes textPop {
//           0% {
//             opacity: 0;
//             transform: scale(0.96);
//           }
//           60% {
//             opacity: 1;
//             transform: scale(1.04);
//           }
//           100% {
//             transform: scale(1);
//           }
//         }
//         .animate-textPop {
//           animation: textPop 1.2s ease forwards;
//         }
//         @keyframes tilt {
//           0%, 100% {
//             transform: rotate(-3deg);
//           }
//           50% {
//             transform: rotate(3deg);
//           }
//         }
//         .animate-tilt {
//           animation: tilt 6s ease-in-out infinite;
//         }
//       `}</style>
//     </main>
//   )
// }

// const FeatureSection = React.forwardRef<
//   HTMLDivElement,
//   { title: string; text: string; iconPath: string; bg: string }
// >(({ title, text, iconPath, bg }, ref) => (
//   <section
//     className={`flex flex-col md:flex-row items-center gap-8 py-12 px-6 rounded-xl shadow-lg cursor-default hover:shadow-blue-600/50 transition-shadow duration-700 ${bg}`}
//     ref={ref}
//   >
//     <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32">
//       <img src={iconPath} alt={title} className="w-full h-full object-contain" />
//     </div>
//     <div className="max-w-xl text-center md:text-left">
//       <h3 className="text-3xl font-semibold text-blue-400 mb-4">{title}</h3>
//       <p className="text-gray-300 text-lg leading-relaxed">{text}</p>
//     </div>
//   </section>
// ))

// FeatureSection.displayName = 'FeatureSection'









'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { BeamsBackground } from '@/components/ui/beams-background'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const sectionsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    sectionsRef.current.forEach((section, i) => {
      gsap.fromTo(
        section,
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          delay: i * 0.15,
        }
      )
    })
  }, [])

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el)
    }
  }

  return (
    <main className="relative bg-black bg-gradient-to-b from-black via-gray-900 to-black text-gray-200 min-h-screen font-sans select-none overflow-x-hidden">
      {/* Hero Section */}
      <section
        className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 overflow-hidden"
        ref={addToRefs}
      >
        {/* <BeamsBackground className="absolute inset-0 -z-10" /> */}
        <h1 className="relative text-7xl md:text-9xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 drop-shadow-md mb-5">
          Sentinel<span className="text-white">.io</span>
        </h1>
        <p className="relative z-10 text-xl text-gray-400 mb-10 max-w-lg tracking-wide font-semibold">
          Advanced VIP Threat & Misinformation Monitoring Platform
        </p>
        <p className="relative z-10 text-sm italic text-gray-600 mb-12">
          Powered by <span className="text-blue-400 font-bold">RejectedDevs</span>
        </p>
        <Link
          href="/app"
          className="relative z-10 inline-block px-10 py-4 text-lg font-semibold rounded-xl bg-blue-600 hover:bg-cyan-500 active:scale-95 transition-transform shadow-md shadow-blue-600/40"
        >
          Launch Demo
        </Link>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 space-y-24 py-20">
        <FeatureSection
          title="Real-time Multi-Platform Monitoring"
          text="Track VIP mentions instantly across Twitter, Instagram, Google, and more, consolidating data into a single dashboard."
          iconPath="/icons/multi-platform.svg"
          bg="bg-gray-900/70"
          ref={addToRefs}
        />
        <FeatureSection
          title="AI-driven Misinformation & Impersonation Detection"
          text="Leveraging advanced AI for deep analysis of text, image, and behavior patterns to detect fake profiles and coordinated misinformation."
          iconPath="/icons/ai.svg"
          bg="bg-gray-900/60"
          ref={addToRefs}
        />
        <FeatureSection
          title="Visual Alerts & Interactive Dashboards"
          text="Receive real-time alerts with clear evidence and explore data visualizations to quickly grasp critical insights."
          iconPath="/icons/alerts.svg"
          bg="bg-gray-900/70"
          ref={addToRefs}
        />
        <FeatureSection
          title="Campaign Visualization & Network Analysis"
          text="Interactive graph views reveal relationships between fake accounts and misinformation campaigns, enabling strategic responses."
          iconPath="/icons/visualize.svg"
          bg="bg-gray-900/60"
          ref={addToRefs}
        />
      </section>

      {/* Call To Action */}
      <section
        className="text-center py-24 bg-gradient-to-r from-blue-900 via-cyan-800 to-blue-900 shadow-inner rounded-tl-[5rem] rounded-tr-[5rem]"
        ref={addToRefs}
      >
        <h2 className="text-5xl tracking-wide font-extrabold mb-4 text-white drop-shadow-md animate-textPop">
          Ready to Protect?
        </h2>
        <p className="text-gray-300 max-w-xl mx-auto mb-10 text-lg tracking-wide font-semibold">
          Join Sentinel.io today and safeguard VIPs from misinformation and online threats with confidence.
        </p>
        <Link
          href="/app"
          className="inline-block px-12 py-5 font-bold rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 hover:from-blue-500 hover:to-cyan-400 transition shadow-md shadow-cyan-400/40 animate-none"
        >
          Explore the Demo
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center p-6 text-gray-500 text-sm bg-black border-t border-gray-800">
        © 2025 Sentinel.io by RejectedDevs. All rights reserved.
      </footer>

      {/* Custom Animations */}
      <style>{`
        @keyframes textPop {
          0% {
            opacity: 0;
            transform: scale(0.96);
          }
          60% {
            opacity: 1;
            transform: scale(1.04);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-textPop {
          animation: textPop 1.2s ease forwards;
        }
      `}</style>
    </main>
  )
}

const FeatureSection = React.forwardRef<
  HTMLDivElement,
  { title: string; text: string; iconPath: string; bg: string }
>(({ title, text, iconPath, bg }, ref) => (
  <section
    className={`flex flex-col md:flex-row items-center gap-8 py-12 px-6 rounded-xl shadow-lg cursor-default hover:shadow-blue-600/50 transition-shadow duration-700 ${bg}`}
    ref={ref}
  >
    <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32">
      <img src={iconPath} alt={title} className="w-full h-full object-contain" />
    </div>
    <div className="max-w-xl text-center md:text-left">
      <h3 className="text-3xl font-semibold text-blue-400 mb-4">{title}</h3>
      <p className="text-gray-300 text-lg leading-relaxed">{text}</p>
    </div>
  </section>
))

FeatureSection.displayName = 'FeatureSection'



