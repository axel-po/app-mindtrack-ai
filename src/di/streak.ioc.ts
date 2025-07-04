import {
  createStreakUseCase,
  StreakUseCase,
} from "@/domain/usecases/streak.usecase";

interface StreakContainer {
  streakUseCase: StreakUseCase;
}

export const streakContainer: StreakContainer = {
  streakUseCase: createStreakUseCase(),
};
