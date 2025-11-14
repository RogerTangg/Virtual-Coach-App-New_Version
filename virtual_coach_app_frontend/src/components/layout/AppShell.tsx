import { ReactNode } from 'react';

/**
 * AppShell Props
 */
export interface AppShellProps {
  children: ReactNode;
  /** Optional header content */
  header?: ReactNode;
  /** Optional footer content */
  footer?: ReactNode;
}

/**
 * AppShell Component
 * 
 * Main application container with responsive padding and layout
 * 
 * Features:
 * - Responsive padding based on viewport size
 * - Optional header and footer
 * - Matcha green theme integration
 * - Smooth transitions between breakpoints
 */
export function AppShell({ children, header, footer }: AppShellProps) {
  return (
    <div
      className="app-shell"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(to bottom right, #E8F5E9, #C8E6C9)',
      }}
    >
      {/* Header */}
      {header && (
        <header
          style={{
            padding: '16px',
          }}
          className="app-shell-header"
        >
          {header}
        </header>
      )}

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: '16px',
          marginBottom: footer ? 0 : '16px',
        }}
        className="app-shell-main"
      >
        {children}
      </main>

      {/* Footer */}
      {footer && (
        <footer
          style={{
            padding: '16px',
            marginTop: 'auto',
          }}
          className="app-shell-footer"
        >
          {footer}
        </footer>
      )}
    </div>
  );
}
