import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

const MiniChart = ({ data, color = '#22c55e' }) => {
  const chartData = {
    labels: data.map((_, i) => i.toString()),
    datasets: [
      {
        data: data,
        borderColor: color,
        borderWidth: 1.5,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 40);
          gradient.addColorStop(0, `${color}40`); 
          gradient.addColorStop(1, `${color}00`);
          return gradient;
        },
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    animation: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <div className="h-10 w-24">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MiniChart;
