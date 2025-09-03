// import React from 'react'

// const page = () => {
//   return (
//     <div>
//       page
//     </div>
//   )
// }

// export default page


'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ChartContainer,
  ChartConfig,
  ChartTooltipContent,
  ChartLegendContent,
} from '@/components/ui/chart'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Instagram, Globe, Facebook } from 'lucide-react'

const platforms = [
  {
    name: 'FaceBook',
    icon: Facebook,
    lineData: [
      { date: 'Oct 1', value: 12 },
      { date: 'Oct 2', value: 15 },
      { date: 'Oct 3', value: 14 },
      { date: 'Oct 4', value: 18 },
      { date: 'Oct 5', value: 20 },
      { date: 'Oct 6', value: 22 },
      { date: 'Oct 7', value: 19 },
    ],
    pieData: [
      { name: 'Threats', value: 14 },
      { name: 'Safe Posts', value: 35 },
    ],
    colors: ['#2563eb', '#93c5fd'], // Blue shades for pie slices
    summary: {
      threats: 14,
      safe: 35,
      description:
        'FaceBook mentions and threats fluctuated over the past week, showing increased attention on certain days.',
    },
  },
  {
    name: 'Instagram',
    icon: Instagram,
    lineData: [
      { date: 'Oct 1', value: 5 },
      { date: 'Oct 2', value: 7 },
      { date: 'Oct 3', value: 6 },
      { date: 'Oct 4', value: 8 },
      { date: 'Oct 5', value: 9 },
      { date: 'Oct 6', value: 10 },
      { date: 'Oct 7', value: 11 },
    ],
    pieData: [
      { name: 'Threats', value: 7 },
      { name: 'Safe Posts', value: 24 },
    ],
    colors: ['#2563eb', '#93c5fd'],
    summary: {
      threats: 7,
      safe: 24,
      description:
        'Instagram activity covered here displays a steady rise in monitored posts, with threats being relatively low.',
    },
  },
  {
    name: 'Google',
    icon: Globe,
    lineData: [
      { date: 'Oct 1', value: 8 },
      { date: 'Oct 2', value: 12 },
      { date: 'Oct 3', value: 14 },
      { date: 'Oct 4', value: 15 },
      { date: 'Oct 5', value: 17 },
      { date: 'Oct 6', value: 16 },
      { date: 'Oct 7', value: 18 },
    ],
    pieData: [
      { name: 'Threats', value: 11 },
      { name: 'Safe Posts', value: 40 },
    ],
    colors: ['#2563eb', '#93c5fd'],
    summary: {
      threats: 11,
      safe: 40,
      description:
        'Google search mentions represent a significant data source, with notable safe content predominating.',
    },
  },
]

const Page = () => {
  return (
    <div className="px-12 py-10 space-y-16 bg-black min-h-screen text-gray-100">
      {platforms.map(({ name, icon: Icon, lineData, pieData, colors, summary }) => {
        const chartConfigLine: ChartConfig = {
          [name]: { label: name, color: colors[0] },
        }
        const chartConfigPie: ChartConfig = {
          Threats: { label: 'Threats', color: colors[0] },
          'Safe Posts': { label: 'Safe Posts', color: colors[1] },
        }
        return (
          <section key={name}>
            <header className="flex items-center gap-3 mb-6">
              <Icon size={26} className="text-blue-400" />
              <h2 className="text-2xl font-bold text-blue-400 tracking-wide">{name} Stats</h2>
            </header>

            <Card className="p-7 bg-gray-900/95 border border-gray-700 shadow-xl space-y-6">
              {/* Summary Data */}
              <div className="flex gap-8">
                <Badge variant="secondary" className="bg-blue-700/30 text-blue-300 px-4 py-2 text-lg font-semibold">
                  Threats: <span className="text-blue-600">{summary.threats}</span>
                </Badge>
                <Badge variant="secondary" className="bg-blue-700/20 text-blue-300 px-4 py-2 text-lg font-semibold">
                  Safe Posts: <span className="text-blue-400">{summary.safe}</span>
                </Badge>
              </div>

              {/* Description */}
              <p className="text-gray-400 max-w-xl">{summary.description}</p>

              {/* Line Chart */}
              <div className="w-full h-64">
                <ChartContainer config={chartConfigLine} className="w-full h-full">
                  <LineChart data={lineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid stroke="#334155" strokeDasharray="4 4" />
                    <XAxis dataKey="date" stroke="#7dd3fc" />
                    <YAxis stroke="#7dd3fc" />
                    <ChartTooltipContent />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={colors[0]}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      animationDuration={1000}
                    />
                  </LineChart>
                </ChartContainer>
              </div>

              {/* Donut Pie Chart */}
              <div className="flex justify-center mt-2">
                <ChartContainer config={chartConfigPie} className="h-52 w-52">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={4}
                      label
                      animationDuration={1000}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <ChartTooltipContent />
                    <ChartLegendContent />
                  </PieChart>
                </ChartContainer>
              </div>
            </Card>
          </section>
        )
      })}
    </div>
  )
}

export default Page
