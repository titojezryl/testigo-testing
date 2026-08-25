import type { PaginatedResponse } from '~/api-services/types';

export interface AnalyticsEvent {
  id: string;
  eventName: string;
  user_id: string;
  userEmail: string;
  category: string;
  page: string;
  browser: string;
  device: string;
  timestamp: string;
}

export const generateDummyAnalyticsEvents = (
  page: number,
  limit: number,
  search?: string
): PaginatedResponse<AnalyticsEvent> => {
  const eventNames = [
    'Page View',
    'Button Click',
    'Form Submit',
    'User Sign In',
    'User Sign Out',
    'Download',
    'Search',
    'Navigation',
  ];

  const categories = ['User Action', 'System', 'Error', 'Warning', 'Info'];
  const pages = [
    '/dashboard',
    '/dashboard/users',
    '/dashboard/settings',
    '/dashboard/profile',
    '/dashboard/analytics',
  ];
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Unknown'];
  const devices = ['Desktop', 'Mobile', 'Tablet', 'Unknown'];

  const allEvents: AnalyticsEvent[] = Array.from({ length: 250 }, (_, i) => {
    const id = i;
    const eventName = eventNames[Math.floor(Math.random() * eventNames.length)];
    return {
      id: `event-${id}`,
      eventName,
      user_id: `user-${Math.floor(Math.random() * 100)}`,
      userEmail: `user-${Math.floor(Math.random() * 100)}@example.com`,
      category: categories[Math.floor(Math.random() * categories.length)],
      page: pages[Math.floor(Math.random() * pages.length)],
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      device: devices[Math.floor(Math.random() * devices.length)],
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  });

  let filteredEvents = allEvents;
  if (search && search.trim()) {
    const searchLower = search.toLowerCase();
    filteredEvents = allEvents.filter(
      (event) =>
        event.eventName.toLowerCase().includes(searchLower) ||
        event.userEmail.toLowerCase().includes(searchLower) ||
        event.page.toLowerCase().includes(searchLower) ||
        event.category.toLowerCase().includes(searchLower)
    );
  }

  const total = filteredEvents.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;

  const data = filteredEvents.slice(startIndex, startIndex + (limit || 10));

  return {
    data,
    total,
    page,
    limit: limit || 10,
    totalPages,
  };
};
