## Local Instructions

App

```bash
npm i
```

```bash
npm run dev
```

## DB

```bash
docker compose up -d db
```

#### Migrations

```bash
npx dbmate new create_new_table
```

Then

```bash
npx dbmate migrate
```

## Local instructions

```bash
NODE_OPTIONS=--use-system-ca npm run dev
```

To be able to upload files

## Production

1. Run DB Migrations

```bash
npx dbmate migrate
```

2. Seed with location data

```bash
npm run seed-locations
```
