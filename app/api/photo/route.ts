import { NextRequest, NextResponse } from 'next/server'

const API_KEY = process.env.GOOGLE_PLACES_API_KEY!

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get('ref')
  if (!ref) return new NextResponse('Missing ref', { status: 400 })

  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${ref}&key=${API_KEY}`

  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) return new NextResponse('Photo not found', { status: 404 })

  const buf = await res.arrayBuffer()
  const contentType = res.headers.get('content-type') ?? 'image/jpeg'

  return new NextResponse(buf, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
