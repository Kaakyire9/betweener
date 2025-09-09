// src/app/api/create-profile/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 401 });

    // Verify token and fetch user from Supabase
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !userData?.user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const u = userData.user;
    // upsert into Prisma using Supabase user id (u.id)
    const user = await prisma.user.upsert({
      where: { id: u.id },
      create: {
        id: u.id,
        email: u.email ?? null,
        name: (u.user_metadata as any)?.full_name ?? null,
      },
      update: {
        email: u.email ?? undefined,
        name: (u.user_metadata as any)?.full_name ?? undefined,
      },
    });

    return NextResponse.json({ ok: true, user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
