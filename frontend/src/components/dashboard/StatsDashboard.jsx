import React, { useContext } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { ClipboardList, Clock, Loader2, CheckCircle2 } from 'lucide-react';

const StatsDashboard = () => {
  const { stats } = useContext(TaskContext);

  // Calculate completion percentage safely
  const completionPercentage = stats.total > 0 
    ? Math.round((stats.Completed / stats.total) * 100) 
    : 0;

  const cardData = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: <ClipboardList className="card-icon total" size={24} />,
      className: 'card-total'
    },
    {
      title: 'Pending',
      value: stats.Pending,
      icon: <Clock className="card-icon pending" size={24} />,
      className: 'card-pending'
    },
    {
      title: 'In Progress',
      value: stats['In Progress'],
      icon: <Loader2 className="card-icon progress" size={24} />,
      className: 'card-progress'
    },
    {
      title: 'Completed',
      value: stats.Completed,
      icon: <CheckCircle2 className="card-icon completed" size={24} />,
      className: 'card-completed'
    }
  ];

  return (
    <section className="stats-dashboard">
      <div className="stats-grid">
        {cardData.map((card, idx) => (
          <div key={idx} className={`stat-card ${card.className}`}>
            <div className="stat-card-header">
              <span className="stat-card-title">{card.title}</span>
              {card.icon}
            </div>
            <div className="stat-card-body">
              <span className="stat-card-value">{card.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="progress-section">
        <div className="progress-info">
          <span className="progress-label">Project Completion Rate</span>
          <span className="progress-value">{completionPercentage}%</span>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${completionPercentage}%` }}
            role="progressbar"
            aria-valuenow={completionPercentage}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
      </div>
    </section>
  );
};

export default StatsDashboard;
