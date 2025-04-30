
export const environments = {
    API_URL: (import.meta as any).env.NG_APP_API_URL || 'localhost',
    API_PORT: (import.meta as any).env.NG_APP_API_PORT || 3001,
    API_PROTOCOL: (import.meta as any).env.NG_APP_API_PROTOCOL || 'http',
  };
  