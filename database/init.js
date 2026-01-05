// src/database/init.js
import { db } from './db';

export const initDatabase = () => {
  // BATCHES
  db.execSync(`
    CREATE TABLE IF NOT EXISTS batches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      startDate TEXT,
      initialChicks INTEGER,
      chickPrice REAL,
      expectedPricePerBird REAL,
      expectedPricePerKg REAL,
      status TEXT
    );
  `);

  // FEED
  db.execSync(`
    CREATE TABLE IF NOT EXISTS feed (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      batchId INTEGER,
      type TEXT,
      quantityKg REAL,
      pricePerKg REAL,
      datePurchased TEXT,
      receiptPath TEXT
    );
  `);

  // MORTALITY
  db.execSync(`
    CREATE TABLE IF NOT EXISTS mortality (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      batchId INTEGER,
      quantity INTEGER,
      date TEXT,
      reason TEXT
    );
  `);

  // CLIENTS
  db.execSync(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT
    );
  `);

  // SALES
  db.execSync(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      batchId INTEGER,
      clientId INTEGER,
      saleType TEXT,
      quantity REAL,
      price REAL,
      total REAL,
      date TEXT,
      receiptPath TEXT
    );
  `);

  // EXPENSES
  db.execSync(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      batchId INTEGER,
      itemName TEXT NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      notes TEXT
    );
  `);
};
