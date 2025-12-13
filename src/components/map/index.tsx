'use client'

import 'mapbox-gl/dist/mapbox-gl.css'
import MapboxLanguage from '@mapbox/mapbox-gl-language'
import mapboxgl from 'mapbox-gl'

import { useTheme } from 'next-themes'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import {
  GeolocateControl,
  Layer,
  Map as MapboxMap,
  type MapRef,
  NavigationControl,
  Source,
} from 'react-map-gl/mapbox'
import { env } from '@/env'
import { useActivityStore } from '@/stores/use-activity-store'

import { api } from '@/trpc/react'
import type { GPXData, GPXPoint, GPXSegment, GPXTrack } from '@/types/map'

export function CycMap() {
  const { resolvedTheme } = useTheme()
  const mapRef = useRef<mapboxgl.Map | null>(null)

  const selectedActivityId = useActivityStore(
    (state) => state.selectedActivityId,
  )
  const selectedYear = useActivityStore(
    (state) => state.selectedYear,
  )

  const { data: activitiesWithTracks, isLoading, isError } = api.activities.getWithTracks.useQuery({
    year: selectedYear || undefined,
  })

  const { trackFeatures, startPoint, endPoint } = useMemo<{
    trackFeatures: GeoJSON.Feature[]
    startPoint: GPXPoint | null
    endPoint: GPXPoint | null
  }>(() => {
    if (!activitiesWithTracks)
      return { trackFeatures: [], startPoint: null, endPoint: null }

    const features: GeoJSON.Feature[] = []
    let firstPoint: GPXPoint | undefined
    let lastPoint: GPXPoint | undefined

    activitiesWithTracks.forEach((activity) => {
      if (selectedActivityId && activity.id !== selectedActivityId) return

      if (!activity.track?.GPXData) return

      try {
        const gpxData: GPXData =
          typeof activity.track.GPXData === 'string'
            ? JSON.parse(activity.track.GPXData)
            : activity.track.GPXData

        if (gpxData?.tracks) {
          gpxData.tracks.forEach((track: GPXTrack) => {
            track.segments?.forEach((segment: GPXSegment) => {
              const coordinates = segment.points
                ?.filter((p: GPXPoint) => p.latitude && p.longitude)
                .map((p: GPXPoint) => [p.longitude, p.latitude])

              if (coordinates && coordinates.length > 0) {
                features.push({
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    coordinates,
                  },
                  properties: {
                    id: activity.id,
                    name: activity.name || 'Activity',
                  },
                })

                if (selectedActivityId && segment.points.length > 0) {
                  const first = segment.points[0]
                  const last = segment.points[segment.points.length - 1]
                  if (first) firstPoint = first
                  if (last) lastPoint = last
                }
              }
            })
          })
        }
      } catch (error) {
        console.error('Error parsing track data:', error)
      }
    })

    return {
      trackFeatures: features,
      startPoint: firstPoint || null,
      endPoint: lastPoint || null,
    }
  }, [activitiesWithTracks, selectedActivityId])

  const markerPoints = useMemo(() => {
    if (
      !startPoint ||
      !endPoint ||
      !startPoint.longitude ||
      !startPoint.latitude ||
      !endPoint.longitude ||
      !endPoint.latitude
    )
      return []

    return [
      {
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [startPoint.longitude, startPoint.latitude],
        },
        properties: { type: 'start' },
      },
      {
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [endPoint.longitude, endPoint.latitude],
        },
        properties: { type: 'end' },
      },
    ]
  }, [startPoint, endPoint])

  const markersData: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: markerPoints,
  } as GeoJSON.FeatureCollection

  const tracksData: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: trackFeatures,
  }

  const mapStyle = useMemo(() => {
    return resolvedTheme === 'dark'
      ? 'mapbox://styles/mapbox/dark-v11' // 使用Mapbox默认的深色样式
      : 'mapbox://styles/mapbox/light-v11' // 使用Mapbox默认的浅色样式
  }, [resolvedTheme])

  const trackColor = useMemo(() => {
    return resolvedTheme === 'dark' ? '#ffff00' : '#0066ff'
  }, [resolvedTheme])

  const initialViewState = useMemo(
    () => ({
      longitude: 116.38,
      latitude: 39.9,
      zoom: 2,
      pitch: 0,
      bearing: 0,
    }),
    [],
  )

  const handleMapRef = useCallback(
    (ref: MapRef | null) => {
      if (ref) {
        mapRef.current = ref.getMap()
        const language = 'zh-Hans' // 固定使用中文
        ref.getMap().addControl(
          new MapboxLanguage({
            defaultLanguage: language,
          }) as unknown as mapboxgl.IControl,
        )
      }
    },
    [],
  )

  // Fly to track bounds when map reference is ready and activity is selected
  useEffect(() => {
    if (!mapRef.current || !selectedActivityId || trackFeatures.length === 0)
      return

    const map = mapRef.current

    let bounds: mapboxgl.LngLatBounds | null = null

    trackFeatures.forEach((feature) => {
      if (feature.geometry.type === 'LineString') {
        const coords = feature.geometry.coordinates
        coords.forEach((coord) => {
          if (Array.isArray(coord) && coord.length >= 2) {
            const lng = coord[0]
            const lat = coord[1]
            if (typeof lng === 'number' && typeof lat === 'number') {
              if (!bounds) {
                bounds = new mapboxgl.LngLatBounds([lng, lat], [lng, lat])
              } else {
                bounds.extend([lng, lat])
              }
            }
          }
        })
      }
    })

    if (bounds) {
      map.fitBounds(bounds, {
        padding: 50,
        duration: 1000,
      })
    }
  }, [selectedActivityId, trackFeatures])

  // Fit all tracks on map load when no specific activity is selected
  useEffect(() => {
    if (!mapRef.current || selectedActivityId || trackFeatures.length === 0)
      return

    const map = mapRef.current

    let bounds: mapboxgl.LngLatBounds | null = null

    trackFeatures.forEach((feature) => {
      if (feature.geometry.type === 'LineString') {
        const coords = feature.geometry.coordinates
        coords.forEach((coord) => {
          if (Array.isArray(coord) && coord.length >= 2) {
            const lng = coord[0]
            const lat = coord[1]
            if (typeof lng === 'number' && typeof lat === 'number') {
              if (!bounds) {
                bounds = new mapboxgl.LngLatBounds([lng, lat], [lng, lat])
              } else {
                bounds.extend([lng, lat])
              }
            }
          }
        })
      }
    })

    if (bounds) {
      map.fitBounds(bounds, {
        padding: 50,
        duration: 1000,
      })
    }
  }, [selectedActivityId, trackFeatures])

  // 添加更好的加载状态处理
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-card/80">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-muted-foreground">
            加载地图数据中...
          </p>
        </div>
      </div>
    )
  }

  // 添加更好的错误状态处理
  if (isError) {
    return (
      <div className="flex h-full items-center justify-center bg-card/80">
        <div className="flex flex-col items-center gap-4 p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <span className="text-destructive text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-destructive">加载地图数据失败</h3>
          <p className="text-muted-foreground max-w-md">
            无法加载您的骑行轨迹数据，请检查网络连接后重试。
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <MapboxMap
        mapLib={mapboxgl}
        initialViewState={initialViewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        ref={handleMapRef}
        projection={{ name: 'globe' }}
        attributionControl={false}
      >
      {trackFeatures.length > 0 && (
        <Source
          id='tracks'
          type='geojson'
          data={tracksData}
        >
          <Layer
            id='tracks-line'
            type='line'
            paint={{
              'line-color': trackColor,
              'line-width': 2,
              'line-dasharray': [2, 2],
            }}
          />
        </Source>
      )}

      {markerPoints.length > 0 && (
        <Source
          id='markers'
          type='geojson'
          data={markersData}
        >
          <Layer
            id='start-marker-circle'
            type='circle'
            filter={['==', ['get', 'type'], 'start']}
            paint={{
              'circle-color': '#00ff00',
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                8,
                4,
                16,
                8,
                20,
                16,
              ],
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff',
            }}
          />
          <Layer
            id='start-marker-symbol'
            type='symbol'
            filter={['==', ['get', 'type'], 'start']}
            layout={{
              'text-field': '🏁',
              'text-size': [
                'interpolate',
                ['linear'],
                ['zoom'],
                8,
                12,
                16,
                16,
                20,
                24,
              ],
              'text-allow-overlap': true,
              'text-ignore-placement': true,
            }}
          />
          <Layer
            id='end-marker-circle'
            type='circle'
            filter={['==', ['get', 'type'], 'end']}
            paint={{
              'circle-color': '#ff0000',
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                8,
                4,
                16,
                8,
                20,
                16,
              ],
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff',
            }}
          />
          <Layer
            id='end-marker-symbol'
            type='symbol'
            filter={['==', ['get', 'type'], 'end']}
            layout={{
              'text-field': '🏁',
              'text-size': [
                'interpolate',
                ['linear'],
                ['zoom'],
                8,
                12,
                16,
                16,
                20,
                24,
              ],
              'text-allow-overlap': true,
              'text-ignore-placement': true,
            }}
          />
        </Source>
      )}

      {/* 自定义导航控件 */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-3">
        <NavigationControl 
          position="top-right" 
          showCompass={false}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
        />
        <GeolocateControl 
          position="top-right"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
        />
      </div>
      
      {/* 自定义地图属性 */}
      <div className="absolute bottom-4 left-4 text-xs text-white/80 bg-black/40 px-2 py-1 rounded">
        © Mapbox © OpenStreetMap
      </div>
    </MapboxMap>
    </>
  )
}
