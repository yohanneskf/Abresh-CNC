import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter: adapter,
});

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@cncdesign.com" },
    update: {},
    create: {
      email: "admin@cncdesign.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  // Sample projects
  await prisma.project.createMany({
    data: [
      {
        titleEn: "Modern Oak Dining Table",
        titleAm: "ዘመናዊ ኦክ የመግቢያ ጠረጴዛ",
        descriptionEn:
          "Handcrafted solid oak dining table with CNC precision joints",
        descriptionAm: "በእጅ የተሠራ ጠንካራ ኦክ የመግቢያ ጠረጴዛ በCNC ትክክለኛ መገጣጠሚያዎች",
        category: "living",
        materials: ["Solid Oak", "Steel Legs", "Polyurethane Finish"],
        dimensions: { length: "180", width: "90", height: "75", unit: "cm" },
        images: [
          "/projects/dining-table-1.jpg",
          "/projects/dining-table-2.jpg",
        ],
        featured: true,
      },
      {
        titleEn: "Minimalist Bed Frame",
        titleAm: "ሚኒማሊስት የአልጋ ሠንጠረዥ",
        descriptionEn: "CNC-cut minimalist bed frame with integrated lighting",
        descriptionAm: "በCNC የተቆረጠ ሚኒማሊስት የአልጋ ሠንጠረዥ ከተዋሃደ መብራት",
        category: "bedroom",
        materials: ["Birch Plywood", "LED Strips", "Matte Finish"],
        dimensions: { length: "200", width: "180", height: "40", unit: "cm" },
        images: ["/projects/bed-frame-1.jpg"],
        featured: true,
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
