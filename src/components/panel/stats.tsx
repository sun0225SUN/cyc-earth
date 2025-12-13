'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { api } from '@/trpc/react'
import { formatDistance, formatTime, formatElevation } from '@/lib/utils'
import type { TotalStats } from '@/server/api/routers/activities'

export const StatsPanel = () => {
  const { data: stats, isLoading } = api.activities.getStats.useQuery()

  if (isLoading || !stats) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
        <p className="text-center text-muted-foreground mt-4">
          加载统计数据中...
        </p>
      </div>
    )
  }

  const typedStats = stats as TotalStats

  return (
    <div className="divide-y divide-border">
      {/* 标题 */}
      <div className="p-6">
        <h3 className="text-2xl font-bold">骑行统计</h3>
      </div>

      {/* 总量统计 */}
      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="border border-border rounded-xl p-4 transition-all duration-200 hover:border-primary/80 hover:shadow-sm">
            <p className="text-sm text-muted-foreground mb-2">总活动次数</p>
            <p className="text-3xl font-bold text-primary">{typedStats.totalActivities}</p>
          </div>
          <div className="border border-border rounded-xl p-4 transition-all duration-200 hover:border-primary/80 hover:shadow-sm">
            <p className="text-sm text-muted-foreground mb-2">总距离</p>
            <p className="text-3xl font-bold text-primary">{formatDistance(typedStats.totalDistance)}</p>
          </div>
          <div className="border border-border rounded-xl p-4 transition-all duration-200 hover:border-primary/80 hover:shadow-sm">
            <p className="text-sm text-muted-foreground mb-2">总时长</p>
            <p className="text-3xl font-bold text-primary">{formatTime(typedStats.totalMovingTime)}</p>
          </div>
          <div className="border border-border rounded-xl p-4 transition-all duration-200 hover:border-primary/80 hover:shadow-sm">
            <p className="text-sm text-muted-foreground mb-2">总爬升</p>
            <p className="text-3xl font-bold text-primary">{formatElevation(typedStats.totalElevationGain)}</p>
          </div>
        </div>
      </div>

      {/* 年份统计表格 */}
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="px-6 py-4 text-left font-semibold">年份</TableHead>
              <TableHead className="px-6 py-4 text-left font-semibold">活动次数</TableHead>
              <TableHead className="px-6 py-4 text-left font-semibold">距离</TableHead>
              <TableHead className="px-6 py-4 text-left font-semibold">时长</TableHead>
              <TableHead className="px-6 py-4 text-left font-semibold">爬升</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {typedStats.yearlyStats.map((yearStats) => (
              <TableRow 
                key={yearStats.year} 
                className="border-b border-border/30 hover:bg-accent/50 transition-colors duration-150"
              >
                <TableCell className="px-6 py-4 font-medium">{yearStats.year}</TableCell>
                <TableCell className="px-6 py-4">{yearStats.totalActivities}</TableCell>
                <TableCell className="px-6 py-4">{formatDistance(yearStats.totalDistance)}</TableCell>
                <TableCell className="px-6 py-4">{formatTime(yearStats.totalMovingTime)}</TableCell>
                <TableCell className="px-6 py-4">{formatElevation(yearStats.totalElevationGain)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
