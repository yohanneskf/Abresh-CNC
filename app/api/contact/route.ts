import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request: Request) {
  try {
    console.log("Contact form submission received");

    const data = await request.json();

    // Validate required fields
    if (
      !data.name ||
      !data.email ||
      !data.phone ||
      !data.projectType ||
      !data.description
    ) {
      console.log("Missing required fields:", {
        name: !data.name,
        email: !data.email,
        phone: !data.phone,
        projectType: !data.projectType,
        description: !data.description,
      });

      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["name", "email", "phone", "projectType", "description"],
        },
        { status: 400 }
      );
    }

    // Handle images from the form
    let files: string[] = [];
    if (data.images && Array.isArray(data.images)) {
      // Filter only valid image data URLs
      files = data.images.filter(
        (img: string) =>
          img &&
          (img.startsWith("data:image/") ||
            img.startsWith("data:application/pdf"))
      );
      console.log(`Received ${files.length} valid file(s)`);
    }

    // Create submission in database
    const submission = await prisma.contactSubmission.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        projectType: data.projectType,
        description: data.description,
        budget: data.budget || "",
        timeline: data.timeline || "",
        files: files, // Store image data URLs
        status: "pending",
        language: data.language || "en",
      },
    });

    console.log("✅ Submission created successfully:", {
      id: submission.id,
      name: submission.name,
      email: submission.email,
      filesCount: files.length,
    });

    // Send success response
    return NextResponse.json(
      {
        success: true,
        message: "Submission received successfully",
        submissionId: submission.id,
        filesCount: files.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating submission:", error);

    return NextResponse.json(
      {
        error: "Error submitting form",
        details: error instanceof Error ? error.message : "Unknown error",
      },
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
