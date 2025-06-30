import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Type guard for decoded JWT
    const userId = typeof decoded === 'object' && 'id' in decoded ? decoded.id : null;
    if (!userId) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
