import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const listingsPath = path.join(process.cwd(), 'data', 'listings.json');
    const data = await fs.readFile(listingsPath, 'utf8');
    const listings = JSON.parse(data);
    
    return NextResponse.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch listings',
        details: error.message
      },
      { status: 500 }
    );
  }
}
