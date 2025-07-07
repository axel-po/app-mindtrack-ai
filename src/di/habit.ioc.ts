import { HabitUseCase } from "@/domain/usecases/habit.usecase";
import { createHabitRepository } from "@/infrastructure/repositories/habits.repository";

class HabitContainer {
  private static instance: HabitContainer;
  private _habitUseCase: HabitUseCase | null = null;

  private constructor() {}

  static getInstance(): HabitContainer {
    if (!HabitContainer.instance) {
      HabitContainer.instance = new HabitContainer();
    }
    return HabitContainer.instance;
  }

  get habitUseCase(): HabitUseCase {
    if (!this._habitUseCase) {
      const repository = createHabitRepository();
      this._habitUseCase = new HabitUseCase(repository);
    }
    return this._habitUseCase;
  }
}

export const habitContainer = HabitContainer.getInstance();
