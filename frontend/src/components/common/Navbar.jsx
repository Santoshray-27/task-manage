import React, { useContext } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { Sun, Moon, CheckSquare } from 'lucide-react';

const Navbar = () => {
  const { theme, toggleTheme, stats } = useContext(TaskContext);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-logo">
            <CheckSquare size={24} className="logo-icon" />
          </div>
          <div>
            <h1 className="brand-title">task tracker</h1>
            <p className="brand-subtitle">Streamline your tasks</p>
          </div>
        </div>

        <div className="navbar-actions">
          <div className="tasks-count-badge">
            <span className="count-label">Total Tasks:</span>
            <span className="count-number">{stats.total}</span>
          </div>

          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle dark mode"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
