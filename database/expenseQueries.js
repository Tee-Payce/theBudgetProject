import { db } from './db';

export const initializeExpensesTable = () => {
  try {
    db.runSync(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        batchId INTEGER,
        itemName TEXT NOT NULL,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        notes TEXT,
        FOREIGN KEY (batchId) REFERENCES batches (id)
      )
    `);
  } catch (error) {
    console.error('Error creating expenses table:', error);
  }
};

export const addExpense = (batchId, itemName, category, amount, date, notes = '') => {
  try {
    const result = db.runSync(
      'INSERT INTO expenses (batchId, itemName, category, amount, date, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [batchId, itemName, category, amount, date, notes]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error adding expense:', error);
    return null;
  }
};

export const getExpensesByBatch = (batchId) => {
  try {
    return db.getAllSync('SELECT * FROM expenses WHERE batchId = ? ORDER BY date DESC', [batchId]);
  } catch (error) {
    console.error('Error getting expenses:', error);
    return [];
  }
};

export const getTotalExpensesByBatch = (batchId) => {
  try {
    const result = db.getFirstSync('SELECT SUM(amount) as total FROM expenses WHERE batchId = ?', [batchId]);
    return result?.total || 0;
  } catch (error) {
    console.error('Error getting total expenses:', error);
    return 0;
  }
};

export const deleteExpense = (id) => {
  try {
    db.runSync('DELETE FROM expenses WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error('Error deleting expense:', error);
    return false;
  }
};