export class HabitEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly emoji: string | null
  ) {}

  isValidHabit(): boolean {
    return !!(this.userId && this.name && this.name.length > 0);
  }

  getDisplayName(): string {
    return this.name || "Unnamed Habit";
  }

  getDisplayDescription(): string {
    return this.description || "No description available";
  }

  getDisplayEmoji(): string {
    return this.emoji || "📝";
  }
}
