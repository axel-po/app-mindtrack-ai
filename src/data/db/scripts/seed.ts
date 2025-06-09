#!/usr/bin/env node

import pg from "pg";
import initDotEnv from "./env";

initDotEnv();

const seed = async () => {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Do not use in production");
  }
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
  });

  console.log("⏳ Checking connexion ...");
  console.log(`🗄️  URL : ${process.env.DATABASE_URL}`);

  await client.connect();

  const start = Date.now();

  await client.query(` 
INSERT INTO "user" (email, name, "emailVerified", role, image, visibility)
VALUES
  ('admin@mikecodeur.com', 'Mike Codeur', '2024-09-05', 'admin', 'https://www.gravatar.com/avatar/ed8d664fa6324576c806b9ee59c302c6', 'private'),
  ('user@gmail.com', 'Bob', '2024-09-01', 'user', 'https://randomuser.me/api/portraits/med/men/3.jpg', 'public'),
  ('admin@gmail.com', 'Admin', NULL, 'admin', 'https://randomuser.me/api/portraits/med/men/4.jpg', 'public'),
  ('guest@gmail.com', 'Charlie', '2024-08-15', 'public', 'https://randomuser.me/api/portraits/med/men/5.jpg', 'public'),
  ('user-1@gmail.com', 'Julien', '2024-08-15', 'user', 'https://randomuser.me/api/portraits/med/men/6.jpg', 'public'),
  ('moderator@gmail.com', 'David', '2024-08-20', 'admin', 'https://randomuser.me/api/portraits/med/men/7.jpg', 'public'),
  ('ons@mikecodeur.com', 'Ons', '2024-09-03', 'admin', 'https://randomuser.me/api/portraits/med/women/8.jpg', 'public'),
  ('superadmin@gmail.com', 'Frank', '2024-09-04', 'admin', 'https://randomuser.me/api/portraits/med/men/9.jpg', 'public'),
  ('moderator-2@gmail.com', 'Julie', '2024-09-04', 'admin', 'https://randomuser.me/api/portraits/med/women/10.jpg', 'public'),
  ('redactor-2@gmail.com', 'Grace', '2024-09-02', 'user', 'https://randomuser.me/api/portraits/med/women/11.jpg', 'public');
 `);

  await client.query(`
  INSERT INTO "finance" ("userId", "date", "amount", "label", "category")
    VALUES
      ((SELECT id FROM "user" WHERE email = 'user@gmail.com'), '2023-09-01'::timestamp AT TIME ZONE 'UTC', 100, 'Description 23', 'revenus'),
      ((SELECT id FROM "user" WHERE email = 'user@gmail.com'), '2024-10-01'::timestamp AT TIME ZONE 'UTC', 234, 'Description 24', 'revenus'),
      ((SELECT id FROM "user" WHERE email = 'user@gmail.com'), '2025-11-01'::timestamp AT TIME ZONE 'UTC', 154, 'Description 1', 'dépenses'),
      ((SELECT id FROM "user" WHERE email = 'user@gmail.com'), '2025-09-01'::timestamp AT TIME ZONE 'UTC', 678, 'Description 2', 'revenus'),
      ((SELECT id FROM "user" WHERE email = 'user@gmail.com'), '2025-09-01'::timestamp AT TIME ZONE 'UTC', 333, 'Description 3', 'actifs'),
      ((SELECT id FROM "user" WHERE email = 'user@gmail.com'), '2025-09-01'::timestamp AT TIME ZONE 'UTC', 345, 'Description 4', 'revenus'),
      ((SELECT id FROM "user" WHERE email = 'admin@gmail.com'), '2025-10-01'::timestamp AT TIME ZONE 'UTC', 653, 'admin Description 4', 'revenus'),
      ((SELECT id FROM "user" WHERE email = 'admin@gmail.com'), '2025-09-01'::timestamp AT TIME ZONE 'UTC', 234, 'admin Description 5', 'actifs'),
      ((SELECT id FROM "user" WHERE email = 'admin@gmail.com'), '2025-11-01'::timestamp AT TIME ZONE 'UTC', 456, 'admin Description 6', 'revenus'),
      ((SELECT id FROM "user" WHERE email = 'admin@gmail.com'), '2025-07-01'::timestamp AT TIME ZONE 'UTC', 500, 'admin Description 7', 'actifs'),
      ((SELECT id FROM "user" WHERE email = 'admin@gmail.com'), '2025-06-02'::timestamp AT TIME ZONE 'UTC', 200, 'admin Description 8', 'dépenses');
  `);

  await client.query(`
    INSERT INTO "health" ("userId", "date", "value", "category")
      VALUES
        ((SELECT id FROM "user" WHERE email = 'user@gmail.com'), '2025-01-01'::timestamp AT TIME ZONE 'UTC', 3045, 'calories'),
        ((SELECT id FROM "user" WHERE email = 'user@gmail.com'), '2025-01-02'::timestamp AT TIME ZONE 'UTC', 80, 'poids'),
        ((SELECT id FROM "user" WHERE email = 'user@gmail.com'), '2025-02-03'::timestamp AT TIME ZONE 'UTC', 120, 'temps'),
        ((SELECT id FROM "user" WHERE email = 'admin@gmail.com'), '2024-11-01'::timestamp AT TIME ZONE 'UTC', 1212, 'calories'),
        ((SELECT id FROM "user" WHERE email = 'admin@gmail.com'), '2024-11-01'::timestamp AT TIME ZONE 'UTC', 98, 'poids'),
        ((SELECT id FROM "user" WHERE email = 'admin@gmail.com'), '2024-11-01'::timestamp AT TIME ZONE 'UTC', 120, 'temps'),
        ((SELECT id FROM "user" WHERE email = 'admin@gmail.com'), '2024-11-02'::timestamp AT TIME ZONE 'UTC', 1612, 'calories'),
        ((SELECT id FROM "user" WHERE email = 'admin@gmail.com'), '2024-11-02'::timestamp AT TIME ZONE 'UTC', 99, 'poids'),
        ((SELECT id FROM "user" WHERE email = 'admin@gmail.com'), '2024-11-03'::timestamp AT TIME ZONE 'UTC', 220, 'temps'),
        ((SELECT id FROM "user" WHERE email = 'admin@gmail.com'), '2024-12-03'::timestamp AT TIME ZONE 'UTC', 120, 'temps'),
        ((SELECT id FROM "user" WHERE email = 'admin@gmail.com'), '2025-01-06'::timestamp AT TIME ZONE 'UTC', 2604, 'calories'),
        ((SELECT id FROM "user" WHERE email = 'admin@gmail.com'), '2025-01-06'::timestamp AT TIME ZONE 'UTC', 90, 'poids'),
        ((SELECT id FROM "user" WHERE email = 'admin@gmail.com'), '2025-01-07'::timestamp AT TIME ZONE 'UTC', 180, 'temps'),
        ((SELECT id FROM "user" WHERE email = 'admin@gmail.com'), '2025-01-08'::timestamp AT TIME ZONE 'UTC', 2504, 'calories'),
        ((SELECT id FROM "user" WHERE email = 'admin@gmail.com'), '2025-01-13'::timestamp AT TIME ZONE 'UTC', 90, 'poids'),
        ((SELECT id FROM "user" WHERE email = 'admin@gmail.com'), '2025-01-13'::timestamp AT TIME ZONE 'UTC', 4354, 'calories'),
        ((SELECT id FROM "user" WHERE email = 'admin@gmail.com'), '2025-01-13'::timestamp AT TIME ZONE 'UTC', 120, 'temps'),
        ((SELECT id FROM "user" WHERE email = 'admin@gmail.com'), '2025-01-14'::timestamp AT TIME ZONE 'UTC', 99, 'poids'),
        ((SELECT id FROM "user" WHERE email = 'admin@gmail.com'), '2025-01-14'::timestamp AT TIME ZONE 'UTC', 3354, 'calories'),
        ((SELECT id FROM "user" WHERE email = 'admin@gmail.com'), '2025-01-14'::timestamp AT TIME ZONE 'UTC', 280, 'temps');
    `);

  // Insert habits
  await client.query(`
    INSERT INTO "habit" (id, "userId", name, description)
    VALUES
      (gen_random_uuid(), (SELECT id FROM "user" WHERE email = 'user@gmail.com'), 'Méditation', 'Méditer 10 minutes par jour'),
      (gen_random_uuid(), (SELECT id FROM "user" WHERE email = 'user@gmail.com'), 'Lecture', 'Lire 30 minutes par jour'),
      (gen_random_uuid(), (SELECT id FROM "user" WHERE email = 'user@gmail.com'), 'Sport', 'Faire du sport 3 fois par semaine'),
      (gen_random_uuid(), (SELECT id FROM "user" WHERE email = 'user@gmail.com'), 'Hydratation', 'Boire 2L d''eau par jour'),
      (gen_random_uuid(), (SELECT id FROM "user" WHERE email = 'admin@gmail.com'), 'Yoga', 'Pratiquer le yoga tous les matins'),
      (gen_random_uuid(), (SELECT id FROM "user" WHERE email = 'admin@gmail.com'), 'Journaling', 'Écrire dans son journal intime'),
      (gen_random_uuid(), (SELECT id FROM "user" WHERE email = 'admin@gmail.com'), 'Marcher', 'Faire 10,000 pas par jour'),
      (gen_random_uuid(), (SELECT id FROM "user" WHERE email = 'admin@gmail.com'), 'Coding', 'Coder au moins 1 heure par jour');
  `);

  // Insert entries
  await client.query(`
    INSERT INTO "entry" (id, "userId", date, mood, thought, "createdAt")
    VALUES
      (gen_random_uuid(), (SELECT id FROM "user" WHERE email = 'user@gmail.com'), '2025-01-01', 8, 'Très bonne journée aujourd''hui, plein d''énergie', '2025-01-01 20:00:00'::timestamp AT TIME ZONE 'UTC'),
      (gen_random_uuid(), (SELECT id FROM "user" WHERE email = 'user@gmail.com'), '2025-01-02', 6, 'Journée correcte, un peu fatigué', '2025-01-02 21:00:00'::timestamp AT TIME ZONE 'UTC'),
      (gen_random_uuid(), (SELECT id FROM "user" WHERE email = 'user@gmail.com'), '2025-01-03', 9, 'Super journée productive !', '2025-01-03 22:00:00'::timestamp AT TIME ZONE 'UTC'),
      (gen_random_uuid(), (SELECT id FROM "user" WHERE email = 'user@gmail.com'), '2025-01-04', 4, 'Pas très motivé aujourd''hui', '2025-01-04 21:30:00'::timestamp AT TIME ZONE 'UTC'),
      (gen_random_uuid(), (SELECT id FROM "user" WHERE email = 'admin@gmail.com'), '2025-01-01', 7, 'Journée productive au travail', '2025-01-01 22:15:00'::timestamp AT TIME ZONE 'UTC'),
      (gen_random_uuid(), (SELECT id FROM "user" WHERE email = 'admin@gmail.com'), '2025-01-02', 5, 'Beaucoup de stress aujourd''hui', '2025-01-02 23:00:00'::timestamp AT TIME ZONE 'UTC'),
      (gen_random_uuid(), (SELECT id FROM "user" WHERE email = 'admin@gmail.com'), '2025-01-03', 8, 'Belle journée ensoleillée', '2025-01-03 21:45:00'::timestamp AT TIME ZONE 'UTC'),
      (gen_random_uuid(), (SELECT id FROM "user" WHERE email = 'admin@gmail.com'), '2025-01-04', 9, 'Très inspiré et motivé', '2025-01-04 22:30:00'::timestamp AT TIME ZONE 'UTC');
  `);

  // Insert entry_habit relationships
  await client.query(`
    INSERT INTO "entry_habit" ("entryId", "habitId")
    VALUES
      ((SELECT id FROM "entry" WHERE "userId" = (SELECT id FROM "user" WHERE email = 'user@gmail.com') AND date = '2025-01-01' LIMIT 1),
       (SELECT id FROM "habit" WHERE "userId" = (SELECT id FROM "user" WHERE email = 'user@gmail.com') AND name = 'Méditation' LIMIT 1)),
      
      ((SELECT id FROM "entry" WHERE "userId" = (SELECT id FROM "user" WHERE email = 'user@gmail.com') AND date = '2025-01-01' LIMIT 1),
       (SELECT id FROM "habit" WHERE "userId" = (SELECT id FROM "user" WHERE email = 'user@gmail.com') AND name = 'Lecture' LIMIT 1)),
      
      ((SELECT id FROM "entry" WHERE "userId" = (SELECT id FROM "user" WHERE email = 'user@gmail.com') AND date = '2025-01-02' LIMIT 1),
       (SELECT id FROM "habit" WHERE "userId" = (SELECT id FROM "user" WHERE email = 'user@gmail.com') AND name = 'Hydratation' LIMIT 1)),
      
      ((SELECT id FROM "entry" WHERE "userId" = (SELECT id FROM "user" WHERE email = 'user@gmail.com') AND date = '2025-01-03' LIMIT 1),
       (SELECT id FROM "habit" WHERE "userId" = (SELECT id FROM "user" WHERE email = 'user@gmail.com') AND name = 'Sport' LIMIT 1)),
      
      ((SELECT id FROM "entry" WHERE "userId" = (SELECT id FROM "user" WHERE email = 'user@gmail.com') AND date = '2025-01-03' LIMIT 1),
       (SELECT id FROM "habit" WHERE "userId" = (SELECT id FROM "user" WHERE email = 'user@gmail.com') AND name = 'Méditation' LIMIT 1)),
      
      ((SELECT id FROM "entry" WHERE "userId" = (SELECT id FROM "user" WHERE email = 'admin@gmail.com') AND date = '2025-01-01' LIMIT 1),
       (SELECT id FROM "habit" WHERE "userId" = (SELECT id FROM "user" WHERE email = 'admin@gmail.com') AND name = 'Yoga' LIMIT 1)),
      
      ((SELECT id FROM "entry" WHERE "userId" = (SELECT id FROM "user" WHERE email = 'admin@gmail.com') AND date = '2025-01-01' LIMIT 1),
       (SELECT id FROM "habit" WHERE "userId" = (SELECT id FROM "user" WHERE email = 'admin@gmail.com') AND name = 'Journaling' LIMIT 1)),
      
      ((SELECT id FROM "entry" WHERE "userId" = (SELECT id FROM "user" WHERE email = 'admin@gmail.com') AND date = '2025-01-02' LIMIT 1),
       (SELECT id FROM "habit" WHERE "userId" = (SELECT id FROM "user" WHERE email = 'admin@gmail.com') AND name = 'Marcher' LIMIT 1)),
      
      ((SELECT id FROM "entry" WHERE "userId" = (SELECT id FROM "user" WHERE email = 'admin@gmail.com') AND date = '2025-01-03' LIMIT 1),
       (SELECT id FROM "habit" WHERE "userId" = (SELECT id FROM "user" WHERE email = 'admin@gmail.com') AND name = 'Coding' LIMIT 1)),
      
      ((SELECT id FROM "entry" WHERE "userId" = (SELECT id FROM "user" WHERE email = 'admin@gmail.com') AND date = '2025-01-04' LIMIT 1),
       (SELECT id FROM "habit" WHERE "userId" = (SELECT id FROM "user" WHERE email = 'admin@gmail.com') AND name = 'Yoga' LIMIT 1)),
      
      ((SELECT id FROM "entry" WHERE "userId" = (SELECT id FROM "user" WHERE email = 'admin@gmail.com') AND date = '2025-01-04' LIMIT 1),
       (SELECT id FROM "habit" WHERE "userId" = (SELECT id FROM "user" WHERE email = 'admin@gmail.com') AND name = 'Journaling' LIMIT 1)),
      
      ((SELECT id FROM "entry" WHERE "userId" = (SELECT id FROM "user" WHERE email = 'admin@gmail.com') AND date = '2025-01-04' LIMIT 1),
       (SELECT id FROM "habit" WHERE "userId" = (SELECT id FROM "user" WHERE email = 'admin@gmail.com') AND name = 'Coding' LIMIT 1));
  `);

  const end = Date.now();

  console.log("✅ Seed inserted in", end - start, "ms");

  process.exit(0);
};

export default seed;

(async () => {
  try {
    await seed();
  } catch (error) {
    console.error("❌ Connexion failed");
    console.error(error);
    process.exit(1);
  }
})();
