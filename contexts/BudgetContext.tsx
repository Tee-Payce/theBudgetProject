import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initDatabase, insertTransaction as dbInsertTransaction, getAllTransactions, deleteTransaction as dbDeleteTransaction } from '@/database/database';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  currency: 'USD' | 'ZWG';
}

interface BudgetContextType {
  transactions: Transaction[];
  currency: 'USD' | 'ZWG';
  setCurrency: (currency: 'USD' | 'ZWG') => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getBalance: () => number;
  getCurrencySymbol: () => string;
  refreshTransactions: () => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currency, setCurrency] = useState<'USD' | 'ZWG'>('USD');

  useEffect(() => {
    initDatabase();
    refreshTransactions();
  }, []);

  const refreshTransactions = () => {
    const dbTransactions = getAllTransactions();
    setTransactions(dbTransactions.map(t => ({ ...t, id: t.id.toString() })));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const id = dbInsertTransaction(transaction);
    refreshTransactions();
  };

  const deleteTransaction = (id: string) => {
    dbDeleteTransaction(parseInt(id));
    refreshTransactions();
  };

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income' && t.currency === currency)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return transactions
      .filter(t => t.type === 'expense' && t.currency === currency)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  const getCurrencySymbol = () => {
    return currency === 'USD' ? '$' : 'ZWG';
  };

  return (
    <BudgetContext.Provider value={{
      transactions,
      currency,
      setCurrency,
      addTransaction,
      deleteTransaction,
      getTotalIncome,
      getTotalExpenses,
      getBalance,
      getCurrencySymbol,
      refreshTransactions,
    }}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}