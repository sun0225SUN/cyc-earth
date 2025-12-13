export interface GPXPoint {
  latitude: number
  longitude: number
  elevation?: number
  time?: string
}

export interface GPXSegment {
  points: GPXPoint[]
}

export interface GPXTrack {
  name?: string
  segments?: GPXSegment[]
}

export interface GPXData {
  tracks?: GPXTrack[]
}
