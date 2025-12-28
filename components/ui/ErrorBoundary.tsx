import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-error mb-2">⚠️</h1>
              <h2 className="text-2xl font-bold text-text mb-4">Something went wrong</h2>
            </div>

            <div className="bg-surface-elevated rounded-lg p-6 mb-6">
              <p className="text-text-secondary mb-4">
                An error occurred while loading the application. Please try refreshing the page.
              </p>

              {this.state.error && (
                <details className="text-left">
                  <summary className="text-primary cursor-pointer mb-2">
                    Error Details
                  </summary>
                  <div className="bg-surface rounded p-3 text-sm text-error font-mono">
                    <p><strong>Error:</strong> {this.state.error.message}</p>
                    <p><strong>Stack:</strong></p>
                    <pre className="whitespace-pre-wrap text-xs">
                      {this.state.error.stack}
                    </pre>
                  </div>
                </details>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Refresh Page
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-surface-muted hover:bg-surface-muted/80 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
