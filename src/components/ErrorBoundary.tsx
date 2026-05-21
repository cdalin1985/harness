import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('[HarnessOS] Uncaught error:', error, info.componentStack);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-8">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100">
            <AlertTriangle size={28} className="text-rose-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-sm text-slate-500 font-medium max-w-sm">
              An unexpected error occurred. Our team has been notified.
            </p>
            {this.state.error && (
              <p className="text-xs text-slate-400 font-mono mt-2 max-w-md truncate">
                {this.state.error.message}
              </p>
            )}
          </div>
          <button
            onClick={this.handleReset}
            className="px-6 py-2 bg-brand text-white rounded-lg text-sm font-bold hover:opacity-90 transition-all"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
