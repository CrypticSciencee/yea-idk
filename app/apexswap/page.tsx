'use client';

import React, { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Sidebar from '@/components/apexswap/sidebar';
import TokenTable from '@/components/apexswap/token-table';
import FilterBar from '@/components/apexswap/filter-bar';
import Header from '@/components/apexswap/header';
import { useApexSwapData, useSearch, useFilters, TokenData } from '@/hooks/use-apexswap-data';
import { cn } from '@/lib/utils';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds
      cacheTime: 300000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
});

function ApexSwapDashboardContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Use custom hooks for state management
  const { query, setQuery, debouncedQuery } = useSearch();
  const { filters, updateFilter } = useFilters();
  
  // Update filters when search query changes
  React.useEffect(() => {
    updateFilter('searchQuery', debouncedQuery);
  }, [debouncedQuery, updateFilter]);

  // Get data using the custom hook
  const {
    tokenData,
    globalStats,
    isLoading,
    isConnected,
    lastUpdate,
    refresh
  } = useApexSwapData(filters);

  // Event handlers
  const handleSidebarToggle = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setQuery(query);
  }, [setQuery]);

  const handleNavigationClick = useCallback((item: string) => {
    console.log('Navigation clicked:', item);
    // Implement navigation logic here
  }, []);

  const handleBlockchainClick = useCallback((blockchain: string) => {
    updateFilter('blockchain', blockchain);
  }, [updateFilter]);

  const handleFilterChange = useCallback((filter: string) => {
    updateFilter('sortBy', filter.toLowerCase().replace(' ', ''));
  }, [updateFilter]);

  const handleTimeframeChange = useCallback((timeframe: string) => {
    updateFilter('timeframe', timeframe);
  }, [updateFilter]);

  const handleTokenClick = useCallback((token: TokenData) => {
    console.log('Token clicked:', token);
    // Implement token detail view or trading logic here
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        searchQuery={query}
        onSearchChange={handleSearchChange}
        onNavigationClick={handleNavigationClick}
        onBlockchainClick={handleBlockchainClick}
      />

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "ml-16" : "ml-80"
      )}>
        {/* Header */}
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={handleSidebarToggle}
          globalStats={globalStats}
          isConnected={isConnected}
          lastUpdate={lastUpdate}
        />

        {/* Filter Bar */}
        <FilterBar
          selectedFilter={filters.sortBy}
          selectedTimeframe={filters.timeframe}
          onFilterChange={handleFilterChange}
          onTimeframeChange={handleTimeframeChange}
        />

        {/* Main Table */}
        <div className="p-6">
          <TokenTable
            data={tokenData}
            onTokenClick={handleTokenClick}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Ad Blocking Notification */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-blue-50 border border-blue-200 rounded-lg max-w-sm p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">!</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm">More ad blocking available</h3>
              <p className="text-gray-600 text-xs mt-1">
                Expand Ghostery ad blocking to search engines in a few easy steps.
              </p>
              <div className="flex space-x-2 mt-3">
                <button className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded">
                  Enable now
                </button>
                <button className="text-gray-600 text-xs px-3 py-1">
                  Ignore
                </button>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">👻</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ApexSwapDashboard() {
  return (
    <QueryClientProvider client={queryClient}>
      <ApexSwapDashboardContent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
