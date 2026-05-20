import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { error: 'Use /api/admin/login for portfolio admin authentication.' },
    { status: 404 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: 'Use /api/admin/login for portfolio admin authentication.' },
    { status: 404 }
  );
}
