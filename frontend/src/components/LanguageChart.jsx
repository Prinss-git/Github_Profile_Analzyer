import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PALETTE = [
  '#58a6ff', '#3fb950', '#f78166', '#d2a8ff', '#ffa657',
  '#79c0ff', '#aaaaaa',
];

export default function LanguageChart({ languages }) {
  if (!languages || languages.length === 0) {
    return (
      <div className="card chart-card">
        <h3 className="card-title">Top Languages</h3>
        <p className="empty-state">No language data available.</p>
      </div>
    );
  }

  const data = {
    labels: languages.map((l) => l.name),
    datasets: [
      {
        data: languages.map((l) => l.bytes),
        backgroundColor: PALETTE.slice(0, languages.length),
        borderColor: '#0d1117',
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#c9d1d9',
          padding: 16,
          font: { family: 'Inter, system-ui, sans-serif', size: 13 },
          boxWidth: 12,
          boxHeight: 12,
        },
      },
      tooltip: {
        callbacks: {
          label(ctx) {
            const lang = languages[ctx.dataIndex];
            return ` ${lang.name}: ${lang.percent}%`;
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
  };

  return (
    <div className="card chart-card">
      <h3 className="card-title">Top Languages</h3>
      <div className="doughnut-wrapper">
        <Doughnut data={data} options={options} />
      </div>
      <ul className="lang-list">
        {languages.map((lang, i) => (
          <li key={lang.name} className="lang-item">
            <span className="lang-dot" style={{ background: PALETTE[i] }} />
            <span className="lang-name">{lang.name}</span>
            <span className="lang-percent">{lang.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
