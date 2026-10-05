import { s3 } from "@/app/lib/s3";
import { Pitch, savePitch } from "@/app/services/pitches";
import { safeParseFormData } from "@/app/validations/pitch";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      {
        error: "Formulário inválido",
      },
      {
        status: 400,
      },
    );
  }

  const validation = safeParseFormData(formData);
  if (!validation.success) {
    return Response.json(
      {
        error: "Dados inválidos",
        issues: validation.error.issues,
      },
      {
        status: 400,
      },
    );
  }

  const { name, area, municipality, maps_url, image } = validation.data;

  const extension = image.name.split(".").pop() || "bin";
  const key = `pitches/${crypto.randomUUID()}.${extension}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      Body: Buffer.from(await image.arrayBuffer()),
      ContentType: image.type,
    }),
  );

  const imageUrl = `${process.env.PUBLIC_BUCKET_URL}/${key}`;

  const pitch: Partial<Pitch> = {
    name,
    area,
    municipality,
    image_url: imageUrl,
    maps_url,
    created_at: Date.now().toString(),
  };

  const result = await savePitch(pitch);

  return Response.json(result, { status: 201 });
}
