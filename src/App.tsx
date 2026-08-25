import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { useSession } from './hooks/useSession';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (except 408, 429)
        if (error && typeof error === 'object' && 'status' in error) {
          const status = error.status as number;
          if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
            return false;
          }
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
    },
    mutations: {
      retry: 1,
    },
  },
});

function AppContent() {
  const { showWarning, timeUntilExpiry, isSessionValid } = useSession({
    warningThresholdMinutes: 5,
    inactivityTimeoutMinutes: 30,
  });

  return (
    <>
      {/* Session warning banner */}
      {/* {showWarning && isSessionValid && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-100 dark:bg-yellow-900/20 border-b border-yellow-400 dark:border-yellow-600 text-yellow-800 dark:text-yellow-200 px-4 py-2">
          <div className="container mx-auto flex items-center justify-between">
            <span className="text-sm font-medium">
              Your session will expire in {Math.ceil(timeUntilExpiry / 60000)} minute{Math.ceil(timeUntilExpiry / 60000) !== 1 ? 's' : ''}. Please save your work.
            </span>
          </div>
        </div>
      )} */}

      {/* Main app content - add top padding when warning is shown */}
      <div className={showWarning && isSessionValid ? 'pt-10' : ''}>
        <RouterProvider router={router} />
      </div>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;