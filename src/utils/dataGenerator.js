import { COMMODITIES } from '../data/commodities';
import { MARKETS } from '../data/markets';

const PRICE_RANGES = {
  1: { min: 75000, max: 95000 },  // Rice (Local)
  2: { min: 45000, max: 55000 },  // Rice (Foreign)
  3: { min: 45000, max: 60000 },  // Maize
  4: { min: 110000, max: 130000 }, // Beans
  5: { min: 40000, max: 55000 },  // Millet
  6: { min: 42000, max: 58000 },  // Sorghum
  7: { min: 95000, max: 115000 }   // Groundnuts
};

const NORTHERN_STATES = ["Kano", "Kaduna"];
const SOUTHERN_STATES = ["Lagos", "Oyo", "Anambra"];

const getRandomPrice = (baseMin, baseMax) => {
  return baseMin + Math.random() * (baseMax - baseMin);
};

export const generateInitialPrices = () => {
  const prices = [];
  let priceId = 1;

  MARKETS.forEach(market => {
    COMMODITIES.forEach(commodity => {
      if (Math.random() > 0.2) { // Not all commodities in all markets
        const basePriceRange = PRICE_RANGES[commodity.id];
        let price = getRandomPrice(basePriceRange.min, basePriceRange.max);

        // Apply regional variations
        if (NORTHERN_STATES.includes(market.state)) {
          price *= (1 - (5 + Math.random() * 5) / 100); // 5-10% cheaper
        } else if (SOUTHERN_STATES.includes(market.state)) {
          price *= (1 + (5 + Math.random() * 5) / 100); // 5-10% more expensive
        }

        // Apply random variance
        price *= (1 + (Math.random() - 0.5) * 2 * 0.05); // ±5%

        prices.push({
          id: priceId++,
          commodityId: commodity.id,
          marketId: market.id,
          price: Math.round(price / 100) * 100, // Round to nearest 100
          date: new Date().toISOString(),
        });
      }
    });
  });
  return prices.slice(0, 100); // Ensure between 80-100
};

export const generatePriceHistory = (commodityId, marketId, days = 30) => {
  const history = [];
  const basePriceRange = PRICE_RANGES[commodityId];
  let currentPrice = getRandomPrice(basePriceRange.min, basePriceRange.max);

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));

    // Simple trend simulation
    const trend = Math.sin(i / 5) * 0.02 + (Math.random() - 0.5) * 0.03;
    currentPrice *= (1 + trend);

    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(currentPrice / 100) * 100,
    });
  }
  return history;
};

export const generateDemoUsers = () => {
  return [
    { id: 1, name: "Jide Okoro", phone: "08012345678", password: "password123", role: "Trader", state: "Lagos" },
    { id: 2, name: "Amina Bello", phone: "08023456789", password: "password123", role: "Farmer", state: "Kano" },
    { id: 3, name: "Chidi Eze", phone: "08034567890", password: "password123", role: "Consumer", state: "Anambra" },
    { id: 4, name: "Fatima Garba", phone: "08045678901", password: "password123", role: "Reporter", state: "Kaduna" },
  ];
};
