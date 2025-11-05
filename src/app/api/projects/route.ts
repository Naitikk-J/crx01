import { NextRequest, NextResponse } from 'next/server';
import { getAuthPayload } from '@/lib/auth';

const mockProjects = [
  { id: 1, name: 'Amazon Rainforest Conservation', tons: 15000, pricePerTon: 18, type: 'Reforestation', location: 'Brazil' },
  { id: 2, name: 'Gujarat Wind Farm', tons: 50000, pricePerTon: 25, type: 'Renewable Energy', location: 'India' },
  { id: 3, name: 'Siberian Tundra Methane Capture', tons: 22000, pricePerTon: 22, type: 'Methane Capture', location: 'Russia' },
  { id: 4, name: 'Kenya Cookstove Initiative', tons: 5000, pricePerTon: 15, type: 'Community Project', location: 'Kenya' },
];

export async function GET(req: NextRequest) {
  const payload = getAuthPayload(req);

  if (!payload) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(mockProjects);
}
