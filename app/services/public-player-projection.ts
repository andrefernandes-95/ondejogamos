export function publicPlayerIdentity(user: string, profile: string) {
  return `
  jsonb_build_object(
    'name', ${user}.name,
    'publicSlug', ${profile}.public_slug,
    'hasPublicPhoto', COALESCE(
      ${profile}.avatar_storage_key IS NOT NULL AND 'photo' = ANY(${profile}.visible_fields),
      false
    )
  )`;
}
