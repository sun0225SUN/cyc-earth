import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 格式化距离，将米转换为公里
// 超过1公里显示公里，否则显示米
export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`
  }
  return `${Math.round(meters)} m`
}

// 格式化时间，将秒转换为小时:分钟:秒或小时:分钟
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 格式化海拔，将米转换为公里或保持米
export function formatElevation(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`
  }
  return `${Math.round(meters)} m`
}

// 格式化速度，将米/秒转换为公里/小时
export function formatSpeed(metersPerSecond: number): string {
  const kmPerHour = metersPerSecond * 3.6
  return `${kmPerHour.toFixed(1)} km/h`
}

// 格式化日期，显示为YYYY-MM-DD格式
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0] || ''
}
