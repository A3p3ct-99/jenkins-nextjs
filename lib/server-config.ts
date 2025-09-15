import getConfig from 'next/config';

// This function is for use in getServerSideProps or getInitialProps
export function getServerRuntimeConfig() {
  try {
    const { publicRuntimeConfig } = getConfig();
    return {
      NEXT_PUBLIC_API_URL: publicRuntimeConfig?.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
      // Add other environment variables here as needed
    };
  } catch (error) {
    console.error('Error getting config:', error);
    return {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
      // Add other environment variables here as needed
    };
  }
}
