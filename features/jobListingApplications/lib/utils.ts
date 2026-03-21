import { ApplicationStageEnum } from "@/drizzle/schema";

export const sortApplicationsByStage = (
  a: ApplicationStageEnum,
  b: ApplicationStageEnum,
): number => {
  return APPLICATION_STAGE_SORT_ORDER[a] - APPLICATION_STAGE_SORT_ORDER[b];
};

const APPLICATION_STAGE_SORT_ORDER: Record<ApplicationStageEnum, number> = {
  applied: 0,
  interested: 1,
  interviewed: 2,
  hired: 3,
  denied: 4,
};
