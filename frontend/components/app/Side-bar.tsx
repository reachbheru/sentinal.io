"use client";
import Image from "next/image";
import Link from "next/link";
import { BarChart3, BookOpen, GalleryThumbnailsIcon, Settings, ShieldCheck, VideoIcon } from "lucide-react"; // Lucide icons

const menu = [
  { name: "Statistics", icon: BarChart3, href: "/app/stats" },
  {name: 'Deepfake Analyzer', icon: VideoIcon, href: '/app/deepfake' },
  {name: 'Image Analyzer', icon: GalleryThumbnailsIcon, href: '/app/image-analysis'},
  { name: "Settings", icon: Settings, href: "/app/settings" },
];

const SideBar = () => {
  return (
    <aside className="w-[300px] min-h-screen bg-black bg-opacity-80 border-r border-blue-900/60 flex flex-col items-center py-6 shadow-xl">
      {/* Logo section with glassmorphism */}
      <Link
        href="/app"
        className="w-5/6 flex items-center gap-3 px-4 py-3 mb-6 rounded-xl bg-blue-500/20 hover:bg-blue-600/30 transition backdrop-blur-md border border-blue-200/20 shadow-lg"
      >
        <Image
          src="/logo.PNG"
          width={40}
          height={40}
          alt="logo"
          className="rounded-full bg-blue-900/40 p-1"
        />
        <span className="text-2xl font-bold text-white tracking-wide drop-shadow-md">
          Sentinel.io
        </span>
      </Link>

      {/* Navigation links */}
      <nav className="flex flex-col gap-2 w-full px-4">
        {menu.map(({ name, icon: Icon, href }) => (
          <Link
            href={href}
            key={name}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-blue-200 hover:text-white hover:bg-blue-600/30 transition group"
          >
            <Icon
              size={22}
              className="text-blue-400 group-hover:text-cyan-300"
              strokeWidth={2}
            />
            <span>{name}</span>
          </Link>
        ))}
      </nav>

      <div className="flex-1"></div>
      {/* Footer or profile avatar */}
      <footer className="mb-3 flex items-center justify-center w-full">
        <span className="w-9 h-9 rounded-full bg-blue-800/40 flex items-center justify-center text-white text-lg font-semibold border border-blue-600/30 shadow-md">
          N
        </span>
      </footer>
    </aside>
  );
};

export default SideBar;

// 'use client'
// import Image from 'next/image'
// import Link from 'next/link'
// import { BarChart3, BookOpen, Settings, ShieldCheck, LayoutGrid } from 'lucide-react'

// const menu = [
//   { name: 'Statistics', icon: BarChart3, href: '/app/stats' },
//   { name: 'Resources', icon: BookOpen, href: '/app/resources' },
//   { name: 'Settings', icon: Settings, href: '/app/preferences' },
// ]

// const SideBar = () => {
//   return (
//     <aside className="w-[300px] min-h-screen bg-black border-r border-gray-800 flex flex-col items-center py-6 shadow-xl">
//       {/* Logo section with subtle white text */}
//       <Link
//         href="/app"
//         className="w-5/6 flex items-center gap-3 px-4 py-3 mb-6 rounded-xl bg-gray-900 hover:bg-gray-800 transition shadow"
//       >
//         <Image src="/logo.png" width={40} height={40} alt="logo" className="rounded-full bg-gray-700 p-1" />
//         <span className="text-2xl font-bold text-white tracking-wide drop-shadow-md">
//           Sentinel.io
//         </span>
//       </Link>

//       {/* Navigation links */}
//       <nav className="flex flex-col gap-4 w-full px-6">
//         {menu.map(({ name, icon: Icon, href }) => (
//           <Link
//             href={href}
//             key={name}
//             className="flex items-center gap-3 px-5 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition group"
//           >
//             <Icon size={22} className="text-gray-500 group-hover:text-green-500" strokeWidth={2} />
//             <span>{name}</span>
//           </Link>
//         ))}
//       </nav>

//       <div className="flex-1" />
//       {/* Footer avatar placeholder */}
//       <footer className="mb-4 flex items-center justify-center w-full">
//         <span className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white text-lg font-semibold border border-gray-600 shadow-md">N</span>
//       </footer>
//     </aside>
//   )
// }

// export default SideBar
