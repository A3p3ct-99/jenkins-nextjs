'use client';

import { useState, useEffect } from 'react';

export interface RuntimeConfig {
  NEXT_PUBLIC_API_URL: string;
  // Add other environment variables here as needed
}

export function useRuntimeConfig() {
  const [config, setConfig] = useState<RuntimeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/config');
        if (!response.ok) {
          throw new Error(`Error fetching config: ${response.status}`);
        }
        const data = await response.json();
        setConfig(data);
      } catch (err) {
        console.error('Failed to load runtime config:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading, error };
}
