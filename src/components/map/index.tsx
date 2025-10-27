'use client'

import 'mapbox-gl/dist/mapbox-gl.css'
import MapboxLanguage from '@mapbox/mapbox-gl-language'
import mapboxgl from 'mapbox-gl'
import { useLocale } from 'next-intl'
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
  const locale = useLocale()
  const mapRef = useRef<mapboxgl.Map | null>(null)

  const { data: activitiesWithTracks } = api.activities.getWithTracks.useQuery()

  const selectedActivityId = useActivityStore(
    (state) => state.selectedActivityId,
  )

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
      ? 'mapbox://styles/sunguoqi/cm1xkp4hc000i01nthigphlmh'
      : 'mapbox://styles/sunguoqi/cm1xkfhra014901qr0td1a0mz'
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
        const language = locale === 'zh' ? 'zh-Hans' : 'en'
        ref.getMap().addControl(
          new MapboxLanguage({
            defaultLanguage: language,
          }) as unknown as mapboxgl.IControl,
        )
      }
    },
    [locale],
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

  return (
    <MapboxMap
      mapLib={mapboxgl}
      initialViewState={initialViewState}
      style={{ width: '100%', height: '100%' }}
      mapStyle={mapStyle}
      mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      ref={handleMapRef}
      projection={{ name: 'globe' }}
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

      <NavigationControl position='bottom-right' />
      <GeolocateControl position='bottom-right' />
    </MapboxMap>
  )
}
