'use client'

import 'mapbox-gl/dist/mapbox-gl.css'
import MapboxLanguage from '@mapbox/mapbox-gl-language'
import mapboxgl from 'mapbox-gl'
import { useLocale } from 'next-intl'
import { useTheme } from 'next-themes'
import { useCallback, useMemo, useRef } from 'react'
import {
  GeolocateControl,
  Map as MapboxMap,
  type MapRef,
  NavigationControl,
} from 'react-map-gl/mapbox'
import { env } from '@/env'

export function CycMap() {
  const { resolvedTheme } = useTheme()
  const locale = useLocale()
  const mapRef = useRef<mapboxgl.Map | null>(null)

  const mapStyle = useMemo(() => {
    return resolvedTheme === 'dark'
      ? 'mapbox://styles/sunguoqi/cm1xkp4hc000i01nthigphlmh'
      : 'mapbox://styles/sunguoqi/cm1xkfhra014901qr0td1a0mz'
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
      <NavigationControl position='bottom-right' />
      <GeolocateControl position='bottom-right' />
    </MapboxMap>
  )
}
