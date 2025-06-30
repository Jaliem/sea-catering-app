import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Create a new testimonial
export async function POST(req: NextRequest) {
  const data = await req.json();
  const testimonial = await prisma.testimonial.create({ data });
  return NextResponse.json(testimonial);
}

// Get all testimonials
export async function GET() {
  const testimonials = await prisma.testimonial.findMany();
  return NextResponse.json(testimonials);
}
