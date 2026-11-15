export function publicPlayerIdentity(user: string, profile: string) {
  return `
  jsonb_build_object(
    'name', ${user}.name,
    'publicUsername', CASE WHEN ${profile}.published THEN ${profile}.username END,
    'hasPublicPhoto', COALESCE(
      ${profile}.published AND ${profile}.username IS NOT NULL
      AND ${profile}.avatar_storage_key IS NOT NULL AND 'photo' = ANY(${profile}.visible_fields),
      false
    )
  )`;
}
