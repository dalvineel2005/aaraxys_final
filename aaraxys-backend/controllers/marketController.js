import yahooFinance from 'yahoo-finance2';

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
        period1.setDate(period1.getDate() - 2); // 2 days to ensure we get data (trading days)
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
        period1.setDate(period1.getDate() - 2);
    }

    const queryOptions = {
      period1: period1.toISOString(),
      interval: interval,
    };

    const result = await yahooFinance.historical(querySymbol, queryOptions);
    
    // Process formatting for React Candlestick Chart
    const formattedData = result.map(entry => {
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
    console.error('Error fetching historical data:', error);
    res.status(500).json({ message: 'Error fetching historical data API' });
  }
};
