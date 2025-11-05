import { NextRequest, NextResponse } from 'next/server';
import { getAuthPayload } from '@/lib/auth';

const mockVerificationQueue = [
  { id: 101, projectName: 'Ghana Solar Power Plant', submittedBy: 'EcoSolar Ltd.', status: 'Pending', date: '2023-10-28' },
  { id: 102, projectName: 'Indonesian Peatland Restoration', submittedBy: 'TerraCura Foundation', status: 'Pending', date: '2023-10-27' },
  { id: 103, projectName: 'Chilean Geothermal Project', submittedBy: 'Andes Energy', status: 'Pending', date: '2023-10-25' },
];

export async function GET(req: NextRequest) {
  const payload = getAuthPayload(req);

  if (!payload) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (payload.role !== 'admin' && payload.role !== 'verifier') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json(mockVerificationQueue);
}
