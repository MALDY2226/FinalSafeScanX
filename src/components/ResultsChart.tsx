import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ResultsChartProps {
  data: {
    clean: number;
    flagged: number;
  };
}

const ResultsChart: React.FC<ResultsChartProps> = ({ data }) => {
  const chartData = {
    labels: ['Clean', 'Flagged'],
    datasets: [
      {
        data: [data.clean, data.flagged],
        backgroundColor: ['#4CAF50', '#F44336'],
        hoverBackgroundColor: ['#45a049', '#da190b'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="mt-8 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Scan Results</h2>
      <div className="h-64">
        <Pie data={chartData} options={options} />
      </div>
      <div className="mt-4 text-center">
        <p className="text-lg">
          <span className="font-bold text-green-600">{data.clean}%</span> Clean
        </p>
        <p className="text-lg">
          <span className="font-bold text-red-600">{data.flagged}%</span> Flagged
        </p>
      </div>
    </div>
  );
};

export default ResultsChart;