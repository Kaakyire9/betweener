import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization") ?? "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) return NextResponse.json({}, { status: 401 });

    const { data: userData, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !userData?.user) return NextResponse.json({}, { status: 401 });

    // Fetch profile from 'profiles' table
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", userData.user.id)
      .single();
    if (!profile) return NextResponse.json({}, { status: 404 });
    return NextResponse.json(profile);
  } catch (err) {
    return NextResponse.json({}, { status: 500 });
  }
}
