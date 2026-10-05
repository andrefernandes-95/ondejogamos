import { s3 } from "@/app/lib/s3";
import {
  listPitchesForArea,
  savePitch,
  SavePitchInput,
} from "@/app/services/pitches";
import { safeParseFormData } from "@/app/validations/pitch";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const area = url.searchParams.get("area");

  if (!area) {
    return Response.json({ error: "A área é obrigatória" }, { status: 400 });
  }

  const pitches = await listPitchesForArea(area);
  return Response.json(pitches);
}

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

  const bucket = process.env.S3_BUCKET;
  const publicBucketUrl = process.env.PUBLIC_BUCKET_URL;
  if (!bucket || !publicBucketUrl) {
    console.error(`Configuração S3 incompleta`);

    return Response.json(
      {
        error: "Serviço indisponível",
      },
      {
        status: 503,
      },
    );
  }

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: Buffer.from(await image.arrayBuffer()),
        ContentType: image.type,
      }),
    );
  } catch (error) {
    console.error(`Falha no upload da imagem`, error);

    return Response.json(
      {
        error: "Não foi possível enviar a imagem",
      },
      {
        status: 502,
      },
    );
  }

  const imageUrl = `${process.env.PUBLIC_BUCKET_URL}/${key}`;

  const pitch: SavePitchInput = {
    name,
    area,
    municipality,
    image_url: imageUrl,
    maps_url,
  };

  let result: Awaited<ReturnType<typeof savePitch>>;

  try {
    result = await savePitch(pitch);
  } catch (error) {
    console.error(`Falha ao guardar o campo`, error);

    try {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
      );
    } catch (cleanupError) {
      console.error(`Falha ao remover imagem sem registo`, {
        key,
        error: cleanupError,
      });
    }

    return Response.json(
      {
        error: `Não foi possível guardar o campo`,
      },
      {
        status: 500,
      },
    );
  }

  return Response.json(result, { status: 200 });
}
