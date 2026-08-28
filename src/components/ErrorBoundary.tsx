import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Sentry } from "@/lib/sentry";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack ?? "",
        },
      },
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-card border border-border rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <h1 className="text-2xl font-bold text-foreground">
                Something went wrong
              </h1>
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                The application encountered an error. The failure has been recorded when production monitoring is configured.
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Check your network connection</li>
                <li>Reload the page to retry the request</li>
                <li>Return home if the current feature remains unavailable</li>
              </ul>
              {import.meta.env.DEV && this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-foreground hover:text-primary">
                    Development details
                  </summary>
                  <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md font-medium transition-colors"
                >
                  Reload Page
                </button>
                <button
                  onClick={() => { window.location.href = "/"; }}
                  className="flex-1 bg-muted text-foreground hover:bg-muted/80 py-2 px-4 rounded-md font-medium transition-colors"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
