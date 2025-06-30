import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"
import DOMPurify from "isomorphic-dompurify"

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || "changeme"

async function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  if (!token) return null
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const userId = typeof decoded === "object" && "id" in decoded ? decoded.id : null
    if (!userId) return null
    const user = await prisma.user.findUnique({ where: { id: userId } })
    return user
  } catch {
    return null
  }
}

export async function PUT(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await req.json()
    // Sanitize and validate input
    const name = DOMPurify.sanitize(body.name || "")
    const phone = DOMPurify.sanitize(body.phone || "")
    const address = DOMPurify.sanitize(body.address || "")
    const dateOfBirth = body.dateOfBirth || null
    const preferences = body.preferences ? {
      dietaryRestrictions: DOMPurify.sanitize(body.preferences.dietaryRestrictions || ""),
      allergies: DOMPurify.sanitize(body.preferences.allergies || ""),
      favoriteFood: DOMPurify.sanitize(body.preferences.favoriteFood || ""),
    } : undefined

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        phone,
        address,
        dateOfBirth,
        preferences,
      },
    })
    // Exclude sensitive fields
    const { password, ...safeUser } = updated
    return NextResponse.json(safeUser)
  } catch (err) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  // Exclude sensitive fields
  const { password, ...safeUser } = user
  return NextResponse.json(safeUser)
}
