SELECT 
  m.id,
  m.starts_at,
  m.format,
  m.description,

  -- Build attendance array with user details --
  COALESCE(
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'user_id', u.id,
          'user_name', u.name,
          'created_at', a.created_at
        )
      )
      FROM attendance AS a
      JOIN "user" AS u ON a.user_id = u.id
      WHERE a.match_id = m.id
    ),
    '[]'::jsonb
  ) AS attendances,

  -- Is current user attending ? --
  EXISTS(
    SELECT 1
    FROM attendance AS a
    WHERE a.match_id = m.id
      AND a.user_id = $2
  ) AS is_attending

FROM matches AS m
JOIN pitches AS p on p.id = m.pitch_id
WHERE p.area = $1
ORDER BY m.starts_at, m.id;
