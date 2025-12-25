export const theme = {
  colors: {
    background: '#f3f4f6',
    backgroundAlt: '#e5e7eb',
    card: 'rgba(255, 255, 255, 0.75)',
    panel: 'rgba(255, 255, 255, 0.6)',
    border: 'rgba(255, 255, 255, 0.5)',
    text: '#111827',
    muted: '#6b7280',
    accent: '#4f46e5',
    accentStrong: '#8b5cf6',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    neutral: '#9ca3af',
  },
  glass: {
    panel: 'rgba(255, 255, 255, 0.75)',
    card: 'rgba(255, 255, 255, 0.6)',
    border: 'rgba(255, 255, 255, 0.5)',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    hoverShadow:
      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  radii: {
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  status: {
    Lead: { bg: '#f3f4f6', color: '#6b7280', border: '#d1d5db' },
    Applied: { bg: '#dbeafe', color: '#1d4ed8', border: '#93c5fd' },
    Viewed: { bg: '#e0e7ff', color: '#4338ca', border: '#c7d2fe' },
    Contacted: { bg: '#fef3c7', color: '#d97706', border: '#fcd34d' },
    Interview: { bg: '#fef3c7', color: '#b45309', border: '#fcd34d' },
    TechnicalTest: { bg: '#fde68a', color: '#92400e', border: '#fbbf24' },
    Offer: { bg: '#dcfce7', color: '#15803d', border: '#86efac' },
    Accepted: { bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' },
    Rejected: { bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5' },
    Withdrawn: { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
    Closed: { bg: '#f3f4f6', color: '#374151', border: '#d1d5db' },
    Ghosted: { bg: '#f3f4f6', color: '#4b5563', border: '#d1d5db' },
    Archived: { bg: '#e0f2fe', color: '#0f172a', border: '#bae6fd' },
  },
  gradients: {
    header: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
    brand: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    statBlue: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    statAmber: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    statGreen: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    statGray: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
  },
  spacing: {
    container: 'max-width: 1200px',
  },
};

export type AppTheme = typeof theme;
