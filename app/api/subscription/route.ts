import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

// Create a new subscription
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Calculate total price
    let totalPrice = 0;
    if (
      data.plan &&
      Array.isArray(data.mealTypes) &&
      data.mealTypes.length > 0 &&
      Array.isArray(data.deliveryDays) &&
      data.deliveryDays.length > 0
    ) {
      const planPrices: Record<string, number> = {
        diet: 30000,
        protein: 40000,
        royal: 60000,
      };
      const planPrice = planPrices[data.plan] || 0;
      totalPrice = planPrice * data.mealTypes.length * data.deliveryDays.length * 4.3;
    }
    // Only send valid fields to Prisma
    const subscription = await prisma.subscription.create({
      data: {
        name: data.name,
        phone: data.phone,
        plan: data.plan, // fixed field name
        mealTypes: data.mealTypes,
        deliveryDays: data.deliveryDays,
        allergies: data.allergies,
        totalPrice,
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
