import { db } from './db';

export const addSale = (sale) => {
  db.runSync(
    `INSERT INTO sales
    (batchId, clientId, saleType, quantity, price, total, date, receiptPath)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      sale.batchId,
      sale.clientId,
      sale.saleType,
      sale.quantity,
      sale.price,
      sale.total,
      sale.date,
      sale.receiptPath
    ]
  );
};

export const getSalesByBatch = (batchId) => {
  const result = db.getFirstSync(
    `SELECT SUM(total) as revenue FROM sales WHERE batchId=?`,
    [batchId]
  );
  return result?.revenue || 0;
};

export const getAllSales = () => {
  return db.getAllSync(`SELECT * FROM sales`);
};

export const getSalesDetailsByBatch = (batchId) => {
  return db.getAllSync(`SELECT * FROM sales WHERE batchId=?`, [batchId]);
};

export const getSalesByDateRange = (startDate, endDate) => {
  return db.getAllSync(`SELECT * FROM sales WHERE date BETWEEN ? AND ?`, [startDate, endDate]);
};

export const getTotalSalesInDateRange = (startDate, endDate) => {
  const result = db.getFirstSync(
    `SELECT SUM(total) AS totalSales FROM sales WHERE date BETWEEN ? AND ?`,
    [startDate, endDate]
  );
  return result.totalSales || 0;
};

export const deleteSaleById = (id) => {
  db.runSync(`DELETE FROM sales WHERE id = ?`, [id]);
};

export const updateSale = (sale) => {
  db.runSync(
    `UPDATE sales SET clientId=?, saleType=?, quantity=?, price=?, total=?, date=?, receiptPath=? WHERE id=?`,
    [sale.clientId, sale.saleType, sale.quantity, sale.price, sale.total, sale.date, sale.receiptPath, sale.id]
  );
};

export const getSalesByClientId = (clientId) => {
  return db.getAllSync(`SELECT * FROM sales WHERE clientId = ?`, [clientId]);
};

export const getTotalSalesByClientId = (clientId) => {
  const result = db.getFirstSync(
    `SELECT SUM(total) AS totalSales FROM sales WHERE clientId = ?`,
    [clientId]
  );
  return result.totalSales || 0;
};

export const getSalesCount = () => {
  const result = db.getFirstSync(`SELECT COUNT(*) AS count FROM sales`);
  return result.count || 0;
};

export const getSalesWithClientInfo = () => {
  return db.getAllSync(
    `SELECT sales.*, clients.name AS clientName, clients.phone AS clientPhone FROM sales JOIN clients ON sales.clientId = clients.id`
  );
};

export const getSalesByBatchAndDateRange = (batchId, startDate, endDate) => {
  return db.getAllSync(
    `SELECT * FROM sales WHERE batchId = ? AND date BETWEEN ? AND ?`,
    [batchId, startDate, endDate]
  );
};

export const getTotalSalesByBatchAndDateRange = (batchId, startDate, endDate) => {
  const result = db.getFirstSync(
    `SELECT SUM(total) AS totalSales FROM sales WHERE batchId = ? AND date BETWEEN ? AND ?`,
    [batchId, startDate, endDate]
  );
  return result.totalSales || 0;
};

export const getAverageSalePriceByBatch = (batchId) => {
  const result = db.getFirstSync(
    `SELECT AVG(price) AS averagePrice FROM sales WHERE batchId = ?`,
    [batchId]
  );
  return result.averagePrice || 0;
};

export const getTopClientsBySales = (limit) => {
  return db.getAllSync(
    `SELECT clients.id, clients.name, SUM(sales.total) AS totalSpent
     FROM sales
     JOIN clients ON sales.clientId = clients.id
     GROUP BY clients.id, clients.name
     ORDER BY totalSpent DESC
     LIMIT ?`,
    [limit]
  );
};

export const getMonthlySalesSummary = (year, month) => {
  return db.getFirstSync(
    `SELECT SUM(total) AS totalSales, COUNT(*) AS numberOfSales
     FROM sales
     WHERE strftime('%Y', date) = ? AND strftime('%m', date) = ?`,
    [year, month]
  );
};

export const getSalesWithPagination = (limit, offset) => {
  return db.getAllSync(
    `SELECT * FROM sales ORDER BY date DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );
};

export const getTotalRevenue = () => {
  try {
    const result = db.getFirstSync(`SELECT SUM(total) AS totalRevenue FROM sales`);
    return result.totalRevenue || 0;
  } catch (error) {
    console.log('Sales table not found, returning 0');
    return 0;
  }
};

    