import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { bootstrapKey, email } = await req.json();

    const expectedBootstrapKey = process.env.SUPER_ADMIN_BOOTSTRAP_KEY;

    if (!expectedBootstrapKey || expectedBootstrapKey.trim().length < 16) {
      return NextResponse.json(
        { error: "Server Configuration Error: SUPER_ADMIN_BOOTSTRAP_KEY not properly configured." },
        { status: 500 }
      );
    }

    if (bootstrapKey !== expectedBootstrapKey) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid bootstrap key." },
        { status: 401 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Bad Request: A valid target email is required." },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // 1. Check if bootstrap already executed
    const { data: bootstrapRecord, error: checkError } = await adminClient
      .from("super_admin_bootstrap")
      .select("initialized, initialized_at")
      .eq("id", 1)
      .single();

    if (checkError) {
      return NextResponse.json(
        { error: `Database Error: Failed to check bootstrap state: ${checkError.message}` },
        { status: 500 }
      );
    }

    if (bootstrapRecord?.initialized) {
      return NextResponse.json(
        {
          error: "System Already Provisioned: Super Admin bootstrap has already been executed.",
          initialized_at: bootstrapRecord.initialized_at,
        },
        { status: 410 } // HTTP 410 Gone
      );
    }

    // 2. Locate user by email in profiles
    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("id, email, role")
      .eq("email", email.trim().toLowerCase())
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: `User Not Found: No profile exists for ${email}. Please register via web UI first.` },
        { status: 404 }
      );
    }

    // 3. Elevate user to super_admin
    const { error: updateError } = await adminClient
      .from("profiles")
      .update({
        role: "super_admin",
        verification_status: "enhanced_accredited",
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (updateError) {
      return NextResponse.json(
        { error: `Update Failed: ${updateError.message}` },
        { status: 500 }
      );
    }

    // 4. Mark bootstrap as permanently completed
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

    await adminClient
      .from("super_admin_bootstrap")
      .update({
        initialized: true,
        initialized_at: new Date().toISOString(),
        initialized_by: ip,
      })
      .eq("id", 1);

    // 5. Log audit trail
    await adminClient.from("audit_logs").insert({
      actor_id: profile.id,
      action: "SUPER_ADMIN_BOOTSTRAP_EXECUTED",
      target_entity: "profiles",
      target_id: profile.id,
      details: { email, ip },
      ip_address: ip,
    });

    return NextResponse.json({
      success: true,
      message: `User ${email} has been securely provisioned as Super Admin. Bootstrap channel is now closed.`,
      user_id: profile.id,
      role: "super_admin",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Unexpected Error: ${error.message}` },
      { status: 500 }
    );
  }
}
