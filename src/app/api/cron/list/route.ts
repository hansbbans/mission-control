import { NextRequest, NextResponse } from 'next/server';

// GET /api/cron/list - List scheduled cron jobs from OpenClaw
export async function GET(request: NextRequest) {
  try {
    // Call OpenClaw's cron API
    const openclawUrl = process.env.OPENCLAW_URL || 'http://localhost:6247';
    const response = await fetch(`${openclawUrl}/api/cron/list`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`OpenClaw API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch cron jobs:', error);
    // Return empty list if OpenClaw is not available
    return NextResponse.json({ jobs: [], error: 'OpenClaw not available' });
  }
}
