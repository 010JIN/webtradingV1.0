import React from 'react';
import type { AppProps } from 'next/app';
import { AuthContext, useAuthLogic } from '@/hooks/useAuth';
import '@/styles/globals.css';

function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthLogic();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}