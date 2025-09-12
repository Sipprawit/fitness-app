// Theme constants for consistent styling across customer pages
export const CUSTOMER_THEME = {
  // Primary colors
  primary: '#C50000',
  primaryLight: '#DC2626',
  primaryDark: '#991B1B',
  
  // Background colors
  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 30%, #dee2e6 70%, #f1f3f4 100%)',
  cardBackground: 'rgba(255, 255, 255, 0.8)',
  cardBackgroundSolid: '#ffffff',
  
  // Text colors
  textPrimary: '#374151',
  textSecondary: '#6b7280',
  textLight: '#9ca3af',
  
  // Border colors
  borderLight: '#e5e7eb',
  borderMedium: '#d1d5db',
  
  // Shadow colors
  shadowPrimary: 'rgba(197, 0, 0, 0.3)',
  shadowLight: 'rgba(0, 0, 0, 0.08)',
  shadowMedium: 'rgba(0, 0, 0, 0.1)',
};

// Button styles
export const BUTTON_STYLES = {
  primary: {
    padding: '0.75rem 1.5rem',
    background: `linear-gradient(135deg, ${CUSTOMER_THEME.primary} 0%, ${CUSTOMER_THEME.primaryLight} 100%)`,
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: `0 4px 12px ${CUSTOMER_THEME.shadowPrimary}`,
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center' as const,
  },
  
  secondary: {
    padding: '0.75rem 1.5rem',
    background: CUSTOMER_THEME.primaryLight,
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: `0 4px 12px ${CUSTOMER_THEME.shadowPrimary}`,
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center' as const,
  },
  
  danger: {
    padding: '0.75rem 1.5rem',
    background: `linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)`,
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center' as const,
  },
  
  outline: {
    padding: '0.75rem 1.5rem',
    background: 'transparent',
    color: CUSTOMER_THEME.primary,
    border: `2px solid ${CUSTOMER_THEME.primary}`,
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center' as const,
  },
};

// Card styles
export const CARD_STYLES = {
  default: {
    background: CUSTOMER_THEME.cardBackground,
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: `0 20px 40px ${CUSTOMER_THEME.shadowLight}`,
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255,255,255,0.3)',
  },
  
  solid: {
    background: CUSTOMER_THEME.cardBackgroundSolid,
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: `0 20px 40px ${CUSTOMER_THEME.shadowLight}`,
    border: `1px solid ${CUSTOMER_THEME.borderLight}`,
  },
};

// Input styles
export const INPUT_STYLES = {
  default: {
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: `2px solid ${CUSTOMER_THEME.borderLight}`,
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    background: 'white',
    color: CUSTOMER_THEME.textPrimary,
  },
  
  focused: {
    border: `2px solid ${CUSTOMER_THEME.primary}`,
    boxShadow: `0 0 0 3px ${CUSTOMER_THEME.shadowPrimary}20`,
  },
};

// Page styles
export const PAGE_STYLES = {
  container: {
    minHeight: '100vh',
    background: CUSTOMER_THEME.background,
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  
  header: {
    textAlign: 'center' as const,
    marginBottom: '2rem',
    color: CUSTOMER_THEME.primary,
  },
  
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    margin: '0 0 0.5rem 0',
    textShadow: `0 2px 4px ${CUSTOMER_THEME.shadowPrimary}`,
    color: CUSTOMER_THEME.primary,
  },
  
  subtitle: {
    fontSize: '1.1rem',
    margin: 0,
    opacity: 0.8,
    color: CUSTOMER_THEME.textSecondary,
  },
};

// Utility functions
export const getButtonHoverStyle = (baseStyle: any) => ({
  ...baseStyle,
  transform: 'translateY(-2px)',
  boxShadow: `0 8px 25px ${CUSTOMER_THEME.shadowPrimary}`,
});

export const getButtonActiveStyle = (baseStyle: any) => ({
  ...baseStyle,
  transform: 'translateY(0)',
});

export const getButtonDisabledStyle = (baseStyle: any) => ({
  ...baseStyle,
  opacity: 0.7,
  cursor: 'not-allowed',
  transform: 'none',
});
