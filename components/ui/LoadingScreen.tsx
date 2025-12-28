import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-text mb-2">Loading...</h2>
        <p className="text-text-muted">Please wait while we prepare your experience</p>
      </div>
    </div>
  );
};