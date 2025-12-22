import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { jwtVerify } from "jose";

async function verifyAdmin(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;

  const token = authHeader.split(" ")[1];
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

// --- 1. POST: Handle Client Submissions ---
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    const required = ["name", "email", "phone", "projectType", "description"];
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing technical parameter: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create Submission with EdgeStore URLs (sent from frontend)
    const submission = await prisma.contactSubmission.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        projectType: data.projectType,
        description: data.description,
        budget: data.budget || "TBD",
        timeline: data.timeline || "Standard",
        images: data.images || [], // EdgeStore URLs
        files: data.files || [], // EdgeStore URLs
        status: "pending",
        language: data.language || "en",
      },
    });

    return NextResponse.json(
      { success: true, id: submission.id, msg: "DATA_PACKET_RECEIVED" },
      { status: 201 }
    );
  } catch (error) {
    console.error("CRITICAL_DB_ERROR:", error);
    return NextResponse.json(
      { error: "INTERNAL_SYS_FAILURE" },
      { status: 500 }
    );
  }
}

// --- 2. GET: Handle Admin Dashboard Fetching ---
export async function GET(request: Request) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "UNAUTHORIZED_ACCESS" }, { status: 401 });
  }

  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(submissions);
  } catch (error) {
    return NextResponse.json({ error: "FETCH_FAILURE" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "UNAUTHORIZED_ACCESS" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json({ error: "ID_REQUIRED" }, { status: 400 });

    await prisma.contactSubmission.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true, msg: "ENTRY_PURGED" });
  } catch (error) {
    return NextResponse.json({ error: "DELETE_FAILURE" }, { status: 500 });
  }
}
