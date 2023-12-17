"use client";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

type QueryProviderProps = {
  children: ReactNode;
};

function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default QueryProvider;
