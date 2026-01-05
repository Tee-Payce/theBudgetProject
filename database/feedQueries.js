import { db } from './db';

export const addFeedExpense = (feed) => {
  db.runSync(
    `INSERT INTO feed
    (batchId, type, quantityKg, pricePerKg, datePurchased, receiptPath)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      feed.batchId,
      feed.type,
      feed.quantityKg,
      feed.pricePerKg,
      feed.datePurchased,
      feed.receiptPath
    ]
  );
};

export const getFeedByBatch = (batchId) => {
  return db.getAllSync(`SELECT * FROM feed WHERE batchId=?`, [batchId]);
};
