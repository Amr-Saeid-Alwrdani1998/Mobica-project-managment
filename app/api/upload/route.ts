import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Item from "@/models/Item";
import formidable from "formidable";
import { readFile, utils } from "xlsx";

// لمنع Next.js من محاولة معالجة البودي
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest): Promise<NextResponse | Response> {
  await connectToDatabase();

  const form = formidable({ uploadDir: "/tmp", keepExtensions: true });

  return new Promise((resolve, reject) => {
    form.parse(req as any, async (err: any, fields: formidable.Fields, files: formidable.Files) => {
      if (err) {
        console.error("Form parse error:", err);
        return reject(new Response("Form parsing error", { status: 500 }));
      }

      const uploadedFile = Array.isArray(files.file) ? files.file[0] : null;

      if (!uploadedFile) {
        return reject(new Response("No file uploaded", { status: 400 }));
      }

      try {
        const workbook = readFile(uploadedFile.filepath);
        const sheetName = workbook.SheetNames[0];
        const jsonData = utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (!jsonData || jsonData.length === 0) {
          return reject(new Response("Excel file is empty", { status: 400 }));
        }

        await Item.insertMany(jsonData);

        resolve(NextResponse.json({
          message: "تم التحميل بنجاح",
          count: jsonData.length,
        }));
      } catch (error) {
        console.error("Processing error:", error);
        reject(new Response("Database error", { status: 500 }));
      }
    });
  });
}
