import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import DOMPurify from 'isomorphic-dompurify';

const prisma = new PrismaClient();

// Create a new testimonial
export async function POST(req: NextRequest) {
  const data = await req.json();
  // Backend validation
  if (!data.name || typeof data.name !== 'string') {
    return NextResponse.json({ error: 'Name is required and must be at least 2 characters.' }, { status: 400 });
  }
  if (!data.message || typeof data.message !== 'string') {
    return NextResponse.json({ error: 'Message is required and must be at least 5 characters.' }, { status: 400 });
  }
  if (!data.rating || typeof data.rating !== 'number' || data.rating < 1 || data.rating > 5) {
    return NextResponse.json({ error: 'Rating must be a number between 1 and 5.' }, { status: 400 });
  }
  // Sanitize message to prevent XSS
  const sanitizedMessage = DOMPurify.sanitize(data.message);
  const testimonial = await prisma.testimonial.create({
    data: {
      name: data.name.trim(),
      message: sanitizedMessage,
      rating: data.rating,
    },
  });
  return NextResponse.json(testimonial);
}

// Get all testimonials
export async function GET() {
  const testimonials = await prisma.testimonial.findMany();
  return NextResponse.json(testimonials);
}
