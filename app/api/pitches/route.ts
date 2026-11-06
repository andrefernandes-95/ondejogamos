import auth from "@/app/lib/auth";
import { s3 } from "@/app/lib/s3";
import {
  deleteFromPitch,
  getPitchById,
  listPitchesForArea,
  Pitch,
  savePitch,
  SavePitchInput,
  updatePitch,
} from "@/app/services/pitches";
import {
  safeParseFormData,
  safeUpdateParseFormData,
} from "@/app/validations/pitch";
import { apiError } from "@/app/utils/api-error";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const area = url.searchParams.get("area");

  if (!area) {
    return apiError("AREA_REQUIRED", 400);
  }

  try {
    const pitches = await listPitchesForArea(area);
    return Response.json(pitches);
  } catch (error) {
    console.error("Falha ao carregar campos", error);
    return apiError("PITCH_READ_FAILED", 500);
  }
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return apiError("AUTHENTICATION_REQUIRED", 401);
  }

  const createdBy = session.user.id;

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return apiError("INVALID_FORM", 400);
  }

  const validation = safeParseFormData(formData);
  if (!validation.success) {
    return apiError("INVALID_PITCH_DATA", 400, validation.error.issues);
  }

  const { name, area, municipality, maps_url, image } = validation.data;

  const extension = image.name.split(".").pop() || "bin";
  const key = `pitches/${crypto.randomUUID()}.${extension}`;

  const bucket = process.env.S3_BUCKET;
  const publicBucketUrl = process.env.PUBLIC_BUCKET_URL;
  if (!bucket || !publicBucketUrl) {
    console.error(`Configuração S3 incompleta`);
    return apiError("STORAGE_NOT_CONFIGURED", 503);
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

    return apiError("IMAGE_UPLOAD_FAILED", 502);
  }

  const imageUrl = `${process.env.PUBLIC_BUCKET_URL}/${key}`;

  const pitch: SavePitchInput = {
    name,
    area,
    municipality,
    image_url: imageUrl,
    maps_url,
    created_by: createdBy,
  };

  let result: Awaited<ReturnType<typeof savePitch>>;

  try {
    result = await savePitch(pitch);
  } catch (error) {
    console.error("Falha ao guardar o campo", error);
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

    return apiError("PITCH_CREATE_FAILED", 500);
  }

  return Response.json(result, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return apiError("AUTHENTICATION_REQUIRED", 401);
  }

  const createdBy = session.user.id;

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return apiError("INVALID_FORM", 400);
  }

  const existingPitchId = Number(formData.get("id"));
  if (!existingPitchId) {
    return apiError("INVALID_PITCH_DATA", 400);
  }

  const validation = safeUpdateParseFormData(formData);
  if (!validation.success) {
    return apiError("INVALID_PITCH_DATA", 400, validation.error.issues);
  }

  const { name, area, municipality, maps_url, image } = validation.data;

  const requiredPitchId = formData.get("id");
  const existingPitch = await getPitchById(Number(requiredPitchId));

  if (!existingPitch) {
    return apiError("PITCH_NOT_FOUND", 404);
  }

  if (existingPitch.created_by !== createdBy) {
    return apiError("FORBIDDEN", 403);
  }

  let imageUrl = existingPitch.image_url;

  let key;
  let bucket;

  if (image && image instanceof File) {
    const extension = image.name.split(".").pop() || "bin";
    key = `pitches/${crypto.randomUUID()}.${extension}`;

    bucket = process.env.S3_BUCKET;
    const publicBucketUrl = process.env.PUBLIC_BUCKET_URL;
    if (!bucket || !publicBucketUrl) {
      console.error(`Configuração S3 incompleta`);
      return apiError("STORAGE_NOT_CONFIGURED", 503);
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

      return apiError("IMAGE_UPLOAD_FAILED", 502);
    }

    imageUrl = `${process.env.PUBLIC_BUCKET_URL}/${key}`;
  }

  const pitch: Partial<Pitch> = {
    id: existingPitchId,
    name,
    area,
    municipality,
    image_url: imageUrl,
    maps_url,
  };

  let result: Awaited<ReturnType<typeof updatePitch>>;

  try {
    result = await updatePitch(pitch, createdBy);
  } catch (error) {
    console.error(`Falha ao guardar o campo`, error);

    if (image) {
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
    }

    return apiError("PITCH_UPDATE_FAILED", 500);
  }

  return Response.json(result, { status: 200 });
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return apiError("AUTHENTICATION_REQUIRED", 401);
  }

  const loggedUser = session.user.id;

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return apiError("INVALID_FORM", 400);
  }

  const existingPitchId = Number(formData.get("id"));
  if (!existingPitchId) {
    return apiError("INVALID_PITCH_DATA", 400);
  }

  const requiredPitchId = formData.get("id");

  const existingPitch = await getPitchById(Number(requiredPitchId));
  if (!existingPitch) {
    return apiError("PITCH_NOT_FOUND", 404);
  }

  if (existingPitch.created_by !== loggedUser) {
    return apiError("FORBIDDEN", 403);
  }

  try {
    await deleteFromPitch(existingPitch.id.toString(), loggedUser);
  } catch (error) {
    console.error(`Falha ao remover o campo`, error);

    /*
    // TODO: We need to store the key and bucket in the table to remove here

    if (image) {
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
    }*/

    if (
      error instanceof Error &&
      error.message === "PITCH_HAS_ACTIVE_MATCHES"
    ) {
      return apiError("PITCH_HAS_ACTIVE_MATCHES", 409);
    }

    return apiError("PITCH_DELETE_FAILED", 500);
  }

  return Response.json(true, { status: 200 });
}
