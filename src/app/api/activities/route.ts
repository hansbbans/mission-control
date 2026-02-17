import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { queryAll, run } from '@/lib/db';

export interface Activity {
  id: string;
  type: 'task' | 'message' | 'search' | 'system' | 'error';
  title: string;
  description?: string;
  workspace_id: string;
  metadata?: string;
  created_at: string;
}

// GET /api/activities - List activities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const workspaceId = searchParams.get('workspace_id');
    const limit = parseInt(searchParams.get('limit') || '50');

    let sql = 'SELECT * FROM activities WHERE 1=1';
    const params: unknown[] = [];

    if (type && type !== 'all') {
      sql += ' AND type = ?';
      params.push(type);
    }
    if (workspaceId) {
      sql += ' AND workspace_id = ?';
      params.push(workspaceId);
    }

    sql += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limit);

    const activities = await queryAll<Activity>(sql, params);
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Failed to fetch activities:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}

// POST /api/activities - Create a new activity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, description, workspace_id, metadata } = body;

    if (!type || !title) {
      return NextResponse.json({ error: 'type and title are required' }, { status: 400 });
    }

    const id = uuidv4();
    const sql = `
      INSERT INTO activities (id, type, title, description, workspace_id, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await run(sql, [
      id,
      type,
      title,
      description || null,
      workspace_id || 'default',
      metadata ? JSON.stringify(metadata) : null
    ]);

    const activity: Activity = {
      id,
      type,
      title,
      description,
      workspace_id: workspace_id || 'default',
      metadata,
      created_at: new Date().toISOString()
    };

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error('Failed to create activity:', error);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}
