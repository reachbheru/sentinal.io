'use client'
import React, {useState} from 'react'
import { useRouter } from 'next/navigation'
import { Search, Bell, LayoutGrid } from 'lucide-react'
import { serialize } from 'v8'

const NavBar = () => {
  const [search,  setSearch] = useState('')
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!search.trim()) return
    // redirecting to summary page with query param
    router.push(`/app/summary?query=${encodeURIComponent(search)}`)
    setSearch("")
  }

  return (
    <header className="w-full bg-black/70 backdrop-blur-lg border-b border-blue-900/40 shadow-lg flex items-center px-8 py-3 z-10">
      {/* Left: Dashboard Title with Grid Icon */}
      <div className="flex items-center gap-3">
        <LayoutGrid size={22} className="text-blue-400" strokeWidth={2} />
        <span className="text-white text-xl font-bold tracking-wide flex items-center gap-2">
          Summary Dashboard
        </span>
      </div>

      {/* Center: Spacer */}
      <div className="flex-1" />
      
      {/* Right: Search + Icons */}
      {/* <div className="flex items-center gap-4">
        <form onSubmit={handleSearch} className="relative">
          <input
            className="bg-blue-900/30 backdrop-blur-md border border-blue-700/30 focus:border-blue-400 rounded-lg py-1.5 px-4 pl-10 text-blue-200 placeholder:text-blue-300 outline-none transition w-64 shadow-inner"
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 opacity-80" />
        </form>
        <button className="relative p-2 rounded-full bg-blue-700/20 hover:bg-blue-500/30 transition">
          <Bell size={20} className="text-blue-300" />
          
          <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full border-2 border-black"></span>
        </button> 
         
      </div> */}
    
    </header>
  )
}

export default NavBar

// import React from 'react'
// import { Search, Bell, LayoutGrid } from 'lucide-react'

// const NavBar = () => {
//   return (
//     <header className="w-full bg-black border-b border-gray-800 shadow-lg flex items-center px-8 py-3 z-10">
//       {/* Left: Dashboard Title with Grid Icon */}
//       <div className="flex items-center gap-3 text-white">
//         <LayoutGrid size={22} className="text-green-500" strokeWidth={2} />
//         <span className="text-white text-xl font-bold tracking-wide flex items-center gap-2">
//           Summary Dashboard
//         </span>
//       </div>

//       <div className="flex-1" />

//       {/* Right: Search + Icons */}
//       <div className="flex items-center gap-4">
//         <div className="relative">
//           <input
//             className="bg-gray-900 border border-gray-700 rounded-lg py-1.5 px-4 pl-10 text-gray-300 placeholder-gray-500 outline-none transition w-64 shadow-inner focus:border-green-500"
//             type="text"
//             placeholder="Search..."
//           />
//           <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 opacity-80" />
//         </div>
//         <button className="relative p-2 rounded-full bg-gray-800 hover:bg-red-900 transition">
//           <Bell size={20} className="text-red-500" />
//           {/* Notification dot */}
//           <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full border-2 border-black"></span>
//         </button>
//       </div>
//     </header>
//   )
// }

// export default NavBar
