import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';

// Suppress console.error for expected boundary catches
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

function ThrowingComponent(): never {
  throw new Error('Test explosion');
}

describe('ErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Safe Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Safe Content')).toBeInTheDocument();
  });

  it('renders default error UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<div>Custom Error UI</div>}>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
  });

  it('resets error state when Try Again is clicked', () => {
    // Use a key to force remount after reset — simulates the typical recovery pattern
    let shouldThrow = true;

    function MaybeThrow() {
      if (shouldThrow) throw new Error('Test explosion');
      return <div>Recovered Content</div>;
    }

    const { rerender } = render(
      <ErrorBoundary key="eb-reset-test">
        <MaybeThrow />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Stop throwing, then click Try Again to clear the error state
    shouldThrow = false;
    fireEvent.click(screen.getByText('Try Again'));

    // Trigger a re-render so ErrorBoundary renders its (now non-throwing) children
    rerender(
      <ErrorBoundary key="eb-reset-test">
        <MaybeThrow />
      </ErrorBoundary>
    );

    expect(screen.getByText('Recovered Content')).toBeInTheDocument();
  });
});
