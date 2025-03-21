/**
 * Formats a date string from YYYY-MM-DD to a more readable format
 * @param dateString Date string in YYYY-MM-DD format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Checks if a date is in the past
 * @param dateString Date string in YYYY-MM-DD format
 * @returns Boolean indicating if the date is in the past
 */
export function isDatePast(dateString: string): boolean {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  } catch (error) {
    console.error('Error checking if date is past:', error);
    return false;
  }
}

/**
 * Calculates days remaining until a date
 * @param dateString Date string in YYYY-MM-DD format
 * @returns Number of days remaining (negative if date is in the past)
 */
export function daysUntil(dateString: string): number {
  if (!dateString) return 0;
  
  try {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch (error) {
    console.error('Error calculating days until:', error);
    return 0;
  }
} 