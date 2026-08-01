import { NextResponse } from 'next/server';
import { analyticsService } from '@/services/analyticsService';

export async function GET() {
  const analytics = await analyticsService.getAnalytics();
  return NextResponse.json(analytics);
}
