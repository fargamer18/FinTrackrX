// Finnhub API integration for stock market data
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'd487ge1r01qk80bjptfgd487ge1r01qk80bjptg0';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

// Get stock quote (current price, change, etc.)
export async function getQuote(symbol: string) {
  try {
    const response = await fetch(
      `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );
    const data = await response.json();
    
    return {
      currentPrice: data.c, // Current price
      change: data.d, // Change
      percentChange: data.dp, // Percent change
      high: data.h, // High price of the day
      low: data.l, // Low price of the day
      open: data.o, // Open price of the day
      previousClose: data.pc, // Previous close price
      timestamp: data.t, // Timestamp
    };
  } catch (error) {
    console.error('Finnhub quote error:', error);
    return null;
  }
}

// Get company profile
export async function getCompanyProfile(symbol: string) {
  try {
    const response = await fetch(
      `${FINNHUB_BASE_URL}/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );
    const data = await response.json();
    
    return {
      name: data.name,
      ticker: data.ticker,
      exchange: data.exchange,
      currency: data.currency,
      country: data.country,
      industry: data.finnhubIndustry,
      logo: data.logo,
      marketCap: data.marketCapitalization,
    };
  } catch (error) {
    console.error('Finnhub profile error:', error);
    return null;
  }
}

// Search for stocks
export async function searchSymbol(query: string) {
  try {
    const url = `${FINNHUB_BASE_URL}/search?q=${query}&token=${FINNHUB_API_KEY}`;
    console.log('🌐 Fetching from Finnhub:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('📡 Raw Finnhub API response:', data);
    
    // Check if data.result exists and is an array
    if (!data.result || !Array.isArray(data.result)) {
      console.warn('⚠️ Unexpected Finnhub response structure:', data);
      return [];
    }
    
    const mapped = data.result.map((item: any) => ({
      symbol: item.symbol,
      description: item.description,
      type: item.type,
      displaySymbol: item.displaySymbol,
    }));
    
    console.log('🔧 Mapped results:', mapped);
    return mapped;
  } catch (error) {
    console.error('❌ Finnhub search error:', error);
    return [];
  }
}

// Get historical candles (for charts)
export async function getCandles(symbol: string, resolution: string = 'D', from: number, to: number) {
  try {
    const response = await fetch(
      `${FINNHUB_BASE_URL}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`
    );
    const data = await response.json();
    
    if (data.s !== 'ok') return null;
    
    return {
      timestamps: data.t,
      open: data.o,
      high: data.h,
      low: data.l,
      close: data.c,
      volume: data.v,
    };
  } catch (error) {
    console.error('Finnhub candles error:', error);
    return null;
  }
}

// Get market news
export async function getMarketNews(category: string = 'general') {
  try {
    const response = await fetch(
      `${FINNHUB_BASE_URL}/news?category=${category}&token=${FINNHUB_API_KEY}`
    );
    const data = await response.json();
    
    return data.slice(0, 10).map((item: any) => ({
      headline: item.headline,
      summary: item.summary,
      source: item.source,
      url: item.url,
      image: item.image,
      datetime: item.datetime,
    }));
  } catch (error) {
    console.error('Finnhub news error:', error);
    return [];
  }
}

// Get company news
export async function getCompanyNews(symbol: string, from: string, to: string) {
  try {
    const response = await fetch(
      `${FINNHUB_BASE_URL}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`
    );
    const data = await response.json();
    
    return data.slice(0, 10).map((item: any) => ({
      headline: item.headline,
      summary: item.summary,
      source: item.source,
      url: item.url,
      image: item.image,
      datetime: item.datetime,
    }));
  } catch (error) {
    console.error('Finnhub company news error:', error);
    return [];
  }
}

// Batch update prices for multiple symbols
export async function batchUpdatePrices(symbols: string[]): Promise<{ [symbol: string]: number }> {
  const quotes = await Promise.all(
    symbols.map(async (symbol) => {
      const quote = await getQuote(symbol);
      return { symbol, price: quote?.currentPrice || 0 };
    })
  );
  
  const priceMap: { [symbol: string]: number } = {};
  quotes.forEach(({ symbol, price }) => {
    priceMap[symbol] = price;
  });
  
  return priceMap;
}

export const finnhubService = {
  getQuote,
  getCompanyProfile,
  searchSymbol,
  getCandles,
  getMarketNews,
  getCompanyNews,
  batchUpdatePrices,
};
