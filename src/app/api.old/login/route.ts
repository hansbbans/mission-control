import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { password } = await request.json()
  const correctPassword = process.env.MISSION_CONTROL_PASSWORD || 'admin'
  
  if (password === correctPassword) {
    const response = NextResponse.json({ success: true })
    response.cookies.set('mission-control-pw', password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })
    return response
  }
  
  return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
}
