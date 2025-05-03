// Theme configuration for the application
// Change these values to customize the color scheme

export const theme = {
  // Primary color (used for buttons, links, accents)
  primary: {
    50: '#f0f0ff',
    100: '#e0e1ff',
    200: '#c7c8ff',
    300: '#a5a6ff',
    400: '#8183ff',
    500: '#6366f1', // Default primary color (indigo-500)
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
  },
  
  // Secondary color (used for secondary buttons, backgrounds)
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  
  // Accent colors for success, warning, error states
  success: '#10b981', // Emerald-500
  warning: '#f59e0b', // Amber-500
  error: '#ef4444',   // Red-500
  
  // Text colors
  text: {
    primary: '#0f172a',   // slate-900
    secondary: '#475569', // slate-600
    light: '#94a3b8',     // slate-400
  },
  
  // Background colors
  background: {
    light: '#ffffff',
    subtle: '#f8fafc',    // slate-50
    muted: '#f1f5f9',     // slate-100
  },
  
  // Border colors
  border: {
    light: '#e2e8f0',     // slate-200
    medium: '#cbd5e1',    // slate-300
  }
};

// Helper function to get CSS variable name from theme key
export const getThemeVar = (path: string) => {
  return `var(--${path.replace(/\./g, '-')})`;
};

// Function to generate CSS variables from theme
export const generateThemeVariables = () => {
  const variables: Record<string, string> = {};
  
  // Process primary colors
  Object.entries(theme.primary).forEach(([key, value]) => {
    variables[`--primary-${key}`] = value;
  });
  
  // Process secondary colors
  Object.entries(theme.secondary).forEach(([key, value]) => {
    variables[`--secondary-${key}`] = value;
  });
  
  // Process other colors
  variables['--success'] = theme.success;
  variables['--warning'] = theme.warning;
  variables['--error'] = theme.error;
  
  // Process text colors
  Object.entries(theme.text).forEach(([key, value]) => {
    variables[`--text-${key}`] = value;
  });
  
  // Process background colors
  Object.entries(theme.background).forEach(([key, value]) => {
    variables[`--bg-${key}`] = value;
  });
  
  // Process border colors
  Object.entries(theme.border).forEach(([key, value]) => {
    variables[`--border-${key}`] = value;
  });
  
  return variables;
};

// Export theme variables as CSS
export const themeVariables = generateThemeVariables();
