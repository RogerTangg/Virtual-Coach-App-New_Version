import { ReactNode } from 'react';
import { Container, ContainerProps } from '@mantine/core';

/**
 * ResponsiveContainer Props
 */
export interface ResponsiveContainerProps extends Omit<ContainerProps, 'size'> {
  children: ReactNode;
  /** Maximum width for desktop */
  maxWidth?: number | string;
}

/**
 * ResponsiveContainer Component
 * 
 * Provides responsive container with consistent max-width and padding
 * across breakpoints
 * 
 * Breakpoints:
 * - Mobile (<768px): Full width with 16px padding
 * - Tablet (768-1024px): 90% width with 24px padding
 * - Desktop (≥1024px): Max 1200-1440px centered with 32px padding
 */
export function ResponsiveContainer({ 
  children, 
  maxWidth = 1440,
  ...props 
}: ResponsiveContainerProps) {
  return (
    <Container
      size="xl"
      px={{ base: 'md', sm: 'lg', md: 'xl' }}
      style={{
        maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
      {...props}
    >
      {children}
    </Container>
  );
}
