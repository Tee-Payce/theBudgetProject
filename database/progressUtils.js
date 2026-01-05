export const BATCH_DURATION_DAYS = 42;

export const getBatchProgress = (startDate) => {
  const start = new Date(startDate);
  const today = new Date();

  const daysPassed = Math.floor(
    (today - start) / (1000 * 60 * 60 * 24)
  );

  const progress = Math.min(daysPassed / BATCH_DURATION_DAYS, 1);

  return {
    daysPassed,
    week: Math.min(Math.ceil(daysPassed / 7), 6),
    percentage: Math.round(progress * 100),
    completed: daysPassed >= BATCH_DURATION_DAYS
  };
};

export const getEndDate = (startDate) => {
  const d = new Date(startDate);
  d.setDate(d.getDate() + BATCH_DURATION_DAYS);
  return d.toISOString().split('T')[0];
};

export const isBatchCompleted = (startDate) => {
  const { completed } = getBatchProgress(startDate);
  return completed;
};

