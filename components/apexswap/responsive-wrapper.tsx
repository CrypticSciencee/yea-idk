'use client';

import React, { memo, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  className?: string;
  breakpoints?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

// Hook to detect screen size
const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

// Hook to detect device type
const useDeviceType = () => {
  const { width } = useScreenSize();
  
  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    isLargeDesktop: width >= 1280,
  };
};

// Hook to detect orientation
const useOrientation = () => {
  const { width, height } = useScreenSize();
  
  return {
    isPortrait: height > width,
    isLandscape: width > height,
  };
};

// Responsive wrapper component
const ResponsiveWrapper = memo<ResponsiveWrapperProps>(({
  children,
  className,
  breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  }
}) => {
  const { width } = useScreenSize();
  const deviceType = useDeviceType();
  const orientation = useOrientation();

  // Determine current breakpoint
  const getCurrentBreakpoint = () => {
    if (width >= breakpoints.xl!) return 'xl';
    if (width >= breakpoints.lg!) return 'lg';
    if (width >= breakpoints.md!) return 'md';
    if (width >= breakpoints.sm!) return 'sm';
    return 'xs';
  };

  const currentBreakpoint = getCurrentBreakpoint();

  return (
    <div
      className={cn(
        'responsive-wrapper',
        `breakpoint-${currentBreakpoint}`,
        {
          'mobile': deviceType.isMobile,
          'tablet': deviceType.isTablet,
          'desktop': deviceType.isDesktop,
          'large-desktop': deviceType.isLargeDesktop,
          'portrait': orientation.isPortrait,
          'landscape': orientation.isLandscape,
        },
        className
      )}
      data-breakpoint={currentBreakpoint}
      data-device-type={deviceType.isMobile ? 'mobile' : deviceType.isTablet ? 'tablet' : 'desktop'}
      data-orientation={orientation.isPortrait ? 'portrait' : 'landscape'}
    >
      {children}
    </div>
  );
});

ResponsiveWrapper.displayName = 'ResponsiveWrapper';

// Mobile-specific wrapper
export const MobileWrapper = memo<{ children: React.ReactNode; className?: string }>(({
  children,
  className
}) => {
  const deviceType = useDeviceType();
  
  if (!deviceType.isMobile) return null;
  
  return (
    <div className={cn('mobile-wrapper', className)}>
      {children}
    </div>
  );
});

MobileWrapper.displayName = 'MobileWrapper';

// Desktop-specific wrapper
export const DesktopWrapper = memo<{ children: React.ReactNode; className?: string }>(({
  children,
  className
}) => {
  const deviceType = useDeviceType();
  
  if (!deviceType.isDesktop) return null;
  
  return (
    <div className={cn('desktop-wrapper', className)}>
      {children}
    </div>
  );
});

DesktopWrapper.displayName = 'DesktopWrapper';

// Conditional rendering based on screen size
export const ConditionalRender = memo<{
  children: React.ReactNode;
  showOn?: 'mobile' | 'tablet' | 'desktop' | 'mobile-tablet' | 'tablet-desktop' | 'all';
  hideOn?: 'mobile' | 'tablet' | 'desktop' | 'mobile-tablet' | 'tablet-desktop' | 'all';
  className?: string;
}>(({ children, showOn = 'all', hideOn, className }) => {
  const deviceType = useDeviceType();
  
  const shouldShow = () => {
    if (hideOn) {
      switch (hideOn) {
        case 'mobile':
          return !deviceType.isMobile;
        case 'tablet':
          return !deviceType.isTablet;
        case 'desktop':
          return !deviceType.isDesktop;
        case 'mobile-tablet':
          return !deviceType.isMobile && !deviceType.isTablet;
        case 'tablet-desktop':
          return !deviceType.isTablet && !deviceType.isDesktop;
        case 'all':
          return false;
        default:
          return true;
      }
    }
    
    switch (showOn) {
      case 'mobile':
        return deviceType.isMobile;
      case 'tablet':
        return deviceType.isTablet;
      case 'desktop':
        return deviceType.isDesktop;
      case 'mobile-tablet':
        return deviceType.isMobile || deviceType.isTablet;
      case 'tablet-desktop':
        return deviceType.isTablet || deviceType.isDesktop;
      case 'all':
      default:
        return true;
    }
  };

  if (!shouldShow()) return null;
  
  return (
    <div className={className}>
      {children}
    </div>
  );
});

ConditionalRender.displayName = 'ConditionalRender';

// Responsive grid component
export const ResponsiveGrid = memo<{
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: string;
  className?: string;
}>(({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = '4',
  className
}) => {
  const deviceType = useDeviceType();
  
  const getGridCols = () => {
    if (deviceType.isMobile) return columns.mobile || 1;
    if (deviceType.isTablet) return columns.tablet || 2;
    return columns.desktop || 3;
  };

  return (
    <div
      className={cn(
        'grid',
        `grid-cols-${getGridCols()}`,
        `gap-${gap}`,
        className
      )}
    >
      {children}
    </div>
  );
});

ResponsiveGrid.displayName = 'ResponsiveGrid';

// Responsive text component
export const ResponsiveText = memo<{
  children: React.ReactNode;
  size?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  className?: string;
}>(({
  children,
  size = { mobile: 'sm', tablet: 'base', desktop: 'lg' },
  className
}) => {
  const deviceType = useDeviceType();
  
  const getTextSize = () => {
    if (deviceType.isMobile) return size.mobile || 'sm';
    if (deviceType.isTablet) return size.tablet || 'base';
    return size.desktop || 'lg';
  };

  return (
    <span
      className={cn(
        `text-${getTextSize()}`,
        className
      )}
    >
      {children}
    </span>
  );
});

ResponsiveText.displayName = 'ResponsiveText';

// Hook for responsive values
export const useResponsiveValue = <T>(values: {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  default: T;
}): T => {
  const deviceType = useDeviceType();
  
  if (deviceType.isMobile && values.mobile !== undefined) {
    return values.mobile;
  }
  if (deviceType.isTablet && values.tablet !== undefined) {
    return values.tablet;
  }
  if (deviceType.isDesktop && values.desktop !== undefined) {
    return values.desktop;
  }
  
  return values.default;
};

// Hook for responsive breakpoint
export const useResponsiveBreakpoint = () => {
  const { width } = useScreenSize();
  
  return {
    width,
    isXs: width < 640,
    isSm: width >= 640 && width < 768,
    isMd: width >= 768 && width < 1024,
    isLg: width >= 1024 && width < 1280,
    isXl: width >= 1280,
  };
};

export default ResponsiveWrapper;
export { useScreenSize, useDeviceType, useOrientation };
