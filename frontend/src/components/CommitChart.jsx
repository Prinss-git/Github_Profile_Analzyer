import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CommitChart({ commitActivity }) {
  const { labels, data } = commitActivity;
  const hasActivity = data.some((v) => v > 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Commits',
        data,
        backgroundColor: 'rgba(88, 166, 255, 0.25)',
        borderColor: '#58a6ff',
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(88, 166, 255, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label(ctx) {
            return ` ${ctx.parsed.y} commit${ctx.parsed.y !== 1 ? 's' : ''}`;
          },
        },
        backgroundColor: '#161b22',
        borderColor: '#30363d',
        borderWidth: 1,
        titleColor: '#c9d1d9',
        bodyColor: '#8b949e',
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { color: '#21262d' },
        ticks: {
          color: '#8b949e',
          font: { family: 'Inter, system-ui, sans-serif', size: 12 },
        },
      },
      y: {
        grid: { color: '#21262d' },
        ticks: {
          color: '#8b949e',
          font: { family: 'Inter, system-ui, sans-serif', size: 12 },
          stepSize: 1,
          precision: 0,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="card chart-card">
      <h3 className="card-title">Commit Activity (Last 12 Months)</h3>
      {hasActivity ? (
        <div className="bar-wrapper">
          <Bar data={chartData} options={options} />
        </div>
      ) : (
        <div className="bar-wrapper">
          <Bar data={chartData} options={options} />
          <p className="empty-state-overlay">No public push events in the last 12 months.</p>
        </div>
      )}
      <p className="chart-note">Public repositories only — private repo commits are not included</p>
    </div>
  );
}
