import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

export default function RecallChart() {
  const data = {
    labels: ['0.0', '0.2', '0.4', '0.6', '0.8', '1.0'],
    datasets: [
      {
        label: 'Smooth Line Chart',
        data: [1, 1, 1, 1, 1, 0],
        fill: true,
        tension: 0.4, // Adjust this value to control the smoothness of the line
        backgroundColor: '#6B4EFF',
        borderColor: '#6B4EFF',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div>
      {' '}
      <Line
        data={data}
        options={{
          scales: {
            x: {
              type: 'category',
              position: 'bottom',
            },
            y: {
              type: 'linear',
              position: 'left',
            },
          },
        }}
      />
    </div>
  );
}
