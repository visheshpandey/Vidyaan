export const ROUTES = {
  home: '/',
  onboarding: '/onboarding',
  dashboard: '/dashboard',
  discover: '/discover',
  scholarship: (id: string) => `/scholarship/${id}`,
  saved: '/saved',
  compare: '/compare',
  applications: '/applications',
  application: (id: string) => `/applications/${id}`,
  documents: '/documents',
  deadlines: '/deadlines',
  profile: '/profile',
} as const
