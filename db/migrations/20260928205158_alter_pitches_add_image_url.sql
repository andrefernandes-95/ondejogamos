-- migrate:up
alter table pitches add column image_url text;

-- migrate:down
alter table pitches drop column image_url;
