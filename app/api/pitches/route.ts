import auth from "@/app/lib/auth";
import {
  deleteFile,
  isObjectStorageConfigured,
  type StoredPublicFile,
  uploadPublicFile,
} from "@/app/services/object-storage";
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
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return Response.json(
      {
        error: "Inicia a sessão para criar um campo",
      },
      {
        status: 401,
      },
    );
  }

  const createdBy = session.user.id;

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

  if (!isObjectStorageConfigured()) {
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

  let uploadedImage: StoredPublicFile;
  try {
    uploadedImage = await uploadPublicFile({ file: image, storageKey: key });
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

  const pitch: SavePitchInput = {
    name,
    area,
    municipality,
    image_url: uploadedImage.url,
    maps_url,
    created_by: createdBy,
  };

  let result: Awaited<ReturnType<typeof savePitch>>;

  try {
    result = await savePitch(pitch);
  } catch {
    try {
      await deleteFile(key);
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

export async function PUT(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return Response.json(
      {
        error: "Inicia a sessão para editar um campo",
      },
      {
        status: 401,
      },
    );
  }

  const createdBy = session.user.id;

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

  const existingPitchId = Number(formData.get("id"));
  if (!existingPitchId) {
    return Response.json(
      {
        error: "Dados inválidos",
      },
      {
        status: 400,
      },
    );
  }

  const validation = safeUpdateParseFormData(formData);
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

  const requiredPitchId = formData.get("id");
  const existingPitch = await getPitchById(Number(requiredPitchId));

  if (!existingPitch) {
    return Response.json({ error: "Campo não encontrado" }, { status: 404 });
  }

  if (existingPitch.created_by !== createdBy) {
    return Response.json(
      {
        error: "Não autorizado",
      },
      {
        status: 403,
      },
    );
  }

  let imageUrl = existingPitch.image_url;

  let uploadedImageKey: string | null = null;

  if (image && image instanceof File) {
    const extension = image.name.split(".").pop() || "bin";
    uploadedImageKey = `pitches/${crypto.randomUUID()}.${extension}`;

    if (!isObjectStorageConfigured()) {
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
      const uploadedImage = await uploadPublicFile({
        file: image,
        storageKey: uploadedImageKey,
      });
      imageUrl = uploadedImage.url;
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

    if (uploadedImageKey) {
      try {
        await deleteFile(uploadedImageKey);
      } catch (cleanupError) {
        console.error(`Falha ao remover imagem sem registo`, {
          key: uploadedImageKey,
          error: cleanupError,
        });
      }
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

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return Response.json(
      {
        error: "Inicia a sessão para remover um campo",
      },
      {
        status: 401,
      },
    );
  }

  const loggedUser = session.user.id;

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

  const existingPitchId = Number(formData.get("id"));
  if (!existingPitchId) {
    return Response.json(
      {
        error: "Dados inválidos",
      },
      {
        status: 400,
      },
    );
  }

  const requiredPitchId = formData.get("id");

  const existingPitch = await getPitchById(Number(requiredPitchId));
  if (!existingPitch) {
    return Response.json(
      {
        error: "Campo não encontrado",
      },
      {
        status: 400,
      },
    );
  }

  if (existingPitch.created_by !== loggedUser) {
    return Response.json(
      {
        error: "Não autorizado",
      },
      {
        status: 503,
      },
    );
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
      return Response.json(
        {
          error: `Não podes remover um campo com jogos futuros ou em curso`,
        },
        {
          status: 409,
        },
      );
    }

    return Response.json(
      {
        error: `Não foi possível remover o campo`,
      },
      {
        status: 500,
      },
    );
  }

  return Response.json(true, { status: 200 });
}
