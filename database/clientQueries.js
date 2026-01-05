import { db } from './db';

export const addClient = (client) => {
  const result = db.runSync(
    `INSERT INTO clients (name, phone) VALUES (?, ?)`,
    [client.name, client.phone]
  );
  return result.lastInsertRowId;
};

export const getClients = () => {
  try {
    return db.getAllSync(`SELECT * FROM clients`);
  } catch (error) {
    console.log('Clients table not found, returning empty array');
    return [];
  }
};

export const getClientById = (id) => {
  return db.getFirstSync(`SELECT * FROM clients WHERE id = ?`, [id]);
};

export const updateClient = (client) => {
  db.runSync(
    `UPDATE clients SET name = ?, phone = ? WHERE id = ?`,
    [client.name, client.phone, client.id]
  );
};

export const deleteClient = (id) => {
  db.runSync(`DELETE FROM clients WHERE id = ?`, [id]);
};

export const findClientsByName = (name) => {
  return db.getAllSync(`SELECT * FROM clients WHERE name LIKE ?`, [`%${name}%`]);
};

