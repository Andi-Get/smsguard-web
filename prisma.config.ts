import { config } from "dotenv";
import { definePrismaConfig } from "@prisma/cli-engine";
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";

// Next.js keeps local secrets in .env.local; fall back to .env for CI.
config({ path: [".env.local", ".env"] });

export default definePrismaConfig({
  orm: ormConfig({
    contract: "./prisma/contract.prisma",
    db: { connection: process.env["DATABASE_URL"]! },
  }),
});
