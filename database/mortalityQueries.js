import { db } from './db';

export const recordMortality = (data) => {
  db.runSync(
    `INSERT INTO mortality (batchId, quantity, date, reason)
     VALUES (?, ?, ?, ?)`,
    [data.batchId, data.quantity, data.date, data.reason]
  );
};

export const getMortalityByBatch = (batchId) => {
  const result = db.getFirstSync(
    `SELECT SUM(quantity) as totalDead FROM mortality WHERE batchId=?`,
    [batchId]
  );
  return result?.totalDead || 0;
};
