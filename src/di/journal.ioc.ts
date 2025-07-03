import { JournalUseCase } from "@/domain/usecases/journal.usecase";
import { createJournalRepository } from "@/infrastructure/repositories/journal.repository";

class JournalContainer {
  private static instance: JournalContainer;
  private _journalUseCase: JournalUseCase | null = null;

  private constructor() {}

  static getInstance(): JournalContainer {
    if (!JournalContainer.instance) {
      JournalContainer.instance = new JournalContainer();
    }
    return JournalContainer.instance;
  }

  get journalUseCase(): JournalUseCase {
    if (!this._journalUseCase) {
      const repository = createJournalRepository();
      this._journalUseCase = new JournalUseCase(repository);
    }
    return this._journalUseCase;
  }
}

export const journalContainer = JournalContainer.getInstance();
