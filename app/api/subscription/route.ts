import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import DOMPurify from 'isomorphic-dompurify';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Create a new subscription
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Get user from JWT cookie
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    let userId;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = typeof decoded === 'object' && 'id' in decoded ? decoded.id : null;
      if (!userId) throw new Error('Invalid token');
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Backend validation
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
      return NextResponse.json({ error: 'Name is required and must be at least 2 characters.' }, { status: 400 });
    }
    if (!data.phone || typeof data.phone !== 'string' || !/^08\d{8,11}$/.test(data.phone)) {
      return NextResponse.json({ error: 'Phone number is required and must be a valid Indonesian number.' }, { status: 400 });
    }
    if (!data.plan || typeof data.plan !== 'string') {
      return NextResponse.json({ error: 'Plan is required.' }, { status: 400 });
    }
    if (!Array.isArray(data.mealTypes) || data.mealTypes.length === 0) {
      return NextResponse.json({ error: 'At least one meal type is required.' }, { status: 400 });
    }
    if (!Array.isArray(data.deliveryDays) || data.deliveryDays.length === 0) {
      return NextResponse.json({ error: 'At least one delivery day is required.' }, { status: 400 });
    }
    // Sanitize allergies
    const sanitizedAllergies = data.allergies ? DOMPurify.sanitize(data.allergies) : null;
    // Calculate total price
    let totalPrice = 0;
    const planPrices: Record<string, number> = {
      diet: 30000,
      protein: 40000,
      royal: 60000,
    };
    const planPrice = planPrices[data.plan] || 0;
    totalPrice = planPrice * data.mealTypes.length * data.deliveryDays.length * 4.3;
    // Only send valid fields to Prisma
    const subscription = await prisma.subscription.create({
      data: {
        name: data.name.trim(),
        phone: data.phone.trim(),
        plan: data.plan,
        mealTypes: data.mealTypes,
        deliveryDays: data.deliveryDays,
        allergies: sanitizedAllergies,
        totalPrice,
        userId: userId,
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

// Update (pause, resume, cancel) a subscription
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    // Get user from JWT cookie
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    let userId;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = typeof decoded === 'object' && 'id' in decoded ? decoded.id : null;
      if (!userId) throw new Error('Invalid token');
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Validate subscription id
    if (!data.id) {
      return NextResponse.json({ error: 'Subscription id required' }, { status: 400 });
    }
    // Find subscription and check ownership
    const subscription = await prisma.subscription.findUnique({ where: { id: Number(data.id) } });
    if (!subscription || subscription.userId !== userId) {
      return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 });
    }
    // Handle actions
    if (data.action === 'pause') {
      if (!data.pausedFrom || !data.pausedUntil) {
        return NextResponse.json({ error: 'Pause dates required' }, { status: 400 });
      }
      const updated = await prisma.subscription.update({
        where: { id: Number(data.id) },
        data: {
          status: 'paused',
          pausedFrom: data.pausedFrom,
          pausedUntil: data.pausedUntil,
        },
      });
      return NextResponse.json(updated);
    } else if (data.action === 'resume') {
      const updated = await prisma.subscription.update({
        where: { id: Number(data.id) },
        data: {
          status: 'active',
          pausedFrom: null,
          pausedUntil: null,
        },
      });
      return NextResponse.json(updated);
    } else if (data.action === 'cancel') {
      const updated = await prisma.subscription.update({
        where: { id: Number(data.id) },
        data: {
          status: 'cancelled',
          cancelledAt: new Date().toISOString(),
        },
      });
      return NextResponse.json(updated);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Subscription update error:', error);
    return NextResponse.json({ error: 'Failed to update subscription', details: error }, { status: 500 });
  }
}
