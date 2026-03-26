import React, { useRef, useEffect, useState, useCallback } from 'react';

const CandlestickChart = ({ data = [], height = 400 }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const COLORS = {
    bullish: '#22c55e',
    bullishBody: '#22c55e',
    bearish: '#ef4444',
    bearishBody: '#ef4444',
    grid: 'rgba(156, 163, 175, 0.1)',
    axisText: 'rgba(156, 163, 175, 0.7)',
    tooltipBg: 'rgba(17, 24, 39, 0.95)',
    crosshair: 'rgba(156, 163, 175, 0.3)',
  };

  const PADDING = { top: 20, right: 70, bottom: 35, left: 10 };

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const { width, height: h } = dimensions;

    if (width === 0 || h === 0) return;

    canvas.width = width * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, width, h);

    const chartWidth = width - PADDING.left - PADDING.right;
    const chartHeight = h - PADDING.top - PADDING.bottom;

    // Find price range
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    data.forEach(d => {
      if (d.low < minPrice) minPrice = d.low;
      if (d.high > maxPrice) maxPrice = d.high;
    });

    const priceRange = maxPrice - minPrice || 1;
    const pricePadding = priceRange * 0.08;
    minPrice -= pricePadding;
    maxPrice += pricePadding;
    const totalRange = maxPrice - minPrice;

    const toY = (price) => PADDING.top + chartHeight - ((price - minPrice) / totalRange) * chartHeight;

    // Draw horizontal grid lines & Y-axis labels
    const gridLines = 6;
    ctx.font = '11px Inter, system-ui, sans-serif';
    ctx.textAlign = 'left';
    for (let i = 0; i <= gridLines; i++) {
      const price = minPrice + (totalRange * i) / gridLines;
      const y = toY(price);

      ctx.beginPath();
      ctx.strokeStyle = COLORS.grid;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.moveTo(PADDING.left, y);
      ctx.lineTo(width - PADDING.right + 10, y);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = COLORS.axisText;
      ctx.fillText(`₹${price.toFixed(2)}`, width - PADDING.right + 14, y + 4);
    }

    // Calculate candle dimensions
    const candleCount = data.length;
    const totalCandleWidth = chartWidth / candleCount;
    const candleBodyWidth = Math.max(3, Math.min(totalCandleWidth * 0.65, 20));
    const wickWidth = Math.max(1, candleBodyWidth * 0.12);

    // Draw candles
    data.forEach((candle, i) => {
      const x = PADDING.left + (i + 0.5) * totalCandleWidth;
      const isBullish = candle.close >= candle.open;
      const color = isBullish ? COLORS.bullish : COLORS.bearish;

      const yHigh = toY(candle.high);
      const yLow = toY(candle.low);
      const yOpen = toY(candle.open);
      const yClose = toY(candle.close);

      // Draw wick (shadow)
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = wickWidth;
      ctx.moveTo(x, yHigh);
      ctx.lineTo(x, yLow);
      ctx.stroke();

      // Draw body
      const bodyTop = Math.min(yOpen, yClose);
      const bodyHeight = Math.max(Math.abs(yOpen - yClose), 1);

      ctx.fillStyle = color;
      ctx.fillRect(
        x - candleBodyWidth / 2,
        bodyTop,
        candleBodyWidth,
        bodyHeight
      );

      // Add subtle glow for bullish candles
      if (isBullish) {
        ctx.shadowColor = COLORS.bullish;
        ctx.shadowBlur = 4;
        ctx.fillRect(x - candleBodyWidth / 2, bodyTop, candleBodyWidth, bodyHeight);
        ctx.shadowBlur = 0;
      }
    });

    // Draw X-axis labels
    ctx.fillStyle = COLORS.axisText;
    ctx.textAlign = 'center';
    const labelInterval = Math.max(1, Math.floor(candleCount / 8));
    data.forEach((candle, i) => {
      if (i % labelInterval === 0) {
        const x = PADDING.left + (i + 0.5) * totalCandleWidth;
        ctx.fillText(candle.label || '', x, h - PADDING.bottom + 20);
      }
    });
  }, [data, dimensions]);

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height: h } = entry.contentRect;
        setDimensions({ width, height: h });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Draw chart when data or dimensions change
  useEffect(() => {
    drawChart();
  }, [drawChart]);

  // Mouse move handler for tooltip
  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const chartWidth = dimensions.width - PADDING.left - PADDING.right;
    const totalCandleWidth = chartWidth / data.length;

    const candleIndex = Math.floor((mouseX - PADDING.left) / totalCandleWidth);

    if (candleIndex >= 0 && candleIndex < data.length) {
      const candle = data[candleIndex];
      setTooltip({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        candle,
        isBullish: candle.close >= candle.open,
      });

      // Redraw chart with crosshair
      drawChart();
      const ctx = canvas.getContext('2d');

      // Vertical crosshair
      ctx.beginPath();
      ctx.strokeStyle = COLORS.crosshair;
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.moveTo(mouseX, PADDING.top);
      ctx.lineTo(mouseX, dimensions.height - PADDING.bottom);
      ctx.stroke();

      // Horizontal crosshair
      ctx.beginPath();
      ctx.moveTo(PADDING.left, mouseY);
      ctx.lineTo(dimensions.width - PADDING.right, mouseY);
      ctx.stroke();
      ctx.setLineDash([]);
    } else {
      setTooltip(null);
    }
  }, [data, dimensions, drawChart]);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
    drawChart();
  }, [drawChart]);

  return (
    <div ref={containerRef} className="relative w-full h-full" style={{ minHeight: height }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none z-10 transition-opacity duration-150"
          style={{
            left: Math.min(tooltip.x + 16, dimensions.width - 180),
            top: Math.max(tooltip.y - 90, 10),
          }}
        >
          <div
            className="rounded-lg px-3 py-2 text-xs shadow-2xl border border-white/10 backdrop-blur-sm"
            style={{ backgroundColor: COLORS.tooltipBg }}
          >
            <div className="font-medium text-white/90 mb-1.5 text-[11px] tracking-wide uppercase">
              {tooltip.candle.label}
            </div>
            <div className="space-y-0.5">
              <div className="flex justify-between gap-6">
                <span className="text-white/50">Open</span>
                <span className="text-white font-medium tabular-nums">₹{tooltip.candle.open.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-white/50">High</span>
                <span className="text-white font-medium tabular-nums">₹{tooltip.candle.high.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-white/50">Low</span>
                <span className="text-white font-medium tabular-nums">₹{tooltip.candle.low.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span className="text-white/50">Close</span>
                <span
                  className="font-medium tabular-nums"
                  style={{ color: tooltip.isBullish ? COLORS.bullish : COLORS.bearish }}
                >
                  ₹{tooltip.candle.close.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandlestickChart;
