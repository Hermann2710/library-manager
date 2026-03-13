import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public/uploads");

    // Créer le dossier s'il n'existe pas
    await mkdir(uploadDir, { recursive: true });

    // Nettoyer le nom du fichier pour éviter les conflits/caractères spéciaux
    const filename = `${Date.now()}-${file.name.replaceAll(" ", "_")}`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    // Retourner l'URL publique
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 });
  }
}