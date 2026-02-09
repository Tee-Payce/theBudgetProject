import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('nexus_finance.db');

export const initDatabase = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      currency TEXT NOT NULL,
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const insertTransaction = (transaction) => {
  const result = db.runSync(
    'INSERT INTO transactions (type, amount, description, category, currency, date) VALUES (?, ?, ?, ?, ?, ?)',
    [transaction.type, transaction.amount, transaction.description, transaction.category, transaction.currency, transaction.date]
  );
  return result.lastInsertRowId;
};

export const getAllTransactions = () => {
  return db.getAllSync('SELECT * FROM transactions ORDER BY created_at DESC');
};

export const deleteTransaction = (id) => {
  db.runSync('DELETE FROM transactions WHERE id = ?', [id]);
};

export const getTransactionsByMonth = (year, month, currency) => {
  return db.getAllSync(
    `SELECT * FROM transactions 
     WHERE strftime('%Y', date) = ? 
     AND strftime('%m', date) = ? 
     AND currency = ?
     ORDER BY date DESC`,
    [year.toString(), month.toString().padStart(2, '0'), currency]
  );
};

export const getYearlyData = (year, currency) => {
  return db.getAllSync(
    `SELECT 
       strftime('%m', date) as month,
       type,
       SUM(amount) as total
     FROM transactions 
     WHERE strftime('%Y', date) = ? AND currency = ?
     GROUP BY strftime('%m', date), type
     ORDER BY month`,
    [year.toString(), currency]
  );
};