import { NextResponse } from 'next/server';
import { approvalService } from '@/services/approvalService';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { responseType, customInput, approvalId } = body;

    await approvalService.respondToApproval(approvalId || id, responseType || 'approve', customInput);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
