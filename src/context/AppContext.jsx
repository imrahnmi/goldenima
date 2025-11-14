import React, { createContext, useState, useEffect } from 'react';
import { COMMODITIES } from '../data/commodities';
import { MARKETS } from '../data/markets';
import { generateInitialPrices, generateDemoUsers } from '../utils/dataGenerator';

// 1. Create the context
export const AppContext = createContext();

// 2. Create the provider component
export const AppProvider = ({ children }) => {
  const [state, setState] = useState({
    // Authentication
    currentUser: null,
    isAuthenticated: false,

    // Core data
    commodities: COMMODITIES,
    markets: MARKETS,
    prices: [], // Generated prices
    users: [], // Demo users

    // UI state
    filters: { commodity: null, market: null, state: null },
    searchQuery: "",
    favorites: [],

    // Loading states
    isLoading: true,
    error: null
  });

  // 3. Initialize data on mount
  useEffect(() => {
    const initialPrices = generateInitialPrices();
    const demoUsers = generateDemoUsers();
    setState(prevState => ({
      ...prevState,
      prices: initialPrices,
      users: demoUsers,
      isLoading: false
    }));
  }, []);

  // 4. Define placeholder functions
  const login = (phone, password) => {
    console.log("Attempting login with:", phone);
    const user = state.users.find(u => u.phone === phone && u.password === password);
    if (user) {
      setState(prevState => ({ ...prevState, currentUser: user, isAuthenticated: true }));
      return true;
    }
    return false;
  };
  const register = (userData) => console.log("Registering user:", userData);
  const logout = () => setState(prevState => ({ ...prevState, currentUser: null, isAuthenticated: false }));
  const submitPrice = (priceData) => console.log("Submitting price:", priceData);
  const getPricesByFilter = (filters) => console.log("Getting prices by filter:", filters);
  const searchCommodities = (query) => console.log("Searching commodities:", query);
  const filterMarkets = (filters) => console.log("Filtering markets:", filters);
  const getNearbyMarkets = (userLocation, radius) => console.log("Getting nearby markets:", userLocation, radius);
  const getPriceTrend = (commodityId, marketId, days) => console.log("Getting price trend:", commodityId, marketId, days);
  const getMarketComparison = (commodityId, marketIds) => console.log("Getting market comparison:", commodityId, marketIds);
  const setFilters = (filters) => setState(prevState => ({ ...prevState, filters }));
  const addToFavorites = (item) => console.log("Adding to favorites:", item);
  const removeFromFavorites = (itemId) => console.log("Removing from favorites:", itemId);

  // 5. Provide the context value
  const contextValue = {
    ...state,
    login,
    register,
    logout,
    submitPrice,
    getPricesByFilter,
    searchCommodities,
    filterMarkets,
    getNearbyMarkets,
    getPriceTrend,
    getMarketComparison,
    setFilters,
    addToFavorites,
    removeFromFavorites,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};