import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 1. Validate required fields
    const required = ["name", "email", "phone", "projectType", "description"];
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing: ${field}` },
          { status: 400 }
        );
      }
    }

    // 2. Sort Incoming Files/Images
    const images: string[] = [];
    const documents: string[] = [];

    if (data.files && Array.isArray(data.files)) {
      data.files.forEach((file: string) => {
        if (file.startsWith("data:image/")) {
          images.push(file);
        } else {
          documents.push(file);
        }
      });
    }

    // 3. Create Submission with Amber System mapping
    const submission = await prisma.contactSubmission.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        projectType: data.projectType,
        description: data.description,
        budget: data.budget || "TBD",
        timeline: data.timeline || "Standard",
        images: images, // Saved to new images field
        files: documents, // Saved to files field
        status: "pending",
        language: data.language || "en",
      },
    });

    return NextResponse.json(
      {
        success: true,
        id: submission.id,
        msg: "DATA_PACKET_RECEIVED", // Keeping the industrial theme
      },
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
// Also add GET method for testing
export async function GET() {
  return NextResponse.json({
    message: "Contact API is working",
    status: "active",
    instructions: {
      POST: "Submit contact form with JSON data",
      required_fields: ["name", "email", "phone", "projectType", "description"],
      optional_fields: ["budget", "timeline", "images", "language"],
    },
  });
}
