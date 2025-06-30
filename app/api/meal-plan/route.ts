import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Create a new meal plan
export async function POST(req: NextRequest) {
  const data = await req.json();
  const mealPlan = await prisma.mealPlan.create({ data });
  return NextResponse.json(mealPlan);
}

// Get all meal plans
export async function GET() {
  const mealPlans = await prisma.mealPlan.findMany();
  return NextResponse.json(mealPlans);
}
