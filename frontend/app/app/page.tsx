// 'use client'

// import React from "react"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import {
//   ChartContainer,
//   ChartConfig,
//   ChartTooltip,
//   ChartTooltipContent,
//   ChartLegend,
//   ChartLegendContent,
// } from "@/components/ui/chart"

// import {
//   AreaChart,
//   Area,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Label,
// } from "recharts"

// import { Twitter, Instagram, Globe } from "lucide-react"

// const summaryData = [
//   {
//     platform: "Twitter (X)",
//     icon: Twitter,
//     threats: 14,
//     safe: 35,
//   },
//   {
//     platform: "Instagram",
//     icon: Instagram,
//     threats: 7,
//     safe: 24,
//   },
//   {
//     platform: "Google",
//     icon: Globe,
//     threats: 11,
//     safe: 40,
//   },
// ]

// const chartData = summaryData.map(({ platform, threats, safe }) => ({
//   platform,
//   Threats: threats,
//   Safe: safe,
// }))

// const chartConfig: ChartConfig = {
//   Threats: {
//     label: "Threats",
//     color: "#2563eb", // Tailwind blue-600
//   },
//   Safe: {
//     label: "Safe Posts",
//     color: "#93c5fd", // Tailwind blue-300
//   },
// }

// const Page = () => {
//   return (
    
//     <div className="px-12 py-10 space-y-14 bg-black min-h-screen text-gray-100">
//       {/* Summary Cards */}
//       <div className="flex gap-10 flex-wrap mb-6 justify-center">
//         {summaryData.map(({ platform, icon: Icon, threats, safe }) => (
//           <Card
//             key={platform}
//             className="w-80 min-h-[140px] bg-gray-900/95 border border-gray-700 shadow-lg px-8 py-6 flex flex-col justify-between hover:bg-gray-800 transition"
//           >
//             <div className="flex items-center justify-between mb-5">
//               <Badge variant="secondary" className="bg-blue-900/70 text-blue-300 px-3 py-1 text-base font-semibold flex items-center gap-2">
//                 <Icon size={20} className="text-blue-400" />
//                 {platform}
//               </Badge>
//               <div className="text-xs text-gray-400 tracking-wide">Summary</div>
//             </div>
//             <div className="flex items-center gap-12 pt-2">
//               <div>
//                 <div className="text-3xl font-semibold text-blue-600">{threats}</div>
//                 <div className="text-sm text-gray-400 mt-1">Threats</div>
//               </div>
//               <div>
//                 <div className="text-3xl font-semibold text-blue-300">{safe}</div>
//                 <div className="text-sm text-gray-400 mt-1">Safe Posts</div>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Threat & Safe Posts Area Chart */}
//       <Card className="bg-gray-900/95 border border-gray-700 p-10 shadow-xl">
//         <h2 className="mb-6 text-xl font-semibold text-gray-100">
//           Threat & Safe Posts Summary
//         </h2>
//         <ChartContainer config={chartConfig} className="h-[380px] w-full">
//           <AreaChart data={chartData} margin={{ top: 10, right: 25, left: 20, bottom: 5 }}>
//             <CartesianGrid vertical={false} stroke="#374151" strokeDasharray="3 3" />
//             <XAxis dataKey="platform" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 16 }} />
//             <YAxis axisLine={false} tickLine={false} tick={{ fill: "#d1d5db", fontSize: 15 }}>
//               <Label
//                 value="Number of Posts"
//                 angle={-90}
//                 position="insideLeft"
//                 style={{ textAnchor: "middle", fill: "#93c5fd" }}
//               />
//             </YAxis>
//             <ChartTooltip content={<ChartTooltipContent />} />
//             <Area
//               type="monotone"
//               dataKey="Threats"
//               stroke="var(--color-Threats)"
//               fill="var(--color-Threats)"
//               fillOpacity={0.15}
//               strokeWidth={3}
//               animationDuration={800}
//             />
//             <Area
//               type="monotone"
//               dataKey="Safe"
//               stroke="var(--color-Safe)"
//               fill="var(--color-Safe)"
//               fillOpacity={0.15}
//               strokeWidth={3}
//               animationDuration={800}
//             />
//             <ChartLegend content={<ChartLegendContent />} />
//           </AreaChart>
//         </ChartContainer>
//       </Card>
//     </div>
//   )
// }

// export default Page


'use client'

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Label,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Twitter, Instagram, Globe } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const summaryData = [
  {
    platform: "Twitter (X)",
    icon: Twitter,
    threats: 14,
    safe: 35,
  },
  {
    platform: "Instagram",
    icon: Instagram,
    threats: 7,
    safe: 24,
  },
  {
    platform: "Google",
    icon: Globe,
    threats: 11,
    safe: 40,
  },
]

const chartData = summaryData.map(({ platform, threats, safe }) => ({
  platform,
  Threats: threats,
  Safe: safe,
}))

const chartConfig: ChartConfig = {
  Threats: {
    label: "Threats",
    color: "#2563eb", // Tailwind blue-600
  },
  Safe: {
    label: "Safe Posts",
    color: "#93c5fd", // Tailwind blue-300
  },
}

const COLORS = ['#2563eb', '#93c5fd'] // match blue theme for pie chart slices

const Page = () => {
  const [selectedPlatform, setSelectedPlatform] = useState(null)

  return (
    <div className="px-12 py-10 space-y-14 bg-black min-h-screen text-gray-100">
      {/* Summary Cards */}
      <div className="flex gap-10 flex-wrap mb-6 justify-center">
        {summaryData.map(({ platform, icon: Icon, threats, safe }) => {
          const pieData = [
            { name: 'Threats', value: threats },
            { name: 'Safe Posts', value: safe },
          ]

          return (
            <Card
              key={platform}
              className="w-80 min-h-[160px] bg-gray-900/95 border border-gray-700 shadow-lg px-8 py-6 flex flex-col justify-between hover:bg-gray-800 transition"
            >
              <div className="flex items-center justify-between mb-5">
                <Badge variant="secondary" className="bg-blue-900/70 text-blue-300 px-3 py-1 text-base font-semibold flex items-center gap-2">
                  <Icon size={20} className="text-blue-400" />
                  {platform}
                </Badge>
                <div className="text-xs text-gray-400 tracking-wide">Summary</div>
              </div>
              <div className="flex items-center gap-12 pt-2">
                <div>
                  <div className="text-3xl font-semibold text-blue-600">{threats}</div>
                  <div className="text-sm text-gray-400 mt-1">Threats</div>
                </div>
                <div>
                  <div className="text-3xl font-semibold text-blue-300">{safe}</div>
                  <div className="text-sm text-gray-400 mt-1">Safe Posts</div>
                </div>
              </div>

              {/* Dialog trigger button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-6 self-start px-4 py-1 text-sm">Details</Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{platform} - Detailed Stats</DialogTitle>
                    <DialogDescription>
                      This chart displays the proportion of threatening and safe posts detected on {platform} for VIP monitoring.
                    </DialogDescription>
                  </DialogHeader>
                  {/* Circular Pie Chart */}
                  <div className="flex justify-center mt-6">
                    <ChartContainer config={{
                      Threats: { color: COLORS[0] },
                      Safe: { color: COLORS[1] }
                    }} className="h-64 w-64">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          fill="#8884d8"
                          label={(entry) => `${entry.name}: ${entry.value}`}
                          animationDuration={1000}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ChartContainer>
                  </div>

                  <DialogClose asChild>
                    <Button variant="outline" className="mt-6 w-full">Close</Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </Card>
          )
        })}
      </div>

      {/* Threat & Safe Posts Area Chart */}
      <Card className="bg-gray-900/95 border border-gray-700 p-10 shadow-xl">
        <h2 className="mb-6 text-xl font-semibold text-gray-100">
          Threat & Safe Posts Summary
        </h2>
        <ChartContainer config={chartConfig} className="h-[380px] w-full">
          <AreaChart data={chartData} margin={{ top: 10, right: 25, left: 20, bottom: 5 }}>
            <CartesianGrid vertical={false} stroke="#374151" strokeDasharray="3 3" />
            <XAxis dataKey="platform" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 16 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#d1d5db", fontSize: 15 }}>
              <Label
                value="Number of Posts"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle", fill: "#93c5fd" }}
              />
            </YAxis>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="Threats"
              stroke="var(--color-Threats)"
              fill="var(--color-Threats)"
              fillOpacity={0.15}
              strokeWidth={3}
              animationDuration={800}
            />
            <Area
              type="monotone"
              dataKey="Safe"
              stroke="var(--color-Safe)"
              fill="var(--color-Safe)"
              fillOpacity={0.15}
              strokeWidth={3}
              animationDuration={800}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </Card>
    </div>
  )
}

export default Page
