import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-header">
        <div className="skeleton-badge pulsing" />
        <div className="skeleton-actions">
          <div className="skeleton-icon-btn pulsing" />
          <div className="skeleton-icon-btn pulsing" />
        </div>
      </div>
      <div className="skeleton-body">
        <div className="skeleton-title pulsing" />
        <div className="skeleton-line pulsing" />
        <div className="skeleton-line pulsing short" />
      </div>
      <div className="skeleton-footer">
        <div className="skeleton-date pulsing" />
        <div className="skeleton-select pulsing" />
      </div>
    </div>
  );
};

export const SkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="tasks-grid">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default SkeletonLoader;
