import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "FETCH_FAILED" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Ensure dimensions are handled as a structured object
    const project = await prisma.project.create({
      data: {
        titleEn: body.titleEn,
        titleAm: body.titleAm,
        descriptionEn: body.descriptionEn,
        descriptionAm: body.descriptionAm,
        category: body.category,
        materials: body.materials,
        dimensions: body.dimensions, // Stored as JSON in Prisma
        images: body.images, // Array of EdgeStore URLs
        featured: Boolean(body.featured),
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("DB_WRITE_ERROR:", error);
    return NextResponse.json(
      { error: "DATABASE_INJECTION_FAILED" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json({ error: "ID_REQUIRED" }, { status: 400 });

    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ message: "ENTRY_DELETED" });
  } catch (error) {
    return NextResponse.json({ error: "ERASURE_FAILED" }, { status: 500 });
  }
}
