import { MARKETS } from '../data/markets';

// Calculate distance between two coordinates using the Haversine formula
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// Calculate transport cost (₦150/km)
export function calculateTransportCost(fromMarketId, toMarketId) {
  const fromMarket = MARKETS.find(m => m.id === fromMarketId);
  const toMarket = MARKETS.find(m => m.id === toMarketId);
  if (!fromMarket || !toMarket) return 0;

  const distance = calculateDistance(fromMarket.lat, fromMarket.lng, toMarket.lat, toMarket.lng);
  return distance * 150;
}

// Calculate price change percentage
export function calculatePriceChange(currentPrice, previousPrice) {
  if (previousPrice === 0 || previousPrice === null) return 0;
  const change = ((currentPrice - previousPrice) / previousPrice) * 100;
  return Math.round(change * 10) / 10; // Round to one decimal place
}

// Get latest price for a specific commodity-market pair
export function getLatestPrice(prices, commodityId, marketId) {
  const marketPrices = prices
    .filter(p => p.commodityId === commodityId && p.marketId === marketId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  return marketPrices.length > 0 ? marketPrices[0] : null;
}

// Get price trend data for charts
export function getPriceTrend(prices, commodityId, marketId, days = 7) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - days);

  return prices
    .filter(p => p.commodityId === commodityId && p.marketId === marketId && new Date(p.date) >= oneWeekAgo)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Compare prices across multiple markets for a specific commodity
export function compareMarketPrices(prices, commodityId, marketIds, userLocation = null) {
  const results = marketIds.map(marketId => {
    const market = MARKETS.find(m => m.id === marketId);
    const latestPrice = getLatestPrice(prices, commodityId, marketId);
    let distance = null;

    if (userLocation && market) {
      distance = calculateDistance(userLocation.lat, userLocation.lng, market.lat, market.lng);
    }

    return {
      marketId: market ? market.id : marketId,
      marketName: market ? market.name : 'Unknown Market',
      price: latestPrice ? latestPrice.price : null,
      distance: distance
    };
  });

  // Sort by price, placing null prices at the end
  return results.sort((a, b) => {
    const aPrice = a.price === null || a.price === undefined ? Infinity : a.price;
    const bPrice = b.price === null || b.price === undefined ? Infinity : b.price;
    return aPrice - bPrice;
  });
}
