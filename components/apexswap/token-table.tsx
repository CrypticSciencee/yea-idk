'use client';

import React, { memo, useCallback, useMemo } from 'react';
import { HelpCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { TokenData } from '@/hooks/use-apexswap-data';

interface TokenTableProps {
  data: TokenData[];
  onTokenClick?: (token: TokenData) => void;
  isLoading?: boolean;
}

// Memoized token row component for performance
const TokenRow = memo<{
  token: TokenData;
  onTokenClick?: (token: TokenData) => void;
}>(({ token, onTokenClick }) => {
  const handleClick = useCallback(() => {
    onTokenClick?.(token);
  }, [token, onTokenClick]);

  const getChangeColor = useCallback((change: number) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  }, []);

  const getChangeBgColor = useCallback((change: number) => {
    return change >= 0 ? 'bg-green-400/10' : 'bg-red-400/10';
  }, []);

  const formatChange = useCallback((change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  }, []);

  return (
    <TableRow 
      className="border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors"
      onClick={handleClick}
    >
      <TableCell className="text-gray-400 font-mono text-sm">
        #{token.rank}
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{token.token.icon}</div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-white">
                {token.token.symbol}/{token.token.pair}
              </span>
              <Badge className="bg-gray-700 text-gray-300 text-xs">
                {token.token.tag}
              </Badge>
            </div>
            <div className="text-sm text-gray-400">{token.token.name}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right font-mono text-sm text-white">
        {token.price}
      </TableCell>
      <TableCell className="text-right text-gray-400 text-sm">
        {token.age}
      </TableCell>
      <TableCell className="text-right text-gray-400 text-sm">
        {token.txns}
      </TableCell>
      <TableCell className="text-right text-gray-400 text-sm">
        {token.volume}
      </TableCell>
      <TableCell className="text-right text-gray-400 text-sm">
        {token.makers}
      </TableCell>
      <TableCell className="text-right">
        <span className={cn(
          "text-sm font-mono px-2 py-1 rounded",
          getChangeColor(token.change5m),
          getChangeBgColor(token.change5m)
        )}>
          {formatChange(token.change5m)}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <span className={cn(
          "text-sm font-mono px-2 py-1 rounded",
          getChangeColor(token.change1h),
          getChangeBgColor(token.change1h)
        )}>
          {formatChange(token.change1h)}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <span className={cn(
          "text-sm font-mono px-2 py-1 rounded",
          getChangeColor(token.change6h),
          getChangeBgColor(token.change6h)
        )}>
          {formatChange(token.change6h)}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <span className={cn(
          "text-sm font-mono px-2 py-1 rounded",
          getChangeColor(token.change24h),
          getChangeBgColor(token.change24h)
        )}>
          {formatChange(token.change24h)}
        </span>
      </TableCell>
      <TableCell className="text-right text-gray-400 text-sm">
        {token.liquidity}
      </TableCell>
      <TableCell className="text-right text-gray-400 text-sm">
        {token.marketCap}
      </TableCell>
    </TableRow>
  );
});

TokenRow.displayName = 'TokenRow';

// Loading skeleton component
const LoadingSkeleton = memo(() => (
  <>
    {Array.from({ length: 10 }, (_, i) => (
      <TableRow key={i} className="border-gray-800">
        {Array.from({ length: 13 }, (_, j) => (
          <TableCell key={j} className="py-4">
            <div className="h-4 bg-gray-800 rounded animate-pulse" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

const TokenTable = memo<TokenTableProps>(({ data, onTokenClick, isLoading }) => {
  const handleTokenClick = useCallback((token: TokenData) => {
    onTokenClick?.(token);
  }, [onTokenClick]);

  // Memoize table headers to prevent re-renders
  const tableHeaders = useMemo(() => [
    { label: '#', className: 'text-gray-300 font-semibold' },
    { label: 'TOKEN', className: 'text-gray-300 font-semibold' },
    { 
      label: 'PRICE', 
      className: 'text-gray-300 font-semibold text-right',
      tooltip: 'Current token price'
    },
    { label: 'AGE', className: 'text-gray-300 font-semibold text-right' },
    { label: 'TXNS', className: 'text-gray-300 font-semibold text-right' },
    { label: 'VOLUME', className: 'text-gray-300 font-semibold text-right' },
    { label: 'MAKERS', className: 'text-gray-300 font-semibold text-right' },
    { label: '5M', className: 'text-gray-300 font-semibold text-right' },
    { label: '1H', className: 'text-gray-300 font-semibold text-right' },
    { label: '6H', className: 'text-gray-300 font-semibold text-right' },
    { label: '24H', className: 'text-gray-300 font-semibold text-right' },
    { label: '$87K', className: 'text-gray-300 font-semibold text-right' },
    { label: '$462K', className: 'text-gray-300 font-semibold text-right' }
  ], []);

  return (
    <TooltipProvider>
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-gray-800/50">
                  {tableHeaders.map((header, index) => (
                    <TableHead key={index} className={header.className}>
                      {header.tooltip ? (
                        <div className="flex items-center justify-end">
                          {header.label}
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-3 w-3 ml-1 inline" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{header.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      ) : (
                        header.label
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <LoadingSkeleton />
                ) : (
                  data.map((token) => (
                    <TokenRow
                      key={token.id}
                      token={token}
                      onTokenClick={handleTokenClick}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
});

TokenTable.displayName = 'TokenTable';

export default TokenTable;
