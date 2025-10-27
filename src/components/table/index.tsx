'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
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
  const t = useTranslations('table')
  const locale = useLocale()
  const [currentPage, setCurrentPage] = useState(1)
  const tableRef = useRef<HTMLDivElement>(null)
  const { data: activities, isLoading } = api.activities.getAll.useQuery()

  const setSelectedActivityId = useActivityStore(
    (state) => state.setSelectedActivityId,
  )

  const storeSelectedId = useActivityStore((state) => state.selectedActivityId)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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
    return new Date(dateString).toLocaleDateString(
      locale === 'zh' ? 'zh-CN' : 'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
    )
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

  const pageInfo = t('pageInfo', {
    start: startIndex.toString(),
    end: endIndex.toString(),
    total: total.toString(),
  })

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
  }

  if (isLoading) {
    return (
      <Table>
        <TableCaption>{t('loading')}</TableCaption>
      </Table>
    )
  }

  if (!activities || activities.length === 0) {
    return (
      <Table>
        <TableCaption>{t('noData')}</TableCaption>
      </Table>
    )
  }

  return (
    <div
      ref={tableRef}
      className='mb-10 w-full space-y-5'
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='text-center'>{t('activityName')}</TableHead>
            <TableHead className='text-center'>{t('distance')}</TableHead>
            <TableHead className='text-center'>{t('movingTime')}</TableHead>
            <TableHead className='text-center'>{t('elevationGain')}</TableHead>
            <TableHead className='text-center'>{t('date')}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedData.map((activity) => (
            <TableRow
              key={activity.id}
              onClick={() => handleRowClick(activity.id)}
              className='cursor-pointer transition-colors hover:bg-muted/50 data-[selected=true]:bg-muted'
              data-selected={storeSelectedId === activity.id}
            >
              <TableCell className='text-center'>
                {activity.name || '-'}
              </TableCell>
              <TableCell className='text-center'>
                {formatDistance(activity.distance)}
              </TableCell>
              <TableCell className='text-center'>
                {formatTime(activity.movingTime)}
              </TableCell>
              <TableCell className='text-center'>
                {activity.totalElevationGain
                  ? `${activity.totalElevationGain.toFixed(0)} m`
                  : '-'}
              </TableCell>
              <TableCell className='text-center'>
                {formatDate(activity.startDate)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className='flex items-center justify-between'>
        <p className='text-muted-foreground text-sm'>{pageInfo}</p>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            {t('previous')}
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            {t('next')}
          </Button>
        </div>
      </div>
    </div>
  )
}
