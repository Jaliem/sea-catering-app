import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  // Validate input
  if (!name || !email || !password) return NextResponse.json({ error: 'All fields required' }, { status: 400 });
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password)) {
    return NextResponse.json({ error: 'Password too weak' }, { status: 400 });
  }
  // Hash password
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({ data: { name, email, password: hashed } });
    return NextResponse.json({ id: user.id, name: user.name, email: user.email });
  } catch (e) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
  }
}
