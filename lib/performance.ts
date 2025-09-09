// Performance optimization utilities for ApexSwap

// Debounce function for search and input handling
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function for scroll and resize events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Virtual scrolling utilities for large datasets
export interface VirtualScrollConfig {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function calculateVirtualScrollRange(
  scrollTop: number,
  config: VirtualScrollConfig
): { start: number; end: number; offsetY: number } {
  const { itemHeight, containerHeight, overscan = 5 } = config;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const end = start + visibleCount + overscan * 2;
  const offsetY = start * itemHeight;

  return { start, end, offsetY };
}

// Memoization for expensive calculations
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    
    // Limit cache size to prevent memory leaks
    if (cache.size > 1000) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    return result;
  }) as T;
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
): IntersectionObserver {
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private marks: Map<string, number> = new Map();
  private measures: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  measure(name: string, startMark: string, endMark?: string): number {
    const startTime = this.marks.get(startMark);
    const endTime = endMark ? this.marks.get(endMark) : performance.now();
    
    if (startTime === undefined) {
      console.warn(`Start mark "${startMark}" not found`);
      return 0;
    }

    const duration = endTime - startTime;
    this.measures.set(name, duration);
    return duration;
  }

  getMeasure(name: string): number | undefined {
    return this.measures.get(name);
  }

  getAllMeasures(): Record<string, number> {
    return Object.fromEntries(this.measures);
  }

  clear(): void {
    this.marks.clear();
    this.measures.clear();
  }
}

// Memory usage monitoring
export function getMemoryUsage(): {
  used: number;
  total: number;
  percentage: number;
} {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
    };
  }
  
  return { used: 0, total: 0, percentage: 0 };
}

// Bundle size optimization helpers
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

export function preloadImages(sources: string[]): Promise<void[]> {
  return Promise.all(sources.map(preloadImage));
}

// Service Worker registration for caching
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
}

// Web Workers for heavy computations
export function createWorker<T, R>(
  workerFunction: (data: T) => R
): Worker {
  const blob = new Blob([`
    self.onmessage = function(e) {
      const result = (${workerFunction.toString()})(e.data);
      self.postMessage(result);
    };
  `], { type: 'application/javascript' });
  
  const workerUrl = URL.createObjectURL(blob);
  return new Worker(workerUrl);
}

// Request deduplication
export class RequestDeduplicator {
  private static instance: RequestDeduplicator;
  private pendingRequests: Map<string, Promise<any>> = new Map();

  static getInstance(): RequestDeduplicator {
    if (!RequestDeduplicator.instance) {
      RequestDeduplicator.instance = new RequestDeduplicator();
    }
    return RequestDeduplicator.instance;
  }

  async deduplicate<T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    const promise = requestFn().finally(() => {
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }
}

// Batch processing for large datasets
export function batchProcess<T, R>(
  items: T[],
  processor: (item: T) => R,
  batchSize: number = 100
): Promise<R[]> {
  return new Promise((resolve) => {
    const results: R[] = [];
    let index = 0;

    const processBatch = () => {
      const batch = items.slice(index, index + batchSize);
      const batchResults = batch.map(processor);
      results.push(...batchResults);
      index += batchSize;

      if (index < items.length) {
        // Use requestIdleCallback if available, otherwise setTimeout
        if ('requestIdleCallback' in window) {
          requestIdleCallback(processBatch);
        } else {
          setTimeout(processBatch, 0);
        }
      } else {
        resolve(results);
      }
    };

    processBatch();
  });
}

// Connection quality detection
export function getConnectionQuality(): 'slow' | 'medium' | 'fast' {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    const effectiveType = connection.effectiveType;
    
    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return 'slow';
      case '3g':
        return 'medium';
      case '4g':
      default:
        return 'fast';
    }
  }
  
  return 'fast';
}

// Adaptive loading based on connection quality
export function shouldLoadHeavyContent(): boolean {
  const quality = getConnectionQuality();
  return quality === 'fast';
}

// Performance budget monitoring
export class PerformanceBudget {
  private static instance: PerformanceBudget;
  private budgets: Map<string, number> = new Map();
  private currentUsage: Map<string, number> = new Map();

  static getInstance(): PerformanceBudget {
    if (!PerformanceBudget.instance) {
      PerformanceBudget.instance = new PerformanceBudget();
    }
    return PerformanceBudget.instance;
  }

  setBudget(metric: string, budget: number): void {
    this.budgets.set(metric, budget);
  }

  recordUsage(metric: string, usage: number): void {
    const current = this.currentUsage.get(metric) || 0;
    this.currentUsage.set(metric, current + usage);
  }

  isOverBudget(metric: string): boolean {
    const budget = this.budgets.get(metric) || Infinity;
    const usage = this.currentUsage.get(metric) || 0;
    return usage > budget;
  }

  getUsage(metric: string): number {
    return this.currentUsage.get(metric) || 0;
  }

  getRemainingBudget(metric: string): number {
    const budget = this.budgets.get(metric) || 0;
    const usage = this.currentUsage.get(metric) || 0;
    return Math.max(0, budget - usage);
  }
}
