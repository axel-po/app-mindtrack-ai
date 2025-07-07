import db from "../client";
import { habits } from "../schemas/habits.schema";
import { entries } from "../schemas/entries.schema";
import { entryHabits } from "../schemas/entryHabits.schema";
import { user } from "../schemas/user.schema";

// Sample data for habits
const habitData = [
  {
    name: "Méditation",
    description: "Méditer 10 minutes par jour",
    emoji: "🧘",
  },
  {
    name: "Exercice",
    description: "Faire du sport ou de l'exercice",
    emoji: "🏃",
  },
  {
    name: "Lecture",
    description: "Lire au moins 15 minutes",
    emoji: "📚",
  },
];

// Sample thoughts for journal entries
const sampleThoughts = [
  "Excellente journée aujourd'hui, très productive",
  "Je me sens un peu fatigué mais satisfait",
  "Belle journée ensoleillée, ça fait du bien",
  "Réunion importante au travail, plutôt stressante",
  "Weekend relaxant avec la famille",
  "Nouvelle découverte culinaire aujourd'hui",
  "Journée pluvieuse mais cosy à la maison",
  "Accomplissement personnel, fier de moi",
  "Moment difficile mais j'ai persévéré",
  "Bonne soirée entre amis",
  "Apprentissage d'une nouvelle compétence",
  "Balade en nature très ressourçante",
  "Journée chargée mais enrichissante",
  "Petit moment de solitude apprécié",
  "Challenge relevé avec succès",
  "Temps de qualité avec mes proches",
  "Découverte d'un nouveau lieu inspirant",
  "Réflexion profonde sur mes objectifs",
  "Moment de gratitude pour ce que j'ai",
  "Énergie positive contagieuse aujourd'hui",
  "Séance de yoga matinale très relaxante",
  "Conversation inspirante avec un mentor",
  "Projet créatif avancé aujourd'hui",
  "Moment de méditation profonde",
  "Sortie culturelle enrichissante",
  "Cours en ligne passionnant terminé",
  "Aide apportée à une personne dans le besoin",
  "Recette maison réussie pour la première fois",
  "Appel téléphonique réconfortant avec un ami",
  "Promenade matinale revigorante",
  "Séance de jardinage thérapeutique",
  "Film documentaire captivant regardé",
  "Atelier créatif très stimulant",
  "Moment de lecture captivante",
  "Découverte d'un café cosy en ville",
  "Session de brainstorming productive",
  "Exercice de respiration apaisant",
  "Visite de musée culturellement enrichissante",
  "Préparation d'un cadeau fait main",
  "Observation des étoiles contemplative",
  "Randonnée en montagne ressourçante",
  "Séance de photographie créative",
  "Cours de danse amusant et énergisant",
  "Moment de journaling introspectif",
  "Préparation d'un repas healthy",
  "Écoute de podcast inspirant",
  "Séance de stretching relaxante",
  "Temps passé avec mon animal de compagnie",
  "Réorganisation de mon espace de travail",
  "Planification de mes objectifs futurs",
];

const moods = ["good", "neutral", "sad"] as const;

// Generate unique dates for the last 50 days
function generateUniqueDates(): string[] {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 50; i++) {
    const pastDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    dates.push(pastDate.toISOString().split("T")[0]);
  }

  return dates;
}

// Get random mood
function getRandomMood() {
  return moods[Math.floor(Math.random() * moods.length)];
}

async function seed() {
  try {
    console.log("🌱 Starting seed process...");

    // Get existing user (first user found)
    console.log("📤 Fetching existing user...");
    const existingUsers = await db.select().from(user).limit(1);

    if (existingUsers.length === 0) {
      throw new Error("No existing user found. Please create a user first.");
    }

    const existingUser = existingUsers[0];
    console.log(`✅ Using user: ${existingUser.name} (${existingUser.email})`);

    // Create 3 habits
    console.log("🏃 Creating habits...");
    const createdHabits = [];

    for (const habit of habitData) {
      const [createdHabit] = await db
        .insert(habits)
        .values({
          userId: existingUser.id,
          name: habit.name,
          description: habit.description,
          emoji: habit.emoji,
        })
        .returning();

      createdHabits.push(createdHabit);
      console.log(`  ✅ Created habit: ${habit.name} ${habit.emoji}`);
    }

    // Generate unique dates
    const uniqueDates = generateUniqueDates();

    // Create 50 journal entries
    console.log("📔 Creating journal entries...");
    const createdEntries = [];

    for (let i = 0; i < 50; i++) {
      const [createdEntry] = await db
        .insert(entries)
        .values({
          userId: existingUser.id,
          date: uniqueDates[i],
          mood: getRandomMood(),
          thought: sampleThoughts[i], // Use unique thought for each entry
        })
        .returning();

      createdEntries.push(createdEntry);

      // Randomly associate some habits with this entry (0 to 3 habits)
      const numHabitsToAssociate = Math.floor(Math.random() * 4); // 0, 1, 2, or 3
      const shuffledHabits = [...createdHabits].sort(() => Math.random() - 0.5);
      const habitsToAssociate = shuffledHabits.slice(0, numHabitsToAssociate);

      for (const habit of habitsToAssociate) {
        await db.insert(entryHabits).values({
          entryId: createdEntry.id,
          habitId: habit.id,
        });
      }

      if (i % 10 === 9) {
        console.log(`  ✅ Created ${i + 1}/50 entries...`);
      }
    }

    console.log("🎉 Seed completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`  - User: ${existingUser.name}`);
    console.log(`  - Habits created: ${createdHabits.length}`);
    console.log(`  - Journal entries created: ${createdEntries.length}`);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log("✅ Seeding process completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });
