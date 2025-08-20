import { NextResponse } from 'next/server';
import { updateApproval } from '@/lib/storage';

export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.reviewId || typeof body.approved !== 'boolean') {
      return NextResponse.json(
        { 
          error: 'Invalid request body',
          details: 'reviewId (string) and approved (boolean) are required'
        },
        { status: 400 }
      );
    }
    
    const { reviewId, approved } = body;
    
    // Validate reviewId format
    if (!reviewId.includes(':')) {
      return NextResponse.json(
        { 
          error: 'Invalid reviewId format',
          details: 'reviewId should be in format "source:id" (e.g., "hostaway:12345")'
        },
        { status: 400 }
      );
    }
    
    // Update approval status
    await updateApproval(reviewId, approved);
    
    return NextResponse.json({
      ok: true,
      reviewId,
      approved,
      message: `Review ${approved ? 'approved' : 'unapproved'} successfully`
    });
    
  } catch (error) {
    console.error('Error in approve API route:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to update approval status',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// Handle batch approval updates
export async function PATCH(request) {
  try {
    const body = await request.json();
    
    if (!Array.isArray(body.updates)) {
      return NextResponse.json(
        { 
          error: 'Invalid request body',
          details: 'updates array is required'
        },
        { status: 400 }
      );
    }
    
    const results = [];
    const errors = [];
    
    for (const update of body.updates) {
      try {
        if (!update.reviewId || typeof update.approved !== 'boolean') {
          errors.push({
            reviewId: update.reviewId || 'unknown',
            error: 'Invalid update format'
          });
          continue;
        }
        
        await updateApproval(update.reviewId, update.approved);
        results.push({
          reviewId: update.reviewId,
          approved: update.approved,
          success: true
        });
      } catch (error) {
        errors.push({
          reviewId: update.reviewId,
          error: error.message
        });
      }
    }
    
    return NextResponse.json({
      ok: true,
      updated: results.length,
      errors: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined
    });
    
  } catch (error) {
    console.error('Error in batch approve API route:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process batch approval updates',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// Add CORS headers for development
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
