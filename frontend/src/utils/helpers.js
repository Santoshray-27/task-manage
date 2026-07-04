/**
 * Format Date to standard input format (YYYY-MM-DD)
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
};

/**
 * Format Date to localized string (e.g., MMM DD, YYYY)
 */
export const formatDisplayDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Check if a date is in the past (overdue)
 */
export const isOverdue = (dueDateString, status) => {
  if (!dueDateString || status === 'Completed') return false;
  
  const dueDate = new Date(dueDateString);
  // Set time of due date to end of day to be lenient
  dueDate.setHours(23, 59, 59, 999);
  
  const today = new Date();
  
  return dueDate < today;
};
