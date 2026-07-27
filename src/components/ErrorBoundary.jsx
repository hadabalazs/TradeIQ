import React from "react";

// Catches render crashes and shows the error instead of a blank page.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("TradeIQ render error:", error, info?.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-tiq-navy flex items-center justify-center p-6">
          <div className="max-w-lg w-full rounded-2xl bg-white border border-tiq-border p-8 text-center">
            <h1 className="font-slab text-xl text-tiq-ink font-bold mb-2">Something went wrong</h1>
            <p className="text-sm text-slate-500 mb-4">
              The page hit an error while rendering. The details below help fix it:
            </p>
            <pre className="text-left text-xs text-red-600 bg-red-500/5 border border-red-500/20 rounded-lg p-3 overflow-auto max-h-48 whitespace-pre-wrap mb-5">
              {String(this.state.error?.message || this.state.error)}
            </pre>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-lg bg-tiq-mint text-white text-sm font-semibold hover:bg-tiq-mint/90 transition"
              >
                Reload
              </button>
              <a href="/" className="px-4 py-2 rounded-lg border border-tiq-border text-slate-600 text-sm font-medium hover:bg-tiq-mintLight transition">
                Back to courses
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
