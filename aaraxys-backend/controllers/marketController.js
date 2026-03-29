import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

// Helper to append .NS suffix for Indian stocks if missing
const getYahooSymbol = (symbol) => {
  const usStocks = ['AAPL', 'MSFT', 'TSLA', 'AMZN', 'GOOGL', 'META', 'NVDA'];
  if (!usStocks.includes(symbol) && !symbol.includes('.')) {
    return `${symbol}.NS`;
  }
  return symbol;
};

export const getHistoricalData = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { timeframe = '1D' } = req.query;

    const querySymbol = getYahooSymbol(symbol);

    let period1 = new Date();
    let interval = '5m';

    // Map timeframe string to Yahoo Finance periods
    switch (timeframe) {
      case '1D':
        period1.setDate(period1.getDate() - 5); // 5 days to ensure we get data over weekends
        interval = '5m';
        break;
      case '1W':
        period1.setDate(period1.getDate() - 7);
        interval = '15m';
        break;
      case '1M':
        period1.setMonth(period1.getMonth() - 1);
        interval = '1d';
        break;
      case '3M':
        period1.setMonth(period1.getMonth() - 3);
        interval = '1d';
        break;
      case '1Y':
        period1.setFullYear(period1.getFullYear() - 1);
        interval = '1wk';
        break;
      case 'ALL':
        period1.setFullYear(period1.getFullYear() - 5);
        interval = '1mo';
        break;
      default:
        period1.setDate(period1.getDate() - 5);
    }

    const queryOptions = {
      period1: period1,
      interval: interval,
    };

    const result = await yahooFinance.chart(querySymbol, queryOptions);
    
    // Process formatting for React Candlestick Chart
    const quotes = result?.quotes || [];
    const formattedData = quotes
      .filter(entry => entry.open !== null && entry.close !== null && entry.high !== null && entry.low !== null)
      .map(entry => {
        // Date formatting based on interval
        const date = new Date(entry.date);
        let label = '';
        if (interval === '5m' || interval === '15m') {
            label = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
        } else {
            label = `${date.getDate()}/${date.getMonth() + 1}`;
        }

        return {
            open: entry.open,
            high: entry.high,
            low: entry.low,
            close: entry.close,
            label: label,
            date: entry.date
        };
    });

    res.json(formattedData);
  } catch (error) {
    console.error('Yahoo Finance failed, trying Finnhub fallback:', error.message);
    
    try {
        const usStocks = ['AAPL', 'MSFT', 'TSLA', 'AMZN', 'GOOGL', 'META', 'NVDA', 'LTIM'];
        if (!usStocks.includes(req.params.symbol)) {
             return res.status(500).json({ message: 'Error fetching historical data (Yahoo Blocked, No Finnhub for Indian stocks)' });
        }

        const finnhubKey = process.env.FINNHUB_API_KEY;
        if (!finnhubKey) {
             return res.status(500).json({ message: 'Error fetching historical data (No API key)' });
        }

        // Map resolution
        let resolution = '5';
        const { timeframe = '1D' } = req.query;
        if (timeframe === '1W') resolution = '15';
        else if (timeframe === '1M' || timeframe === '3M') resolution = 'D';
        else if (timeframe === '1Y') resolution = 'W';
        else if (timeframe === 'ALL') resolution = 'M';

        // Calculate 'from' timestamp
        let period1 = new Date();
        if (timeframe === '1D') period1.setDate(period1.getDate() - 5);
        else if (timeframe === '1W') period1.setDate(period1.getDate() - 7);
        else if (timeframe === '1M') period1.setMonth(period1.getMonth() - 1);
        else if (timeframe === '3M') period1.setMonth(period1.getMonth() - 3);
        else if (timeframe === '1Y') period1.setFullYear(period1.getFullYear() - 1);
        else if (timeframe === 'ALL') period1.setFullYear(period1.getFullYear() - 5);
        else period1.setDate(period1.getDate() - 5);

        const fromTimestamp = Math.floor(period1.getTime() / 1000);
        const toTimestamp = Math.floor(Date.now() / 1000);

        const fhRes = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${req.params.symbol}&resolution=${resolution}&from=${fromTimestamp}&to=${toTimestamp}&token=${finnhubKey}`);
        
        if (!fhRes.ok) throw new Error('Finnhub network error');
        
        const fhData = await fhRes.json();
        if (fhData.s !== 'ok') {
            return res.status(500).json({ message: 'No data from Finnhub' });
        }

        const formattedData = [];
        for (let i = 0; i < fhData.t.length; i++) {
             const dateObj = new Date(fhData.t[i] * 1000);
             let label = '';
             if (resolution === '5' || resolution === '15') {
                 label = `${dateObj.getHours()}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
             } else {
                 label = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
             }

             formattedData.push({
                 open: fhData.o[i],
                 high: fhData.h[i],
                 low: fhData.l[i],
                 close: fhData.c[i],
                 label: label,
                 date: dateObj.toISOString()
             });
        }
        return res.json(formattedData);
    } catch (fallbackError) {
        console.error('Finnhub fallback failed:', fallbackError.message);
        return res.status(500).json({ message: 'All data sources failed' });
    }
  }
};
