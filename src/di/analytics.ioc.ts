import { JournalRepositoryImpl } from "@/infrastructure/repositories/journal.repository";
import { AnalyticsUseCase } from "@/domain/usecases/analytics.usecase";

export const createAnalyticsUseCase = (): AnalyticsUseCase => {
  const journalRepository = new JournalRepositoryImpl();
  return new AnalyticsUseCase(journalRepository);
};
