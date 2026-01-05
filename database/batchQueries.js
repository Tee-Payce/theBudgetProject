import { db } from './db';

/* CREATE */
export const createBatch = (batch) => {
  const result = db.runSync(
    `INSERT INTO batches
    (name, startDate, initialChicks, chickPrice, expectedPricePerBird, expectedPricePerKg, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      batch.name,
      batch.startDate,
      batch.initialChicks,
      batch.chickPrice,
      batch.expectedPricePerBird,
      batch.expectedPricePerKg,
      'active'
    ]
  );
  return result.lastInsertRowId;
};

/* READ */
export const getAllBatches = () => {
  try {
    return db.getAllSync(`SELECT * FROM batches ORDER BY startDate DESC`);
  } catch (error) {
    console.log('Batches table not found, returning empty array');
    return [];
  }
};

/* UPDATE */
export const updateBatchStatus = (id, status) => {
  db.runSync(`UPDATE batches SET status=? WHERE id=?`, [status, id]);
};

/* DELETE */
export const deleteBatch = (id) => {
  db.runSync(`DELETE FROM batches WHERE id=?`, [id]);
};

/* ADDITIONAL QUERIES */
export const getBatchById = (id) => {
  return db.getFirstSync(`SELECT * FROM batches WHERE id=?`, [id]);
};

export const findBatchesByName = (name) => {
  return db.getAllSync(`SELECT * FROM batches WHERE name LIKE ?`, [`%${name}%`]);
};

export const getActiveBatches = () => {
  return db.getAllSync(`SELECT * FROM batches WHERE status = 'active' ORDER BY startDate DESC`);
};

export const getCompletedBatches = () => {
  return db.getAllSync(`SELECT * FROM batches WHERE status = 'completed' ORDER BY startDate DESC`);
};

export const updateBatchDetails = (batch) => {
  db.runSync(
    `UPDATE batches SET name=?, startDate=?, initialChicks=?, chickPrice=?, expectedPricePerBird=?, expectedPricePerKg=? WHERE id=?`,
    [batch.name, batch.startDate, batch.initialChicks, batch.chickPrice, batch.expectedPricePerBird, batch.expectedPricePerKg, batch.id]
  );
};

export const getBatchCount = () => {
  const result = db.getFirstSync(`SELECT COUNT(*) AS count FROM batches`);
  return result.count;
};

export const getBatchesStartedAfter = (date) => {
  return db.getAllSync(`SELECT * FROM batches WHERE startDate > ? ORDER BY startDate DESC`, [date]);
};

export const getBatchesByStatus = (status) => {
  return db.getAllSync(`SELECT * FROM batches WHERE status = ? ORDER BY startDate DESC`, [status]);
};

export const getTotalInitialChicks = () => {
  const result = db.getFirstSync(`SELECT SUM(initialChicks) AS totalChicks FROM batches`);
  return result.totalChicks || 0;
};

