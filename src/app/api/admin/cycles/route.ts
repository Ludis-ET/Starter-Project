import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { options } from '@/app/api/auth/[...nextauth]/options';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://a2sv-application-platform-backend-team5.onrender.com';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(options);

    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const cycleData = await request.json();

    const response = await fetch(`${BASE_URL}/admin/cycles/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(cycleData),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to create cycle' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Create cycle error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
