'use client'

import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useActivityStore } from '@/stores/use-activity-store'
import { api } from '@/trpc/react'

const ITEMS_PER_PAGE = 10

export function DataTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const tableRef = useRef<HTMLDivElement>(null)
  
  const selectedYear = useActivityStore((state) => state.selectedYear)
  const setSelectedYear = useActivityStore((state) => state.setSelectedYear)
  const setSelectedActivityId = useActivityStore(
    (state) => state.setSelectedActivityId,
  )
  const storeSelectedId = useActivityStore((state) => state.selectedActivityId)
  
  const { data: stats } = api.activities.getStats.useQuery()
  const { data: activities, isLoading } = api.activities.getAll.useQuery({
    year: selectedYear || undefined,
  })
  
  // 从统计数据中获取所有有数据的年份
  const availableYears = stats?.yearlyStats.map((stat: any) => stat.year) || []
  const currentYear = new Date().getFullYear()
  
  // 切换到上一年
  const handlePrevYear = () => {
    if (selectedYear) {
      const prevYear = availableYears.find((year: number) => year < selectedYear)
      if (prevYear) {
        setSelectedYear(prevYear)
        setCurrentPage(1) // 切换年份后重置到第一页
      }
    }
  }

  // 切换到下一年
  const handleNextYear = () => {
    if (selectedYear) {
      const nextYear = availableYears.find((year: number) => year > selectedYear)
      if (nextYear) {
        setSelectedYear(nextYear)
        setCurrentPage(1) // 切换年份后重置到第一页
      }
    }
  }

  // 渲染年份选择器
  const renderYearSelector = () => {
    // 如果没有可用年份，不显示选择器
    if (availableYears.length === 0) return null

    return (
      <div className='flex items-center gap-4'>
        <span className='text-sm font-medium text-muted-foreground'>年份:</span>
        <div className='flex items-center gap-2 rounded-lg bg-muted/50 p-1'>
          <Button
            variant='ghost'
            size='icon'
            onClick={handlePrevYear}
            disabled={!selectedYear || !availableYears.find((year: number) => year < selectedYear)}
            className='h-8 w-8 rounded-full hover:bg-primary/20 transition-colors duration-150'
          >
            ←
          </Button>
          <span className='px-4 py-2 text-sm font-semibold text-primary rounded-md bg-card shadow-sm'>{selectedYear || currentYear}</span>
          <Button
            variant='ghost'
            size='icon'
            onClick={handleNextYear}
            disabled={!selectedYear || !availableYears.find((year: number) => year > selectedYear)}
            className='h-8 w-8 rounded-full hover:bg-primary/20 transition-colors duration-150'
          >
            →
          </Button>
        </div>
      </div>
    )
  }

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target as Node)
      ) {
        setSelectedActivityId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setSelectedActivityId])

  const handleRowClick = (activityId: number) => {
    setSelectedActivityId(activityId)
    
    // 滚动到页面最顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const formatDistance = (meters?: number | null) => {
    if (!meters) return '-'
    return `${(meters / 1000).toFixed(2)} km`
  }

  const formatTime = (seconds?: number | null) => {
    if (!seconds) return '-'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}:${minutes.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const totalPages = activities
    ? Math.ceil(activities.length / ITEMS_PER_PAGE)
    : 0
  const paginatedData = activities
    ? activities.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      )
    : []

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endIndex = Math.min(
    currentPage * ITEMS_PER_PAGE,
    activities?.length || 0,
  )
  const total = activities?.length || 0

  const pageInfo = `显示 ${startIndex} - ${endIndex} 条，共 ${total} 条`

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
        <p className="text-center text-muted-foreground mt-4">
          加载数据中...
        </p>
      </div>
    )
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-2xl mb-2">📊</p>
          <h4 className="text-lg font-semibold mb-1">暂无数据</h4>
          <p className="text-muted-foreground">还没有骑行记录</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={tableRef}
      className='divide-y divide-border'
    >
      {/* 标题和年份选择器 */}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-2xl font-bold">骑行记录</h3>
          {renderYearSelector()}
        </div>
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className='px-6 py-4 text-left font-semibold'>活动名称</TableHead>
              <TableHead className='px-6 py-4 text-left font-semibold'>距离</TableHead>
              <TableHead className='px-6 py-4 text-left font-semibold'>用时</TableHead>
              <TableHead className='px-6 py-4 text-left font-semibold'>爬升</TableHead>
              <TableHead className='px-6 py-4 text-left font-semibold'>日期</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.map((activity: any) => (
              <TableRow
                key={activity.id}
                onClick={() => handleRowClick(activity.id)}
                className='cursor-pointer transition-all duration-200 hover:bg-muted/50 data-[selected=true]:bg-muted/80 data-[selected=true]:shadow-sm'
                data-selected={storeSelectedId === activity.id}
              >
                <TableCell className='px-6 py-4 font-medium'>
                  {activity.name || '-'}
                </TableCell>
                <TableCell className='px-6 py-4'>
                  {formatDistance(activity.distance)}
                </TableCell>
                <TableCell className='px-6 py-4'>
                  {formatTime(activity.movingTime)}
                </TableCell>
                <TableCell className='px-6 py-4'>
                  {activity.totalElevationGain
                    ? `${activity.totalElevationGain.toFixed(0)} m`
                    : '-'}
                </TableCell>
                <TableCell className='px-6 py-4 text-muted-foreground'>
                  {formatDate(activity.startDate)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 分页 */}
      <div className='flex flex-col sm:flex-row items-center justify-between gap-4 p-6'>
        <p className='text-sm text-muted-foreground'>{pageInfo}</p>
        <div className='flex gap-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className='rounded-lg px-4 py-2 hover:bg-primary/10 transition-colors duration-200'
          >
            ← 上一页
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className='rounded-lg px-4 py-2 hover:bg-primary/10 transition-colors duration-200'
          >
            下一页 →
          </Button>
        </div>
      </div>
    </div>
  )
}
