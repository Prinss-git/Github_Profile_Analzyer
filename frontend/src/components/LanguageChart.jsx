import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PALETTE = [
  '#3b82f6', '#22c55e', '#f59e0b', '#a78bfa', '#f87171',
  '#06b6d4', '#ec4899', '#84cc16', '#fb923c', '#e879f9',
  '#34d399', '#fbbf24', '#60a5fa', '#f472b6', '#4ade80',
  '#818cf8', '#fb7185', '#38bdf8', '#a3e635', '#c084fc',
];

function getColor(index) {
  return PALETTE[index % PALETTE.length];
}

export default function LanguageChart({ languages }) {
  if (!languages || languages.length === 0) {
    return (
      <div className="card chart-card">
        <h3 className="card-title">Languages</h3>
        <p className="empty-state">No language data available.</p>
      </div>
    );
  }

  // Doughnut shows top 8, list shows all
  const chartLangs = languages.slice(0, 8);
  const remainingBytes = languages.slice(8).reduce((sum, l) => sum + l.bytes, 0);
  const chartData = remainingBytes > 0
    ? [...chartLangs, { name: 'Other', bytes: remainingBytes, percent: languages.slice(8).reduce((s, l) => s + parseFloat(l.percent), 0).toFixed(1) }]
    : chartLangs;

  const data = {
    labels: chartData.map((l) => l.name),
    datasets: [
      {
        data: chartData.map((l) => l.bytes),
        backgroundColor: chartData.map((_, i) => getColor(i)),
        borderColor: '#080a0c',
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label(ctx) {
            const lang = chartData[ctx.dataIndex];
            return ` ${lang.name}: ${lang.percent}%`;
          },
        },
        backgroundColor: '#0e1115',
        borderColor: '#1e2530',
        borderWidth: 1,
        titleColor: '#f0f4f8',
        bodyColor: '#7a8899',
        padding: 10,
      },
    },
  };

  return (
    <div className="card chart-card">
      <h3 className="card-title">Languages</h3>
      <div className="doughnut-wrapper">
        <Doughnut data={data} options={options} />
      </div>
      <ul className="lang-list">
        {languages.map((lang, i) => (
          <li key={lang.name} className="lang-item">
            <span className="lang-dot" style={{ background: getColor(i) }} />
            <span className="lang-name">{lang.name}</span>
            <span className="lang-percent">{lang.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
