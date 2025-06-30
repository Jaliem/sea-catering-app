import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

// Create a new subscription
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Only send valid fields to Prisma
    const subscription = await prisma.subscription.create({
      data: {
        name: data.name,
        phone: data.phone,
        plan: data.plan, // fixed field name
        mealTypes: data.mealTypes,
        deliveryDays: data.deliveryDays,
        allergies: data.allergies,
      },
    });
    return NextResponse.json(subscription);
  } catch (error) {
    console.error('Prisma error:', error);
    return NextResponse.json({ error: 'Failed to create subscription', details: error }, { status: 500 });
  }
}

// Get all subscriptions
export async function GET() {
  const subscriptions = await prisma.subscription.findMany();
  return NextResponse.json(subscriptions);
}
