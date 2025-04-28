import React from "react";

export default class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-[#fb7185] p-8 text-center">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-[#f43f5e]">
              Reel Broken!
            </h2>
            <p className="mb-4">Something went wrong loading this scene.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#1a1a1a] border border-[#f43f5e]/50 rounded hover:bg-[#f43f5e]/10 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
