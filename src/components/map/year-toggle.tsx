'use client'

import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { api } from '@/trpc/react'
import { useActivityStore } from '@/stores/use-activity-store'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function YearToggle() {
  const { data: stats } = api.activities.getStats.useQuery()
  const selectedYear = useActivityStore((state) => state.selectedYear)
  const setSelectedYear = useActivityStore((state) => state.setSelectedYear)

  const [isOpen, setIsOpen] = useState(false)

  // 从统计数据中获取所有有数据的年份
  const availableYears = stats?.yearlyStats.map((stat) => stat.year) || []
  const currentYear = new Date().getFullYear()

  // 如果没有可用年份，使用当前年份
  useEffect(() => {
    if (availableYears.length === 0 && selectedYear === null) {
      setSelectedYear(currentYear)
    }
  }, [availableYears, selectedYear, setSelectedYear, currentYear])

  // 切换到上一年
  const handlePrevYear = () => {
    if (selectedYear) {
      const prevYear = availableYears.find((year) => year < selectedYear)
      if (prevYear) {
        setSelectedYear(prevYear)
      }
    }
  }

  // 切换到下一年
  const handleNextYear = () => {
    if (selectedYear) {
      const nextYear = availableYears.find((year) => year > selectedYear)
      if (nextYear) {
        setSelectedYear(nextYear)
      }
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrevYear}
        disabled={!selectedYear || !availableYears.find((year) => year < selectedYear)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="default" size="sm">
            {selectedYear || currentYear}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2">
          <div className="grid grid-cols-3 gap-1">
            {[...availableYears, currentYear]
              .filter((year, index, self) => self.indexOf(year) === index)
              .sort((a, b) => b - a)
              .map((year) => (
                <Button
                  key={year}
                  variant={selectedYear === year ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setSelectedYear(year)
                    setIsOpen(false)
                  }}
                  className="justify-center"
                >
                  {year}
                </Button>
              ))}
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleNextYear}
        disabled={!selectedYear || !availableYears.find((year) => year > selectedYear)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </>
  )
}
