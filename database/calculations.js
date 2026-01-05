import { getFeedByBatch } from './feedQueries';
import { getMortalityByBatch } from './mortalityQueries';
import { getSalesByBatch } from './salesQueries';

/* TOTAL FEED COST */
export const calculateFeedCost = async (batchId) => {
  const feed = await getFeedByBatch(batchId);
  return feed.reduce(
    (sum, f) => sum + f.quantityKg * f.pricePerKg,
    0
  );
};

/* TOTAL INVESTMENT */
export const calculateInvestment = async (batch) => {
  const feedCost = await calculateFeedCost(batch.id);
  const chicksCost = batch.initialChicks * batch.chickPrice;
  return chicksCost + feedCost;
};

/* AVAILABLE BIRDS */
export const calculateAvailableBirds = async (batch) => {
  const dead = await getMortalityByBatch(batch.id);
  const sold = await new Promise((resolve) => {
    import('./db').then(({ db }) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT SUM(quantity) as sold FROM sales WHERE batchId=? AND saleType='per_bird'`,
          [batch.id],
          (_, { rows }) => resolve(rows._array[0]?.sold || 0)
        );
      });
    });
  });

  return batch.initialChicks - dead - sold;
};

/* PROFIT */
export const calculateProfit = async (batch) => {
  const investment = await calculateInvestment(batch);
  const revenue = await getSalesByBatch(batch.id);
  return revenue - investment;
};

/* BATCH PROGRESS */
export const calculateProgress = (startDate) => {
  const days = (new Date() - new Date(startDate)) / (1000 * 60 * 60 * 24);
  return Math.min(Math.round((days / 42) * 100), 100);
};

/* AVERAGE DAILY GAIN */
export const calculateADG = async (batch, finalWeightKg) => {
  const availableBirds = await calculateAvailableBirds(batch);
  const days = (new Date() - new Date(batch.startDate)) / (1000 * 60 * 60 * 24);
  const weightGain = finalWeightKg - batch.initialWeightKg;
  return availableBirds > 0 && days > 0 ? weightGain / (availableBirds * days) : 0;
};

/* FCR */
export const calculateFCR = async (batch, finalWeightKg) => {
  const feed = await getFeedByBatch(batch.id);
    const totalFeedKg = feed.reduce((sum, f) => sum + f.quantityKg, 0);
    const availableBirds = await calculateAvailableBirds(batch);
    const totalWeightGain = availableBirds * (finalWeightKg - batch.initialWeightKg);
    return totalWeightGain > 0 ? totalFeedKg / totalWeightGain : 0;
};

/* TOTAL REVENUE */
export const calculateTotalRevenue = async (batchId) => {
  return await getSalesByBatch(batchId);
};

/* TOTAL COST */
export const calculateTotalCost = async (batch) => {
  return await calculateInvestment(batch);
};

/* NET PROFIT */
export const calculateNetProfit = async (batch) => {
  const revenue = await calculateTotalRevenue(batch.id);
  const cost = await calculateTotalCost(batch);
  return revenue - cost;
};

/* RETURN ON INVESTMENT */
export const calculateROI = async (batch) => {
  const netProfit = await calculateNetProfit(batch);
  const cost = await calculateTotalCost(batch);
  return cost > 0 ? (netProfit / cost) * 100 : 0;
};

/* BREAK-EVEN PRICE PER BIRD */
export const calculateBreakEvenPricePerBird = async (batch) => {
  const totalCost = await calculateTotalCost(batch);
  return batch.initialChicks > 0 ? totalCost / batch.initialChicks : 0;
};

/* BREAK-EVEN PRICE PER KG */
export const calculateBreakEvenPricePerKg = async (batch, finalWeightKg) => {
  const totalCost = await calculateTotalCost(batch);
  const availableBirds = await calculateAvailableBirds(batch);
  const totalWeightGain = availableBirds * (finalWeightKg - batch.initialWeightKg);
  return totalWeightGain > 0 ? totalCost / totalWeightGain : 0;
};

/* AVERAGE SALE PRICE PER BIRD */
export const calculateAverageSalePricePerBird = async (batchId) => {
  return await new Promise((resolve) => {
    import('./db').then(({ db }) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT AVG(pricePerBird) as avgPrice FROM sales WHERE batchId=? AND saleType='per_bird'`,
          [batchId],
          (_, { rows }) => resolve(rows._array[0]?.avgPrice || 0)
        );
      });
    });
  });
};

/* AVERAGE SALE PRICE PER KG */
export const calculateAverageSalePricePerKg = async (batchId) => {
  return await new Promise((resolve) => {
    import('./db').then(({ db }) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT AVG(pricePerKg) as avgPrice FROM sales WHERE batchId=? AND saleType='per_kg'`,  
                [batchId],
                (_, { rows }) => resolve(rows._array[0]?.avgPrice || 0)
            );
        });
    });
  });
};

/* TOTAL MORTALITY */
export const calculateTotalMortality = async (batchId) => {
  return await getMortalityByBatch(batchId);
};

/* MORTALITY RATE */
export const calculateMortalityRate = async (batch) => {
  const totalDead = await calculateTotalMortality(batch.id);
  return batch.initialChicks > 0 ? (totalDead / batch.initialChicks) * 100 : 0;
};

/* AVERAGE DAILY MORTALITY */
export const calculateAverageDailyMortality = async (batch) => {
  const totalDead = await calculateTotalMortality(batch.id);
  const days = (new Date() - new Date(batch.startDate)) / (1000 * 60 * 60 * 24);
  return days > 0 ? totalDead / days : 0;
};

/* TOTAL FEED CONSUMED */
export const calculateTotalFeedConsumed = async (batchId) => {
  const feed = await getFeedByBatch(batchId);
  return feed.reduce((sum, f) => sum + f.quantityKg, 0);
};

/* AVERAGE FEED CONSUMPTION PER BIRD */
export const calculateAverageFeedConsumptionPerBird = async (batch, finalWeightKg) => {
  const totalFeedKg = await calculateTotalFeedConsumed(batch.id);
  const availableBirds = await calculateAvailableBirds(batch);
  return availableBirds > 0 ? totalFeedKg / availableBirds : 0;
};

/* AVERAGE WEIGHT PER BIRD */
export const calculateAverageWeightPerBird = async (batch, finalWeightKg) => {
  const availableBirds = await calculateAvailableBirds(batch);
  return availableBirds > 0 ? finalWeightKg : 0;
};  

/* TOTAL BIRDS SOLD */
export const calculateTotalBirdsSold = async (batchId) => {
  return await new Promise((resolve) => {   
    import('./db').then(({ db }) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT SUM(quantity) as totalSold FROM sales WHERE batchId=? AND saleType='per_bird'`,
                [batchId],
                (_, { rows }) => resolve(rows._array[0]?.totalSold || 0)
            );
        });
    });
  });
};

/* TOTAL WEIGHT SOLD */ 
export const calculateTotalWeightSold = async (batchId) => {
    return await new Promise((resolve) => {
        import('./db').then(({ db }) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT SUM(quantity) as totalWeight FROM sales WHERE batchId=? AND saleType='per_kg'`,
                    [batchId],
                    (_, { rows }) => resolve(rows._array[0]?.totalWeight || 0)
                );
            });
        });
    }
);};

/* AVERAGE PRICE PER KG OF FEED */
export const calculateAveragePricePerKgOfFeed = async (batchId) => {
  const feed = await getFeedByBatch(batchId);
    const totalQuantity = feed.reduce((sum, f) => sum + f.quantityKg, 0);
    const totalCost = feed.reduce((sum, f) => sum + f.quantityKg * f.pricePerKg, 0);
    return totalQuantity > 0 ? totalCost / totalQuantity : 0;
};

/* TOTAL DAYS IN PRODUCTION */
export const calculateTotalDaysInProduction = (startDate) => {
  const days = Math.floor((new Date() - new Date(startDate)) / (1000 * 60 * 60 * 24));
  return days >= 0 ? days : 0;
};


